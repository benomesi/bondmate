import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Crown, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { marked } from 'marked';
import { getDemoResponse } from '../../shared/lib/demoOpenAI';
import type { DemoConfig, FollowUpSuggestion } from '../../shared/lib/demoOpenAI';
import { ErrorBoundary } from '../../../../components/ErrorBoundary';

interface DemoChatProps {
  initialPrompt: string;
  onReset: () => void;
  config: DemoConfig;
  signUpCta: {
    text: string;
    buttonText: string;
    path: string;
  };
}

interface Message {
  id: string;
  content: string;
  isAI: boolean;
  suggestions?: FollowUpSuggestion[];
}

export function DemoChat({
  initialPrompt,
  onReset,
  config,
  signUpCta
}: DemoChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPrompt) {
      handleSubmit(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  const handleSubmit = async (content: string = currentMessage) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      isAI: false
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);
    setError(null);

    try {
      const response = await getDemoResponse(content, config);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        isAI: true,
        suggestions: response.suggestions
      };

      setMessages(prev => [...prev, aiMessage]);
      setInteractionCount(prev => prev + 1);
    } catch (err) {
      console.error('Chat error:', err);
      setError(err instanceof Error ? err.message : 'Failed to get response. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-red-600 to-red-500 text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5" />
          <span className="font-semibold font-poppins">AI Dating Coach</span>
        </div>
        <button
          onClick={onReset}
          className="text-sm px-3 py-1 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
        >
          New Chat
        </button>
      </div>

      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
      >
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.isAI ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-4 ${
                message.isAI 
                  ? 'bg-white text-gray-900 shadow-md' 
                  : 'bg-red-600 text-white'
              }`}
            >
              <div 
                className="prose prose-sm"
                dangerouslySetInnerHTML={{ __html: marked(message.content) }}
              />
              
              {message.isAI && message.suggestions && message.suggestions.length > 0 && (
                <div className="mt-4 space-y-2">
                  {message.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSubmit(suggestion.text)}
                      className="block w-full text-left text-sm p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-gray-700 border border-gray-100"
                    >
                      {suggestion.text}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white rounded-2xl p-4 max-w-[80%] shadow-md">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <div className="text-red-500 text-center text-sm">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {interactionCount >= 3 ? (
        <div className="p-4 bg-gray-50 border-t shrink-0">
          <div className="text-center space-y-3">
            <p className="text-gray-600">{signUpCta.text}</p>
            <Link
              to={signUpCta.path}
              className="inline-block px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              {signUpCta.buttonText}
            </Link>
          </div>
        </div>
      ) : (
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="p-4 border-t flex gap-2 shrink-0"
        >
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            type="submit"
            disabled={!currentMessage.trim() || isTyping}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      )}
    </div>
  );
}