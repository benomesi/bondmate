import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import type { Step } from './index';

interface StepCardProps {
  step: Step;
  index: number;
  totalSteps: number;
}

export function StepCard({ step, index, totalSteps }: StepCardProps) {
  const Icon = Icons[step.icon as keyof typeof Icons];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2 }}
      className="relative p-8 group text-center"
    >
      {/* Large Background Number */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
        <span className="text-[200px] font-bold bg-gradient-to-r from-red-500 to-red-600 text-transparent bg-clip-text select-none">
          {index + 1}
        </span>
      </div>
      
      <div className="relative z-10">
        {/* Animated Icon Container */}
        <div className={`w-24 h-24 bg-gradient-to-r ${step.gradient} rounded-2xl flex items-center justify-center transform transition-all duration-300 group-hover:scale-105 group-hover:rotate-3 shadow-xl relative overflow-hidden mx-auto mb-6`}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 10,
              delay: index * 0.3
            }}
          >
            <Icon className="w-10 h-10 text-white" />
          </motion.div>
        </div>

        <motion.h3 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.3 + 0.2 }}
          className="text-2xl font-bold text-gray-900 mb-4"
        >
          {step.title}
        </motion.h3>

        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.3 + 0.3 }}
          className="text-gray-600 max-w-sm mx-auto leading-relaxed"
        >
          {step.description}
        </motion.p>
      </div>
      
      {/* Animated Connection Line */}
      {index < totalSteps - 1 && (
        <div className="hidden md:block absolute top-1/2 -right-4 w-8 transform -translate-y-1/2">
          <div className="h-0.5 w-full bg-gradient-to-r from-red-400 to-red-500">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.3 + 0.4, duration: 0.5 }}
              style={{ transformOrigin: 'left' }}
              className="h-full w-full bg-gradient-to-r from-red-500 to-red-600"
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}