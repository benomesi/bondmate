import { supabase } from '../lib/supabase';
import { encryptMessage, decryptMessage } from '../lib/encryption';
import type { Message } from '../types';

export class MessageService {
  async getMessages(relationshipId: string): Promise<{ messages: Message[]; error: Error | null }> {
    try {
      // Get messages from database
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('relationship_id', relationshipId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      if (!data) return { messages: [], error: null };

      // Decrypt messages in parallel
      const decryptedMessages = await Promise.all(data.map(async (message) => {
        try {
          const decryptedContent = await decryptMessage(message.content);
          return {
          id: message.id,
          content: decryptedContent || message.content,
          timestamp: message.created_at,
          isAI: message.is_ai
          };
        } catch (error) {
          console.error('Failed to decrypt message:', error);
          // Return message with original content if decryption fails
          return {
            id: message.id,
            content: message.content,
            timestamp: message.created_at,
            isAI: message.is_ai
          };
        }
      }));

      return { messages: decryptedMessages, error: null };
    } catch (error) {
      console.error('Get messages error:', error);
      return { messages: [], error: error as Error };
    }
  }

  async createMessage(relationshipId: string, content: string, isAI: boolean): Promise<{ message: Message | null; error: Error | null }> {
    try {
      // Validate input
      if (!content.trim()) {
        throw new Error('Message content cannot be empty');
      }

      // Encrypt content
      const encryptedContent = await encryptMessage(content);
      
      // Save to database
      const { data, error } = await supabase
        .from('messages')
        .insert({
          relationship_id: relationshipId,
          content: encryptedContent,
          is_ai: isAI
        })
        .select()
        .single();

      if (error) throw error;

      const message = {
        id: data.id,
        content,
        timestamp: data.created_at,
        isAI
      };

      return {
        message,
        error: null
      };
    } catch (error) {
      console.error('Create message error:', error);
      return { message: null, error: error as Error };
    }
  }
}

export const messageService = new MessageService();