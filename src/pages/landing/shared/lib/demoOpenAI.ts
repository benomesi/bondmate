import { OpenAIError, getChatResponse } from '../../../../lib/openai';
import { rateLimiter } from '../../../../lib/rateLimiter';
import type { ChatPreferences } from '../../../../types';

export interface DemoConfig {
  systemPrompt: string;
  preferences: ChatPreferences;
  context: {
    name: string;
    type: string;
    interests: string[];
    goals: string[];
  };
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

function extractSuggestions(response: string): FollowUpSuggestion[] {
  try {
    // Extract JSON between <suggestions> tags
    const match = response.match(/<suggestions>([\s\S]*?)<\/suggestions>/);
    if (!match) {
      console.warn('No suggestions found in response');
      return generateFallbackSuggestions(response);
    }

    const suggestionsJson = match[1];
    const rawSuggestions = JSON.parse(suggestionsJson);

    // Map raw suggestions to our format
    return rawSuggestions.map((suggestion: any, index: number) => ({
      id: `suggestion-${index + 1}`,
      text: suggestion.text,
      description: suggestion.description,
      icon: determineIcon(suggestion.text.toLowerCase())
    }));
  } catch (error) {
    console.error('Failed to parse suggestions:', error);
    return generateFallbackSuggestions(response);
  }
}

function generateFallbackSuggestions(content: string): FollowUpSuggestion[] {
  const topics = {
    profile: /profile|bio|photo|picture/i,
    message: /message|text|write|say/i,
    date: /date|meet|meetup/i,
    confidence: /confidence|nervous|anxiety|fear/i,
    strategy: /strategy|approach|plan|improve/i
  };

  const suggestions: FollowUpSuggestion[] = [];

  // Add profile-related suggestions
  if (topics.profile.test(content)) {
    suggestions.push(
      {
        id: 'profile-1',
        text: 'Help me pick my best photos',
        description: 'Get guidance on your photo selection',
        icon: 'profile'
      },
      {
        id: 'profile-2',
        text: 'Write an amazing bio',
        description: 'Learn how to craft the perfect bio',
        icon: 'profile'
      }
    );
  }

  // Add message-related suggestions
  if (topics.message.test(content)) {
    suggestions.push(
      {
        id: 'message-1',
        text: 'Create conversation starters',
        description: 'Ideas to spark engaging chats',
        icon: 'message'
      },
      {
        id: 'message-2',
        text: 'Keep conversations exciting',
        description: 'Tips for maintaining great chats',
        icon: 'message'
      }
    );
  }

  // Add fallback suggestions if no specific match
  if (suggestions.length < 2) {
    suggestions.push(
      {
        id: 'strategy-1',
        text: 'Tell me about your dating goals',
        description: 'Get advice tailored to your journey',
        icon: 'strategy'
      },
      {
        id: 'strategy-2',
        text: 'What is your biggest dating challenge?',
        description: 'Share your struggles and find solutions',
        icon: 'strategy'
      }
    );
  }

  return suggestions.slice(0, 3);
}

function determineIcon(text: string): FollowUpSuggestion['icon'] {
  if (text.includes('profile') || text.includes('bio') || text.includes('photo')) {
    return 'profile';
  }
  if (text.includes('message') || text.includes('text') || text.includes('write')) {
    return 'message';
  }
  if (text.includes('date') || text.includes('meet')) {
    return 'date';
  }
  if (text.includes('confidence') || text.includes('nervous') || text.includes('fear')) {
    return 'confidence';
  }
  return 'strategy';
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
        const suggestions = extractSuggestions(response);
        
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