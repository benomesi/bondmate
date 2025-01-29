import { supabase } from '../lib/supabase';
import type { Relationship } from '../types';

export class RelationshipService {
  async getRelationships(userId: string): Promise<{ relationships: Relationship[]; error: Error | null }> {
    try {
      if (!userId) throw new Error('User ID is required');

      const { data, error } = await supabase
        .from('relationships')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { relationships: data as Relationship[], error: null };
    } catch (error) {
      console.error('Get relationships error:', error);
      return { relationships: [], error: error as Error };
    }
  }

  async getRelationship(relationshipId: string): Promise<{ relationship: Relationship | null; error: Error | null }> {
    try {
      if (!relationshipId) throw new Error('Relationship ID is required');

      const { data, error } = await supabase
        .from('relationships')
        .select('*')
        .eq('id', relationshipId)
        .single();

      if (error) throw error;
      return { relationship: data as Relationship, error: null };
    } catch (error) {
      console.error('Get relationship error:', error);
      return { relationship: null, error: error as Error };
    }
  }

  async createRelationship(userId: string, relationship: Omit<Relationship, 'id'>): Promise<{ relationship: Relationship | null; error: Error | null }> {
    try {
      if (!userId) throw new Error('User ID is required');
      if (!relationship.name) throw new Error('Relationship name is required');
      if (!relationship.type) throw new Error('Relationship type is required');

      const { data, error } = await supabase
        .from('relationships')
        .insert({
          ...relationship,
          user_id: userId
        })
        .select()
        .single();

      if (error) throw error;
      return { relationship: data as Relationship, error: null };
    } catch (error) {
      console.error('Create relationship error:', error);
      return { relationship: null, error: error as Error };
    }
  }

  async updateRelationship(relationshipId: string, updates: Partial<Relationship>): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('relationships')
        .update(updates)
        .eq('id', relationshipId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Update relationship error:', error);
      return { error: error as Error };
    }
  }

  async deleteRelationship(relationshipId: string): Promise<{ error: Error | null }> {
    try {
      // First delete all messages for this relationship
      const { error: messagesError } = await supabase
        .from('messages')
        .delete()
        .eq('relationship_id', relationshipId);

      if (messagesError) throw messagesError;

      // Then delete the relationship
      const { error } = await supabase
        .from('relationships')
        .delete()
        .eq('id', relationshipId);

      if (error) throw error;
      
      return { error: null };
    } catch (error) {
      console.error('Delete relationship error:', error);
      return { error: error as Error };
    }
  }
}

export const relationshipService = new RelationshipService();