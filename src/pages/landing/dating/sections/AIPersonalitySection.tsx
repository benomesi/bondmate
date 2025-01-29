import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Sparkles } from 'lucide-react';

const AI_PERSONALITIES = [
  {
    id: 'direct',
    name: 'Direct & Strategic',
    description: 'No-nonsense, practical advice focused on results',
    sampleResponse: "Let's cut to the chase. Your profile needs work - here's exactly what to fix:\n\n1. Lead photo isn't strong enough\n2. Bio lacks hooks for conversation\n3. Not showing enough status markers\n\nFix these and you'll 3x your matches this week. Want the specific changes to make?",
    style: 'from-blue-600 to-blue-700'
  },
  {
    id: 'cocky',
    name: 'Cocky & Funny',
    description: 'Confident, playful advice with a dash of humor',
    sampleResponse: "Bro, your profile's about as exciting as watching paint dry! 😂 But don't worry, I've helped way worse cases than you. Let's turn you from 'meh' to 'damn!' with some quick fixes:\n\n• Add some humor (not the dad joke kind)\n• Show off a bit (subtly, we're not peacocking here)\n• Get some action shots (and no, gaming doesn't count)\n\nReady to level up?",
    style: 'from-purple-600 to-purple-700'
  },
  {
    id: 'wingman',
    name: 'Supportive Wingman',
    description: 'Encouraging and motivating, like your best friend',
    sampleResponse: "Hey man, I see what you're going for with your profile, and you've got some great elements to work with! Let's build on your strengths:\n\n• Your travel photos show adventure\n• You've got a great smile in that third pic\n• Your career shows ambition\n\nWant to see how we can make these shine even more?",
    style: 'from-green-600 to-green-700'
  },
  {
    id: 'analytical',
    name: 'Analytical Expert',
    description: 'Data-driven insights and proven strategies',
    sampleResponse: "Analysis of your dating profile reveals several key optimization opportunities:\n\n📊 Current Match Rate: 2.3%\n🎯 Target Match Rate: 8-10%\n\nKey Findings:\n1. Photo sequence suboptimal (72% of users decide based on first photo)\n2. Bio keywords missing high-response triggers\n3. Interest alignment needs calibration\n\nShall we optimize these metrics?",
    style: 'from-red-600 to-red-700'
  }
];

export function AIPersonalitySection() {
  const [selectedPersonality, setSelectedPersonality] = useState(AI_PERSONALITIES[0]);
  const [isTyping, setIsTyping] = useState(false);

  const handlePersonalitySelect = async (personality: typeof AI_PERSONALITIES[0]) => {
    setIsTyping(true);
    setSelectedPersonality(personality);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsTyping(false);
  };

  return (
    <section id="ai-personalities" className="py-20 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-pink-50 to-white" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-gradient-to-br from-red-200/20 to-red-300/10 rounded-full blur-3xl animate-float"
              style={{
                width: `${300 + Math.random() * 200}px`,
                height: `${300 + Math.random() * 200}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${20 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 relative z-10">
          <div className="inline-block p-2 bg-red-500/10 rounded-2xl mb-4">
            <Sparkles className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Choose Your Perfect AI Coach
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the coaching style that matches your personality
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          {/* Personality Selection */}
          <div className="lg:col-span-1 space-y-4">
            {AI_PERSONALITIES.map((personality) => (
              <motion.button
                key={personality.id}
                onClick={() => handlePersonalitySelect(personality)}
                className={`w-full p-6 rounded-xl text-left transition-all duration-200 ${
                  selectedPersonality.id === personality.id
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg scale-[1.02]'
                    : 'bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm'
                }`}
              >
                <h3 className="text-lg font-semibold mb-1">{personality.name}</h3>
                <p className={selectedPersonality.id === personality.id ? 'text-white/90' : 'text-gray-600'}>
                  {personality.description}
                </p>
              </motion.button>
            ))}
          </div>

          {/* Chat Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-red-500 to-red-600 text-white">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span className="font-semibold">{selectedPersonality.name} Coach</span>
                </div>
              </div>
              
              <div className="p-6 bg-gradient-to-b from-gray-50/50 to-white min-h-[300px]">
                <div className="flex justify-end mb-4">
                  <div className="bg-red-600 text-white rounded-xl p-4 max-w-[80%]">
                    Can you help me improve my dating profile?
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {isTyping ? (
                    <motion.div
                      key="typing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex"
                    >
                      <div className="bg-white rounded-xl p-4 shadow-md">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="response"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex"
                    >
                      <div className="bg-white rounded-xl p-4 shadow-md max-w-[80%] whitespace-pre-wrap">
                        {selectedPersonality.sampleResponse}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}