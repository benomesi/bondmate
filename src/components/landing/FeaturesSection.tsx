import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Brain, Shield, Target } from 'lucide-react';

const FEATURES = [
  {
    icon: MessageSquare,
    title: 'Instant Expert Guidance',
    description: 'Get personalized relationship advice from our AI coach trained in psychology and communication.',
  },
  {
    icon: Brain,
    title: 'Smart Insights',
    description: 'Receive data-driven recommendations based on your unique relationship dynamics and patterns.',
  },
  {
    icon: Shield,
    title: 'Private & Secure',
    description: 'Your conversations are protected with enterprise-grade encryption. Your privacy is our priority.',
  },
  {
    icon: Target,
    title: 'Personalized Growth Plans',
    description: 'Get customized strategies and exercises to strengthen your relationships over time.',
  }
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            Why Choose BondMate?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Experience the future of relationship guidance with our innovative features
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map(({ icon: Icon, title, description }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform hover:scale-110 transition-transform">
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {title}
              </h3>
              <p className="text-gray-600">
                {description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}