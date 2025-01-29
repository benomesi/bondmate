import React, { createContext, useContext, useState } from 'react';
import type { RelationType } from '../../types';

interface WizardData {
  name: string;
  type: RelationType;
  communicationStyle: string;
  interests: string[];
  goals: string[];
}

interface WizardContextType {
  data: WizardData;
  updateData: (data: Partial<WizardData>) => void;
  step: number;
  setStep: (step: number) => void;
  isValid: boolean;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<WizardData>({
    name: '',
    type: 'romantic',
    communicationStyle: '',
    interests: [],
    goals: []
  });
  const [step, setStep] = useState(1);

  const updateData = (newData: Partial<WizardData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const isValid = Boolean(
    data.name.trim() && 
    data.type && 
    data.communicationStyle && 
    data.interests.length > 0 && 
    data.goals.length > 0
  );

  return (
    <WizardContext.Provider value={{ data, updateData, step, setStep, isValid }}>
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
}