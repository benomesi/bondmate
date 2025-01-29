import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Loader } from 'lucide-react';
import { createSubscription } from '../lib/stripe';
import { trackPricingInteraction } from '../lib/analytics';

interface SubscriptionButtonProps {
  priceId: string;
  planName: string;
  className?: string;
  children?: React.ReactNode;
}

export function SubscriptionButton({ 
  priceId, 
  planName,
  className = '',
  children 
}: SubscriptionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Track subscription attempt
      trackPricingInteraction('click', 'PREMIUM', {
        plan_name: planName,
        price_id: priceId
      });

      await createSubscription(priceId);
    } catch (err) {
      console.error('Subscription error:', err);
      setError(err instanceof Error ? err.message : 'Failed to start subscription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <motion.button
        onClick={handleSubscribe}
        disabled={isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`flex items-center justify-center ${className}`}
      >
        {isLoading ? (
          <Loader className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <Crown className="w-5 h-5 mr-2" />
            {children || 'Start Free Trial'}
          </>
        )}
      </motion.button>
      {error && (
        <p className="mt-2 text-sm text-red-600 text-center">
          {error}
        </p>
      )}
    </div>
  );
}