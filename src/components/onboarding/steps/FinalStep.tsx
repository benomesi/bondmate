import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, ArrowRight } from 'lucide-react';

interface FinalStepProps {
  data: {
    relationshipFocus: string[];
    profile: {
      name: string;
      interests: string[];
      goals: string[];
      communicationStyle: string;
    };
    quizResults: any;
  };
  isSubmitting: boolean;
  onComplete: () => void;
  onBack: () => void;
}

export function FinalStep({ data, isSubmitting, onComplete, onBack }: FinalStepProps) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <MessageSquare className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          You're All Set!
        </h2>
        <p className="text-lg text-gray-600">
          We've got everything we need to help you build stronger relationships
        </p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Here's what you can expect:
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-medium">1</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Personalized Guidance</h4>
              <p className="text-gray-600">
                Get advice tailored to your communication style and goals
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-medium">2</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">24/7 Support</h4>
              <p className="text-gray-600">
                Our AI coach is always here to help you navigate challenges
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-medium">3</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Progress Tracking</h4>
              <p className="text-gray-600">
                Monitor your relationship growth and achievements
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="px-6 py-2 text-gray-600 hover:text-gray-900"
        >
          Back
        </button>
        <button
          onClick={onComplete}
          disabled={isSubmitting}
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
              Setting Up...
            </>
          ) : (
            <>
              Let's Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}