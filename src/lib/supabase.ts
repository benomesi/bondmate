import { createClient, FunctionsHttpError } from '@supabase/supabase-js';
import type { AuthError } from '@supabase/supabase-js';
import type { AppDispatch } from '../store/store';
import { clearAuth } from '../store/slices/authSlice';
import type { NavigateFunction } from 'react-router-dom';
import type { Database } from '../types/supabase';

// Configure Supabase client options
const supabaseOptions = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
};

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Using fallback values for development.');
}

// Create the client
export const supabase = createClient<Database>(
  supabaseUrl || 'https://eubvmwaqdayneweuenli.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1YnZtd2FxZGF5bmV3ZXVlbmxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY4MjU2MDAsImV4cCI6MjAyMjQwMTYwMH0.ARtO1Y4JQHQwXY-SvxvzX4I4udfF0IwVz_LBhQqHkbk',
  supabaseOptions
);

// Error handling
export function handleAuthError(
  error: AuthError,
  dispatch: AppDispatch,
  navigate: NavigateFunction
) {
  console.error('Auth error:', error);
  
  // Handle specific auth errors
  if (error.message === 'Invalid API key' || 
      error.message.includes('Invalid login credentials') ||
      error.message.includes('JWT expired')) {
    dispatch(clearAuth());
    
    // Only navigate to sign-in if we're not already there
    if (!window.location.pathname.includes('/sign-in')) {
      navigate('/sign-in', { 
        state: { from: window.location.pathname }
      });
    }
  }
}

// Password validation
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_REQUIREMENTS = [
  { label: 'At least 8 characters', regex: /.{8,}/ },
  { label: 'At least one uppercase letter', regex: /[A-Z]/ },
  { label: 'At least one lowercase letter', regex: /[a-z]/ },
  { label: 'At least one number', regex: /[0-9]/ },
  { label: 'At least one special character', regex: /[!@#$%^&*(),.?":{}|<>]/ }
];

export function checkPasswordStrength(password: string): number {
  return PASSWORD_REQUIREMENTS.reduce((score, requirement) => {
    return score + (requirement.regex.test(password) ? 1 : 0);
  }, 0);
}


export async function usefullErrorMessage(error: unknown){
    if (error instanceof FunctionsHttpError) {
        const errorMessage = await error.context.json()
        return errorMessage.message;
    } 

    if (error instanceof Error) {
        return error.message;
    }

    return 'An unknown error occurred';
}