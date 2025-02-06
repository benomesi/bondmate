import { useState, useCallback } from 'react';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { addMessage, setLoading, setError, setTyping, setTemporaryMessage } from '../store/slices/appSlice';
import { chatService, ChatServiceError } from '../services/chat';
import { u } from 'framer-motion/client';

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
//   const { user } = useAppSelector((state) => state.auth);
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
    // dispatch(setLoading(true));
    dispatch(setTyping(true));
    dispatch(setTemporaryMessage(undefined))
    try {
      const { userMessage, dataStream, error } = await chatService.sendMessage(
        relationshipId,
        content,
        selectedRelationship,
        chatPreferences,
        messageCount,
        isPremium
      );





      if (error) throw error;

      if (userMessage) {
        dispatch(addMessage({ relationshipId, message: userMessage }));
      }
      
        // Handle AI response

      const reader = dataStream?.body?.getReader();
      const decoder = new TextDecoder('utf-8');
        

    let receivedText = "";
        async function readStream() {  
        while (true) {
                if (!reader) break;
              const { done, value } = await reader.read();
              if (done) {
                break;
            }
          
              const chunk = decoder.decode(value, { stream: true }).trim();
          
              // Split multiple JSON objects if they exist
              const lines = chunk.split("\n"); 
          
              for (const line of lines) {
                if (line.startsWith("data:")) {
                  try {
                    const jsonString = line.replace("data: ", "").trim();
                    
                    if (jsonString !== "[DONE]") { // Ignore termination signal
                      const parsedChunk = JSON.parse(jsonString);
                      const content = parsedChunk?.choices?.[0]?.delta?.content || "";
          
                      if (content) {
                        receivedText += content;
                        dispatch(setTemporaryMessage({ id: 'temp', content: receivedText, timestamp: new Date().toISOString(), isAI: true }));
                      }
                    }
                  } catch (error) {
                    console.error("Error parsing chunk:", error, line);
                  }
                }
              }
            }
          }
          await readStream();

          const { message: aiMessage, error: aiMessageError } = await chatService.messageService.createMessage(
            relationshipId,
            receivedText,
            true
          );
        if (aiMessageError) throw aiMessageError;
        const aiResponse = aiMessage;

      if (aiResponse) {
        dispatch(addMessage({ relationshipId, message: aiResponse }));
        dispatch(setTemporaryMessage(undefined));        

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
      dispatch(
        setTemporaryMessage({
            id: 'error',
            content: errorMessage,
            timestamp: new Date().toISOString(),
            isAI: true
        })
      )
      
      dispatch(setError(errorMessage));
    } finally {
      setIsSubmitting(false);
      dispatch(setLoading(false));
      dispatch(setTyping(false));
    }
  }, [relationshipId, selectedRelationship,chatPreferences, messageCount, isPremium, existingError, dispatch]);

  return {
    sendMessage,
    isSubmitting,
    messages: messages[relationshipId] || []
  };
}