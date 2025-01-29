import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import type { ValueProp } from './index';

interface ValuePropCardProps {
  prop: ValueProp;
  index: number;
}

export function ValuePropCard({ prop, index }: ValuePropCardProps) {
  const Icon = Icons[prop.icon as keyof typeof Icons];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="text-center"
    >
      <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{prop.title}</h3>
      <p className="text-gray-600">{prop.description}</p>
    </motion.div>
  );
}