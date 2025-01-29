import React from 'react';
import { Users, Plus } from 'lucide-react';

interface EmptyStateProps {
  darkMode: boolean;
  hasRelationships: boolean;
  onAddRelationship: () => void;
}

export function EmptyState({ darkMode, hasRelationships, onAddRelationship }: EmptyStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Users className="w-12 h-12 text-white" />
        </div>
        <h2 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {hasRelationships ? 'Select a Relationship' : 'Add Your First Relationship'}
        </h2>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} max-w-md mx-auto`}>
          {hasRelationships 
            ? 'Choose a relationship from the sidebar to start chatting and get personalized advice'
            : 'Start by adding someone important in your life to get personalized relationship advice'
          }
        </p>
        {!hasRelationships && (
          <button
            onClick={onAddRelationship}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:opacity-90 transition-colors inline-flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Relationship
          </button>
        )}
      </div>
    </div>
  );
}