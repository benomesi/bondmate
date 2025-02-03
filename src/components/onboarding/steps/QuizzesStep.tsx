import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Heart, User } from 'lucide-react';

interface QuizzesStepProps {
  onComplete: (results: any) => void;
  onSkip: () => void;
  onBack: () => void;
}

const QUIZZES = [
  {
    id: 'attachment',
    title: 'Attachment Style Quiz',
    icon: Brain,
    description: 'Understand how you form and maintain emotional bonds',
    timeEstimate: '2-3 minutes',
    benefits: [
      'Understand your relationship patterns',
      'Improve emotional connections',
      'Build healthier bonds'
    ]
  },
  {
    id: 'love-languages',
    title: 'Love Languages Quiz',
    icon: Heart,
    description: 'Discover how you prefer to give and receive love',
    timeEstimate: '2-3 minutes',
    benefits: [
      'Express affection effectively',
      'Feel more appreciated',
      'Strengthen relationships'
    ]
  },
  {
    id: 'personality',
    title: 'Personality Alignment Quiz',
    icon: User,
    description: 'Learn about your communication and decision-making style',
    timeEstimate: '3-4 minutes',
    benefits: [
      'Improve communication clarity',
      'Handle conflicts better',
      'Build stronger connections'
    ]
  }
];

export function QuizzesStep({ onComplete, onSkip, onBack }: QuizzesStepProps) {
  const [selectedQuizzes, setSelectedQuizzes] = useState<string[]>([]);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);

  const toggleQuiz = (quizId: string) => {
    setSelectedQuizzes(prev =>
      prev.includes(quizId)
        ? prev.filter(id => id !== quizId)
        : [...prev, quizId]
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Personalize Your Experience
        </h2>
        <p className="text-lg text-gray-600">
          Take these optional quizzes to get more personalized advice and insights
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {QUIZZES.map(quiz => {
          const Icon = quiz.icon;
          return (
            <motion.button
              key={quiz.id}
              onClick={() => toggleQuiz(quiz.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-6 rounded-xl text-left transition-all duration-200 ${
                selectedQuizzes.includes(quiz.id)
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                  : 'bg-white border border-gray-200 hover:shadow-md'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                selectedQuizzes.includes(quiz.id)
                  ? 'bg-white/20'
                  : 'bg-blue-50'
              }`}>
                <Icon className={`w-6 h-6 ${
                  selectedQuizzes.includes(quiz.id)
                    ? 'text-white'
                    : 'text-blue-500'
                }`} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{quiz.title}</h3>
              <p className={`text-sm mb-4 ${
                selectedQuizzes.includes(quiz.id)
                  ? 'text-white/90'
                  : 'text-gray-600'
              }`}>
                {quiz.description}
              </p>
              <div className={`text-sm ${
                selectedQuizzes.includes(quiz.id)
                  ? 'text-white/80'
                  : 'text-gray-500'
              }`}>
                Time: {quiz.timeEstimate}
              </div>
              <ul className={`mt-4 space-y-2 text-sm ${
                selectedQuizzes.includes(quiz.id)
                  ? 'text-white/90'
                  : 'text-gray-600'
              }`}>
                {quiz.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                      selectedQuizzes.includes(quiz.id)
                        ? 'bg-white'
                        : 'bg-blue-500'
                    }`} />
                    {benefit}
                  </li>
                ))}
              </ul>
            </motion.button>
          );
        })}
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="px-6 py-2 text-gray-600 hover:text-gray-900"
        >
          Back
        </button>
        <div className="space-x-4">
          <button
            onClick={() => setShowSkipConfirm(true)}
            className="px-6 py-2 text-gray-600 hover:text-gray-900"
          >
            Skip for now
          </button>
          <button
            onClick={() => onComplete(selectedQuizzes)}
            disabled={selectedQuizzes.length === 0}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      </div>

      {/* Skip Confirmation Modal */}
      {showSkipConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Skip Quizzes?
            </h3>
            <p className="text-gray-600 mb-6">
              These quizzes help us provide more personalized advice. You can always take them later from your profile settings.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowSkipConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={onSkip}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:opacity-90 transition-colors"
              >
                Skip Quizzes
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}