import React from 'react';
import { useWizard } from '../WizardContext';
import type { RelationType } from '../../../types';

const RELATIONSHIP_TYPES: { type: RelationType; label: string }[] = [
  { type: 'romantic', label: 'Romantic Partner' },
  { type: 'family', label: 'Family Member' },
  { type: 'friendship', label: 'Friend' },
  { type: 'professional', label: 'Professional' }
];

export function BasicInfo() {
  const { data, updateData } = useWizard();

  return (
    <div className="space-y-6 flex-1">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name
        </label>
        <input
          type="text"
          value={data.name}
          onChange={(e) => updateData({ name: e.target.value })}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter their name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Relationship Type
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {RELATIONSHIP_TYPES.map(({ type, label }) => (
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
  );
}