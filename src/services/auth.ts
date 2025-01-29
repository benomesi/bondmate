import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export interface AuthService {
  getSession: () => Promise<{ user: User | null; error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  onAuthStateChange: (callback: (user: User | null) => void) => () => void;
}

class SupabaseAuthService implements AuthService {
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAYS = [1000, 2000, 4000];

  async getSession() {
    let retries = 0;

    try {
      while (retries < this.MAX_RETRIES) {
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) throw error;
          return { user: session?.user || null, error: null };
        } catch (err) {
          retries++;
          if (retries < this.MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAYS[retries - 1]));
            continue;
          }
          throw err;
        }
      }
      return { user: null, error: new Error('Max retries exceeded') };
    } catch (error) {
      const err = error as Error;
      console.error('Get session error:', {
        name: err.name,
        message: err.message,
        stack: err.stack
      });
      return {
        user: null,
        error: new Error(
          err.message === 'Failed to fetch'
            ? 'Network error - please check your connection'
            : err.message
        )
      };
    }
  }

  async signIn(email: string, password: string) {
    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      return { user, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { user: null, error: error as Error };
    }
  }

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: error as Error };
    }
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }
}

export const authService = new SupabaseAuthService();