import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { ChatPreferences } from '../types';

interface ChatPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: ChatPreferences;
  onChange: (preferences: ChatPreferences) => void;
  darkMode: boolean;
}

const TONE_OPTIONS = [
  { value: 'empathetic', label: '🫂 Empathetic', description: 'Warm and understanding' },
  { value: 'professional', label: '👔 Professional', description: 'Clear and formal' },
  { value: 'casual', label: '😊 Casual', description: 'Friendly and relaxed' },
  { value: 'formal', label: '📝 Formal', description: 'Structured and precise' },
  { value: 'playful', label: '🎮 Playful', description: 'Light and engaging' }
] as const;

const LENGTH_OPTIONS = [
  { value: 'concise', label: 'Concise', description: 'Short and to the point' },
  { value: 'balanced', label: 'Balanced', description: 'Moderate level of detail' },
  { value: 'detailed', label: 'Detailed', description: 'In-depth explanations' }
] as const;

const STYLE_OPTIONS = [
  { value: 'actionable', label: '✅ Action-Focused', description: 'Practical steps and solutions' },
  { value: 'analytical', label: '🔍 Analytical', description: 'Detailed analysis and insights' },
  { value: 'narrative', label: '📖 Narrative', description: 'Story-based explanations' },
  { value: 'supportive', label: '🤝 Supportive', description: 'Encouraging and validating' }
] as const;

export function ChatPreferencesModal({ isOpen, onClose, preferences, onChange, darkMode }: ChatPreferencesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className={`w-full max-w-lg rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <div className={`flex justify-between items-center p-4 border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Chat Preferences
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              darkMode
                ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300'
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Tone */}
          <div className="space-y-3">
            <label className={`block text-sm font-medium ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Response Tone
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TONE_OPTIONS.map(({ value, label, description }) => (
                <button
                  key={value}
                  onClick={() => onChange({ ...preferences, tone: value })}
                  className={`p-3 rounded-xl text-left transition-all duration-200 ${
                    preferences.tone === value
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                      : darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="font-medium">{label}</div>
                  <div className="text-sm opacity-80">{description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Length */}
          <div className="space-y-3">
            <label className={`block text-sm font-medium ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Response Length
            </label>
            <div className="grid grid-cols-3 gap-2">
              {LENGTH_OPTIONS.map(({ value, label, description }) => (
                <button
                  key={value}
                  onClick={() => onChange({ ...preferences, length: value })}
                  className={`p-3 rounded-xl text-center transition-all duration-200 ${
                    preferences.length === value
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                      : darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="font-medium">{label}</div>
                  <div className="text-xs opacity-80">{description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Style */}
          <div className="space-y-3">
            <label className={`block text-sm font-medium ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Response Style
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {STYLE_OPTIONS.map(({ value, label, description }) => (
                <button
                  key={value}
                  onClick={() => onChange({ ...preferences, style: value })}
                  className={`p-3 rounded-xl text-left transition-all duration-200 ${
                    preferences.style === value
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                      : darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="font-medium">{label}</div>
                  <div className="text-sm opacity-80">{description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <button
            onClick={onClose}
            className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:opacity-90 transition-colors"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
}