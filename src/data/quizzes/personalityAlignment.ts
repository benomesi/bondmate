import { Users } from 'lucide-react';
import type { Quiz } from './types';

export const personalityAlignmentQuiz: Quiz = {
  title: 'Personality Alignment Assessment',
  icon: Users,
  questions: [
    {
      id: 'pa1',
      text: 'When someone criticizes you, how do you usually react?',
      options: [
        { value: 'harmonizer', text: 'I stay calm and try to understand their perspective' },
        { value: 'avoider', text: 'I feel hurt and may become defensive' },
        { value: 'leader', text: 'I confront them and express how I feel' },
        { value: 'empath', text: 'I actively listen and validate their feelings' }
      ]
    },
    {
      id: 'pa2',
      text: 'How do you approach resolving a disagreement with a loved one?',
      options: [
        { value: 'harmonizer', text: 'I openly discuss the issue and look for a compromise' },
        { value: 'avoider', text: 'I try to avoid conflict and hope it resolves itself' },
        { value: 'leader', text: 'I prioritize my perspective and push for my solution' },
        { value: 'empath', text: 'I actively listen to their point of view before sharing mine' }
      ]
    },
    {
      id: 'pa3',
      text: 'When a friend is upset, what\'s your first instinct?',
      options: [
        { value: 'harmonizer', text: 'I offer to listen and provide emotional support' },
        { value: 'avoider', text: 'I give them space unless they ask for help' },
        { value: 'leader', text: 'I take charge and help them find a solution' },
        { value: 'empath', text: 'I try to understand and validate their feelings' }
      ]
    },
    {
      id: 'pa4',
      text: 'In group discussions, how do you usually contribute?',
      options: [
        { value: 'harmonizer', text: 'I actively listen and build on others\' ideas' },
        { value: 'avoider', text: 'I share my thoughts but prefer to keep a low profile' },
        { value: 'leader', text: 'I take charge and lead the conversation' },
        { value: 'empath', text: 'I ensure everyone feels heard and included' }
      ]
    },
    {
      id: 'pa5',
      text: 'When your partner doesn\'t meet your expectations, how do you handle it?',
      options: [
        { value: 'harmonizer', text: 'I express my concerns calmly and explain how I feel' },
        { value: 'avoider', text: 'I feel upset but avoid bringing it up to avoid conflict' },
        { value: 'leader', text: 'I directly address the issue and state my expectations' },
        { value: 'empath', text: 'I try to understand their perspective first' }
      ]
    },
    {
      id: 'pa6',
      text: 'How do you react when a loved one is quiet or withdrawn?',
      options: [
        { value: 'harmonizer', text: 'I ask if something is wrong and offer support' },
        { value: 'avoider', text: 'I assume they need space and don\'t address it' },
        { value: 'leader', text: 'I encourage them to open up and talk about it' },
        { value: 'empath', text: 'I sense their mood and respond accordingly' }
      ]
    },
    {
      id: 'pa7',
      text: 'What do you value most in communication with others?',
      options: [
        { value: 'harmonizer', text: 'Finding common ground and mutual understanding' },
        { value: 'avoider', text: 'Keeping things peaceful and avoiding tension' },
        { value: 'leader', text: 'Being direct and getting to the point' },
        { value: 'empath', text: 'Creating a safe space for emotional expression' }
      ]
    },
    {
      id: 'pa8',
      text: 'How do you usually express empathy?',
      options: [
        { value: 'harmonizer', text: 'I listen attentively and validate their feelings' },
        { value: 'avoider', text: 'I give them space to process their emotions' },
        { value: 'leader', text: 'I offer solutions to help them move forward' },
        { value: 'empath', text: 'I deeply connect with their emotional experience' }
      ]
    },
    {
      id: 'pa9',
      text: 'When resolving conflicts, what\'s most important to you?',
      options: [
        { value: 'harmonizer', text: 'Finding a solution that works for everyone' },
        { value: 'avoider', text: 'Maintaining peace and avoiding escalation' },
        { value: 'leader', text: 'Reaching a clear and decisive resolution' },
        { value: 'empath', text: 'Ensuring everyone feels heard and understood' }
      ]
    },
    {
      id: 'pa10',
      text: 'If someone misunderstands you, how do you respond?',
      options: [
        { value: 'harmonizer', text: 'I clarify my point respectfully and ensure understanding' },
        { value: 'avoider', text: 'I might let it go to avoid potential conflict' },
        { value: 'leader', text: 'I assertively correct the misunderstanding' },
        { value: 'empath', text: 'I try to understand their perspective first' }
      ]
    }
  ]
};

export const personalityAlignmentDetails = {
  harmonizer: {
    title: 'The Harmonizer',
    description: `You value open communication, active listening, and finding solutions that work for everyone. You're empathetic and focus on maintaining harmony in your relationships. Your ability to remain calm and prioritize understanding makes you a trusted partner and friend.

However, your desire for harmony can sometimes lead to over-accommodating others at the expense of your own needs. Finding the right balance between maintaining peace and asserting your own boundaries is key to your growth.`,
    tips: [
      'Practice balancing your desire to accommodate with asserting your own needs',
      'Embrace conflict as a natural part of growth',
      'Celebrate your empathy while maintaining healthy boundaries'
    ]
  },
  avoider: {
    title: 'The Avoider',
    description: `You prefer to avoid conflict and prioritize peace, often suppressing your own feelings to keep things calm. While this approach can prevent unnecessary arguments, it can also leave important issues unresolved.

Your tendency to avoid confrontation may stem from a desire to maintain harmony, but it can sometimes make others feel distant or disconnected. Learning to address conflicts constructively while maintaining your peaceful nature is your path forward.`,
    tips: [
      'Start addressing small conflicts to build confidence',
      'Express your feelings constructively rather than suppressing them',
      'Work on opening up gradually with trusted individuals'
    ]
  },
  leader: {
    title: 'The Leader',
    description: `You're assertive, confident, and often take charge in conversations and decision-making. Your clarity and decisiveness are valuable strengths, but they can sometimes overshadow the perspectives of others.

While your leadership qualities help drive relationships forward, learning to balance assertiveness with receptiveness will enhance your connections. Your natural ability to take initiative can be even more effective when combined with collaborative approaches.`,
    tips: [
      'Focus on active listening and inclusive discussion',
      'Balance assertiveness with empathy',
      'Use leadership skills to foster collaboration'
    ]
  },
  empath: {
    title: 'The Empath',
    description: `You excel at understanding and validating others' emotions. People value your support and ability to connect on a deep level. Your natural ability to sense and respond to others' feelings creates strong emotional bonds.

While your empathy strengthens relationships, it can sometimes lead to emotional exhaustion or difficulty setting boundaries. Learning to balance your caring nature with self-care is essential for maintaining healthy relationships.`,
    tips: [
      'Practice setting emotional boundaries',
      'Balance supporting others with self-care',
      'Use your empathy while maintaining personal space'
    ]
  }
};