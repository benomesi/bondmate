import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Clock, CreditCard, MessageSquare, Users } from 'lucide-react';

const TRUST_FEATURES = [
  {
    icon: Shield,
    title: 'Enterprise-Grade Security',
    description: 'Your data is protected with state-of-the-art encryption and security measures'
  },
  {
    icon: Lock,
    title: 'Privacy First',
    description: 'Your conversations and personal information are completely confidential'
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'Get relationship guidance whenever you need it, day or night'
  },
  {
    icon: CreditCard,
    title: 'Easy Cancellation',
    description: 'No commitments - cancel your subscription anytime with no questions asked'
  },
  {
    icon: MessageSquare,
    title: 'Expert Support',
    description: 'Access to our dedicated support team for any questions or concerns'
  },
  {
    icon: Users,
    title: 'Growing Community',
    description: 'Join thousands of others improving their relationships with AI guidance'
  }
];

const TRUST_STATS = [
  { label: 'Active Users', value: '10k+' },
  { label: 'Messages Exchanged', value: '1M+' },
  { label: 'Success Rate', value: '94%' },
  { label: 'User Satisfaction', value: '4.9/5' }
];

export function TrustSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {TRUST_FEATURES.map(({ icon: Icon, title, description }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-4 p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
            >
              <div className="p-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Stats */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-white/90">
              Join our growing community of people improving their relationships
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {TRUST_STATS.map(({ label, value }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-white mb-2">{value}</div>
                <div className="text-white/80">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}