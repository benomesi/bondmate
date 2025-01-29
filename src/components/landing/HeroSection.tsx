import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            Transform Your Relationships with
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 text-transparent bg-clip-text animate-gradient">
              AI-Powered Guidance
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 mb-10"
          >
            Get personalized advice and support to build stronger, more meaningful connections.
            Available 24/7 for all your relationship needs.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <Link
              to="/auth/sign-up"
              className="px-8 py-3 text-lg font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-full hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center group animate-bounce"
            >
              Start Your Journey Today
              <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
            </Link>
            <button
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 text-lg font-medium text-gray-700 bg-white rounded-full hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              See How It Works
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto"
          >
            <div className="flex flex-col items-center">
              <span className="font-semibold text-blue-600 text-2xl mb-1">94%</span>
              <span className="text-sm text-gray-500 text-center">User Satisfaction</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-semibold text-blue-600 text-2xl mb-1">Always</span>
              <span className="text-sm text-gray-500 text-center">Ready to Help</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-semibold text-blue-600 text-2xl mb-1">100%</span>
              <span className="text-sm text-gray-500 text-center">Private & Secure</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-semibold text-blue-600 text-2xl mb-1">24/7</span>
              <span className="text-sm text-gray-500 text-center">Global Access</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-gradient-to-r from-purple-200 to-blue-200 rounded-full blur-3xl opacity-30"
              style={{
                width: `${300 + Math.random() * 200}px`,
                height: `${300 + Math.random() * 200}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: 'translate(-50%, -50%)',
                animation: `float ${10 + Math.random() * 10}s ease-in-out infinite alternate`
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}