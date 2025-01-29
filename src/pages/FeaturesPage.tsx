import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Users, Brain, Heart, Target, Lock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';

const features = [
  {
    icon: MessageSquare,
    title: 'AI Relationship Coach',
    description: 'Get 24/7 personalized advice from our advanced AI coach trained in relationship psychology and communication.',
    benefits: [
      'Instant, personalized guidance',
      'Available anytime, anywhere',
      'Learns from your interactions',
      'Evidence-based advice'
    ]
  },
  {
    icon: Brain,
    title: 'Smart Analysis',
    description: 'Our AI analyzes your communication patterns and relationship dynamics to provide targeted recommendations.',
    benefits: [
      'Communication pattern analysis',
      'Personality insights',
      'Relationship dynamics assessment',
      'Progress tracking'
    ]
  },
  {
    icon: Users,
    title: 'Multiple Relationship Support',
    description: 'Whether it\'s romantic, family, or friendship, get tailored advice for all your important relationships.',
    benefits: [
      'Customized strategies per relationship',
      'Context-aware guidance',
      'Relationship-specific goals',
      'Progress tracking per relationship'
    ]
  },
  {
    icon: Heart,
    title: 'Emotional Intelligence',
    description: 'Develop better emotional awareness and improve your ability to navigate relationship challenges.',
    benefits: [
      'Emotional awareness exercises',
      'Conflict resolution strategies',
      'Active listening techniques',
      'Empathy development'
    ]
  },
  {
    icon: Target,
    title: 'Goal Setting & Tracking',
    description: 'Set relationship goals and track your progress with detailed insights and recommendations.',
    benefits: [
      'Custom goal setting',
      'Progress visualization',
      'Achievement celebrations',
      'Adaptive recommendations'
    ]
  },
  {
    icon: Lock,
    title: 'Privacy & Security',
    description: 'Your conversations and personal information are protected with enterprise-grade security.',
    benefits: [
      'End-to-end encryption',
      'Secure data storage',
      'Privacy controls',
      'Regular security audits'
    ]
  }
];

export function FeaturesPage() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        {/* Hero Section */}
        <section className="pt-20 pb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl font-bold text-gray-900 mb-6"
              >
                Powerful Features for
                <br />
                <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 text-transparent bg-clip-text animate-gradient">
                  Stronger Relationships
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-600 max-w-3xl mx-auto"
              >
                Discover how BondMate's innovative features can help you build and maintain healthier, more meaningful relationships.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {feature.description}
                    </p>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-center text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mr-2" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Experience These Features?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Start your free trial today. No credit card required.
            </p>
            <Link
              to="/auth/sign-up"
              className="inline-flex items-center px-8 py-3 text-lg font-medium bg-white text-gray-900 rounded-full hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}