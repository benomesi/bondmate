import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Crown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAppSelector } from '../hooks/useAppSelector';
import { createSubscription } from '../lib/stripe';
import type { User } from '../types';

import { setProfile } from '../store/slices/appSlice';
import { useAppDispatch } from '../hooks/useAppDispatch';


interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.app.profile);
  const { user } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState<User>(profile || {
    name: '',
    is_admin: false,
    is_premium: false,
    interests: [],
    goals: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isUpgrading, setIsUpgrading] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
    fetchProfile();
  }, [profile, isOpen, user]);

    const fetchProfile = async () => {
        if (!user) return;
        const { data, error } = await supabase
        .from('profiles')
        .select('name, is_admin, is_premium, interests, goals')
        .eq('id', user.id)
        .single();
        if (error) {
        console.error('Profile fetch error:', error);
        setError('Failed to fetch profile');
        } else {
        setFormData(data);
        }
    }


    const redirectToBillingPortal = async () => {
        const { data, error } = await supabase.functions.invoke('billing-portal')
        if (error) {
        console.error('Billing portal error:', error);
        setError('An error occurred. Please try again ');
        return
        }
        const { url } = data;
        // open the billing portal in a new tab
        window.open(url, '_blank');
    }
  const handleUpgrade = async () => {
    setIsUpgrading(true);
    try {
      await createSubscription(import.meta.env.VITE_PRICE_ID);
    } catch (error) {
      console.error('Upgrade error:', error);
      setError('Failed to start upgrade process');
    } finally {
      setIsUpgrading(false);
    }
  };


  const updateProfile = async () => {
    setIsLoading(true);
    try {
      const { data:_, error } = await supabase.from('profiles').update({
        name: formData.name,
      }).eq('id', user?.id)
      if (error) {
        console.error('Profile update error:', error);
        setError('Failed to update profile');
      } else {
        if (profile) {
        const payload = {
            ...profile,
            name: formData.name,
        };
        dispatch(setProfile(payload));
        }
        onClose();
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setError('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200]"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl max-w-2xl w-full relative z-[201] overflow-hidden shadow-xl"
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Account Settings</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-4 space-y-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                {error}
              </div>
            )}

            {/* Subscription Status */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Subscription Status
                  </h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Plan:</span> {profile?.is_premium ? 'Premium' : 'Free Trial'}
                    </p>
                    {profile?.is_premium && (
                      <>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Price:</span> $20/month
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Next billing date:</span> {/* Add billing date from Stripe */}
                        </p>
                      </>
                    )}
                  </div>
                </div>
                {!profile?.is_premium && (
                  <button
                    type="button"
                    onClick={handleUpgrade}
                    disabled={isUpgrading}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:opacity-90 transition-colors flex items-center gap-2"
                  >
                    <Crown className="w-5 h-5" />
                    <span>{isUpgrading ? 'Processing...' : 'Upgrade to Premium'}</span>
                  </button>
                )}
              </div>
              {profile?.is_premium && (
                <div className="mt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={redirectToBillingPortal}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    Manage Subscription →
                  </button>
                  <button
                    type="button"
                    className="text-sm text-red-600 hover:text-red-700"
                    onClick={redirectToBillingPortal}
                  >
                    Cancel Subscription
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full p-2 border rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="sticky bottom-0 bg-white p-4 border-t border-gray-200">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={updateProfile}
                disabled={isLoading}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:opacity-90"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}