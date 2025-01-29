import { OpenAIError } from '../../../../lib/openai';
import { getChatResponse } from '../../../../lib/openai';
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

// Mock responses for demo mode
const DEMO_RESPONSES = {
  default: `I understand you're looking for dating advice. Let’s make this fun and actionable! Here's where we can start:

**Key Points**

• Dating is about building genuine connections while growing as a person.

• Focus on authenticity—your unique qualities are what stand out.

• Small improvements (like a sharper bio or better photos) can have a huge impact.

What would you like to dive into?
1. Profile optimization
2. Conversation tips
3. Creative date ideas`,
  profile: `Let’s polish your profile and make it irresistible:

**Profile Optimization**

• Use 4-6 recent, high-quality photos that showcase your hobbies, personality, and confidence.

• Your bio should be a mix of charm and authenticity. Add conversation hooks like favorite places or quirky interests.

• Include specifics: hobbies, travel experiences, or personal quirks.

**Quick Tip**
Think of your profile as the opening line to your story. What makes you interesting? What sets you apart?`,
  message: `Stand out in your messages with these tips:

**Message Crafting**

• Use something specific from their profile to start—everyone loves personalized attention.

• Ask open-ended questions to keep the conversation alive.

• Add a touch of humor or curiosity to show your personality.

**Examples**

• “That travel pic is amazing! Where was it, and what was the most surprising part of the trip?”

• “You seem like a foodie—any restaurant you’d recommend I try?”`,
  date: `Let’s plan a memorable date experience:

**Date Ideas**

• Choose activities that allow for interaction: coffee and a walk, cooking class, or exploring a scenic spot.

• Be mindful of comfort levels. Fun beats fancy every time!

• Have a backup plan in case things don’t go as expected (like bad weather).

**Popular Ideas**

• A casual coffee walk in a park.

• Cooking something together at a fun workshop.

• Exploring a unique local spot (bookstore, arcade, rooftop views).`
};

export async function getDemoResponse(
  content: string,
  config: DemoConfig
): Promise<DemoResponse> {
  try {
    if (!content || typeof content !== 'string' || !content.trim()) {
      throw new Error('Please enter a message.');
    }

    // Simulate a short delay for realism
    await new Promise(resolve => setTimeout(resolve, 500));

    // Determine the appropriate response type
    const contentLower = content.toLowerCase();
    let response = DEMO_RESPONSES.default;

    if (contentLower.includes('profile') || contentLower.includes('bio') || contentLower.includes('photo')) {
      response = DEMO_RESPONSES.profile;
    } else if (contentLower.includes('message') || contentLower.includes('text') || contentLower.includes('write')) {
      response = DEMO_RESPONSES.message;
    } else if (contentLower.includes('date') || contentLower.includes('meet')) {
      response = DEMO_RESPONSES.date;
    }

    // Generate tailored follow-up suggestions
    const suggestions = generateSuggestions(content);

    return {
      message: response,
      suggestions
    };
  } catch (error) {
    console.error('Demo response error:', {
      error,
      content,
      config
    });
    throw new OpenAIError(
      error instanceof Error ? error.message : 'Failed to fetch response',
      'demo_error'
    );
  }
}

function generateSuggestions(content: string): FollowUpSuggestion[] {
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
        text: 'What’s your biggest dating challenge?',
        description: 'Share your struggles and find solutions',
        icon: 'strategy'
      }
    );
  }

  return suggestions.slice(0, 3);
}
