import { Heart } from 'lucide-react';
import type { Quiz } from './types';

export const loveLanguagesQuiz: Quiz = {
  title: 'Love Languages Assessment',
  icon: Heart,
  questions: [
    {
      id: 'll1',
      text: 'What makes you feel most appreciated in a relationship?',
      options: [
        { value: 'wordsOfAffirmation', text: 'Hearing "I love you" and receiving compliments' },
        { value: 'actsOfService', text: 'When someone helps me with tasks or responsibilities' },
        { value: 'receivingGifts', text: 'Receiving thoughtful gifts or tokens of affection' },
        { value: 'qualityTime', text: 'Having someone\'s undivided attention' },
        { value: 'physicalTouch', text: 'Physical affection like hugs or holding hands' }
      ]
    },
    {
      id: 'll2',
      text: 'How do you typically express affection?',
      options: [
        { value: 'wordsOfAffirmation', text: 'Giving compliments and expressing feelings verbally' },
        { value: 'actsOfService', text: 'Doing helpful things for others' },
        { value: 'receivingGifts', text: 'Giving meaningful gifts' },
        { value: 'qualityTime', text: 'Spending focused time together' },
        { value: 'physicalTouch', text: 'Through physical touch and closeness' }
      ]
    },
    {
      id: 'll3',
      text: 'What gesture means the most to you?',
      options: [
        { value: 'wordsOfAffirmation', text: 'A heartfelt letter or message' },
        { value: 'actsOfService', text: 'Someone taking care of a task for you' },
        { value: 'receivingGifts', text: 'A surprise gift that shows they were thinking of you' },
        { value: 'qualityTime', text: 'An uninterrupted conversation' },
        { value: 'physicalTouch', text: 'A warm hug or gentle touch' }
      ]
    },
    {
      id: 'll4',
      text: 'What makes you feel most connected to someone?',
      options: [
        { value: 'wordsOfAffirmation', text: 'Deep conversations about feelings' },
        { value: 'actsOfService', text: 'Working on tasks together' },
        { value: 'receivingGifts', text: 'Exchanging meaningful presents' },
        { value: 'qualityTime', text: 'Sharing experiences and activities' },
        { value: 'physicalTouch', text: 'Physical proximity and touch' }
      ]
    },
    {
      id: 'll5',
      text: 'What bothers you most in a relationship?',
      options: [
        { value: 'wordsOfAffirmation', text: 'Lack of verbal appreciation' },
        { value: 'actsOfService', text: 'Not receiving help when needed' },
        { value: 'receivingGifts', text: 'Forgotten special occasions' },
        { value: 'qualityTime', text: 'Distracted attention during time together' },
        { value: 'physicalTouch', text: 'Limited physical affection' }
      ]
    }
  ]
};

export const loveLanguagesDetails = {
  wordsOfAffirmation: {
    title: 'Words of Affirmation',
    description: 'You value verbal expressions of love, appreciation, and encouragement. Hearing "I love you" and receiving compliments means the world to you.',
    tips: [
      'Share your need for verbal affirmation with loved ones',
      'Practice expressing appreciation verbally to others',
      'Keep meaningful messages or letters as reminders'
    ]
  },
  actsOfService: {
    title: 'Acts of Service',
    description: 'Actions speak louder than words for you. You feel most loved when others show they care through helpful actions and support.',
    tips: [
      'Communicate specific ways others can help you',
      'Show love through practical assistance',
      'Appreciate the intent behind others\' helpful actions'
    ]
  },
  receivingGifts: {
    title: 'Receiving Gifts',
    description: 'You appreciate thoughtful presents and tokens of affection. It\'s not about the monetary value, but the meaning and thought behind the gift.',
    tips: [
      'Create wish lists to help others choose meaningful gifts',
      'Express appreciation for thoughtful gestures',
      'Focus on the sentiment behind gifts received'
    ]
  },
  qualityTime: {
    title: 'Quality Time',
    description: 'You value undivided attention and shared experiences. Having someone\'s full presence means more than any material gift.',
    tips: [
      'Schedule regular one-on-one time with loved ones',
      'Put away distractions during quality time',
      'Plan activities that allow for meaningful connection'
    ]
  },
  physicalTouch: {
    title: 'Physical Touch',
    description: 'Physical affection is your primary way of experiencing love. Hugs, kisses, and gentle touches make you feel connected and secure.',
    tips: [
      'Communicate your comfort level with physical affection',
      'Initiate appropriate physical contact with loved ones',
      'Respect others\' boundaries while expressing your needs'
    ]
  }
};