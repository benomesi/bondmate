import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

// Debug flag
const DEBUG = true;

// OpenAI Error class
export class OpenAIError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'OpenAIError';
  }
}

// OpenAI client configuration
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

if (import.meta.env.DEV && !OPENAI_API_KEY) {
  console.warn('No OpenAI API key found. Please add VITE_OPENAI_API_KEY to your .env file.');
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Required for client-side usage
});

// Validate API key
function validateApiKey(): boolean {
  if (!OPENAI_API_KEY) {
    if (import.meta.env.DEV) {
      console.warn('OpenAI API key is missing');
    }
    return false;
  }
  if (!OPENAI_API_KEY.startsWith('sk-')) {
    if (import.meta.env.DEV) {
      console.warn('Invalid OpenAI API key format');
    }
    return false;
  }
  return true;
}

// Model configuration
const MODELS = {
  free: {
    name: 'gpt-4-0125-preview',
    maxTokens: {
      concise: 300,
      balanced: 500,
      detailed: 800
    }
  },
  premium: {
    name: 'gpt-4-0125-preview',
    maxTokens: {
      concise: 500,
      balanced: 1000,
      detailed: 2000
    }
  }
};

// Function to detect and format questions at the end of responses
function formatResponse(text: string): string {
  // Split the text into paragraphs
  const paragraphs = text.split('\n\n');
  
  // Check if the last paragraph is a question
  const lastParagraph = paragraphs[paragraphs.length - 1];
  if (lastParagraph.trim().endsWith('?')) {
    // Add line break and make the question bold
    paragraphs[paragraphs.length - 1] = `\n\n**${lastParagraph.trim()}**`;
  }
  
  return paragraphs.join('\n\n');
}

export async function getChatResponse(
  messages: ChatCompletionMessageParam[],
  relationship: {
    name: string;
    type: string;
    interests: string[];
    goals: string[];
    communicationStyle?: string;
  },
  profile?: User | null,
  preferences?: ChatPreferences,
  messageCount: number = 0,
  isPremium: boolean = false
): Promise<string> {
  if (DEBUG) {
    console.log('getChatResponse called:', {
      messageCount,
      isPremium,
      hasMessages: messages.length > 0,
      apiKeyExists: Boolean(OPENAI_API_KEY)
    });
  }

  // If no API key, return demo response
  if (!validateApiKey()) {
    return formatResponse(`I understand you're looking for advice. However, this is running in demo mode without an OpenAI API key.

**Demo Mode Notice**

• This is a demonstration response

• To enable full functionality, add your OpenAI API key

• Set VITE_OPENAI_API_KEY in your .env file

Would you like to know how to set up your API key?`);
  }

  try {
    const model = MODELS[isPremium ? 'premium' : 'free'];
    const systemPrompt = generateSystemPrompt(relationship, profile, preferences);

    // Format messages array
    const formattedMessages: ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.role,
        content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)
      }))
    ];

    if (DEBUG) {
      console.log('OpenAI Request:', {
        model: model.name,
        messageCount: formattedMessages.length,
        systemPrompt: formattedMessages[0].content
      });
    }

    const completion = await openai.chat.completions.create({
      model: model.name,
      messages: formattedMessages,
      temperature: 0.8,
      max_tokens: model.maxTokens[preferences?.length || 'balanced'],
      presence_penalty: 0.3,
      frequency_penalty: 0.3,
      top_p: 0.9
    });

    if (DEBUG) {
      console.log('OpenAI Response:', {
        status: 'success',
        hasContent: Boolean(completion.choices[0]?.message?.content)
      });
    }

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new OpenAIError('Empty response from OpenAI', 'empty_response');
    }

    // Format the response before returning
    return formatResponse(responseContent);

  } catch (error) {
    console.error('OpenAI API Error:', error);

    if (error instanceof OpenAI.APIError) {
      // Map OpenAI error types
      const errorCode = error.code || 'unknown_error';
      throw new OpenAIError(error.message, errorCode, error);
    }

    // Re-throw our own errors
    if (error instanceof OpenAIError) {
      throw error;
    }

    // Handle any other errors
    throw new OpenAIError(
      'Failed to get AI response',
      'unknown_error',
      error as Error
    );
  }
}

// Helper function to generate system prompt
function generateSystemPrompt(
  relationship: {
    name: string;
    type: string;
    interests: string[];
    goals: string[];
  },
  profile?: User | null,
  preferences?: ChatPreferences
): string {
  const basePrompt = `You are an expert dating coach focused on helping with dating advice. Your responses should feel like talking to a knowledgeable friend who genuinely wants to help.

Response Format:
1. Brief Welcome (1 line)
   "I understand [their situation/concern]..."

2. Key Points (2-3 sections)
   Each section should be formatted as:
   
   **[Section Title]**
   
   • Point 1 with specific detail
   
   • Point 2 with clear action
   
   • Point 3 with expected outcome
   
   [Add empty line between sections]

3. Follow-up Question (1 line)
   Ask a specific question to guide the conversation
   Always end with a question to encourage continued dialogue

Special Instructions:
- When user shares personal details, use them in your response
- For profile/bio requests, create an actual bio draft
- For message help, provide actual message examples
- For date ideas, give specific suggestions based on interests
- Always end with an engaging question to keep the conversation going`;

  // Add context-specific instructions
  const contextPrompt = `
Context:
- User Type: ${relationship.type}
- Interests: ${relationship.interests.join(', ')}
- Goals: ${relationship.goals.join(', ')}

Preferences:
- Tone: ${preferences?.tone || 'empathetic'} (be ${preferences?.tone || 'empathetic'} in your responses)
- Length: ${preferences?.length || 'balanced'} (provide ${preferences?.length || 'balanced'} explanations)
- Style: ${preferences?.style || 'supportive'} (focus on ${preferences?.style || 'supportive'} advice)`;

  return `${basePrompt}\n\n${contextPrompt}`;
}

// Types
interface User {
  name: string;
  interests: string[];
  goals: string[];
  communicationStyle?: string;
}

interface ChatPreferences {
  tone: 'empathetic' | 'professional' | 'casual' | 'formal' | 'playful';
  length: 'concise' | 'balanced' | 'detailed';
  style: 'actionable' | 'analytical' | 'narrative' | 'supportive';
}