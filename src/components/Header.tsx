import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppSelector } from '../hooks/useAppSelector';

export function Header() {
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const isDatingPage = location.pathname === '/dating-for-men';
  const isDashboard = location.pathname.startsWith('/dashboard');

  // Return null for dashboard as it has its own header
  if (isDashboard) return null;

  // Dating landing page header
  if (isDatingPage) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              to="/"
              className="flex items-center space-x-2 group cursor-pointer transition-transform duration-200 hover:scale-105"
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-r from-red-500 to-red-600">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent font-poppins">
                BondMate
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-sm text-gray-300 hover:text-white font-medium"
              >
                How It Works
              </button>
              <button
                onClick={() => document.getElementById('ai-chat-companion')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-sm text-gray-300 hover:text-white font-medium"
              >
                Live Demo
              </button>
              <button
                onClick={() => document.getElementById('stats')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-sm text-gray-300 hover:text-white font-medium"
              >
                Stats
              </button>
              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-sm text-gray-300 hover:text-white font-medium"
              >
                Features
              </button>
              <button
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-sm text-gray-300 hover:text-white font-medium"
              >
                Pricing
              </button>
              <Link
                to="/sign-up"
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm font-medium flex items-center"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </nav>
          </div>
        </div>
      </header>
    );
  }

  // Main site header (homepage and other pages)
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="flex items-center space-x-2 group cursor-pointer transition-transform duration-200 hover:scale-105"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-poppins">
              BondMate
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/features"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Features
            </Link>
            <Link
              to="/pricing"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Pricing
            </Link>
            <Link
              to="/blog"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Blog
            </Link>
            {user ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to="/sign-up"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-colors flex items-center"
              >
                Get Started
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}