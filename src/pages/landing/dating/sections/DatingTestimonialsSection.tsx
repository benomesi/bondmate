import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, MessageSquare } from 'lucide-react';
import { TestimonialCard } from '../testimonials/TestimonialCard';
import { SuccessMetric } from '../testimonials/SuccessMetric';
import { TESTIMONIALS, SUCCESS_METRICS } from '../testimonials';

export function DatingTestimonialsSection() {
  return (
    <section id="testimonials" className="relative py-20 bg-gradient-to-br from-gray-50 to-red-50 overflow-hidden">
      {/* Animated Message Square Pattern Background */}
      <div className="absolute inset-0" aria-hidden="true">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 0.08 + Math.random() * 0.04,
              scale: 0.8 + Math.random() * 0.4,
              rotate: Math.random() * 360
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: Math.random() * 2
            }}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            <MessageSquare className="w-16 h-16 text-red-500 opacity-5" />
          </motion.div>
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block p-2 bg-red-500/10 rounded-2xl mb-4"
          >
            <Trophy className="w-8 h-8 text-red-600" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Success Stories
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Join thousands of men who transformed their dating lives
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>

        {/* Success Metrics */}
        <div className="mt-20 bg-white rounded-2xl shadow-lg p-8 border border-red-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {SUCCESS_METRICS.map((metric, index) => (
              <SuccessMetric
                key={metric.label}
                metric={metric}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}