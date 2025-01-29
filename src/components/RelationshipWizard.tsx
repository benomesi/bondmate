import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Users, X } from 'lucide-react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { addRelationship, setHasCompletedOnboarding } from '../store/slices/appSlice';
import { supabase } from '../lib/supabase';
import { useAppSelector } from '../hooks/useAppSelector';
import type { RelationType } from '../types';

interface RelationshipData {
  name: string;
  type: RelationType;
  communicationStyle: string;
  interests: string[];
  goals: string[];
}

const INITIAL_DATA: RelationshipData = {
  name: '',
  type: '' as RelationType,
  communicationStyle: '',
  interests: [],
  goals: []
};

export function RelationshipWizard({ onClose }: { onClose: () => void }) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [step, setStep] = React.useState(1);
  const [data, setData] = React.useState(INITIAL_DATA);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { relationships } = useAppSelector((state) => state.app);

  if (!user) {
    return null;
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isStepValid()) {
      e.preventDefault();
      handleNext();
    }
  };

  const renderWelcomeContent = () => (
    <div className="text-center space-y-6 max-w-2xl mx-auto">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Users className="w-10 h-10 text-white" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900">
        {relationships.length === 0 ? "Let's Add Your First Relationship" : "Add a New Relationship"}
      </h2>
      <p className="text-xl text-gray-600">
        {relationships.length === 0 
          ? "BondMate helps you strengthen your relationships through personalized AI guidance. Start by telling us about someone important in your life - it could be a romantic partner, family member, friend, or professional connection."
          : "Tell us about someone important in your life that you'd like to strengthen your relationship with."}
      </p>
      <div className="bg-blue-50 p-6 rounded-xl text-left">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">What to expect:</h3>
        <ul className="space-y-3 text-blue-800">
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            <span>Quick 3-step setup process</span>
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            <span>Personalized conversation insights</span>
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            <span>AI-powered relationship advice</span>
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            <span>Progress tracking and goal setting</span>
          </li>
        </ul>
      </div>
      <button
        onClick={() => setStep(2)}
        className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-flex items-center"
      >
        Get Started
        <ArrowRight className="ml-2 w-5 h-5" />
      </button>
    </div>
  );

  const updateData = (fields: Partial<RelationshipData>) => {
    setData(prev => ({ ...prev, ...fields }));
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    setError('');

    try {
      // First update the profile to mark onboarding as complete
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ has_completed_onboarding: true })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Save relationship to Supabase
      const { data: savedRelationship, error: relationshipError } = await supabase
        .from('relationships')
        .insert({
          user_id: user.id,
          name: data.name,
          type: data.type,
          interests: data.interests,
          goals: data.goals,
          communication_style: data.communicationStyle
        })
        .select()
        .single();

      if (relationshipError) throw relationshipError;

      // Update local state
      dispatch(addRelationship({
        id: savedRelationship.id,
        ...data
      }));

      // Mark onboarding as complete
      dispatch(setHasCompletedOnboarding(true));

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save relationship');
      console.error('Relationship save error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return true; // Welcome screen is always valid
      case 2:
        return data.name.trim().length > 0 && data.type !== '';
      case 3:
        return data.communicationStyle !== '';
      case 4:
        return data.interests.length > 0 && data.goals.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-xl relative z-[60]"
      >
        {/* Progress Bar */}
        <div className="p-6 border-b border-gray-200 bg-white rounded-t-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              {step === 1 ? 'Welcome' : `Step ${step - 1} of 3`}
            </span>
            <span className="text-sm text-gray-500">
              {step === 1 ? '' : `${Math.round(((step - 1) / 3) * 100)}% Complete`}
            </span>
          </div>
          {step > 1 && <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />
          </div>}
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            {error}
          </div>
        )}

        {/* Content Area */}
        <div className="p-6 bg-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="min-h-[400px]"
            >
              {step === 1 && renderWelcomeContent()}

              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={data.name}
                      onKeyPress={handleKeyPress}
                      onChange={(e) => updateData({ name: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter their name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Relationship Type
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { type: 'romantic' as const, label: 'Romantic Partner' },
                        { type: 'family' as const, label: 'Family Member' },
                        { type: 'friendship' as const, label: 'Friend' },
                        { type: 'professional' as const, label: 'Professional' }
                      ].map(({ type, label }) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => updateData({ type })}
                          className={`p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                            data.type === type
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-blue-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    How do they typically communicate?
                  </h3>
                  <p className="text-gray-600">
                    Understanding their communication style helps us provide better advice.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { value: 'direct', label: 'Direct & Clear' },
                      { value: 'thoughtful', label: 'Thoughtful & Careful' },
                      { value: 'expressive', label: 'Expressive & Emotional' },
                      { value: 'reserved', label: 'Reserved & Private' }
                    ].map(({ value, label }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => updateData({ communicationStyle: value })}
                        className={`p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                          data.communicationStyle === value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-blue-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Shared Interests
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Reading', 'Writing', 'Cooking', 'Gaming',
                        'Photography', 'Travel', 'Music', 'Art',
                        'Sports', 'Fitness', 'Technology', 'Movies'
                      ].map((interest) => (
                        <button
                          key={interest}
                           type="button"
                          onClick={() => {
                            const interests = data.interests.includes(interest)
                              ? data.interests.filter(i => i !== interest)
                              : [...data.interests, interest];
                            updateData({ interests });
                          }}
                          className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                            data.interests.includes(interest)
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
                      Relationship Goals
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Better Communication', 'Quality Time', 'Personal Growth',
                        'Mutual Support', 'Shared Activities', 'Trust Building',
                        'Open Communication', 'Understanding', 'Fun & Adventure'
                      ].map((goal) => (
                        <button
                          key={goal}
                          type="button"
                          onClick={() => {
                            const goals = data.goals.includes(goal)
                              ? data.goals.filter(g => g !== goal)
                              : [...data.goals, goal];
                            updateData({ goals });
                          }}
                          className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                            data.goals.includes(goal)
                              ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {goal}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="flex justify-between items-center">
            <button
              onClick={handleBack}
              className={`px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors ${
                step === 1 ? 'invisible' : ''
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className={`px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 flex items-center space-x-2 ${step === 1 ? 'hidden' : ''} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span>{isLoading ? 'Saving...' : step === 4 ? 'Complete' : 'Continue'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}