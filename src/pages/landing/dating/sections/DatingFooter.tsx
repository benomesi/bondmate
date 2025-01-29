import React from 'react';
import { MessageSquare, Shield, Lock, Award, Clock, Heart } from 'lucide-react';

export function DatingFooter() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badges Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="flex flex-col items-center text-center">
            <Shield className="w-8 h-8 text-red-500 mb-3" />
            <h4 className="font-semibold mb-1">Enterprise Security</h4>
            <p className="text-sm text-gray-400">256-bit encryption</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Lock className="w-8 h-8 text-red-500 mb-3" />
            <h4 className="font-semibold mb-1">Privacy Protected</h4>
            <p className="text-sm text-gray-400">Your data stays private</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Award className="w-8 h-8 text-red-500 mb-3" />
            <h4 className="font-semibold mb-1">Proven Results</h4>
            <p className="text-sm text-gray-400">94% success rate</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Clock className="w-8 h-8 text-red-500 mb-3" />
            <h4 className="font-semibold mb-1">24/7 Support</h4>
            <p className="text-sm text-gray-400">Always here to help</p>
          </div>
        </div>

        {/* Brand Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold font-poppins">BondMate</span>
          </div>
          <p className="text-gray-400 text-sm max-w-md mb-8">
            Transform your dating life with AI-powered guidance and support. 
            Privacy and security guaranteed—your data is safe with us.
          </p>

          {/* Footer Links */}
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} BondMate. All rights reserved.
            </div>
            <div className="flex items-center text-gray-400">
              <Heart className="w-4 h-4 mr-1 text-red-500" />
              <span className="text-sm">Made with love in Miami</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}