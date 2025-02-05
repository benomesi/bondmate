import { supabase } from '../lib/supabase';
import { encryptMessage,} from '../lib/encryption';
import { messageService } from './messages';
import type { Message, Relationship, ChatPreferences } from '../types';


// Chat service specific errors
export class ChatServiceError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'ChatServiceError';
  }
}

export class ChatService {
  public messageService = messageService;
  private messageQueue: Map<string, Promise<any>> = new Map();
  private async processMessageQueue<T>(key: string, task: () => Promise<T>): Promise<T> {
    const currentTask = this.messageQueue.get(key) || Promise.resolve();
    const newTask = currentTask.then(task, task);
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
    relationshipId: string,
    content: string,
    relationship: Relationship,
    preferences?: ChatPreferences,
    messageCount: number = 0,
    isPremium: boolean = false
  ): Promise<{ userMessage: Message | null; error: Error | null; dataStream: Response | undefined }> {
    return this.processMessageQueue(relationshipId, async () => {
      try {
        // Validate message content


        if (!content.trim()) {
          throw new ChatServiceError('Message content cannot be empty', 'empty_message');
        }

        // Validate message length
        if (content.length > 2000) {
          throw new ChatServiceError('Message too long', 'message_too_long');
        }

        // Validate premium status
        if (!isPremium && messageCount >= 10) {
          throw new ChatServiceError('Message limit reached', 'message_limit_reached');
        }

        // Create user message
        const { message: userMessage, error: userMessageError } = await this.messageService.createMessage(
          relationshipId,
          content,
          false
        );

        if (userMessageError) throw userMessageError;
        if (!userMessage) throw new Error('Failed to create user message');

        // Get message history
        const { messages: messageHistory } = await this.messageService.getMessages(relationshipId);

        // Format messages for OpenAI
        const formattedMessages = messageHistory.map(msg => ({
          role: msg.isAI ? 'assistant' as const : 'user' as const,
          content: msg.content
        }));

        // Add current message
        formattedMessages.push({
          role: 'user' as const,
          content: content
        });

      
          // Call Supabase Edge Function
          const { data, error } = await supabase.functions.invoke('chat', {
            body: JSON.stringify({
              messages: formattedMessages,
              context: relationship,
              preferences,
              messageCount,
              isPremium
            })
          });

          if (error) throw error;

          

          return { userMessage, 
            dataStream: data as Response,
             error: null };

        
      } catch (error) {
        console.error('Send message error:', error);
        return {
          userMessage: null,
          dataStream: undefined,
          error: error instanceof ChatServiceError ? error : new ChatServiceError(
            'Failed to send message',
            'unknown_error',
            error as Error
          )
        };
      }
    });
  }

  async editMessage(relationshipId: string, messageId: string, content: string): Promise<{ error: Error | null }> {
    try {
      const encryptedContent = await encryptMessage(content);
      
      const { error } = await supabase
        .from('messages')
        .update({ content: encryptedContent })
        .eq('id', messageId)
        .eq('relationship_id', relationshipId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Edit message error:', error);
      return { error: error as Error };
    }
  }

  async deleteMessage(relationshipId: string, messageId: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId)
        .eq('relationship_id', relationshipId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Delete message error:', error);
      return { error: error as Error };
    }
  }
}

export const chatService = new ChatService();