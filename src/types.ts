export type RelationType = 'romantic' | 'family' | 'friendship' | 'professional';

export interface Relationship {
  id: string;
  name: string;
  type: RelationType;
  context?: string;
  interests: string[];
  goals: string[];
  communicationStyle?: string;
  personalityTraits?: string[];
}

export interface Message {
  id: string;
  content: string;
  timestamp: string;
  isAI: boolean;
}

export interface User {
  name: string;
  is_admin: boolean;
  is_premium: boolean;
  interests: string[];
  goals: string[];
  communicationStyle?: string;
}

export type ModelTier = 'free' | 'premium';

export interface QuizResults {
  attachmentStyle?: {
    type: 'secure' | 'anxious' | 'avoidant' | 'disorganized';
    score: number;
  };
  loveLanguages?: {
    wordsOfAffirmation: number;
    actsOfService: number;
    receivingGifts: number;
    qualityTime: number;
    physicalTouch: number;
  };
  personalityAlignment?: {
    type: 'harmonizer' | 'avoider' | 'leader' | 'empath';
    score: number;
    description: string;
  };
}

export interface ChatPreferences {
  tone: 'empathetic' | 'professional' | 'casual' | 'formal' | 'playful';
  length: 'concise' | 'balanced' | 'detailed';
  style: 'actionable' | 'analytical' | 'narrative' | 'supportive';
}