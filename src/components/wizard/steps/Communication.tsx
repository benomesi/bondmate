import React from 'react';
import { MessageSquare, Brain, Heart, Users } from 'lucide-react';
import { useWizard } from '../WizardContext';

const COMMUNICATION_STYLES = [
  {
    value: 'direct',
    icon: MessageSquare,
    title: 'Direct',
    description: 'Straightforward and to the point'
  },
  {
    value: 'thoughtful',
    icon: Brain,
    title: 'Thoughtful',
    description: 'Careful and considerate in communication'
  },
  {
    value: 'expressive',
    icon: Heart,
    title: 'Expressive',
    description: 'Open with emotions and feelings'
  },
  {
    value: 'reserved',
    icon: Users,
    title: 'Reserved',
    description: 'Private and takes time to open up'
  }
];

export function Communication() {
  const { data, updateData } = useWizard();

  return (
    <div className="space-y-6 min-h-[300px]">
      <h3 className="text-lg font-semibold text-gray-900">
        How do they typically communicate?
      </h3>
      <p className="text-gray-600">
        Understanding their communication style will help us provide better advice.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {COMMUNICATION_STYLES.map(({ value, icon: Icon, title, description }) => (
          <button
            key={value}
            onClick={() => updateData({ communicationStyle: value })}
            className={`relative p-6 text-left transition-all duration-200 rounded-xl border-2
              ${data.communicationStyle === value
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
              }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-lg ${
                data.communicationStyle === value ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{title}</h4>
                <p className="text-sm text-gray-500">{description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}