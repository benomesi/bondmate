import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, MessageSquare, Trophy } from 'lucide-react';
import { useChat } from '../context/ChatContext';

const QUICK_ACTIONS = [
  {
    icon: MessageSquare,
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
    icon: MessageSquare,
    title: 'Plan Amazing Dates',
    description: 'Create memorable experiences',
    prompt: "What are some creative and fun date ideas that will make a great impression?"
  }
];

export function DatingHeroSection() {
  const { state, sendMessage } = useChat();
  const [message, setMessage] = useState('');
  const [textareaHeight, setTextareaHeight] = useState('auto');

  // Debounced textarea resize
  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    setMessage(textarea.value);
    
    // Use requestAnimationFrame for smooth height adjustment
    requestAnimationFrame(() => {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 200);
      if (newHeight !== parseInt(textareaHeight)) {
        setTextareaHeight(`${newHeight}px`);
      }
    });
  }, [textareaHeight]);

  const handleQuickAction = (prompt: string) => {
    const chatCompanion = document.getElementById('ai-chat-companion');
    if (chatCompanion) {
      const yOffset = -80;
      const y = chatCompanion.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ 
        top: y, 
        behavior: 'smooth' 
      });
      setTimeout(() => {
        sendMessage(prompt).catch(console.error);
      }, 500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || state.isTyping) return;
    
    const chatCompanion = document.getElementById('ai-chat-companion');
    if (chatCompanion) {
      const yOffset = -80;
      const y = chatCompanion.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ 
        top: y, 
        behavior: 'smooth' 
      });
      setTimeout(() => {
        sendMessage(message).catch(console.error);
      }, 500);
    }
    setMessage('');
    setTextareaHeight('auto');
  };

  return (
    <section className="relative min-h-[85vh] bg-gradient-to-br from-white to-gray-50 flex items-center">
      {/* Optimized Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-red-100/50 rounded-full blur-3xl will-change-transform"
              style={{
                width: `${300 + Math.random() * 200}px`,
                height: `${300 + Math.random() * 200}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: 'translate3d(-50%, -50%, 0)',
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
            className="text-4xl md:text-5xl lg:text-6xl font-poppins font-extrabold text-gray-900 mb-4"
          >
            Master Dating, Instantly.
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-base sm:text-lg max-w-sm mx-auto font-bold text-red-600"
          >
            Need better matches, messages, or dates? Let AI take the lead.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="max-w-2xl mx-auto mt-8 mb-4"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-red-100">
              <form onSubmit={handleSubmit} className="relative mb-6">
                <textarea
                  value={message}
                  onChange={handleTextareaChange}
                  placeholder="What's your dating challenge? Type here to get expert advice. (e.g. 'What do I do when a girl ghosts me?')"
                  className="w-full p-4 pr-16 bg-gray-50 border border-red-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none font-inter text-base will-change-transform"
                  style={{ 
                    height: textareaHeight,
                    transform: 'translateZ(0)',
                    WebkitOverflowScrolling: 'touch'
                  }}
                />
                <button 
                  type="submit"
                  disabled={!message.trim()}
                  className="absolute top-1/2 -translate-y-1/2 right-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 flex items-center gap-2 font-poppins will-change-transform"
                  style={{ transform: 'translate3d(0, -50%, 0)' }}
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {QUICK_ACTIONS.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <motion.button
                      key={action.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                      onClick={() => handleQuickAction(action.prompt)}
                      className="flex flex-col items-center text-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-red-100"
                    >
                      <Icon className="w-6 h-6 text-red-500 mb-2" />
                      <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex justify-center gap-8 mt-8"
          >
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="text-sm text-gray-600">95% Match Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-red-500" />
              <span className="text-sm text-gray-600">10x More Replies</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-red-500" />
              <span className="text-sm text-gray-600">Better Dates</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}