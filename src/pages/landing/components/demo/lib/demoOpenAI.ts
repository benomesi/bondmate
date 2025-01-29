import { OpenAIError } from '../../../../../lib/openai';
import { getChatResponse } from '../../../../../lib/openai';
import { rateLimiter } from '../../../../../lib/rateLimiter';
import type { ChatPreferences } from '../../../../../types';

export interface DemoConfig {
  systemPrompt: string;
  preferences: ChatPreferences;
  context: {
    name: string;
    type: string;
    interests: string[];
    goals: string[];
  };
  maxInteractions?: number;
}

export interface FollowUpSuggestion {
  id: string;
  text: string;
  description: string;
  icon: 'profile' | 'message' | 'date' | 'confidence' | 'strategy';
}

export interface DemoResponse {
  message: string;
  suggestions: FollowUpSuggestion[];
}

function generateFollowUpSuggestions(response: string, userMessage: string): FollowUpSuggestion[] {
  // Extract key topics from user message and response
  const topics = {
    profile: /profile|bio|photos|pictures/i,
    messaging: /message|text|chat|conversation/i,
    dating: /date|meet|meetup|dating/i,
    confidence: /confidence|nervous|anxiety|afraid/i,
    communication: /communicate|talk|express|say/i,
    strategy: /strategy|approach|plan|method/i
  };

  let suggestions: FollowUpSuggestion[] = [];

  // Add contextual suggestions based on detected topics
  if (topics.profile.test(userMessage) || topics.profile.test(response)) {
    suggestions.push({
      id: 'profile-1',
      text: 'Optimize my photos',
      description: 'Get tips for selecting and arranging profile pictures',
      icon: 'profile'
    });
    suggestions.push({
      id: 'profile-2',
      text: 'Improve my bio',
      description: 'Create a bio that attracts the right matches',
      icon: 'profile'
    });
  }
  
  if (topics.messaging.test(userMessage) || topics.messaging.test(response)) {
    suggestions.push({
      id: 'message-1',
      text: 'Conversation starters',
      description: 'Learn how to open with impact',
      icon: 'message'
    });
    suggestions.push({
      id: 'message-2',
      text: 'Keep chats engaging',
      description: 'Tips for maintaining interesting conversations',
      icon: 'message'
    });
  }

  if (topics.dating.test(userMessage) || topics.dating.test(response)) {
    suggestions.push({
      id: 'date-1',
      text: 'First date ideas',
      description: 'Creative and engaging date suggestions',
      icon: 'date'
    });
    suggestions.push({
      id: 'date-2',
      text: 'When to ask out',
      description: 'Learn the right timing for date invitations',
      icon: 'date'
    });
  }

  if (topics.confidence.test(userMessage) || topics.confidence.test(response)) {
    suggestions.push({
      id: 'confidence-1',
      text: 'Build confidence',
      description: 'Practical steps to boost your dating confidence',
      icon: 'confidence'
    });
    suggestions.push({
      id: 'confidence-2',
      text: 'Handle rejection',
      description: 'Turn setbacks into growth opportunities',
      icon: 'confidence'
    });
  }

  if (topics.communication.test(userMessage) || topics.communication.test(response)) {
    suggestions.push({
      id: 'strategy-1',
      text: 'Express interest clearly',
      description: 'Learn to show interest without coming on too strong',
      icon: 'strategy'
    });
    suggestions.push({
      id: 'strategy-2',
      text: 'Read interest signals',
      description: 'Understand signs of mutual attraction',
      icon: 'strategy'
    });
  }

  // If no specific topics detected, use general follow-ups
  if (suggestions.length === 0) {
    suggestions = [
      {
        id: 'general-1',
        text: 'Tell me more',
        description: 'Get deeper insights on this approach',
        icon: 'strategy'
      },
      {
        id: 'general-2',
        text: 'See examples',
        description: 'View real-world success stories',
        icon: 'profile'
      },
      {
        id: 'general-3',
        text: 'Next steps',
        description: 'Get an action plan for moving forward',
        icon: 'strategy'
      }
    ];
  }

  // Take 2-3 most relevant suggestions
  return suggestions.slice(0, 3);
}

export async function getDemoResponse(
  content: string,
  config: DemoConfig,
  messageHistory: { role: 'user' | 'assistant'; content: string }[] = []
): Promise<DemoResponse> {
  try {
    // Validate input
    if (!content?.trim()) {
      throw new OpenAIError('Message content cannot be empty', 'invalid_request_error');
    }

    // Validate config
    if (!config?.systemPrompt || !config?.context || !config?.preferences) {
      throw new OpenAIError('Invalid demo configuration', 'invalid_request_error');
    }

    // Apply demo-specific rate limiting
    await rateLimiter.checkLimit('demo-user', 'demo');

    // Format messages array for OpenAI API
    const messages = [
      { 
        role: 'system' as const, 
        content: config.systemPrompt.trim() 
      }
    ];

    // Add message history if it exists and is valid
    if (Array.isArray(messageHistory) && messageHistory.length > 0) {
      messages.push(...messageHistory);
    }

    // Add current user message
    messages.push({ 
      role: 'user' as const, 
      content: content.trim() 
    });

    // Get response with retries
    let lastError: Error | null = null;
    const maxRetries = 3;
    const delays = [1000, 2000, 4000];

    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await getChatResponse(
          messages,
          config.context,
          null, // No user profile for demo
          config.preferences,
          0, // Message count starts at 0 for demo
          false // Not premium
        );

        if (!response) {
          throw new OpenAIError('Empty response from AI', 'empty_response');
        }

        // Generate suggestions based on the response and user message
        const suggestions = generateFollowUpSuggestions(response, content);
        
        return {
          message: response,
          suggestions
        };

      } catch (error) {
        lastError = error as Error;
        
        // Only retry on certain errors
        if (
          error instanceof OpenAIError && 
          ['timeout', 'rate_limit_exceeded', 'service_error'].includes(error.code) &&
          i < maxRetries - 1
        ) {
          await new Promise(resolve => setTimeout(resolve, delays[i]));
          continue;
        }
        
        throw error;
      }
    }

    throw lastError || new OpenAIError('Failed to get AI response', 'unknown_error');
  } catch (error) {
    if (error instanceof OpenAIError) {
      throw error;
    }

    // Map unknown errors to OpenAIError
    throw new OpenAIError(
      error instanceof Error ? error.message : 'Failed to get AI response',
      'service_error'
    );
  }
}