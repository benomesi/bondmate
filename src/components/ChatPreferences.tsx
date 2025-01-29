import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Clock, Sparkles } from 'lucide-react';

export interface ChatPreferences {
  tone: 'empathetic' | 'professional' | 'casual' | 'formal' | 'playful';
  length: 'concise' | 'balanced' | 'detailed';
  style: 'actionable' | 'analytical' | 'narrative' | 'supportive';
}

interface ChatPreferencesProps {
  preferences: ChatPreferences;
  onChange: (preferences: ChatPreferences) => void;
  darkMode: boolean;
}

const TONE_OPTIONS = [
  { value: 'empathetic', label: '🫂 Empathetic', icon: MessageSquare },
  { value: 'professional', label: '👔 Professional', icon: MessageSquare },
  { value: 'casual', label: '😊 Casual', icon: MessageSquare },
  { value: 'formal', label: '📝 Formal', icon: MessageSquare },
  { value: 'playful', label: '🎮 Playful', icon: MessageSquare }
] as const;

const LENGTH_OPTIONS = [
  { value: 'concise', label: 'Concise', description: 'Short and to the point' },
  { value: 'balanced', label: 'Balanced', description: 'Moderate level of detail' },
  { value: 'detailed', label: 'Detailed', description: 'In-depth explanations' }
] as const;

const STYLE_OPTIONS = [
  { value: 'actionable', label: '✅ Action-Focused' },
  { value: 'analytical', label: '🔍 Analytical' },
  { value: 'narrative', label: '📖 Narrative' },
  { value: 'supportive', label: '🤝 Supportive' }
] as const;

export function ChatPreferences({ preferences, onChange, darkMode }: ChatPreferencesProps) {
  return (
    <div className={`p-4 border-b backdrop-blur-sm ${darkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-200'}`}>
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Tone Selection */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {TONE_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onChange({ ...preferences, tone: value })}
              className={`flex items-center px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all duration-200 hover:scale-105
                ${preferences.tone === value
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                  : darkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Length Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Response Length
              </span>
            </div>
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {LENGTH_OPTIONS.find(opt => opt.value === preferences.length)?.description}
            </span>
          </div>
          <div className="flex gap-2">
            {LENGTH_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => onChange({ ...preferences, length: value })}
                className={`flex-1 py-1.5 text-sm rounded-lg transition-all duration-200 hover:scale-105
                  ${preferences.length === value
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                    : darkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Style Selection */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {STYLE_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onChange({ ...preferences, style: value })}
              className={`flex items-center px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all duration-200 hover:scale-105
                ${preferences.style === value
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                  : darkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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