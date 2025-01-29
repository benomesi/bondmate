import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertCircle } from 'lucide-react';

interface AssessmentsProps {
  data: {
    loveLanguages: Record<string, number>;
    attachmentStyle: Record<string, string>;
  };
  onUpdate: (data: AssessmentsProps['data']) => void;
}

const LOVE_LANGUAGES_QUESTIONS = [
  {
    id: 'q1',
    text: 'I feel most appreciated when my partner...',
    options: [
      { value: 'words', text: 'Gives me compliments and words of affirmation' },
      { value: 'time', text: 'Spends quality time with me' },
      { value: 'gifts', text: 'Gives me thoughtful gifts' },
      { value: 'service', text: 'Does helpful things for me' },
      { value: 'touch', text: 'Shows physical affection' },
    ],
  },
  {
    id: 'q2',
    text: 'When I want to show someone I care, I typically...',
    options: [
      { value: 'words', text: 'Tell them how much they mean to me' },
      { value: 'time', text: 'Make time to be with them' },
      { value: 'gifts', text: 'Give them meaningful presents' },
      { value: 'service', text: 'Help them with tasks or responsibilities' },
      { value: 'touch', text: 'Give them a hug or physical gesture of care' },
    ],
  },
  // Add more questions here...
];

const ATTACHMENT_QUESTIONS = [
  {
    id: 'a1',
    text: 'When something goes wrong in a relationship, I tend to...',
    options: [
      { value: 'secure', text: 'Talk it through calmly and work towards a solution' },
      { value: 'anxious', text: 'Worry extensively and seek constant reassurance' },
      { value: 'avoidant', text: 'Distance myself and avoid discussing the issue' },
      { value: 'disorganized', text: 'Feel conflicted between wanting closeness and distance' },
    ],
  },
  {
    id: 'a2',
    text: 'In close relationships, I usually...',
    options: [
      { value: 'secure', text: 'Feel comfortable with both intimacy and independence' },
      { value: 'anxious', text: 'Fear abandonment and need frequent reassurance' },
      { value: 'avoidant', text: 'Value my independence and find it hard to depend on others' },
      { value: 'disorganized', text: 'Have unpredictable reactions to closeness' },
    ],
  },
  // Add more questions here...
];

export function Assessments({ data, onUpdate }: AssessmentsProps) {
  const [currentAssessment, setCurrentAssessment] = useState<'love' | 'attachment'>('love');
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [reminderDate, setReminderDate] = useState('');

  const handleLoveLanguageAnswer = (questionId: string, value: string) => {
    onUpdate({
      ...data,
      loveLanguages: {
        ...data.loveLanguages,
        [questionId]: value,
      },
    });
  };

  const handleAttachmentAnswer = (questionId: string, value: string) => {
    onUpdate({
      ...data,
      attachmentStyle: {
        ...data.attachmentStyle,
        [questionId]: value,
      },
    });
  };

  const handleSkip = () => {
    if (reminderDate) {
      localStorage.setItem('assessmentReminder', reminderDate);
      setShowSkipModal(false);
    }
  };

  const questions = currentAssessment === 'love' ? LOVE_LANGUAGES_QUESTIONS : ATTACHMENT_QUESTIONS;
  const progress = currentAssessment === 'love'
    ? Object.keys(data.loveLanguages).length / LOVE_LANGUAGES_QUESTIONS.length
    : Object.keys(data.attachmentStyle).length / ATTACHMENT_QUESTIONS.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Relationship Style Assessment
        </h2>
        <p className="text-gray-600">
          Understanding your relationship patterns helps us provide more personalized advice.
        </p>
      </div>

      {/* Assessment Progress */}
      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-blue-500" />
          <span className="text-sm text-blue-700">
            Estimated time: {currentAssessment === 'love' ? '2-3' : '2-3'} minutes
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="w-32 h-2 bg-blue-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <button
            onClick={() => setShowSkipModal(true)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Skip for now
          </button>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {questions.map((question, index) => (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Question {index + 1}
              </h3>
              <span className="text-sm text-gray-500">
                {index + 1} of {questions.length}
              </span>
            </div>
            <p className="text-gray-700 mb-4">{question.text}</p>
            <div className="space-y-3">
              {question.options.map((option) => (
                <motion.label
                  key={option.value}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`flex items-center p-4 rounded-lg cursor-pointer transition-all duration-200
                    ${(currentAssessment === 'love' ? data.loveLanguages[question.id] : data.attachmentStyle[question.id]) === option.value
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                      : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={option.value}
                    checked={
                      currentAssessment === 'love'
                        ? data.loveLanguages[question.id] === option.value
                        : data.attachmentStyle[question.id] === option.value
                    }
                    onChange={() =>
                      currentAssessment === 'love'
                        ? handleLoveLanguageAnswer(question.id, option.value)
                        : handleAttachmentAnswer(question.id, option.value)
                    }
                    className="hidden"
                  />
                  <span>{option.text}</span>
                </motion.label>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Skip Modal */}
      {showSkipModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full"
          >
            <div className="flex items-center space-x-2 text-red-600 mb-4">
              <AlertCircle className="w-5 h-5" />
              <h3 className="text-lg font-medium">Skip Assessments?</h3>
            </div>
            <p className="text-gray-600 mb-4">
              These assessments help us provide personalized advice. Would you like to schedule a reminder to complete them later?
            </p>
            <input
              type="datetime-local"
              value={reminderDate}
              onChange={(e) => setReminderDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowSkipModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSkip}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:opacity-90"
              >
                Schedule Reminder
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}