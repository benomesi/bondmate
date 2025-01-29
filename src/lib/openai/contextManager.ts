import type { Message, ChatPreferences, RelationType } from '../../types';

interface ConversationContext {
  relationshipType: RelationType;
  interests: string[];
  goals: string[];
  messageHistory: Message[];
  preferences: ChatPreferences;
  lastInteractionTime: number;
}

interface ContextState {
  [relationshipId: string]: ConversationContext;
}

export class ContextManager {
  private static instance: ContextManager;
  private contexts: ContextState = {};
  private readonly MAX_HISTORY_LENGTH = 20;
  private readonly CONTEXT_EXPIRY = 30 * 60 * 1000; // 30 minutes

  private constructor() {}

  static getInstance(): ContextManager {
    if (!ContextManager.instance) {
      ContextManager.instance = new ContextManager();
    }
    return ContextManager.instance;
  }

  updateContext(
    relationshipId: string,
    context: Partial<ConversationContext>
  ): void {
    this.contexts[relationshipId] = {
      ...this.contexts[relationshipId],
      ...context,
      lastInteractionTime: Date.now()
    };

    // Trim message history if needed
    if (this.contexts[relationshipId].messageHistory?.length > this.MAX_HISTORY_LENGTH) {
      this.contexts[relationshipId].messageHistory = this.contexts[relationshipId].messageHistory
        .slice(-this.MAX_HISTORY_LENGTH);
    }
  }

  getContext(relationshipId: string): ConversationContext | null {
    const context = this.contexts[relationshipId];
    if (!context) return null;

    // Check if context has expired
    if (Date.now() - context.lastInteractionTime > this.CONTEXT_EXPIRY) {
      delete this.contexts[relationshipId];
      return null;
    }

    return context;
  }

  addMessage(relationshipId: string, message: Message): void {
    if (!this.contexts[relationshipId]) {
      this.contexts[relationshipId] = {
        relationshipType: 'friendship',
        interests: [],
        goals: [],
        messageHistory: [],
        preferences: {
          tone: 'empathetic',
          length: 'balanced',
          style: 'supportive'
        },
        lastInteractionTime: Date.now()
      };
    }

    this.contexts[relationshipId].messageHistory = [
      ...this.contexts[relationshipId].messageHistory,
      message
    ].slice(-this.MAX_HISTORY_LENGTH);

    this.contexts[relationshipId].lastInteractionTime = Date.now();
  }

  clearContext(relationshipId: string): void {
    delete this.contexts[relationshipId];
  }

  getRelevantContext(relationshipId: string, currentMessage: string): string {
    const context = this.getContext(relationshipId);
    if (!context) return '';

    // Extract key topics from current message
    const topics = this.extractTopics(currentMessage);

    // Filter relevant message history
    const relevantHistory = context.messageHistory
      .filter(msg => this.isMessageRelevant(msg.content, topics))
      .slice(-5);

    return this.formatContextForPrompt(context, relevantHistory);
  }

  private extractTopics(message: string): Set<string> {
    const topics = new Set<string>();
    const topicPatterns = {
      profile: /profile|bio|photo/i,
      messaging: /message|text|chat/i,
      dating: /date|meet|relationship/i,
      confidence: /confidence|anxiety|nervous/i
    };

    Object.entries(topicPatterns).forEach(([topic, pattern]) => {
      if (pattern.test(message)) {
        topics.add(topic);
      }
    });

    return topics;
  }

  private isMessageRelevant(message: string, currentTopics: Set<string>): boolean {
    return Array.from(currentTopics).some(topic => 
      message.toLowerCase().includes(topic.toLowerCase())
    );
  }

  private formatContextForPrompt(
    context: ConversationContext,
    relevantHistory: Message[]
  ): string {
    return `Context:
- Relationship Type: ${context.relationshipType}
- Interests: ${context.interests.join(', ')}
- Goals: ${context.goals.join(', ')}

Relevant History:
${relevantHistory.map(msg => 
  `${msg.isAI ? 'Assistant' : 'User'}: ${msg.content}`
).join('\n')}`;
  }
}

export const contextManager = ContextManager.getInstance();