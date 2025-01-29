import { useEffect } from 'react';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { setUser, clearAuth } from '../store/slices/authSlice';
import { setProfile, setHasCompletedOnboarding, setPremium, setError, setRelationships, addMessage } from '../store/slices/appSlice';
import { supabase } from '../lib/supabase';
import { decryptMessage } from '../lib/encryption';

export function useAuthState() {
  const dispatch = useAppDispatch();
  const { user, isLoading, error } = useAppSelector(state => state.auth);

  useEffect(() => {
    let isSubscribed = true;
    
    const initAuth = async () => {
      try {
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          dispatch(clearAuth());
          return;
        }

        if (session?.user) {
          if (isSubscribed) {
            dispatch(setUser(session.user));
          }

          // Get or create profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            if (profileError.code === 'PGRST116') {
              // Profile doesn't exist, create it
              const { data: newProfile, error: createError } = await supabase.rpc(
                'create_new_profile',
                { 
                  user_id: session.user.id,
                  user_email: session.user.email || '',
                  user_name: session.user.email?.split('@')[0] || 'User'
                }
              );

              if (createError) throw createError;
              if (newProfile && isSubscribed) {
                dispatch(setProfile({
                  name: newProfile.name,
                  is_admin: newProfile.is_admin,
                  is_premium: newProfile.is_premium,
                  interests: newProfile.interests,
                  goals: newProfile.goals
                }));
                dispatch(setHasCompletedOnboarding(newProfile.has_completed_onboarding));
                dispatch(setPremium(newProfile.is_premium));
              }
            } else {
              throw profileError;
            }
          } else if (profile && isSubscribed) {
            dispatch(setProfile({
              name: profile.name,
              is_admin: profile.is_admin,
              is_premium: profile.is_premium,
              interests: profile.interests,
              goals: profile.goals
            }));
            dispatch(setHasCompletedOnboarding(profile.has_completed_onboarding));
            dispatch(setPremium(profile.is_premium));
          }

          // Fetch relationships and messages
          try {
            const { data: relationships, error: relationshipsError } = await supabase
              .from('relationships')
              .select('*')
              .eq('user_id', session.user.id);

            if (relationshipsError) throw relationshipsError;

            if (relationships && isSubscribed) {
              dispatch(setRelationships(relationships));

              // Fetch messages for each relationship
              for (const relationship of relationships) {
                const { data: messages, error: messagesError } = await supabase
                  .from('messages')
                  .select('*')
                  .eq('relationship_id', relationship.id)
                  .order('created_at', { ascending: true });

                if (messagesError) throw messagesError;

                if (messages && isSubscribed) {
                  // Process messages in parallel
                  await Promise.all(messages.map(async (message) => {
                    try {
                      const decryptedContent = await decryptMessage(message.content);
                      dispatch(addMessage({
                        relationshipId: relationship.id,
                        message: {
                          id: message.id,
                          content: decryptedContent,
                          timestamp: message.created_at,
                          isAI: message.is_ai
                        }
                      }));
                    } catch (error) {
                      console.error('Failed to decrypt message:', error);
                    }
                  }));
                }
              }
            }
          } catch (error) {
            console.error('Error fetching relationships/messages:', error);
            if (isSubscribed) {
              dispatch(setError('Failed to load messages'));
            }
          }
        } else if (isSubscribed) {
          dispatch(clearAuth());
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (isSubscribed) {
          dispatch(setError(error instanceof Error ? error.message : 'Failed to initialize auth'));
        }
      }
    };

    // Initialize auth
    initAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        dispatch(setUser(session.user));
      } else {
        dispatch(clearAuth());
      }
    });

    return () => {
      isSubscribed = false;
      subscription.unsubscribe();
    };
  }, [dispatch]);

  return { user, isLoading, error };
}