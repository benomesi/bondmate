import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

import { useChat } from '../context/ChatContext';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TONES = [
  { value: 'direct', label: 'Direct' },
  { value: 'casual', label: 'Casual' },
  { value: 'professional', label: 'Professional' },
  { value: 'playful', label: 'Playful' }
];

const LENGTHS = [
  { value: 'concise', label: 'Concise' },
  { value: 'balanced', label: 'Balanced' },
  { value: 'detailed', label: 'Detailed' }
];

const STYLES = [
  { value: 'analytical', label: 'Analytical' },
  { value: 'supportive', label: 'Supportive' },
  { value: 'strategic', label: 'Strategic' },
  { value: 'motivational', label: 'Motivational' }
];

export function PreferencesModal({ isOpen, onClose }: PreferencesModalProps) {
  const { state, dispatch } = useChat();

  if (!isOpen) return null;

  const handlePreferenceChange = (type: string, value: string) => {
    dispatch({ 
      type: 'SET_PREFERENCES', 
      payload: { [type]: value }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[200]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Response Preferences</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Tone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
            <div className="grid grid-cols-2 gap-2">
              {TONES.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => handlePreferenceChange('tone', value)}
                  className={`p-2 text-sm border rounded-lg transition-colors ${
                    state.preferences?.tone === value
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white border-transparent'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Length */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Length</label>
            <div className="grid grid-cols-3 gap-2">
              {LENGTHS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => handlePreferenceChange('length', value)}
                  className={`p-2 text-sm border rounded-lg transition-colors ${
                    state.preferences?.length === value
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white border-transparent'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Style */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
            <div className="grid grid-cols-2 gap-2">
              {STYLES.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => handlePreferenceChange('style', value)}
                  className={`p-2 text-sm border rounded-lg transition-colors ${
                    state.preferences?.style === value
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white border-transparent'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t">
          <button
            onClick={onClose}
            className="w-full py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:opacity-90"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
}