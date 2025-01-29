import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  name: string;
  interests: string[];
  goals: string[];
  communication_style: string | null;
  has_completed_onboarding: boolean;
  is_premium: boolean;
  is_admin: boolean;
}

export class ProfileService {
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAYS = [1000, 2000, 4000];

  async getProfile(userId: string): Promise<{ profile: Profile | null; error: Error | null }> {
    let retries = 0;
    
    try {
      while (retries < this.MAX_RETRIES) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

          if (error) {
            if (error.code === 'PGRST116') {
              // Profile not found, return null without error
              return { profile: null, error: null };
            }
            throw error;
          }
          
          return { profile: data as Profile, error: null };
        } catch (err) {
          retries++;
          if (retries < this.MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAYS[retries - 1]));
            continue;
          }
          throw err;
        }
      }
      return { profile: null, error: new Error('Max retries exceeded') };
    } catch (error) {
      console.error('Get profile error:', error);
      return { profile: null, error: error as Error };
    }
  }

  async createProfile(user: User): Promise<{ profile: Profile | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          name: user.email?.split('@')[0] || 'User',
          interests: [],
          goals: [],
          has_completed_onboarding: false,
          is_premium: false
        })
        .select()
        .single();

      if (error) throw error;
      return { profile: data as Profile, error: null };
    } catch (error) {
      console.error('Create profile error:', error);
      return { profile: null, error: error as Error };
    }
  }

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Update profile error:', error);
      return { error: error as Error };
    }
  }
}

export const profileService = new ProfileService();