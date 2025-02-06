import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { getServerChatResponse } from '../../../../lib/openai';
import type { ChatPreferences } from '../../../../types';

interface Message {
  id: string;
  content: string;
  isAI: boolean;
  timestamp: string;
}

interface ChatState {
  messages: Message[];
  isTyping: boolean;
  messageCount: number;
  error: string | null;
  input: string;
  isFullscreen: boolean;
  showUpgradePrompt: boolean;
  preferences: ChatPreferences;
}

type ChatAction = 
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_TYPING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_CHAT' }
  | { type: 'SET_INPUT'; payload: string }
  | { type: 'SET_FULLSCREEN'; payload: boolean }
  | { type: 'INCREMENT_MESSAGE_COUNT' }
  | { type: 'SET_UPGRADE_PROMPT'; payload: boolean }
  | { type: 'SET_PREFERENCES'; payload: Partial<ChatPreferences> };

const initialState: ChatState = {
  messages: [],
  isTyping: false,
  messageCount: 0,
  error: null,
  input: '',
  isFullscreen: false,
  showUpgradePrompt: false,
  preferences: {
    tone: 'casual',
    length: 'balanced',
    style: 'supportive'
  }
};

const MESSAGE_LIMIT = 5;

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
        error: null
      };
    case 'SET_TYPING':
      return {
        ...state,
        isTyping: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
    case 'SET_INPUT':
      return {
        ...state,
        input: action.payload
      };
    case 'SET_FULLSCREEN':
      return {
        ...state,
        isFullscreen: action.payload
      };
    case 'INCREMENT_MESSAGE_COUNT':
      const newCount = state.messageCount + 1;
      return {
        ...state,
        messageCount: newCount,
        showUpgradePrompt: newCount >= MESSAGE_LIMIT
      };
    case 'SET_UPGRADE_PROMPT':
      return {
        ...state,
        showUpgradePrompt: action.payload
      };
    case 'SET_PREFERENCES':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          ...action.payload
        }
      };
    case 'RESET_CHAT':
      return initialState;
    default:
      return state;
  }
}

interface ChatContextValue {
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
  sendMessage: (content: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

// Demo context for the AI coach
const DEMO_CONTEXT = {
  name: 'Demo User',
  type: 'dating',
  interests: ['meaningful connections', 'personal growth', 'authenticity'],
  goals: ['better relationships', 'genuine connections', 'natural confidence']
};

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Handle body scroll when fullscreen
  useEffect(() => {
    try {
      document.body.style.overflow = state.isFullscreen ? 'hidden' : '';
      return () => {
        document.body.style.overflow = '';
      };
    } catch (error) {
      console.error('Error handling fullscreen:', error);
    }
  }, [state.isFullscreen]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || state.isTyping) return;

    // Check message limit
    if (state.messageCount >= MESSAGE_LIMIT) {
      dispatch({ type: 'SET_UPGRADE_PROMPT', payload: true });
      return;
    }

    const userMessage = {
      id: Date.now().toString(),
      content: content.trim(),
      isAI: false,
      timestamp: new Date().toISOString()
    };
    
    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    dispatch({ type: 'INCREMENT_MESSAGE_COUNT' });
    dispatch({ type: 'SET_INPUT', payload: '' });
    dispatch({ type: 'SET_TYPING', payload: true });

    try {
      // Format messages for OpenAI
      const formattedMessages = state.messages.map(msg => ({
        role: msg.isAI ? 'assistant' as const : 'user' as const,
        content: msg.content
      }));

      // Add current message
      formattedMessages.push({
        role: 'user' as const,
        content: content.trim()
      });

      
     
      
      // Get AI response
      const response = await getServerChatResponse(
        formattedMessages,
        DEMO_CONTEXT,
        null,
        state.preferences,
        state.messageCount,
        false
      );

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        isAI: true,
        timestamp: new Date().toISOString()
      };

      dispatch({ type: 'ADD_MESSAGE', payload: aiMessage });
    } catch (error) {
      console.error('Chat error:', error);
      dispatch({ 
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to get response. Please try again.'
      });
    } finally {
      dispatch({ type: 'SET_TYPING', payload: false });
    }
  };

  return (
    <ChatContext.Provider value={{ state, dispatch, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}