import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setQuizResults } from '../../store/slices/appSlice';
import { QUIZZES, QUIZ_DETAILS } from '../../data/quizzes';
import type { QuizResults } from '../../types';

interface QuizSystemProps {
  selectedQuizzes: string[];
  onComplete: () => void;
  onBack: () => void;
}

export function QuizSystem({ selectedQuizzes, onComplete, onBack }: QuizSystemProps) {
  const dispatch = useAppDispatch();
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Record<string, string>>>({});
  const [showResults, setShowResults] = useState(false);

  const currentQuizId = selectedQuizzes[currentQuizIndex];
  const currentQuiz = QUIZZES[currentQuizId as keyof typeof QUIZZES];
  const currentQuestion = currentQuiz?.questions[currentQuestionIndex];

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuizId]: {
        ...(prev[currentQuizId] || {}),
        [currentQuestion.id]: value
      }
    }));

    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateResults = (): QuizResults => {
    const results: QuizResults = {};

    if (answers.attachmentStyle) {
      const counts: Record<string, number> = {};
      Object.values(answers.attachmentStyle).forEach(value => {
        counts[value] = (counts[value] || 0) + 1;
      });
      const maxCount = Math.max(...Object.values(counts));
      const dominantType = Object.entries(counts)
        .find(([_, count]) => count === maxCount)?.[0] as 'secure' | 'anxious' | 'avoidant' | 'disorganized';

      if (dominantType) {
        results.attachmentStyle = {
          type: dominantType,
          score: (maxCount / Object.keys(answers.attachmentStyle).length) * 100
        };
      }
    }

    if (answers.loveLanguages) {
      const counts = {
        wordsOfAffirmation: 0,
        actsOfService: 0,
        receivingGifts: 0,
        qualityTime: 0,
        physicalTouch: 0
      };

      Object.values(answers.loveLanguages).forEach(value => {
        counts[value as keyof typeof counts]++;
      });

      results.loveLanguages = counts;
    }

    if (answers.personalityAlignment) {
      const counts: Record<string, number> = {};
      Object.values(answers.personalityAlignment).forEach(value => {
        counts[value] = (counts[value] || 0) + 1;
      });
      const maxCount = Math.max(...Object.values(counts));
      const dominantType = Object.entries(counts)
        .find(([_, count]) => count === maxCount)?.[0] as 'harmonizer' | 'avoider' | 'leader' | 'empath';

      if (dominantType) {
        results.personalityAlignment = {
          type: dominantType,
          score: (maxCount / Object.keys(answers.personalityAlignment).length) * 100,
          description: QUIZ_DETAILS.personalityAlignment[dominantType].description
        };
      }
    }

    return results;
  };

  const handleNext = () => {
    if (showResults) {
      if (currentQuizIndex < selectedQuizzes.length - 1) {
        setCurrentQuizIndex(prev => prev + 1);
        setCurrentQuestionIndex(0);
        setShowResults(false);
      } else {
        const results = calculateResults();
        dispatch(setQuizResults(results));
        onComplete();
      }
    }
  };

  const renderResults = () => {
    const quizType = currentQuizId as keyof typeof QUIZ_DETAILS;
    
    // Special handling for love languages
    if (quizType === 'loveLanguages') {
      const counts = {
        wordsOfAffirmation: 0,
        actsOfService: 0,
        receivingGifts: 0,
        qualityTime: 0,
        physicalTouch: 0
      };

      Object.values(answers[quizType] || {}).forEach(value => {
        counts[value as keyof typeof counts]++;
      });

      const total = Object.values(counts).reduce((a, b) => a + b, 0);
      const percentages = Object.entries(counts).map(([key, value]) => ({
        language: key,
        percentage: Math.round((value / total) * 100)
      })).sort((a, b) => b.percentage - a.percentage);

      const primaryLanguage = percentages[0].language;
      const details = QUIZ_DETAILS.loveLanguages[primaryLanguage as keyof typeof QUIZ_DETAILS.loveLanguages];

      return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Your Love Languages Profile
          </h3>
          <div className="space-y-4 mb-6">
            {percentages.map(({ language, percentage }) => (
              <div key={language}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">
                    {language.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="font-medium">{percentage}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="border-t pt-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Primary Love Language</h4>
            <p className="text-gray-600 mb-4">{details.description}</p>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Tips for Growth</h4>
            <ul className="space-y-2">
              {details.tips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-1.5 h-1.5 mt-2 mr-2 bg-blue-500 rounded-full" />
                  <span className="text-gray-600">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }

    // Handle other quiz types (attachment style and personality alignment)
    const details = QUIZ_DETAILS[quizType];
    if (!details || !answers[quizType]) return null;

    const counts: Record<string, number> = {};
    Object.values(answers[quizType]).forEach(value => {
      counts[value] = (counts[value] || 0) + 1;
    });
    
    const maxCount = Math.max(...Object.values(counts));
    const dominantType = Object.entries(counts)
      .find(([_, count]) => count === maxCount)?.[0];

    if (!dominantType || !details[dominantType]) return null;

    const resultDetails = details[dominantType];

    return (
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          {resultDetails.title}
        </h3>
        <p className="text-gray-600 mb-6 whitespace-pre-wrap">
          {resultDetails.description}
        </p>
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900">Tips for Growth</h4>
          <ul className="space-y-2">
            {resultDetails.tips.map((tip, index) => (
              <li key={index} className="flex items-start">
                <div className="w-1.5 h-1.5 mt-2 mr-2 bg-blue-500 rounded-full" />
                <span className="text-gray-600">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-8"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>

      {!showResults ? (
        <motion.div
          key={`${currentQuizId}-${currentQuestionIndex}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentQuiz.title}
            </h2>
            <p className="text-gray-600">
              Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              {currentQuestion.text}
            </h3>
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className="w-full p-4 text-left rounded-lg transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {renderResults()}
          <div className="flex justify-end">
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:opacity-90 transition-colors"
            >
              {currentQuizIndex < selectedQuizzes.length - 1 ? 'Next Quiz' : 'Complete'}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}