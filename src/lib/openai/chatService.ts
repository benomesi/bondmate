import { OpenAIError } from '../openai';
import { generateSystemPrompt } from './prompts';
import { generateSuggestions } from './suggestions';
import { rateLimiter } from '../rateLimiter';
import type { ChatPreferences, Message } from '../../types';

// Optimized chat service with better error handling and retries
export class ChatService {
  private static instance: ChatService;
  private messageQueue: Map<string, Promise<any>> = new Map();
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAYS = [1000, 2000, 4000];

  private constructor() {}

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  private async withTimeout<T>(promise: Promise<T>, timeoutMs: number = 30000): Promise<T> {
    const timeoutPromise = new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error('Request timed out')), timeoutMs);
    });

    return Promise.race([promise, timeoutPromise]);
  }

  private async processMessageQueue<T>(key: string, task: () => Promise<T>): Promise<T> {
    const currentTask = this.messageQueue.get(key) || Promise.resolve();
    const newTask = currentTask.then(task, task); // Continue even if previous task failed
    this.messageQueue.set(key, newTask);

    try {
      return await newTask;
    } finally {
      if (this.messageQueue.get(key) === newTask) {
        this.messageQueue.delete(key);
      }
    }
  }

  async sendMessage(
    content: string,
    context: {
      name: string;
      type: string;
      interests: string[];
      goals: string[];
    },
    preferences: ChatPreferences,
    messageHistory: Message[] = []
  ): Promise<{ message: string; suggestions: any[] }> {
    return this.processMessageQueue(context.name, async () => {
      let lastError: Error | null = null;

      for (let i = 0; i < this.MAX_RETRIES; i++) {
        try {
          await rateLimiter.checkLimit('chat');
          
          const systemPrompt = generateSystemPrompt(context, preferences);
          const messages = [
            { role: 'system' as const, content: systemPrompt },
            ...messageHistory.slice(-10).map(msg => ({
              role: msg.isAI ? 'assistant' as const : 'user' as const,
              content: msg.content
            })),
            { role: 'user' as const, content: content.trim() }
          ];

          const response = await this.withTimeout(
            fetch('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
              },
              body: JSON.stringify({
                model: 'gpt-4-turbo-preview',
                messages,
                temperature: 0.7,
                max_tokens: preferences.length === 'concise' ? 300 : 
                           preferences.length === 'detailed' ? 2000 : 1000,
                presence_penalty: 0.6,
                frequency_penalty: 0.5
              })
            })
          );

          if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.statusText}`);
          }

          const data = await response.json();
          const message = data.choices[0]?.message?.content;

          if (!message) {
            throw new Error('Empty response from OpenAI');
          }

          const suggestions = generateSuggestions(content, message);
          return { message, suggestions };

        } catch (error) {
          lastError = error as Error;
          if (i < this.MAX_RETRIES - 1) {
            await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAYS[i]));
            continue;
          }
          throw error;
        }
      }

      throw lastError || new Error('Max retries exceeded');
    });
  }
}

export const chatService = ChatService.getInstance();