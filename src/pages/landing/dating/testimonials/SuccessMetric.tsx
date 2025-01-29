import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import type { SuccessMetric } from './index';

interface SuccessMetricProps {
  metric: SuccessMetric;
  index: number;
}

export function SuccessMetric({ metric, index }: SuccessMetricProps) {
  const Icon = Icons[metric.icon as keyof typeof Icons];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="text-center"
    >
      <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
        <Icon className="w-6 h-6 text-red-600" />
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</div>
      <div className="text-lg font-semibold text-gray-800 mb-2">{metric.label}</div>
      <p className="text-gray-600 text-sm">{metric.description}</p>
    </motion.div>
  );
}