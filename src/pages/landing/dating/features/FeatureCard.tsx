import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import type { Feature } from './index';

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

export function FeatureCard({ feature, index }: FeatureCardProps) {
  const Icon = Icons[feature.icon as keyof typeof Icons];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
          {feature.title}
        </h3>
      </div>

      <p className="text-gray-600 mb-6">
        {feature.description}
      </p>

      <div className="space-y-3">
        {feature.benefits.map((benefit, i) => (
          <div 
            key={i} 
            className="flex items-start text-sm text-gray-700 bg-gray-50 p-3 rounded-lg group-hover:bg-red-50 transition-colors"
          >
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 mr-2 flex-shrink-0" />
            <span>{benefit}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}