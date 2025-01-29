import { useState, useCallback } from 'react';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { setChatPreferences } from '../store/slices/appSlice';
import { preferencesManager } from '../lib/openai/preferencesManager';
import type { ChatPreferences } from '../types';

export function usePreferences() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const preferences = useAppSelector(state => state.app.chatPreferences);
  const [isUpdating, setIsUpdating] = useState(false);

  const updatePreferences = useCallback(async (newPreferences: Partial<ChatPreferences>) => {
    if (!user) return;
    
    setIsUpdating(true);
    try {
      // Update preferences in manager
      preferencesManager.setUserPreferences(user.id, newPreferences);
      
      // Update Redux state
      dispatch(setChatPreferences({
        ...preferences,
        ...newPreferences
      }));
    } catch (error) {
      console.error('Failed to update preferences:', error);
    } finally {
      setIsUpdating(false);
    }
  }, [user, preferences, dispatch]);

  const resetPreferences = useCallback(() => {
    if (!user) return;
    
    setIsUpdating(true);
    try {
      // Reset preferences in manager
      preferencesManager.resetUserPreferences(user.id);
      
      // Reset Redux state
      dispatch(setChatPreferences(preferencesManager.getUserPreferences(user.id)));
    } catch (error) {
      console.error('Failed to reset preferences:', error);
    } finally {
      setIsUpdating(false);
    }
  }, [user, dispatch]);

  return {
    preferences,
    isUpdating,
    updatePreferences,
    resetPreferences
  };
}