import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { StatCard } from '../stats/StatCard';
import { DATING_STATS } from '../stats';

export function DatingStatsSection() {
  return (
    <section id="stats" className="py-20 bg-gradient-to-r from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-4"
          >
            The Reality of Modern Dating
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/90 max-w-2xl mx-auto"
          >
            Understanding the challenges men face in today's dating landscape
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {DATING_STATS.map((stat, index) => (
            <StatCard
              key={stat.title}
              stat={stat}
              index={index}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <Link
            to="/sign-up"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg font-medium group"
          >
            Let BondMate Fix This For You
            <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="mt-4 text-white/60">
            Start free, upgrade anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
}