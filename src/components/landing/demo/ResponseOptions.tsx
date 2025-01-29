import React from 'react';
import { motion } from 'framer-motion';

interface ResponseOptionsProps {
  options: { value: string; label: string }[];
  onSelect: (value: string) => void;
}

export function ResponseOptions({ options, onSelect }: ResponseOptionsProps) {
  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
      {options.map((option) => (
        <motion.button
          key={option.value}
          onClick={() => onSelect(option.value)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-3 p-3 text-left bg-white/50 backdrop-blur-sm rounded-xl transition-all duration-200 hover:bg-white group border border-gray-100 hover:border-blue-300"
        >
          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600 group-hover:scale-110 transition-transform">
            {option.value}
          </div>
          <span className="text-sm text-gray-700">{option.label}</span>
        </motion.button>
      ))}
    </div>
  );
}