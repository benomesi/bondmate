import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import type { Scenario } from './types';

interface ScenarioCardProps {
  scenario: Scenario;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function ScenarioCard({ scenario, isSelected, onSelect }: ScenarioCardProps) {
  const { id, icon: Icon, title, description } = scenario;
  
  return (
    <motion.button
      onClick={() => onSelect(id)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`group p-6 rounded-xl text-left transition-all duration-200 bg-white hover:shadow-lg border relative overflow-hidden ${
        isSelected
          ? 'border-blue-300 shadow-lg scale-[1.02]'
          : 'border-gray-100 hover:border-blue-200'
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Sparkles className="w-4 h-4 text-blue-400" />
        </div>
      </div>
    </motion.button>
  );
}