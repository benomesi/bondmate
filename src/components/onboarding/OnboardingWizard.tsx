import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Heart, User, ArrowRight } from 'lucide-react';
import { QuizSystem } from './QuizSystem';
import { UserProfileSetup } from './UserProfileSetup';
import { RelationshipWizard } from '../RelationshipWizard';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setQuizResults, setHasCompletedOnboarding } from '../../store/slices/appSlice';
import { supabase } from '../../lib/supabase';

type OnboardingStep = 'profile' | 'quizzes' | 'quizInProgress' | 'relationship';

const QUIZ_DESCRIPTIONS = [
  {
    id: 'attachmentStyle',
    title: 'Attachment Style Quiz',
    icon: Brain,
    description: 'Understand how you form and maintain emotional bonds in relationships. This quiz helps identify your attachment pattern, which influences how you connect with others, handle trust, and navigate emotional intimacy.',
    timeEstimate: '1-2 minutes',
    benefits: [
      'Understand your emotional needs better',
      'Recognize relationship patterns',
      'Improve emotional communication',
      'Build healthier connections'
    ]
  },
  {
    id: 'loveLanguages',
    title: 'Love Languages Quiz',
    icon: Heart,
    description: 'Discover how you prefer to give and receive love and appreciation. Understanding your love languages helps ensure your emotional needs are met and you can better express care for others.',
    timeEstimate: '1-2 minutes',
    benefits: [
      'Express affection more effectively',
      'Feel more appreciated',
      'Strengthen relationships',
      'Avoid misunderstandings'
    ]
  },
  {
    id: 'personalityAlignment',
    title: 'Personality Alignment Quiz',
    icon: User,
    description: 'Learn about your communication style and decision-making preferences. This insight helps you navigate relationships more effectively and understand potential areas of compatibility or conflict.',
    timeEstimate: '1-2 minutes',
    benefits: [
      'Improve communication clarity',
      'Handle conflicts better',
      'Make better decisions together',
      'Build stronger connections'
    ]
  }
];

export function OnboardingWizard() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('profile');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedQuizzes, setSelectedQuizzes] = useState<string[]>([]);
  const stepTransitionTimeoutRef = React.useRef<number>();

  // Cleanup timeouts on unmount
  React.useEffect(() => {
    return () => {
      if (stepTransitionTimeoutRef.current) {
        window.clearTimeout(stepTransitionTimeoutRef.current);
      }
    };
  }, []);

  const transitionToStep = React.useCallback((step: OnboardingStep) => {
    // Clear any existing timeout
    if (stepTransitionTimeoutRef.current) {
      window.clearTimeout(stepTransitionTimeoutRef.current);
    }

    // Use requestAnimationFrame for smoother transitions
    window.requestAnimationFrame(() => {
      setCurrentStep(step);
    });
  }, []);

  const handleProfileComplete = () => {
    transitionToStep('quizzes');
  };

  const handleQuizSelection = (quizId: string) => {
    setSelectedQuizzes(prev => 
      prev.includes(quizId)
        ? prev.filter(id => id !== quizId)
        : [...prev, quizId]
    );
  };

  const handleQuizzesComplete = () => {
    if (selectedQuizzes.length > 0) {
      // Add a small delay to ensure state updates are complete
      stepTransitionTimeoutRef.current = window.setTimeout(() => {
        transitionToStep('quizInProgress');
      }, 100);
    } else {
      transitionToStep('relationship');
    }
  };

  const handleQuizSystemComplete = async (results: any) => {
    setIsSubmitting(true);
    try {
      // Update profile in Supabase
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ has_completed_onboarding: true })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      // Store quiz results in Redux state
      dispatch(setQuizResults(results));
      dispatch(setHasCompletedOnboarding(true));
      transitionToStep('relationship');
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      // Still continue to relationship step but log the error
      transitionToStep('relationship');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipQuizzes = async () => {
    setIsSubmitting(true);
    try {
      // Update profile in Supabase
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ has_completed_onboarding: true })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      // Clear any quiz results when skipping
      dispatch(setQuizResults(null));
      dispatch(setHasCompletedOnboarding(true));
      transitionToStep('relationship');
    } catch (error) {
      console.error('Failed to skip quizzes:', error);
      // Still continue but log the error
      transitionToStep('relationship');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'profile':
        return <UserProfileSetup onComplete={handleProfileComplete} />;

      case 'quizzes':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto p-6"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Personalize Your Experience
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Take these optional quizzes to get more personalized relationship advice and insights.
                Choose any or all that interest you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {QUIZ_DESCRIPTIONS.map((quiz) => {
                const Icon = quiz.icon;
                return (
                  <motion.div
                    key={quiz.id}
                    whileHover={{ scale: 1.02 }}
                    className={`relative p-6 rounded-xl cursor-pointer transition-all duration-200 ${
                      selectedQuizzes.includes(quiz.id)
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                        : 'bg-white hover:shadow-md'
                    }`}
                    onClick={() => handleQuizSelection(quiz.id)}
                  >
                    <div className={`p-3 rounded-lg inline-block mb-4 ${
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
                    <h3 className={`text-lg font-semibold mb-2 ${
                      selectedQuizzes.includes(quiz.id)
                        ? 'text-white'
                        : 'text-gray-900'
                    }`}>
                      {quiz.title}
                    </h3>
                    <p className={
                      selectedQuizzes.includes(quiz.id)
                        ? 'text-white/90 mb-4'
                        : 'text-gray-600 mb-4'
                    }>
                      {quiz.description}
                    </p>
                    <div className={`text-sm ${
                      selectedQuizzes.includes(quiz.id)
                        ? 'text-white/80'
                        : 'text-gray-500'
                    }`}>
                      Estimated time: {quiz.timeEstimate}
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
                  </motion.div>
                );
              })}
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={handleSkipQuizzes}
                className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Skip for Now
              </button>
              <button
                onClick={handleQuizzesComplete}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:opacity-90 transition-colors flex items-center"
              >
                {selectedQuizzes.length > 0 ? 'Take Selected Quizzes' : 'Continue'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </motion.div>
        );

      case 'quizInProgress':
        return (
          <QuizSystem 
            selectedQuizzes={selectedQuizzes}
            onComplete={handleQuizSystemComplete}
            onBack={() => setCurrentStep('quizzes')}
          />
        );

      case 'relationship':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50"
          >
            <RelationshipWizard 
              onClose={() => {
                // Navigate to dashboard after relationship setup
                navigate('/dashboard', { replace: true });
              }} 
            />
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto py-12">
        {renderStep()}
      </div>
    </div>
  );
}