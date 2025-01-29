import React, { createContext, useContext, useState, useEffect } from 'react';
import type { OnboardingData } from './OnboardingWizard';

interface OnboardingContextType {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  isLoading: boolean;
  error: string | null;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<OnboardingData>(() => {
    const saved = localStorage.getItem('onboardingProgress');
    return saved ? JSON.parse(saved) : {
      relationshipTypes: [],
      profile: {
        name: '',
        ageRange: '',
        hobbies: [],
        goals: [],
      },
      assessments: {
        loveLanguages: {},
        attachmentStyle: {},
      },
    };
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saveData = async () => {
      setIsLoading(true);
      try {
        localStorage.setItem('onboardingProgress', JSON.stringify(data));
      } catch (e) {
        setError('Failed to save progress');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    saveData();
  }, [data]);

  const updateData = (newData: Partial<OnboardingData>) => {
    setData(prev => ({
      ...prev,
      ...newData,
    }));
  };

  return (
    <OnboardingContext.Provider value={{ data, updateData, isLoading, error }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}