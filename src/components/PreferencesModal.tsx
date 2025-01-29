import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { usePreferences } from '../hooks/usePreferences';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PreferencesModal({ isOpen, onClose }: PreferencesModalProps) {
  const { preferences, updatePreferences, resetPreferences, isUpdating } = usePreferences();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl w-[95%] max-w-2xl max-h-[90vh] overflow-hidden"
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">AI Response Preferences</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[calc(90vh-12rem)] overflow-y-auto">
          {/* Tone Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Response Tone
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { value: 'empathetic', label: '🫂 Empathetic' },
                { value: 'professional', label: '👔 Professional' },
                { value: 'casual', label: '😊 Casual' },
                { value: 'formal', label: '📝 Formal' },
                { value: 'playful', label: '🎮 Playful' }
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => updatePreferences({ tone: value as any })}
                  className={`p-3 rounded-lg text-left transition-all duration-200 ${
                    preferences.tone === value
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Length Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Response Length
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'concise', label: 'Concise' },
                { value: 'balanced', label: 'Balanced' },
                { value: 'detailed', label: 'Detailed' }
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => updatePreferences({ length: value as any })}
                  className={`p-3 rounded-lg text-center transition-all duration-200 ${
                    preferences.length === value
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Style Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Response Style
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'actionable', label: '✅ Action-Focused' },
                { value: 'analytical', label: '🔍 Analytical' },
                { value: 'narrative', label: '📖 Narrative' },
                { value: 'supportive', label: '🤝 Supportive' }
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => updatePreferences({ style: value as any })}
                  className={`p-3 rounded-lg text-left transition-all duration-200 ${
                    preferences.style === value
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t bg-gray-50 flex justify-between">
          <button
            onClick={resetPreferences}
            disabled={isUpdating}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Reset to Default
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:opacity-90"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
}