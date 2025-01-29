import { Brain } from 'lucide-react';
import type { Quiz } from './types';

export const attachmentStyleQuiz: Quiz = {
  title: 'Attachment Style Assessment',
  icon: Brain,
  questions: [
    {
      id: 'as1',
      text: 'How do you typically react when a loved one needs space?',
      options: [
        { value: 'secure', text: 'I understand and respect their need for space while staying connected' },
        { value: 'anxious', text: 'I worry they\'re pulling away and try to get closer' },
        { value: 'avoidant', text: 'I welcome the space and might even distance myself more' },
        { value: 'disorganized', text: 'I feel conflicted between giving space and seeking closeness' }
      ]
    },
    {
      id: 'as2',
      text: 'When facing relationship conflicts, you usually:',
      options: [
        { value: 'secure', text: 'Address issues directly and work towards solutions together' },
        { value: 'anxious', text: 'Worry about the relationship ending and seek constant reassurance' },
        { value: 'avoidant', text: 'Withdraw and need time alone to process' },
        { value: 'disorganized', text: 'Feel overwhelmed and react unpredictably' }
      ]
    },
    {
      id: 'as3',
      text: 'In close relationships, you tend to:',
      options: [
        { value: 'secure', text: 'Feel comfortable with both intimacy and independence' },
        { value: 'anxious', text: 'Worry about being abandoned or not being enough' },
        { value: 'avoidant', text: 'Value your independence and find it hard to depend on others' },
        { value: 'disorganized', text: 'Struggle with trusting others while craving connection' }
      ]
    },
    {
      id: 'as4',
      text: 'When something goes wrong in a relationship, your first thought is:',
      options: [
        { value: 'secure', text: 'Let\'s talk about this and find a solution together' },
        { value: 'anxious', text: 'This is terrible, what if they leave me?' },
        { value: 'avoidant', text: 'I need space to figure this out on my own' },
        { value: 'disorganized', text: 'I don\'t know how to handle this or what to feel' }
      ]
    },
    {
      id: 'as5',
      text: 'Your approach to emotional intimacy is:',
      options: [
        { value: 'secure', text: 'Comfortable sharing feelings and supporting others' },
        { value: 'anxious', text: 'Want to be very close but worry about being too much' },
        { value: 'avoidant', text: 'Prefer to maintain some emotional distance' },
        { value: 'disorganized', text: 'Alternate between wanting closeness and pushing away' }
      ]
    }
  ]
};

export const attachmentStyleDetails = {
  secure: {
    title: 'Secure Attachment',
    description: 'You have a healthy balance of independence and intimacy in relationships. You\'re comfortable with emotional closeness and can effectively communicate your needs while respecting others\' boundaries. This secure foundation allows you to build strong, lasting relationships.',
    tips: [
      'Continue fostering open communication in your relationships',
      'Share your relationship skills with others who might be struggling',
      'Maintain your healthy balance of independence and connection'
    ]
  },
  anxious: {
    title: 'Anxious Attachment',
    description: 'You deeply value close relationships and may sometimes worry about losing them. Your strong desire for connection can make you particularly sensitive to changes in relationships and lead to seeking frequent reassurance.',
    tips: [
      'Practice self-soothing techniques when feeling anxious',
      'Work on building self-confidence independent of relationships',
      'Communicate needs clearly without fear of being "too much"'
    ]
  },
  avoidant: {
    title: 'Avoidant Attachment',
    description: 'You value independence and may find it challenging to fully open up in relationships. While self-reliance is a strength, it might sometimes create emotional distance in your relationships.',
    tips: [
      'Practice gradual emotional vulnerability with trusted people',
      'Recognize that interdependence can be healthy',
      'Communicate your need for space clearly and lovingly'
    ]
  },
  disorganized: {
    title: 'Disorganized Attachment',
    description: 'You experience both a desire for close relationships and difficulty trusting them fully. This can create a pattern of approaching and withdrawing from relationships as you navigate complex emotions.',
    tips: [
      'Work with a therapist to process past experiences',
      'Practice consistency in relationships, even when challenging',
      'Develop a strong self-care routine to manage emotional intensity'
    ]
  }
};