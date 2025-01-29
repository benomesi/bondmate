import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Relationship, Message, User, QuizResults, ChatPreferences } from '../../types';

interface AppState {
  profile: User | null;
  relationships: Relationship[];
  messages: Record<string, Message[]>;
  darkMode: boolean;
  selectedRelationship: Relationship | null;
  isLoading: boolean;
  error: string | null;
  messageCount: number;
  isTyping: boolean;
  isPremium: boolean;
  hasCompletedOnboarding: boolean;
  quizResults: QuizResults | null;
  chatPreferences: ChatPreferences;
}

const initialState: AppState = {
  profile: null,
  relationships: [],
  messages: {},
  darkMode: false,
  selectedRelationship: null,
  isLoading: false,
  error: null,
  isTyping: false,
  messageCount: 0,
  isPremium: false,
  hasCompletedOnboarding: false,
  quizResults: null,
  chatPreferences: {
    tone: 'empathetic' as const,
    length: 'concise' as const,
    style: 'supportive' as const
  }
};

const FREE_MESSAGE_LIMIT = 10;

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setRelationships: (state, action: PayloadAction<Relationship[]>) => {
      state.relationships = action.payload;
    },
    setProfile: (state, action: PayloadAction<User>) => {
      state.profile = action.payload;
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
    },
    addRelationship: (state, action: PayloadAction<Relationship>) => {
      state.relationships.push(action.payload);
      state.hasCompletedOnboarding = true;
      state.selectedRelationship = action.payload;
    },
    updateRelationship: (state, action: PayloadAction<Relationship>) => {
      const index = state.relationships.findIndex(rel => rel.id === action.payload.id);
      if (index !== -1) {
        state.relationships[index] = action.payload;
      }
    },
    deleteRelationship: (state, action: PayloadAction<string>) => {
      state.relationships = state.relationships.filter(rel => rel.id !== action.payload);
      if (state.selectedRelationship?.id === action.payload) {
        // Clear selected relationship if it was deleted
        state.selectedRelationship = null;
        // Clear messages for deleted relationship
        delete state.messages[action.payload];
      }
    },
    setSelectedRelationship: (state, action: PayloadAction<Relationship | null>) => {
      state.selectedRelationship = action.payload;
    },
    addMessage: (state, action: PayloadAction<{ relationshipId: string; message: Message }>) => {
      const { relationshipId, message } = action.payload;
      
      if (!state.messages[relationshipId]) {
        state.messages[relationshipId] = [];
      }
      
      // Ensure timestamp is serialized as ISO string
      const messageWithSerializedTimestamp = {
        ...message,
        timestamp: typeof message.timestamp === 'string' 
          ? message.timestamp 
          : new Date().toISOString()
      };
      
      // Check if message already exists to avoid duplicates
      const exists = state.messages[relationshipId].some(m => 
        m.id === messageWithSerializedTimestamp.id || 
        (m.content === messageWithSerializedTimestamp.content && 
         m.timestamp === messageWithSerializedTimestamp.timestamp)
      );

      if (!exists) {
        state.messages[relationshipId].push(messageWithSerializedTimestamp);
        
        // Only increment message count for user messages in free tier
        if (!message.isAI && !state.isPremium && state.messageCount < 10) {
          state.messageCount += 1;
        }
      }
      state.error = null;
    },
    editMessage: (state, action: PayloadAction<{ relationshipId: string; messageId: string }>) => {
      const { relationshipId, messageId } = action.payload;
      const messages = state.messages[relationshipId] || [];
      const messageIndex = messages.findIndex(msg => msg.id === messageId);
      if (messageIndex !== -1) {
        state.messages[relationshipId] = messages.slice(0, messageIndex + 1);
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setPremium: (state, action: PayloadAction<boolean>) => {
      state.isPremium = action.payload;
    },
    setHasCompletedOnboarding: (state, action: PayloadAction<boolean>) => {
      state.hasCompletedOnboarding = action.payload;
    },
    setQuizResults: (state, action: PayloadAction<QuizResults>) => {
      state.quizResults = action.payload;
      state.error = null;
    },
    setChatPreferences: (state, action: PayloadAction<ChatPreferences>) => {
      state.chatPreferences = action.payload;
    }
  }
});

export const {
  setRelationships,
  setProfile,
  setDarkMode,
  addRelationship,
  updateRelationship,
  deleteRelationship,
  setSelectedRelationship,
  addMessage,
  editMessage,
  setTyping,
  setLoading,
  setError,
  setPremium,
  setHasCompletedOnboarding,
  setQuizResults,
  setChatPreferences
} = appSlice.actions;

export default appSlice.reducer;