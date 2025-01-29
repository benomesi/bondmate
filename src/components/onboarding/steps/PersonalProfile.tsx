import React from 'react';
import { Info } from 'lucide-react';

interface PersonalProfileProps {
  data: {
    name: string;
    ageRange: string;
    hobbies: string[];
    goals: string[];
  };
  onUpdate: (data: PersonalProfileProps['data']) => void;
}

const AGE_RANGES = ['18-24', '25-34', '35-44', '45-54', '55+'];

const HOBBIES = [
  { id: 'reading', label: 'Reading', icon: '📚' },
  { id: 'fitness', label: 'Fitness', icon: '💪' },
  { id: 'cooking', label: 'Cooking', icon: '🍳' },
  { id: 'travel', label: 'Travel', icon: '✈️' },
  { id: 'music', label: 'Music', icon: '🎵' },
  { id: 'art', label: 'Art', icon: '🎨' },
  { id: 'gaming', label: 'Gaming', icon: '🎮' },
  { id: 'sports', label: 'Sports', icon: '⚽' },
  { id: 'photography', label: 'Photography', icon: '📷' },
  { id: 'writing', label: 'Writing', icon: '✍️' },
  { id: 'dancing', label: 'Dancing', icon: '💃' },
  { id: 'hiking', label: 'Hiking', icon: '🏃' },
  { id: 'gardening', label: 'Gardening', icon: '🌱' },
  { id: 'movies', label: 'Movies', icon: '🎬' },
  { id: 'technology', label: 'Technology', icon: '💻' },
  { id: 'pets', label: 'Pets', icon: '🐾' },
  { id: 'fashion', label: 'Fashion', icon: '👗' },
  { id: 'meditation', label: 'Meditation', icon: '🧘' },
  { id: 'crafts', label: 'Crafts', icon: '🎨' },
  { id: 'languages', label: 'Languages', icon: '🗣️' },
];

const GROWTH_GOALS = [
  'Better Communication',
  'Work-Life Balance',
  'Personal Growth',
  'Emotional Intelligence',
  'Conflict Resolution',
  'Active Listening',
  'Setting Boundaries',
  'Building Trust',
  'Expressing Feelings',
  'Understanding Others',
  'Stress Management',
  'Quality Time',
  'Shared Activities',
  'Long-term Planning',
  'Cultural Understanding',
];

export function PersonalProfile({ data, onUpdate }: PersonalProfileProps) {
  const toggleHobby = (hobby: string) => {
    const hobbies = data.hobbies.includes(hobby)
      ? data.hobbies.filter(h => h !== hobby)
      : [...data.hobbies, hobby];
    onUpdate({ ...data, hobbies });
  };

  const toggleGoal = (goal: string) => {
    const goals = data.goals.includes(goal)
      ? data.goals.filter(g => g !== goal)
      : data.goals.length < 5 ? [...data.goals, goal] : data.goals;
    onUpdate({ ...data, goals });
  };

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Tell us about yourself
        </h2>
        <p className="text-gray-600">
          This information helps us personalize your experience and provide better relationship advice.
        </p>
      </div>

      <div className="space-y-6">
        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={data.name}
              onChange={(e) => onUpdate({ ...data, name: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your name"
              required
              pattern="[A-Za-z\s]{2,50}"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="group relative">
                <Info className="w-5 h-5 text-gray-400" />
                <div className="hidden group-hover:block absolute right-0 bottom-full mb-2 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg">
                  Name should be 2-50 characters long and contain only letters and spaces.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Age Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Age Range
            <span className="text-red-500 ml-1">*</span>
          </label>
          <select
            value={data.ageRange}
            onChange={(e) => onUpdate({ ...data, ageRange: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select age range</option>
            {AGE_RANGES.map((range) => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
        </div>

        {/* Hobbies */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Hobbies & Interests
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {HOBBIES.map(({ id, label, icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => toggleHobby(id)}
                className={`flex items-center p-3 rounded-lg transition-all duration-200
                  ${data.hobbies.includes(id)
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                    : 'bg-white border border-gray-200 hover:border-blue-300 hover:shadow-sm'
                  }`}
              >
                <span className="mr-2">{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Growth Goals */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Personal Growth Goals
            <span className="text-gray-500 text-xs ml-2">(Select up to 5)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {GROWTH_GOALS.map((goal) => (
              <button
                key={goal}
                type="button"
                onClick={() => toggleGoal(goal)}
                disabled={!data.goals.includes(goal) && data.goals.length >= 5}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-200
                  ${data.goals.includes(goal)
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                    : 'bg-white border border-gray-200 hover:border-blue-300 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}