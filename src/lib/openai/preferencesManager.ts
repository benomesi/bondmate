import type { ChatPreferences } from '../../types';

interface PreferencesState {
  [userId: string]: ChatPreferences;
}

export class PreferencesManager {
  private static instance: PreferencesManager;
  private preferences: PreferencesState = {};
  private readonly DEFAULT_PREFERENCES: ChatPreferences = {
    tone: 'empathetic',
    length: 'balanced',
    style: 'supportive'
  };

  private constructor() {
    this.loadPreferences();
  }

  static getInstance(): PreferencesManager {
    if (!PreferencesManager.instance) {
      PreferencesManager.instance = new PreferencesManager();
    }
    return PreferencesManager.instance;
  }

  private loadPreferences(): void {
    try {
      const savedPreferences = localStorage.getItem('userPreferences');
      if (savedPreferences) {
        this.preferences = JSON.parse(savedPreferences);
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  }

  private savePreferences(): void {
    try {
      localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  getUserPreferences(userId: string): ChatPreferences {
    return this.preferences[userId] || { ...this.DEFAULT_PREFERENCES };
  }

  setUserPreferences(userId: string, preferences: Partial<ChatPreferences>): void {
    const currentPrefs = this.getUserPreferences(userId);
    const validatedPrefs = this.validatePreferences({
      ...currentPrefs,
      ...preferences
    });

    this.preferences[userId] = validatedPrefs;
    this.savePreferences();
  }

  resetUserPreferences(userId: string): void {
    delete this.preferences[userId];
    this.savePreferences();
  }

  private validatePreferences(preferences: ChatPreferences): ChatPreferences {
    const validTones = ['empathetic', 'professional', 'casual', 'formal', 'playful'];
    const validLengths = ['concise', 'balanced', 'detailed'];
    const validStyles = ['actionable', 'analytical', 'narrative', 'supportive'];

    return {
      tone: validTones.includes(preferences.tone) ? preferences.tone : this.DEFAULT_PREFERENCES.tone,
      length: validLengths.includes(preferences.length) ? preferences.length : this.DEFAULT_PREFERENCES.length,
      style: validStyles.includes(preferences.style) ? preferences.style : this.DEFAULT_PREFERENCES.style
    };
  }
}

export const preferencesManager = PreferencesManager.getInstance();