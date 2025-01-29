import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from './useAppDispatch';
import { setUser, clearAuth } from '../store/slices/authSlice';
import { setProfile, setHasCompletedOnboarding, setRelationships, addMessage, setPremium } from '../store/slices/appSlice';
import { decryptMessage } from '../lib/encryption';
import { supabase, handleAuthError } from '../lib/supabase';
import type { RelationType } from '../types';

export function useAuth() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const initAuth = async () => {
    setError(null);
    try {
      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        handleAuthError(sessionError, dispatch, navigate);
        setError('Authentication failed');
        return;
      }
      
      if (session) {
        // Set user state first
        dispatch(setUser(session.user));

        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            // Handle missing profile case
            if (profileError.code === 'PGRST116') {
              const { error: createError } = await supabase
                .from('profiles')
                .insert({
                  id: session.user.id,
                  name: session.user.email?.split('@')[0] || 'User',
                  interests: [],
                  goals: [],
                  has_completed_onboarding: false,
                  is_premium: false
                });

              if (createError) {
                console.error('Error creating profile:', createError);
                setError('Failed to create profile');
                return;
              } 
            } else {
              console.error('Error fetching profile:', profileError);
              setError('Failed to fetch profile');
              return;
            }
          }

          // Set profile state if it exists
          if (profile) {
            const profileData = {
              name: profile.name,
              is_admin: profile.is_admin || false,
              is_premium: profile.is_premium || false,
              interests: profile.interests || [],
              goals: profile.goals || [],
              communicationStyle: profile.communication_style
            };
            dispatch(setProfile(profileData));
            dispatch(setHasCompletedOnboarding(profile.has_completed_onboarding));
            dispatch(setPremium(profile.is_premium || false));
          }
        } catch (error) {
          console.error('Profile fetch error:', error);
          setError('Failed to fetch profile');
        }
        // Fetch relationships
        try {
          const { data: relationships, error: relationshipsError } = await supabase
            .from('relationships')
            .select('*')
            .eq('user_id', session.user.id);

          if (relationshipsError) throw relationshipsError;

          if (relationships) {
            dispatch(setRelationships(relationships.map(rel => ({
              id: rel.id,
              name: rel.name,
              type: rel.type as RelationType,
              interests: rel.interests || [],
              goals: rel.goals || [],
              communicationStyle: rel.communication_style
            }))));
          }

          // Fetch messages for each relationship
          for (const relationship of relationships || []) {
            const { data: messages, error: messagesError } = await supabase
              .from('messages')
              .select('*')
              .eq('relationship_id', relationship.id)
              .order('created_at', { ascending: true });

            if (messagesError) throw messagesError;

            if (messages) {
              for (const message of messages) {
                // Decrypt message content
                try {
                  const decryptedContent = await decryptMessage(message.content);
                  
                  dispatch(addMessage({
                    relationshipId: relationship.id,
                    message: {
                      id: message.id || crypto.randomUUID(), // Ensure unique ID
                      content: decryptedContent,
                      timestamp: message.created_at,
                      isAI: message.is_ai
                    }
                  }));
                } catch (error) {
                  console.error('Failed to decrypt message:', error);
                }
              }
            }
          }
        } catch (error) {
          console.error('Error fetching relationships/messages:', error);
          setError('Failed to load relationships');
        }

      } else {
        dispatch(clearAuth());
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      setError('Failed to initialize auth');
    }
    };

  return {
    error,
    initAuth,
    signOut: async () => {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        dispatch(clearAuth());
        navigate('/');
      } catch (error) {
        console.error('Sign out error:', error);
        // Still clear auth state and redirect even if sign out fails
        dispatch(clearAuth());
        navigate('/');
      }
    }
  };
}