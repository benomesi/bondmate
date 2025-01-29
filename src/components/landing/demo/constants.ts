import { Heart, Shield, Brain } from 'lucide-react';
import type { Scenario } from './types';

export const SCENARIOS: Scenario[] = [
  {
    id: 'dating-apps',
    icon: Heart,
    title: 'Dating App Success',
    description: 'Stand out and make connections',
    prompt: "I'm not getting many matches on dating apps, and when I do message someone, I rarely get responses. How can I improve my profile and messages?"
  },
  {
    id: 'dating',
    icon: Heart,
    title: 'First Date Anxiety',
    description: 'Turn nervousness into confidence',
    prompt: "I have a first date tomorrow and my anxiety is through the roof. I really like this person and don't want to mess it up."
  },
  {
    id: 'conflict',
    icon: Shield,
    title: 'Heal a Relationship',
    description: 'Rebuild trust and connection',
    prompt: "I said some things I regret during an argument with my partner. I'm afraid I've damaged our relationship and don't know how to fix it."
  },
  {
    id: 'communication',
    icon: Brain,
    title: 'Express Your Feelings',
    description: 'Open up authentically',
    prompt: "I'm struggling to tell my partner how I really feel. I'm afraid of being vulnerable but I know I need to open up."
  }
];

export const AI_RESPONSES = {
  dating: {
    initial: `I can hear the excitement and nervousness in your message, and I want you to know that what you're feeling is completely natural. First dates with someone we really like can bring up all kinds of emotions! 

The good news is that feeling nervous actually shows you care, and that's a beautiful thing. Would you like to talk about what's making you most anxious? Whether it's the conversation flow, making a good impression, or even just deciding what to wear - I'm here to help you feel more confident and prepared.

Tell me what's on your mind, and we'll work through this together.`,
    followUps: {
      "1": {
        response: `You know, the best conversations often flow from genuine curiosity and shared interests. Instead of thinking of it as a performance, try to approach it as getting to know someone interesting.

I find the FORD method really helpful - it stands for Family, Occupation, Recreation, and Dreams. These topics naturally lead to engaging conversations because they touch on things people care about. For example, asking about their favorite weekend activities can reveal shared interests, or discussing future plans can show you both where your aspirations align.

Remember, it's not about memorizing topics - it's about showing genuine interest in their story. Would you like to explore some natural ways to start these conversations, or would you prefer tips on being an engaged listener?`,
        options: [
          "Yes, share some conversation starters",
          "Tell me more about active listening"
        ]
      },
      "2": {
        response: `Being yourself is the best way to make a genuine impression! Here's why:

1. **Authenticity Builds Trust**
   - Shows confidence in who you are
   - Creates genuine connections
   - Reduces anxiety about "keeping up an act"

2. **Focus on Being Present**
   - Make eye contact
   - Show genuine interest
   - Share your own experiences

Would you like specific tips for boosting confidence or handling awkward moments?`,
        options: [
          "How can I boost my confidence?",
          "Help with handling awkward moments"
        ]
      }
    },
    final: `Here's your complete first date success toolkit:

1. **Before the Date**
   - Choose a comfortable venue
   - Plan a flexible timeline
   - Prepare conversation topics
   - Get a good night's sleep

2. **During the Date**
   - Focus on being present
   - Ask open-ended questions
   - Share your own stories
   - Pay attention to body language

3. **Remember**
   - They're probably nervous too
   - It's okay to admit nervousness
   - Focus on having fun
   - Be yourself!

*Want personalized coaching for your dating journey? Start your free trial now!*`
  },
  'dating-apps': {
    initial: `The dating app world can definitely feel overwhelming sometimes. It's a unique way of connecting that comes with its own challenges, and it's completely normal to feel frustrated when you're not getting the results you hope for.

Let's look at where you might be getting stuck:

• Profile not getting enough matches?
• Photos not showing your best self?
• Bio not capturing who you are?
• Messages not getting responses?

Let me know what's most challenging, and we'll work on improving your results.`,
    followUps: {
      "1": {
        response: `Your dating profile is really your chance to tell your story authentically. Think of it as a window into your world - not just a list of facts, but a glimpse of who you are and what makes you unique.

The most engaging profiles I've seen share genuine moments from people's lives. Maybe it's a photo from that hiking trip where you reached the summit, or a candid shot of you laughing with friends. These real moments tell so much more about you than a carefully posed selfie ever could.

Your bio should feel like a warm, engaging conversation starter. Instead of listing hobbies, share what excites you about them. Rather than saying "I love travel," you might mention your dream of learning to make pasta in Italy.

Would you like to explore how to choose photos that tell your story, or shall we work on crafting a bio that sparks meaningful conversations?`,
        options: [
          "Help with profile photos",
          "Help writing my bio"
        ]
      },
      "2": {
        response: `Great messages get responses! Here's the formula:

1. **First Message Strategy**
   - Reference something from their profile
   - Ask an engaging question
   - Show genuine interest
   - Keep it light and fun

2. **Common Mistakes to Avoid**
   - Generic greetings ("hey")
   - Overly complex messages
   - Being too forward
   - Multiple unanswered messages

Want example messages or tips for specific situations?`,
        options: [
          "Show me message examples",
          "Tips for specific situations"
        ]
      }
    },
    final: `Here's your complete dating app success guide:

1. **Profile Optimization**
   - High-quality, varied photos
   - Engaging, authentic bio
   - Clear interests and intentions
   - Regular profile updates

2. **Messaging Strategy**
   - Personalized first messages
   - Engaging questions
   - Timely responses
   - Natural conversation flow

3. **Next Steps**
   - Move to real conversation
   - Plan safe, public meetups
   - Be patient and consistent
   - Stay positive and authentic

*Want personalized profile review and messaging strategies? Start your free trial now!*`
  },
  conflict: {
    initial: `I understand you want to make things right. Let's handle this thoughtfully. First, could you tell me what kind of argument it was?

1. Miscommunication or misunderstanding?
2. Difference in values or expectations?
3. Emotional reaction to a situation?
4. Recurring issue or pattern?

Let me know, and I'll help you develop the right approach.`,
    followUps: {
      "1": {
        response: `Miscommunications happen to everyone. Let's break down how to clear things up:

1. **First Step: Self-Reflection**
   - What was your intended message?
   - What might they have understood instead?
   - Where did the disconnect happen?

2. **Next Steps**
   - Take responsibility for your part
   - Express desire to understand their perspective
   - Clarify your intended meaning

Would you like help crafting an opening message or tips for the conversation?`,
        options: [
          "Help me craft a message",
          "Tips for the conversation"
        ]
      },
      "2": {
        response: `When values or expectations differ, it's important to find common ground:

1. **Understanding Differences**
   - Acknowledge both perspectives are valid
   - Focus on shared values
   - Look for compromise opportunities

2. **Moving Forward**
   - Express appreciation for their viewpoint
   - Share your perspective calmly
   - Work on solutions together

Would you like help expressing your perspective or finding compromise?`,
        options: [
          "Help with expressing my view",
          "Tips for finding compromise"
        ]
      }
    },
    final: `Here's your complete conflict resolution plan:

1. **Prepare Mentally**
   - Take deep breaths
   - Focus on resolution
   - Remember your care for them

2. **Have the Conversation**
   - Choose the right time and place
   - Use "I" statements
   - Listen actively
   - Stay calm and focused

3. **Moving Forward**
   - Agree on action steps
   - Set clear expectations
   - Plan check-in times
   - Show appreciation

*Want personalized guidance for your situation? Start your free trial now!*`
  },
  communication: {
    initial: `Opening up about feelings takes courage, and I'm here to help you do it in a way that feels safe and authentic. Let's start by identifying what's holding you back:

• Fear of rejection or judgment?
• Unsure how to express yourself?
• Worried about timing?
• Past experiences making you hesitate?

Let me know your main concern, and we'll work through it together.`,
    followUps: {
      "1": {
        response: `It's natural to feel vulnerable when opening up. Here's how to make it easier:

Let's create a safe space for this important conversation:

First, choose a private, comfortable setting where you both feel at ease. Pick a time when you're both calm and have space to really listen to each other. Starting with smaller disclosures can help build confidence before sharing deeper feelings.

Remember to use "I" statements to express your experience without blame. For example, instead of "You never listen," try "I feel unheard when..." This approach keeps the focus on your feelings while inviting understanding rather than defensiveness.

Would you like help planning the conversation or expressing your feelings?`,
        options: [
          "Help me plan the conversation",
          "Help me express my feelings"
        ]
      },
      "2": {
        response: `Expressing yourself clearly is key. Here's a framework to help:

1. **Structure Your Thoughts**
   - Name your feelings
   - Identify triggers
   - Clarify your needs
   - Consider solutions

2. **Communication Tips**
   - Be specific
   - Stay focused
   - Listen actively
   - Be open to feedback

Would you like examples of how to start or tips for staying calm?`,
        options: [
          "Show me example openers",
          "Tips for staying calm"
        ]
      }
    },
    final: `Here's your complete guide to opening up:

1. **Preparation**
   - Write down key points
   - Practice self-compassion
   - Choose the right moment
   - Set realistic expectations

2. **During the Conversation**
   - Start slowly
   - Be honest and direct
   - Stay present
   - Listen without defending

3. **After Sharing**
   - Acknowledge their response
   - Thank them for listening
   - Plan next steps
   - Be proud of yourself

*Want personalized support for deeper conversations? Start your free trial now!*`
  }
};