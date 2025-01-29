import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const REAL_SCENARIOS = [
  {
    title: "Turn Matches into Real Dates",
    description: "Learn proven conversation strategies that keep her engaged and excited to meet you. No more dead-end chats or ghosting.",
    outcomes: [
      "Get her number within 5-7 messages",
      "Plan dates that she won't cancel",
      "Build genuine attraction through text"
    ],
    actionPoint: "Master the art of engaging conversations that lead to real dates"
  },
  {
    title: "Stand Out From the Competition",
    description: "Get a data-driven profile makeover that showcases your best qualities and attracts high-quality matches who share your values.",
    outcomes: [
      "Optimize your photos for maximum impact",
      "Create an authentic, compelling bio",
      "Highlight your unique qualities"
    ],
    actionPoint: "Transform your profile into a magnet for quality matches"
  },
  {
    title: "Build Natural Confidence",
    description: "Develop genuine confidence through proven strategies and real-time feedback. No more awkward moments or missed opportunities.",
    outcomes: [
      "Overcome approach anxiety naturally",
      "Create instant connections",
      "Turn attraction into meaningful relationships"
    ],
    actionPoint: "Develop the confidence to pursue the relationships you want"
  }
];

export function TrustSection() {
  return (
    <section id="trust" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            Transform Your Dating Life
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600"
          >
            Get the results you want with personalized AI guidance
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {REAL_SCENARIOS.map(({ title, description, outcomes, actionPoint }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-gray-100 group"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-red-600 transition-colors">
                {title}
              </h3>
              <p className="text-gray-600 mb-6">
                {description}
              </p>
              <div className="space-y-3 mb-6">
                {outcomes.map((outcome, i) => (
                  <div key={i} className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3 flex-shrink-0" />
                    {outcome}
                  </div>
                ))}
              </div>
              <p className="text-sm font-medium text-red-600">
                {actionPoint}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Final CTA */}
        <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-2xl p-8 md:p-12 text-white text-center">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center">
                <Heart className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Stop Settling for Average Results
            </h2>
            
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of men who transformed their dating life with AI-powered guidance. 
              Get more matches, better conversations, and real dates - starting today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/auth/sign-up"
                className="px-8 py-4 bg-white text-red-600 rounded-xl hover:bg-gray-50 transition-colors font-bold text-lg flex items-center group"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <div className="text-white/80">
                No credit card required
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold">3x</div>
                <div className="text-white/80">Higher Match Rate</div>
              </div>
              <div>
                <div className="text-2xl font-bold">85%</div>
                <div className="text-white/80">Message Success</div>
              </div>
              <div>
                <div className="text-2xl font-bold">90%</div>
                <div className="text-white/80">User Success Rate</div>
              </div>
              <div>
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-white/80">AI Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}