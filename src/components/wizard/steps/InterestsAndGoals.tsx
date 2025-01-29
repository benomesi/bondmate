import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useWizard } from '../WizardContext';

const SUGGESTED_INTERESTS = [
  'Reading', 'Writing', 'Cooking', 'Gaming', 'Photography', 'Travel',
  'Music', 'Art', 'Sports', 'Fitness', 'Technology', 'Movies'
];

const SUGGESTED_GOALS = [
  'Better Communication', 'Quality Time', 'Personal Growth',
  'Mutual Support', 'Shared Activities', 'Trust Building',
  'Open Communication', 'Understanding', 'Fun & Adventure'
];

export function InterestsAndGoals() {
  const { data, updateData } = useWizard();
  const [customInterest, setCustomInterest] = useState('');
  const [customGoal, setCustomGoal] = useState('');

  const toggleInterest = (interest: string) => {
    const interests = data.interests.includes(interest)
      ? data.interests.filter(i => i !== interest)
      : [...data.interests, interest];
    updateData({ interests });
  };

  const toggleGoal = (goal: string) => {
    const goals = data.goals.includes(goal)
      ? data.goals.filter(g => g !== goal)
      : [...data.goals, goal];
    updateData({ goals });
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

  return (
    <div className="space-y-6 min-h-[300px]">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Shared Interests
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {SUGGESTED_INTERESTS.map((interest) => (
            <button
              key={interest}
              type="button"
              onClick={() => toggleInterest(interest)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                ${data.interests.includes(interest)
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {interest}
            </button>
          ))}
        </div>
        <form onSubmit={handleAddCustomInterest} className="flex gap-2">
          <input
            type="text"
            value={customInterest}
            onChange={(e) => setCustomInterest(e.target.value)}
            placeholder="Add custom interest"
            className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:opacity-90"
          >
            <Plus className="w-5 h-5" />
          </button>
        </form>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Relationship Goals
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {SUGGESTED_GOALS.map((goal) => (
            <button
              key={goal}
              type="button"
              onClick={() => toggleGoal(goal)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                ${data.goals.includes(goal)
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {goal}
            </button>
          ))}
        </div>
        <form onSubmit={handleAddCustomGoal} className="flex gap-2">
          <input
            type="text"
            value={customGoal}
            onChange={(e) => setCustomGoal(e.target.value)}
            placeholder="Add custom goal"
            className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:opacity-90"
          >
            <Plus className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}