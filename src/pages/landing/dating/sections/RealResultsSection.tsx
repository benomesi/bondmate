import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Target, TrendingUp, MessageSquare } from 'lucide-react';

const TRANSFORMATIONS = [
  {
    before: "Struggling with matches",
    after: "3-5 quality matches daily",
    timeframe: "2 weeks",
    key: "Profile optimization and strategic photo selection"
  },
  {
    before: "20% message response rate",
    after: "80% message response rate",
    timeframe: "1 week",
    key: "Personalized conversation strategies"
  },
  {
    before: "1 date per month",
    after: "2-3 dates per week",
    timeframe: "3 weeks",
    key: "Effective date planning and confidence building"
  }
];

const RESULT_METRICS = [
  {
    label: "Average Match Increase",
    value: "300%",
    icon: Target
  },
  {
    label: "Response Rate Improvement",
    value: "4x",
    icon: MessageSquare
  },
  {
    label: "Success Rate",
    value: "89%",
    icon: TrendingUp
  }
];

export function RealResultsSection() {
  return (
    <section id="results" className="py-20 bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-4"
          >
            Real Men, Real Results
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/80 max-w-2xl mx-auto"
          >
            See how men just like you transformed their dating life with AI guidance
          </motion.p>
        </div>

        {/* Transformation Stories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {TRANSFORMATIONS.map(({ before, after, timeframe, key }, index) => (
            <motion.div
              key={before}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="text-sm text-white/60">In just {timeframe}</div>
                <ArrowRight className="w-5 h-5 text-red-500" />
              </div>
              
              <div className="space-y-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-sm text-white/60 mb-1">Before</div>
                  <div className="text-lg">{before}</div>
                </div>
                
                <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-lg p-4">
                  <div className="text-sm text-red-400 mb-1">After</div>
                  <div className="text-lg font-semibold">{after}</div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="text-sm text-white/60 mb-2">Key to Success:</div>
                <div className="text-red-400">{key}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Result Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {RESULT_METRICS.map(({ label, value, icon: Icon }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold mb-2">{value}</div>
              <div className="text-white/80">{label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}