import { useState, useCallback } from 'react';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { addMessage, editMessage, setLoading, setError, setTyping } from '../store/slices/appSlice';
import { chatService, ChatServiceError } from '../services/chat';

export function useChat(relationshipId: string) {
  const dispatch = useAppDispatch();
  const {
    selectedRelationship,
    messages,
    chatPreferences,
    messageCount,
    isPremium,
    error: existingError
  } = useAppSelector((state) => state.app);
  const { user } = useAppSelector((state) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !selectedRelationship) {
      dispatch(setError('Invalid message or no relationship selected'));
      setIsSubmitting(false);
      return;
    }

    // Check message limit for free users
    if (!isPremium && messageCount >= 10) {
      dispatch(setError('You have reached your free message limit. Please upgrade to continue.'));
      return;
    }

    // Clear any previous errors
    if (existingError) {
      dispatch(setError(null));
    }

    setIsSubmitting(true);
    dispatch(setLoading(true));
    dispatch(setTyping(true));

    try {
      const { userMessage, aiResponse, error } = await chatService.sendMessage(
        relationshipId,
        content,
        selectedRelationship,
        user,
        chatPreferences,
        messageCount,
        isPremium
      );

      if (error) throw error;

      if (userMessage) {
        dispatch(addMessage({ relationshipId, message: userMessage }));
      }
      
      if (aiResponse) {
        dispatch(addMessage({ relationshipId, message: aiResponse }));
      }

    } catch (error) {
      console.error('Chat error:', error);
      
      let errorMessage = 'Failed to send message. Please try again.';
      
      if (error instanceof ChatServiceError) {
        switch (error.code) {
          case 'message_limit_reached':
            errorMessage = 'You have reached your free message limit. Please upgrade to continue.';
            break;
          case 'rate_limit_exceeded':
            errorMessage = 'Please wait a moment before sending another message.';
            break;
          case 'json_parse_error':
            errorMessage = 'There was a problem with the response. Please try again.';
            break;
          default:
            errorMessage = error.message;
        }
      }
      
      dispatch(setError(errorMessage));
    } finally {
      setIsSubmitting(false);
      dispatch(setLoading(false));
      dispatch(setTyping(false));
    }
  }, [relationshipId, selectedRelationship, user, chatPreferences, messageCount, isPremium, existingError, dispatch]);

  return {
    sendMessage,
    isSubmitting,
    messages: messages[relationshipId] || []
  };
}