import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

interface ProfileStepProps {
  data: {
    name: string;
    interests: string[];
    goals: string[];
    communicationStyle: string;
  };
  onUpdate: (data: ProfileStepProps['data']) => void;
  onNext: () => void;
  onBack: () => void;
}

// Simplified interests list
const INTERESTS = [
  { id: 'reading', label: 'Reading & Learning', icon: '📚' },
  { id: 'fitness', label: 'Health & Fitness', icon: '💪' },
  { id: 'creativity', label: 'Creative Arts', icon: '🎨' },
  { id: 'outdoors', label: 'Outdoor Activities', icon: '🏃' },
  { id: 'tech', label: 'Technology', icon: '💻' },
  { id: 'social', label: 'Social Activities', icon: '🎉' }
];

// Simplified goals list
const GOALS = [
  'Better Communication',
  'Personal Growth',
  'Building Trust',
  'Work-Life Balance',
  'Emotional Intelligence'
];

// Simplified communication styles with clearer descriptions
const COMMUNICATION_STYLES = [
  {
    value: 'direct',
    label: 'Straightforward',
    description: 'I prefer clear, direct communication without sugarcoating'
  },
  {
    value: 'diplomatic',
    label: 'Considerate',
    description: 'I try to be tactful and consider others\' feelings'
  },
  {
    value: 'expressive',
    label: 'Open & Emotional',
    description: 'I share my feelings and thoughts freely'
  },
  {
    value: 'analytical',
    label: 'Thoughtful',
    description: 'I like to think things through carefully before responding'
  }
];

export function ProfileStep({ data, onUpdate, onNext, onBack }: ProfileStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!data.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (data.interests.length === 0) {
      newErrors.interests = 'Select at least one interest';
    }
    
    if (data.goals.length === 0) {
      newErrors.goals = 'Select at least one goal';
    }
    
    if (!data.communicationStyle) {
      newErrors.communicationStyle = 'Select your communication style';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Tell us about yourself
        </h2>
        <p className="text-lg text-gray-600">
          This helps us personalize your experience
        </p>
      </div>

      <div className="space-y-6">
        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What's your name?
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={data.name}
              onChange={(e) => onUpdate({ ...data, name: e.target.value })}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>
        </div>

        {/* Interests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select your main interests
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {INTERESTS.map(({ id, label, icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  const interests = data.interests.includes(id)
                    ? data.interests.filter(i => i !== id)
                    : [...data.interests, id];
                  onUpdate({ ...data, interests });
                }}
                className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                  data.interests.includes(id)
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                    : 'bg-white border border-gray-200 hover:border-blue-300 hover:shadow-sm'
                }`}
              >
                <span className="mr-2">{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
          {errors.interests && (
            <p className="mt-1 text-sm text-red-500">{errors.interests}</p>
          )}
        </div>

        {/* Goals */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What are your main goals?
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {GOALS.map((goal) => (
              <button
                key={goal}
                type="button"
                onClick={() => {
                  const goals = data.goals.includes(goal)
                    ? data.goals.filter(g => g !== goal)
                    : [...data.goals, goal];
                  onUpdate({ ...data, goals });
                }}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                  data.goals.includes(goal)
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                    : 'bg-white border border-gray-200 hover:border-blue-300 hover:shadow-sm'
                }`}
              >
                {goal}
              </button>
            ))}
          </div>
          {errors.goals && (
            <p className="mt-1 text-sm text-red-500">{errors.goals}</p>
          )}
        </div>

        {/* Communication Style Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How do you prefer to communicate?
            <span className="text-red-500 ml-1">*</span>
          </label>
          <select
            value={data.communicationStyle}
            onChange={(e) => onUpdate({ ...data, communicationStyle: e.target.value })}
            className={`w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 ${
              errors.communicationStyle ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select your style...</option>
            {COMMUNICATION_STYLES.map(({ value, label, description }) => (
              <option key={value} value={value}>
                {label} - {description}
              </option>
            ))}
          </select>
          {errors.communicationStyle && (
            <p className="mt-1 text-sm text-red-500">{errors.communicationStyle}</p>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="px-6 py-2 text-gray-600 hover:text-gray-900"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:opacity-90 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}