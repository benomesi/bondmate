import React from 'react';
import { X, Check, Crown, Loader } from 'lucide-react';
import { createSubscription } from '../lib/stripe';
import { useAppSelector } from '../hooks/useAppSelector';
import { trackPricingInteraction } from '../lib/analytics';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PREMIUM_FEATURES = [
  'Unlimited messages with AI relationship coach',
  'Priority support and faster response times',
  'Advanced relationship analytics and insights',
  'Exclusive relationship resources and guides',
  'Multiple relationship tracking',
  'Message history and conversation backup'
];

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { user } = useAppSelector((state) => state.auth);

  const handleUpgrade = async (priceId: string) => {
    if (!user) {
      setError('Please sign in to upgrade');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      trackPricingInteraction('click', 'PREMIUM', {
        plan_name: 'Premium',
        price_id: priceId
      });

      await createSubscription(priceId);
    } catch (err) {
      console.error('Subscription error:', err);
      
      if (err instanceof Error) {
        if (err.message.includes('auth')) {
          setError('Please sign in again to continue');
        } else if (err.message.includes('network')) {
          setError('Network error. Please check your connection');
        } else {
          setError(err.message || 'Failed to start subscription');
        }
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-500 to-indigo-500 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Crown className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Upgrade to Premium</h2>
          </div>
          <p className="text-center text-white/90">
            Unlock unlimited access to BondMate's powerful features
          </p>
        </div>

        {/* Features List */}
        <div className="p-6">
          <div className="space-y-4 mb-6">
            {PREMIUM_FEATURES.map((feature) => (
              <div key={feature} className="flex items-start space-x-3">
                <div className="p-1 bg-blue-100 rounded-full">
                  <Check className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          {/* Price */}
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-gray-900">
              $14.99
              <span className="text-lg text-gray-500 font-normal">/month</span>
            </div>
            <p className="text-sm text-gray-500">Cancel anytime</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => handleUpgrade('price_0Qm6J50AEK2bx3HFt1RZW7Fd')}
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:opacity-90 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Crown className="w-5 h-5" />
                  <span>Upgrade Now</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 text-gray-600 hover:text-gray-800"
            >
              Maybe Later
            </button>
            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}