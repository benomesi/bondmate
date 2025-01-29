import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: true,
  error: null
};

// Action handlers
const handleSetUser = (state: AuthState, action: PayloadAction<User | null>) => {
  try {
    state.user = action.payload;
    state.isLoading = false;
    state.error = null;
  } catch (error) {
    console.error('Error setting user:', error);
    state.user = null;
    state.isLoading = false;
    state.error = 'Failed to set user';
  }
};

const handleClearAuth = (state: AuthState) => {
  try {
    state.user = null;
    state.isLoading = false;
    state.error = null;
  } catch (error) {
    console.error('Error clearing auth:', error);
    state.error = 'Failed to clear auth';
  }
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: handleSetUser,
    clearAuth: handleClearAuth
  }
});

export const { setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;