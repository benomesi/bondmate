import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { supabase } from '../lib/supabase';
import { setProfile } from '../store/slices/appSlice';
import type { User } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUGGESTED_INTERESTS = [
  'Reading', 'Writing', 'Cooking', 'Gaming', 'Photography', 'Travel',
  'Music', 'Art', 'Sports', 'Fitness', 'Technology', 'Movies',
  'Nature', 'Animals', 'Fashion', 'Dance', 'Yoga', 'Meditation'
];

const SUGGESTED_GOALS = [
  'Better Communication', 'Work-Life Balance', 'Personal Growth',
  'Career Development', 'Health & Fitness', 'Financial Stability',
  'Learning New Skills', 'Building Relationships', 'Mental Wellness',
  'Travel More', 'Start a Business', 'Write a Book'
];

const COMMUNICATION_STYLES = [
  { value: 'direct', label: 'Direct - Straightforward and to the point' },
  { value: 'diplomatic', label: 'Diplomatic - Tactful and considerate' },
  { value: 'expressive', label: 'Expressive - Emotional and enthusiastic' },
  { value: 'analytical', label: 'Analytical - Logical and detail-oriented' }
];

const DEFAULT_USER: User = {
  name: '',
  interests: [],
  goals: [],
  communicationStyle: ''
};

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.app.profile);
  const { user } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState<User>(profile || DEFAULT_USER);
  const [customInterest, setCustomInterest] = useState('');
  const [customGoal, setCustomGoal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && profile) {
      setFormData(profile);
    }
  }, [profile, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      // Update profile in Supabase
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          name: formData.name.trim(),
          interests: formData.interests || [],
          goals: formData.goals || [],
          communication_style: formData.communicationStyle || null
        })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      // Update local state
      dispatch(setProfile({
        name: formData.name.trim(),
        is_admin: profile?.is_admin || false,
        interests: formData.interests || [],
        goals: formData.goals || [],
        communicationStyle: formData.communicationStyle || undefined
      }));

      onClose();
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleInterest = (interest: string) => {
    const interests = formData.interests || [];
    setFormData(prev => ({
      ...prev,
      interests: interests.includes(interest)
        ? interests.filter(i => i !== interest)
        : [...interests, interest]
    }));
  };

  const toggleGoal = (goal: string) => {
    const goals = formData.goals || [];
    setFormData(prev => ({
      ...prev,
      goals: goals.includes(goal)
        ? goals.filter(g => g !== goal)
        : [...goals, goal]
    }));
  };

  const handleAddCustomInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInterest.trim()) {
      toggleInterest(customInterest.trim());
      setCustomInterest('');
    }
  };

  const handleAddCustomGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (customGoal.trim()) {
      toggleGoal(customGoal.trim());
      setCustomGoal('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Account Settings</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-8rem)]">
          <div className="p-4 space-y-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                {error}
              </div>
            )}

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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Interests
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {SUGGESTED_INTERESTS.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                      ${formData.interests?.includes(interest)
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    {interest}
                  </button>
                ))}
                {formData.interests?.map(interest => 
                  !SUGGESTED_INTERESTS.includes(interest) && (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className="px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
                    >
                      {interest}
                    </button>
                  )
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customInterest}
                  onChange={(e) => setCustomInterest(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomInterest(e);
                    }
                  }}
                  placeholder="Add custom interest"
                  className="flex-1 p-2 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddCustomInterest}
                  className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:opacity-90 disabled:opacity-50"
                  disabled={!customInterest.trim()}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Goals
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {SUGGESTED_GOALS.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleGoal(goal)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                      ${formData.goals?.includes(goal)
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    {goal}
                  </button>
                ))}
                {formData.goals?.map(goal => 
                  !SUGGESTED_GOALS.includes(goal) && (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => toggleGoal(goal)}
                      className="px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
                    >
                      {goal}
                    </button>
                  )
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customGoal}
                  onChange={(e) => setCustomGoal(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomGoal(e);
                    }
                  }}
                  placeholder="Add custom goal"
                  className="flex-1 p-2 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddCustomGoal}
                  className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:opacity-90 disabled:opacity-50"
                  disabled={!customGoal.trim()}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Communication Style
              </label>
              <div className="space-y-2">
                {COMMUNICATION_STYLES.map(({ value, label }) => (
                  <label
                    key={value}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200
                      ${formData.communicationStyle === value
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                        : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                  >
                    <input
                      type="radio"
                      name="communicationStyle"
                      value={value}
                      checked={formData.communicationStyle === value}
                      onChange={(e) => setFormData({ ...formData, communicationStyle: e.target.value })}
                      className="hidden"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
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
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:opacity-90"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}