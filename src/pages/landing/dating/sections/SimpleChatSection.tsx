import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Settings, Maximize, Target, TrendingUp, Minimize } from 'lucide-react';
import { Link } from 'react-router-dom';
import { marked } from 'marked';
import { useChat } from '../context/ChatContext';
import { PreferencesModal } from '../components/PreferencesModal';

const PLACEHOLDER = {
  MOBILE: 'Type your message...',
  DESKTOP: 'Ask anything about dating (e.g., "How do I make my profile stand out?")'
};

interface FullscreenChatProps {
  onClose: () => void;
}

const FullscreenChat = ({ onClose }: FullscreenChatProps) => {
  const { state, dispatch, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [state.messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.input.trim() || state.isTyping) return;
    sendMessage(state.input);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    dispatch({ type: 'SET_INPUT', payload: textarea.value });
    
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            <span className="font-semibold">AI Dating Coach</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <Minimize className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white">
          <div className="space-y-4">
            {state.messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.isAI ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 shadow-lg ${
                    message.isAI 
                      ? 'bg-white text-gray-900' 
                      : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                  }`}
                >
                  <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: marked(message.content) }}
                  />
                </div>
              </motion.div>
            ))}

            {state.isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-white rounded-2xl p-4 shadow-md">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-white rounded-b-2xl">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <textarea
              ref={textareaRef}
              value={state.input}
              onChange={handleTextareaChange}
              placeholder="Type your message..."
              className="flex-1 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
              style={{
                minHeight: '24px',
                maxHeight: '120px'
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <button
              type="submit"
              disabled={!state.input.trim() || state.isTyping}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export function SimpleChatSection() {
  const { state, dispatch, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [windowWidth, setWindowWidth] = useState(0);
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.input.trim() || state.isTyping) return;
    sendMessage(state.input);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    dispatch({ type: 'SET_INPUT', payload: textarea.value });
    
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  useEffect(() => {
    if (messagesEndRef.current && chatContainerRef.current) {
      const container = chatContainerRef.current;
      const scrollOptions = {
        top: container.scrollHeight,
        behavior: 'smooth' as ScrollBehavior
      };
      container.scrollTo(scrollOptions);
    }
  }, [state.messages, state.isTyping]);

  return (
    <section id="ai-chat-companion" className="py-20 relative overflow-hidden">
      {/* Enhanced Gradient Background */}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-[2]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Value Props */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-red-600 to-red-500 text-transparent bg-clip-text">
                Your Personal AI Dating Coach
              </h2>
              <p className="text-xl text-gray-600">
                Get tailored advice on your profile, messages, and date ideas—instantly! Our AI coach is here to help you succeed in modern dating.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
                  <span>Available 24/7</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2" />
                  <span>Personalized Advice</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse mr-2" />
                  <span>Data-Driven Results</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm">
                <div className="p-2 bg-red-100 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Always Online</h3>
                  <p className="text-gray-600">Get expert advice – day or night</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Target className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Personalized Strategy</h3>
                  <p className="text-gray-600">Tailored advice for your unique situation</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm">
                <div className="p-2 bg-red-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Proven Results</h3>
                  <p className="text-gray-600">Data-driven methods that work</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Chat Interface */}
          <div className="lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="p-4 bg-gradient-to-r from-red-500 to-red-600 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  <span className="font-semibold">AI Dating Coach</span>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => setShowPreferences(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    title="Customize AI responses"
                  >
                    <Settings className="w-5 h-5" />
                  </motion.button>
                  <button
                    onClick={() => {
                      dispatch({ type: 'SET_FULLSCREEN', payload: true });
                      document.body.style.overflow = 'hidden';
                    }}
                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <Maximize className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div 
                ref={chatContainerRef}
                className="h-[500px] overflow-y-auto bg-gradient-to-b from-gray-50 to-white relative"
              >
                <div className="p-6 space-y-4 min-h-full">
                  {state.messages.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-center p-8">
                      <div className="space-y-4">
                        <div className="text-4xl mb-2">👋 💬 💪</div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          Your AI Dating Coach is Ready!
                        </h3>
                        <p className="text-gray-600 max-w-md">
                          Ask anything about dating - from profile optimization to conversation strategies. I'm here to help you succeed!
                        </p>
                      </div>
                    </div>
                  )}

                  {state.messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.isAI ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-200 ${
                          message.isAI 
                            ? 'bg-white text-gray-900 border border-gray-100' 
                            : 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-500/20'
                        }`}
                      >
                        <div 
                          className="prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: marked(message.content) }}
                        />
                      </div>
                    </motion.div>
                  ))}

                  {state.isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white rounded-2xl p-4 shadow-md">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div className="p-4 border-t border-gray-100 bg-white/95 backdrop-blur-sm shadow-lg">
                {state.showUpgradePrompt ? (
                  <div className="text-center space-y-4">
                    <p className="text-gray-600">
                      Ready to unlock unlimited coaching? Get personalized guidance for all your dating needs.
                    </p>
                    <Link
                      to="/auth/sign-up"
                      className="inline-block px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:opacity-90 transition-colors"
                    >
                      Start Free Trial
                    </Link>
                    <p className="text-sm text-gray-500">
                      No credit card required
                    </p>
                  </div>
                ) : (
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <div className="flex-1 relative">
                    <textarea
                      ref={textareaRef}
                      value={state.input}
                      onChange={handleTextareaChange}
                      placeholder={windowWidth < 768 ? PLACEHOLDER.MOBILE : PLACEHOLDER.DESKTOP}
                      className="w-full p-3 pr-12 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-500 font-inter transition-all duration-200"
                      style={{
                        minHeight: '24px',
                        maxHeight: '120px'
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit(e);
                        }
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!state.input.trim() || state.isTyping}
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:opacity-90 transition-all duration-200 disabled:opacity-50 flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />

      <AnimatePresence>
        {state.isFullscreen && (
          <FullscreenChat 
            onClose={() => {
              dispatch({ type: 'SET_FULLSCREEN', payload: false });
              document.body.style.overflow = '';
            }} 
          />
        )}
        {showPreferences && (
          <PreferencesModal
            isOpen={showPreferences}
            onClose={() => setShowPreferences(false)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}