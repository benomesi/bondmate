import React, { useRef, useState } from 'react';
import { DatingHeroSection } from './dating/sections/DatingHeroSection';
import { DatingFeaturesSection } from './dating/sections/DatingFeaturesSection';
import { DatingTestimonialsSection } from './dating/sections/DatingTestimonialsSection';
import { DatingPricingSection } from './dating/sections/DatingPricingSection';

export function DatingLandingPage() {
  const [showAICoach, setShowAICoach] = useState(false);
  const [initialPrompt, setInitialPrompt] = useState('');
  const aiCoachRef = useRef<HTMLDivElement>(null);

  const handlePromptSubmit = (prompt: string) => {
    setInitialPrompt(prompt);
    setShowAICoach(true);
    
    // Add a small delay to ensure component renders
    setTimeout(() => {
      const element = aiCoachRef.current;
      if (element) {
        // Calculate header height (assuming 64px)
        const headerHeight = 64;
        const yOffset = -headerHeight; // Offset by header height
        
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen">
      <DatingHeroSection 
        onPromptSubmit={handlePromptSubmit}
        hideInput={showAICoach}
        showAICoach={showAICoach}
        initialPrompt={initialPrompt}
        onReset={() => {
          setShowAICoach(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
      
      <div ref={aiCoachRef} />

      <DatingFeaturesSection />
      <DatingTestimonialsSection />
      <DatingPricingSection />
    </div>
  );
}