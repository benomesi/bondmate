import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import type { DatingStat } from './index';

interface StatCardProps {
  stat: DatingStat;
  index: number;
}

export function StatCard({ stat, index }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative bg-white/5 p-6 rounded-xl hover:bg-white/10 transition-colors"
    >
      <div className="text-5xl font-bold mb-4 bg-gradient-to-r from-red-500 to-red-600 text-transparent bg-clip-text">
        {stat.stat}
      </div>
      <h3 className="text-xl font-semibold mb-2">
        {stat.title}
      </h3>
      <p className="text-white/80 mb-4">
        {stat.description}
      </p>
      <a
        href={stat.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-sm text-white/60 hover:text-white transition-colors"
      >
        Source: {stat.source}
        <ExternalLink className="w-4 h-4 ml-1" />
      </a>
    </motion.div>
  );
}