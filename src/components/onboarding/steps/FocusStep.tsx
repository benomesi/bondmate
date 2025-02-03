import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, UserPlus, Briefcase } from 'lucide-react';

interface FocusStepProps {
  selected: string[];
  onUpdate: (focus: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const FOCUS_OPTIONS = [
  {
    id: 'romantic',
    icon: Heart,
    title: 'Improving Romantic Relationships',
    description: 'Get guidance for dating, marriage, or partnerships'
  },
  {
    id: 'workplace',
    icon: Briefcase,
    title: 'Navigating Workplace Dynamics',
    description: 'Build better professional relationships'
  },
  {
    id: 'family',
    icon: Users,
    title: 'Strengthening Family Connections',
    description: 'Improve bonds with family members'
  },
  {
    id: 'friendship',
    icon: UserPlus,
    title: 'Building Better Friendships',
    description: 'Develop and maintain meaningful friendships'
  }
];

export function FocusStep({ selected, onUpdate, onNext, onBack }: FocusStepProps) {
  const handleSelect = (id: string) => {
    if (selected.includes(id)) {
      onUpdate(selected.filter(s => s !== id));
    } else {
      onUpdate([...selected, id]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          What brings you to BondMate today?
        </h2>
        <p className="text-lg text-gray-600">
          Select all that apply. You can always change these later.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FOCUS_OPTIONS.map(({ id, icon: Icon, title, description }) => (
          <motion.button
            key={id}
            onClick={() => handleSelect(id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-6 rounded-xl text-left transition-all duration-200 ${
              selected.includes(id)
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                : 'bg-white hover:shadow-md border border-gray-200'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
              selected.includes(id) ? 'bg-white/20' : 'bg-blue-50'
            }`}>
              <Icon className={`w-6 h-6 ${
                selected.includes(id) ? 'text-white' : 'text-blue-500'
              }`} />
            </div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className={selected.includes(id) ? 'text-white/80' : 'text-gray-600'}>
              {description}
            </p>
          </motion.button>
        ))}
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="px-6 py-2 text-gray-600 hover:text-gray-900"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={selected.length === 0}
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
}