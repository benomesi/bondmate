import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setProfile, setHasCompletedOnboarding } from '../../store/slices/appSlice';
import { supabase } from '../../lib/supabase';
import { useAppSelector } from '../../hooks/useAppSelector';

interface UserProfileSetupProps {
  onComplete: () => void;
}

const INTERESTS = [
  'Reading', 'Writing', 'Cooking', 'Gaming', 'Photography', 'Travel',
  'Music', 'Art', 'Sports', 'Fitness', 'Technology', 'Movies',
  'Nature', 'Animals', 'Fashion', 'Dance', 'Yoga', 'Meditation'
];

const GOALS = [
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

export function UserProfileSetup({ onComplete }: UserProfileSetupProps) {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    name: '',
    interests: [] as string[],
    goals: [] as string[],
    communicationStyle: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    if (!user) return;

    setIsLoading(true);
    setError('');

    try {
      // Save profile data to Supabase
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: formData.name,
          interests: formData.interests,
          goals: formData.goals,
          communication_style: formData.communicationStyle
        });

      if (profileError) throw profileError;
    
      // Update local state
      dispatch(setProfile(formData));
      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
      console.error('Profile save error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const toggleGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-6"
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Tell Us About Yourself
        </h2>
        <p className="text-xl text-gray-600">
          Help us personalize your experience by sharing a bit about who you are.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Your Interests
          </label>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map(interest => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  formData.interests.includes(interest)
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Personal Goals
          </label>
          <div className="flex flex-wrap gap-2">
            {GOALS.map(goal => (
              <button
                key={goal}
                type="button"
                onClick={() => toggleGoal(goal)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  formData.goals.includes(goal)
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Your Communication Style
          </label>
          <div className="space-y-2">
            {COMMUNICATION_STYLES.map(style => (
              <button
                key={style.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, communicationStyle: style.value }))}
                className={`w-full p-4 text-left rounded-lg transition-colors ${
                  formData.communicationStyle === style.value
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!formData.name.trim()}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 flex items-center"
          >
            Continue to Personality Quizzes
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </form>
    </motion.div>
  );
}