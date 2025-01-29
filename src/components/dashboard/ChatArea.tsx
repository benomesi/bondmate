import React from 'react';
import { Crown, MessageSquare } from 'lucide-react';
import { ChatMessages } from '../ChatMessages';
import { ChatInput } from '../ChatInput';
import { LoadingSpinner } from '../LoadingSpinner';
import type { Relationship } from '../../types';

interface ChatAreaProps {
  selectedRelationship: Relationship;
  error: string | null;
  isLoading: boolean;
  darkMode: boolean;
  messageCount: number;
  isPremium: boolean;
  onUpgrade: () => void;
}

export function ChatArea({
  selectedRelationship,
  error,
  isLoading,
  darkMode,
  messageCount,
  isPremium,
  onUpgrade
}: ChatAreaProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Chat Header */}
      <div className={`p-4 md:p-6 border-b ${
        darkMode 
          ? 'bg-gray-800/95 border-gray-700' 
          : 'bg-white/95 border-gray-200'
      } backdrop-blur-sm sticky top-0 z-10 transition-colors duration-200`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r ${
              darkMode 
                ? 'from-blue-600 to-indigo-600' 
                : 'from-blue-500 to-indigo-500'
            } shadow-lg transform hover:scale-105 transition-all duration-200`}>
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedRelationship.name}
              </h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {selectedRelationship.type.charAt(0).toUpperCase() + selectedRelationship.type.slice(1)} Relationship
              </p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className={`p-4 ${
          darkMode 
            ? 'bg-red-900/20 border-red-500 text-red-300' 
            : 'bg-red-100 border-red-500 text-red-700'
        } border-l-4 flex items-center justify-between`}>
          <div className="flex-1">{error}</div>
          {!isPremium && messageCount >= 10 && (
            <button
              onClick={onUpgrade}
              className="ml-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:opacity-90 transition-colors flex items-center space-x-2 shadow-lg"
            >
              <Crown className="w-4 h-4" />
              <span>Upgrade Now</span>
            </button>
          )}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <ChatMessages relationshipId={selectedRelationship.id} />
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className={`p-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'} text-center`}>
          <LoadingSpinner />
        </div>
      )}

      {/* Message Input */}
      <ChatInput relationshipId={selectedRelationship.id} />
    </div>
  );
}