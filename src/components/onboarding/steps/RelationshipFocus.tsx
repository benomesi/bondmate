import React from 'react';
import { Heart, Users, UserPlus, Briefcase } from 'lucide-react';
import type { RelationType } from '../../../types';

interface RelationshipFocusProps {
  selected: RelationType[];
  onUpdate: (types: RelationType[]) => void;
}

const RELATIONSHIP_CARDS = [
  {
    type: 'romantic' as RelationType,
    title: 'Romantic Partnerships',
    description: 'Strengthen bonds with your significant other through better understanding and communication.',
    icon: Heart,
  },
  {
    type: 'family' as RelationType,
    title: 'Family Connections',
    description: 'Nurture meaningful relationships with family members and create lasting bonds.',
    icon: Users,
  },
  {
    type: 'friendship' as RelationType,
    title: 'Friendships',
    description: 'Develop deeper platonic connections and maintain meaningful friendships.',
    icon: UserPlus,
  },
  {
    type: 'professional' as RelationType,
    title: 'Professional Relationships',
    description: 'Improve work relationships and expand your professional network effectively.',
    icon: Briefcase,
  },
];

export function RelationshipFocus({ selected, onUpdate }: RelationshipFocusProps) {
  const toggleSelection = (type: RelationType) => {
    if (selected.includes(type)) {
      onUpdate(selected.filter(t => t !== type));
    } else {
      onUpdate([...selected, type]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          What brings you to BondMate?
        </h2>
        <p className="text-gray-600">
          Select the types of relationships you'd like to focus on. You can choose multiple options.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {RELATIONSHIP_CARDS.map(({ type, title, description, icon: Icon }) => (
          <button
            key={type}
            onClick={() => toggleSelection(type)}
            className={`relative p-6 rounded-xl text-left transition-all duration-200 group
              ${selected.includes(type)
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg scale-[1.02]'
                : 'bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md'
              }`}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-lg ${
                selected.includes(type)
                  ? 'bg-white/20'
                  : 'bg-blue-50 group-hover:bg-blue-100'
              }`}>
                <Icon className={`w-6 h-6 ${
                  selected.includes(type)
                    ? 'text-white'
                    : 'text-blue-500'
                }`} />
              </div>
              <div>
                <h3 className={`font-semibold mb-2 ${
                  selected.includes(type)
                    ? 'text-white'
                    : 'text-gray-900'
                }`}>
                  {title}
                </h3>
                <p className={
                  selected.includes(type)
                    ? 'text-blue-50'
                    : 'text-gray-600'
                }>
                  {description}
                </p>
              </div>
            </div>
            
            {/* Selection Indicator */}
            <div className={`absolute top-4 right-4 w-4 h-4 rounded-full border-2 transition-colors
              ${selected.includes(type)
                ? 'border-white bg-white'
                : 'border-gray-300 group-hover:border-blue-300'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}