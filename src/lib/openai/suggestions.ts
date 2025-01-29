import type { Message } from '../../types';

export interface Suggestion {
  id: string;
  text: string;
  description: string;
  icon: 'profile' | 'message' | 'date' | 'confidence' | 'strategy';
}

export function extractSuggestions(content: string): Suggestion[] {
  try {
    // Extract JSON between <suggestions> tags
    const match = content.match(/<suggestions>([\s\S]*?)<\/suggestions>/);
    if (!match) {
      console.warn('No suggestions found in response');
      return generateFallbackSuggestions(content);
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
    return generateFallbackSuggestions(content);
  }
}

function generateFallbackSuggestions(content: string): Suggestion[] {
  const topics = {
    profile: /profile|bio|photo|picture/i,
    message: /message|text|write|say/i,
    date: /date|meet|meetup/i,
    confidence: /confidence|nervous|anxiety|fear/i,
    strategy: /strategy|approach|plan|improve/i
  };

  const suggestions: Suggestion[] = [];

  // Profile-related suggestions
  if (topics.profile.test(content)) {
    suggestions.push(
      {
        id: 'profile-1',
        text: 'Help me choose my best photos',
        description: 'Get expert advice on photo selection',
        icon: 'profile'
      },
      {
        id: 'profile-2',
        text: 'Write a better bio',
        description: 'Craft an engaging profile description',
        icon: 'profile'
      }
    );
  }

  // Message-related suggestions
  if (topics.message.test(content)) {
    suggestions.push(
      {
        id: 'message-1',
        text: 'Give me conversation starters',
        description: 'Get engaging opening lines',
        icon: 'message'
      },
      {
        id: 'message-2',
        text: 'Help me keep conversations going',
        description: 'Learn to maintain engaging chats',
        icon: 'message'
      }
    );
  }

  // Date-related suggestions
  if (topics.date.test(content)) {
    suggestions.push(
      {
        id: 'date-1',
        text: 'First date ideas',
        description: 'Creative and fun date suggestions',
        icon: 'date'
      },
      {
        id: 'date-2',
        text: 'How to plan the perfect date',
        description: 'Step-by-step date planning guide',
        icon: 'date'
      }
    );
  }

  // Confidence-related suggestions
  if (topics.confidence.test(content)) {
    suggestions.push(
      {
        id: 'confidence-1',
        text: 'Build dating confidence',
        description: 'Overcome dating anxiety',
        icon: 'confidence'
      },
      {
        id: 'confidence-2',
        text: 'Handle rejection better',
        description: 'Build resilience in dating',
        icon: 'confidence'
      }
    );
  }

  // Add fallback suggestions if needed
  if (suggestions.length < 2) {
    suggestions.push(
      {
        id: 'strategy-1',
        text: 'Tell me more about your dating goals',
        description: 'Get personalized dating advice',
        icon: 'strategy'
      },
      {
        id: 'strategy-2',
        text: 'What specific challenges are you facing?',
        description: 'Get targeted solutions',
        icon: 'strategy'
      }
    );
  }

  // Return max 3 suggestions
  return suggestions.slice(0, 3);
}

function determineIcon(text: string): Suggestion['icon'] {
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