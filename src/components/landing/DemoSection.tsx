import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ScenarioCard } from './demo/ScenarioCard';
import { ChatMessage } from './demo/ChatMessage';
import { ResponseOptions } from './demo/ResponseOptions';
import { SCENARIOS, AI_RESPONSES } from './demo/constants';
import type { Scenario } from './demo/types';

export function DemoSection() {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [showResponse, setShowResponse] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationStep, setConversationStep] = useState<'initial' | 'followUp' | 'final'>('initial');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleScenarioSelect = async (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    setIsTyping(true);
    // Simulate AI typing
    await new Promise(resolve => setTimeout(resolve, 1500));
    setShowResponse(true);
    setIsTyping(false);
    setConversationStep('initial');
  };

  const handleOptionSelect = async (option: string) => {
    setSelectedOption(option);
    setIsTyping(true);
    // Ensure we have a valid scenario before proceeding
    if (!selectedScenario || !(selectedScenario in AI_RESPONSES)) {
      console.error('Invalid scenario selected');
      setIsTyping(false);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 1500));
    setConversationStep('followUp');
    setIsTyping(false);
  };

  const handleFinalStep = async () => {
    setIsTyping(true);
    // Ensure we have a valid scenario before proceeding
    if (!selectedScenario || !(selectedScenario in AI_RESPONSES)) {
      console.error('Invalid scenario selected');
      setIsTyping(false);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 1500));
    setConversationStep('final');
    setIsTyping(false);
  };

  const resetDemo = () => {
    setSelectedScenario(null);
    setShowResponse(false);
    setConversationStep('initial');
    setSelectedOption(null);
  };

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-gradient-to-r from-purple-200/20 to-blue-200/20 rounded-full blur-2xl"
              style={{
                width: `${150 + Math.random() * 200}px`,
                height: `${150 + Math.random() * 200}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: 'translate(-50%, -50%)',
                animation: `float ${15 + Math.random() * 10}s ease-in-out infinite alternate`
              }}
            />
          ))}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            Experience the Magic of AI Relationship Coaching
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            See how BondMate transforms relationship challenges into opportunities for deeper connection
          </motion.p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Demo Header */}
            <div className="p-4 md:p-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    BondMate AI Coach
                  </h3>
                  <p className="text-sm text-white/80">
                    Preview Version
                  </p>
                </div>
              </div>
            </div>

            {/* Demo Content */}
            <div className="p-6 min-h-[400px]">
              <AnimatePresence mode="wait">
                {!selectedScenario ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <p className="text-gray-600 mb-6 text-lg">
                      Select a challenge you're facing and see how BondMate provides personalized guidance:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {SCENARIOS.map(scenario => (
                        <ScenarioCard
                          key={scenario.id}
                          scenario={scenario}
                          isSelected={scenario.id === 'dating-apps'}
                          onSelect={handleScenarioSelect}
                        />
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <button
                      onClick={resetDemo}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      ← Choose another scenario
                    </button>

                    {/* User Message */}
                    <ChatMessage 
                      content={SCENARIOS.find(s => s.id === selectedScenario)?.prompt || ''}
                    />

                    {/* AI Response */}
                    {isTyping ? (
                      <ChatMessage showTypingIndicator />
                    ) : showResponse && (
                      <>
                        <ChatMessage
                          isAI
                          content={
                            conversationStep === 'initial'
                              ? selectedScenario && AI_RESPONSES[selectedScenario as keyof typeof AI_RESPONSES]?.initial || 'I apologize, but I cannot provide a response at this moment.'
                              : conversationStep === 'followUp' && selectedOption && selectedScenario
                              ? AI_RESPONSES[selectedScenario as keyof typeof AI_RESPONSES]?.followUps?.[selectedOption as "1" | "2"]?.response || ''
                              : conversationStep === 'final'
                              ? selectedScenario && AI_RESPONSES[selectedScenario as keyof typeof AI_RESPONSES]?.final || 'I apologize, but I cannot provide a response at this moment.'
                              : 'I apologize, but I cannot provide a response at this moment.'
                          }
                        />
                        
                        {conversationStep === 'initial' && selectedScenario && (
                          <ResponseOptions
                            options={[
                              { value: '1', label: selectedScenario === 'dating-apps' ? 'Help with my profile' : 'Help me plan ahead' },
                              { value: '2', label: selectedScenario === 'dating-apps' ? 'Help with messaging' : 'Help with confidence' }
                            ]}
                            onSelect={handleOptionSelect}
                          />
                        )}
                        
                        {conversationStep === 'followUp' && (
                           <div className="mt-4">
                             <motion.button
                               onClick={handleFinalStep}
                               whileHover={{ scale: 1.02 }}
                               whileTap={{ scale: 0.98 }}
                               className="w-full p-4 text-center bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                             >
                               Get Final Advice
                             </motion.button>
                           </div>
                         )}
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Demo Footer */}
            <div className="p-6 border-t border-gray-100">              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl mx-auto">
                <p className="text-gray-600 font-medium">
                  Ready to get personalized guidance?
                </p>
                <Link
                  to="/sign-up"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 group whitespace-nowrap"
                >
                  Transform Your Relationships
                  <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add keyframes for floating animation */}
      <style>{`
        @keyframes float {
          0% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.1); }
          100% { transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </section>
  );
}