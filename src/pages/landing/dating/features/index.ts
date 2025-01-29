// Updated feature definitions with more comprehensive offerings
export interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
  benefits: string[];
}

export const ALL_FEATURES: Feature[] = [
  {
    id: 'conversation-strategy',
    icon: 'MessageSquare',
    title: 'Conversation Strategy',
    description: 'Master the art of engaging conversations that lead to real connections',
    benefits: [
      'Message timing optimization',
      'Topic suggestions based on profiles',
      'Recovery strategies for dead conversations',
      'Cultural sensitivity guidance'
    ]
  },
  {
    id: 'personal-growth',
    icon: 'Target',
    title: 'Personal Growth Tracking',
    description: 'Track your progress and build lasting confidence in dating',
    benefits: [
      'Confidence building exercises',
      'Social skills development',
      'Self-improvement goals',
      'Progress monitoring'
    ]
  },
  {
    id: 'relationship-guide',
    icon: 'Heart',
    title: 'Relationship Progression',
    description: 'Navigate each stage of dating with confidence and clarity',
    benefits: [
      'Timing for key relationship steps',
      'Exclusivity conversation tips',
      'Meeting friends/family preparation',
      'Red flags awareness'
    ]
  },
  {
    id: 'cultural-advisor',
    icon: 'Globe',
    title: 'Cultural Dating Advisor',
    description: 'Navigate cultural differences in modern dating with confidence',
    benefits: [
      'Cross-cultural dating etiquette',
      'Traditional vs modern approaches',
      'Cultural sensitivity training',
      'International dating norms'
    ]
  },
  {
    id: 'long-term-planning',
    icon: 'Compass',
    title: 'Long-term Success',
    description: 'Build lasting relationships with strategic guidance',
    benefits: [
      'Relationship goal setting',
      'Values alignment checking',
      'Future vision development',
      'Compatibility evaluation'
    ]
  },
  {
    id: 'recovery-resilience',
    icon: 'Shield',
    title: 'Recovery & Resilience',
    description: 'Build emotional strength and bounce back from setbacks',
    benefits: [
      'Breakup recovery guidance',
      'Dating burnout prevention',
      'Mental health maintenance',
      'Motivation strategies'
    ]
  }
];