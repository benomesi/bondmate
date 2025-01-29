import React from 'react';
import { DatingHeroSection } from './sections/DatingHeroSection';
import { HowItWorksSection } from './sections/HowItWorksSection';
import { SimpleChatSection } from './sections/SimpleChatSection';
import { DatingStatsSection } from './sections/DatingStatsSection';
import { RealResultsSection } from './sections/RealResultsSection';
import { DatingFeaturesSection } from './sections/DatingFeaturesSection';
import { DatingPricingSection } from './sections/DatingPricingSection';
import { DatingFooter } from './sections/DatingFooter';
import { ChatProvider } from './context/ChatContext';

export function DatingLandingPage() {
  return (
    <ChatProvider>
      <div className="min-h-screen">
        <DatingHeroSection />
        <HowItWorksSection />
        <SimpleChatSection />
        <DatingStatsSection />
        <RealResultsSection />
        <DatingFeaturesSection />
        <DatingPricingSection />
        <DatingFooter />
      </div>
    </ChatProvider>
  );
}