import React from 'react';
import { DemoChat } from '../../shared/components/DemoChat';
import { DATING_DEMO_CONFIG, DATING_SIGNUP_CTA } from '../config/demoConfig';

interface DatingDemoSectionProps {
  initialPrompt: string;
  onReset: () => void;
}

export function DatingDemoSection({ initialPrompt, onReset }: DatingDemoSectionProps) {
  return (
    <DemoChat
      initialPrompt={initialPrompt}
      onReset={onReset}
      config={DATING_DEMO_CONFIG}
      signUpCta={DATING_SIGNUP_CTA}
    />
  );
}