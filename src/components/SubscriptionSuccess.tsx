import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Loader } from 'lucide-react';
import { handleSubscriptionSuccess } from '../lib/stripe';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { setPremium } from '../store/slices/appSlice';

export function SubscriptionSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifySubscription = async () => {
      const sessionId = searchParams.get('session_id');
      if (!sessionId) {
        setError('Invalid session');
        return;
      }

      try {
        await handleSubscriptionSuccess(sessionId);
        dispatch(setPremium(true));
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to verify subscription');
      } finally {
        setIsLoading(false);
      }
    };

    verifySubscription();
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
      >
        {isLoading ? (
          <>
            <Loader className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verifying Your Subscription
            </h2>
            <p className="text-gray-600">
              Please wait while we confirm your payment...
            </p>
          </>
        ) : error ? (
          <>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">❌</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Subscription Error
            </h2>
            <p className="text-gray-600 mb-4">
              {error}
            </p>
            <button
              onClick={() => navigate('/pricing')}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </>
        ) : (
          <>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to Premium!
            </h2>
            <p className="text-gray-600">
              Your subscription has been activated. Redirecting you to your dashboard...
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}