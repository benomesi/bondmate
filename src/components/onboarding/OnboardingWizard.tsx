import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Heart, User, ArrowRight } from 'lucide-react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { setHasCompletedOnboarding, setProfile } from '../../store/slices/appSlice';
import { supabase } from '../../lib/supabase';
import { FocusStep } from './steps/FocusStep';
import { ProfileStep } from './steps/ProfileStep';
import { QuizzesStep } from './steps/QuizzesStep';
import { FinalStep } from './steps/FinalStep';

type OnboardingStep = 'welcome' | 'focus' | 'profile' | 'quizzes' | 'final';

const STEP_TITLES = {
  welcome: 'Welcome',
  focus: 'Your Focus',
  profile: 'Your Profile',
  quizzes: 'Personalization',
  final: 'Ready!'
};

export function OnboardingWizard() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState({
    relationshipFocus: [] as string[],
    profile: {
      name: '',
      interests: [] as string[],
      goals: [] as string[],
      communicationStyle: ''
    },
    quizResults: null
  });

  const handleComplete = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          name: data.profile.name,
          interests: data.profile.interests,
          goals: data.profile.goals,
          communication_style: data.profile.communicationStyle,
          has_completed_onboarding: true
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      dispatch(setProfile({
        name: data.profile.name,
        interests: data.profile.interests,
        goals: data.profile.goals,
        communicationStyle: data.profile.communicationStyle,
        is_admin: false,
        is_premium: false
      }));
      dispatch(setHasCompletedOnboarding(true));
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepProgress = () => {
    const steps = ['welcome', 'focus', 'profile', 'quizzes', 'final'];
    return ((steps.indexOf(currentStep) + 1) / steps.length) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
          initial={{ width: '0%' }}
          animate={{ width: `${getStepProgress()}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Step Indicator */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md z-50">
        <motion.span
          key={currentStep}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-medium text-gray-600"
        >
          {STEP_TITLES[currentStep]}
        </motion.span>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep === 'welcome' && (
            <motion.div
              className="text-center space-y-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-center gap-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl md:flex items-center justify-center hidden"
                >
                  <Heart className="w-12 h-12 text-white" />
                </motion.div>
                <h1 className="text-4xl font-bold text-gray-900">
                  Welcome to BondMate!
                </h1>
              </div>
              
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Let's personalize your experience to help you build stronger, more meaningful relationships.
              </p>

              <div className="bg-white rounded-xl p-6 shadow-lg max-w-xl mx-auto">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className='flex flex-col items-start'>
                    <p className="text-gray-900 font-medium">Create Your Profile</p>
                    <p className="text-sm text-gray-600">Tell us about yourself</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className='flex flex-col items-start'>
                    <p className="text-gray-900 font-medium">Quick Assessment</p>
                    <p className="text-sm text-gray-600">Understand your relationship style</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Heart className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className='flex flex-col items-start'>
                    <p className="text-gray-900 font-medium">Get Personalized Guidance</p>
                    <p className="text-sm text-gray-600">Start improving your relationships</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setCurrentStep('focus')}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center mx-auto"
              >
                Let's Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>

              <p className="text-sm text-gray-500">
                Takes about 1-3 minutes to complete
              </p>
            </motion.div>
          )}

          {currentStep === 'focus' && (
            <FocusStep
              selected={data.relationshipFocus}
              onUpdate={(focus) => setData({ ...data, relationshipFocus: focus })}
              onNext={() => setCurrentStep('profile')}
              onBack={() => setCurrentStep('welcome')}
            />
          )}

          {currentStep === 'profile' && (
            <ProfileStep
              data={data.profile}
              onUpdate={(profile) => setData({ ...data, profile })}
              onNext={() => setCurrentStep('quizzes')}
              onBack={() => setCurrentStep('focus')}
            />
          )}

          {currentStep === 'quizzes' && (
            <QuizzesStep
              onComplete={(results) => {
                setData({ ...data, quizResults: results });
                setCurrentStep('final');
              }}
              onSkip={() => setCurrentStep('final')}
              onBack={() => setCurrentStep('profile')}
            />
          )}

          {currentStep === 'final' && (
            <FinalStep
              data={data}
              isSubmitting={isSubmitting}
              onComplete={handleComplete}
              onBack={() => setCurrentStep('quizzes')}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}