import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, MessageSquare, Trophy } from 'lucide-react';
import { useChat } from '../context/ChatContext';

export function DatingHeroSection() {
  const { state, sendMessage } = useChat();
  const [message, setMessage] = useState('');
  const [textareaHeight, setTextareaHeight] = useState('auto');

  // Debounced textarea resize
  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    setMessage(textarea.value);
    
    requestAnimationFrame(() => {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 120);
      if (newHeight !== parseInt(textareaHeight)) {
        setTextareaHeight(`${newHeight}px`);
      }
    });
  }, [textareaHeight]);

  const scrollToChatSection = () => {
    const chatCompanion = document.getElementById('ai-chat-companion');
    if (chatCompanion) {
      const yOffset = -80;
      const y = chatCompanion.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ 
        top: y, 
        behavior: 'smooth' 
      });
      return true;
    }
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || state.isTyping) return;
    
    if (scrollToChatSection()) {
      setTimeout(() => {
        sendMessage(message);
        setMessage('');
        setTextareaHeight('auto');
      }, 500);
    }
  };

  const handleQuickAction = (prompt: string) => {
    if (scrollToChatSection()) {
      setTimeout(() => {
        sendMessage(prompt);
      }, 500);
    }
  };

  return (
    <section className="relative min-h-[85vh] bg-gradient-to-br from-white to-gray-50 flex items-center pt-16">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-red-100/50 rounded-full blur-3xl"
              style={{
                width: `${300 + Math.random() * 200}px`,
                height: `${300 + Math.random() * 200}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: 'translate(-50%, -50%)',
                animation: `float ${15 + Math.random() * 10}s ease-in-out infinite alternate`
              }}
            />
          ))}
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12">
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-poppins font-extrabold text-gray-900 mb-2"
          >
            Master Dating,
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-poppins font-extrabold text-gray-900 mb-2"
          >
            Instantly
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-poppins font-extrabold text-gray-900 mb-4"
          >
            With AI.
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-base sm:text-lg max-w-sm mx-auto font-bold text-red-600"
          >
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col items-center mt-6 mb-8"
          >
            <div className="text-lg sm:text-xl font-bold text-red-600 mb-2">
              Need better matches, messages, or dates?
            </div>
            <div className="text-base sm:text-lg text-gray-700">
              Ask your first question below
            </div>
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 20 20" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-red-500 mt-4 animate-bounce"
            >
              <path 
                d="M10 15L3.66987 7.5L16.3301 7.5L10 15Z" 
                fill="currentColor"
              />
            </svg>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-red-100">
              <form onSubmit={handleSubmit} className="relative mb-6">
                <textarea
                  value={message}
                  onChange={handleTextareaChange}
                  placeholder="Ask me anything about dating..."
                  className="w-full p-4 pr-14 bg-gray-50 border border-red-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none font-inter text-base shadow-inner"
                  style={{ height: textareaHeight }}
                />
                <button 
                  type="submit"
                  disabled={!message.trim() || state.isTyping}
                  className="absolute top-1/2 -translate-y-1/2 right-3 p-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:opacity-90 transition-all duration-200 disabled:opacity-50 transform hover:scale-105"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="text-center mb-4 text-gray-600">
                Or try one of these:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    icon: Heart,
                    title: 'Perfect Your Profile',
                    description: 'Get more matches with expert tips',
                    prompt: 'How can I make my dating profile stand out and attract better matches?'
                  },
                  {
                    icon: MessageSquare,
                    title: 'Craft Better Messages',
                    description: 'Write messages that get replies',
                    prompt: 'Help me write engaging messages that start great conversations'
                  },
                  {
                    icon: Trophy,
                    title: 'Plan Amazing Dates',
                    description: 'Create memorable experiences',
                    prompt: "What are some creative and fun date ideas that will make a great impression?"
                  }
                ].map((action) => (
                  <motion.button
                    key={action.title}
                    onClick={() => handleQuickAction(action.prompt)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 group border border-red-100 hover:border-red-200"
                  >
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className="p-3 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
                        <action.icon className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 mb-1 font-inter">{action.title}</div>
                        <div className="text-xs text-gray-600 font-inter">{action.description}</div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Metrics */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-wrap justify-center items-center gap-8 mt-4"
          >
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="text-2xl font-bold text-gray-900 font-inter">3x</span>
              <span className="text-gray-900 font-semibold font-inter">More Matches</span>
            </div>
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-red-500" />
              <span className="text-2xl font-bold text-gray-900 font-inter">85%</span>
              <span className="text-gray-900 font-semibold font-inter">Better Conversations</span>
            </div>
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-red-500" />
              <span className="text-2xl font-bold text-gray-900 font-inter">10k+</span>
              <span className="text-gray-900 font-semibold font-inter">Success Stories</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}