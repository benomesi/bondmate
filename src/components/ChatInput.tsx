import React, { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Settings } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import { trackMessage } from '../lib/analytics';
import { useAppSelector } from '../hooks/useAppSelector';
import { PreferencesModal } from './PreferencesModal';

export function ChatInput({ relationshipId }: { relationshipId: string }) {
  const [input, setInput] = useState('');
  const [textareaHeight, setTextareaHeight] = useState('auto');
  const [showPreferences, setShowPreferences] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage, isSubmitting } = useChat(relationshipId);
  const { isPremium, messageCount, darkMode } = useAppSelector((state) => state.app);

  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    setInput(textarea.value);
    
    requestAnimationFrame(() => {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 120);
      setTextareaHeight(`${newHeight}px`);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSubmitting) return;
    if (!isPremium && messageCount >= 10) return;

    try {
      await sendMessage(input);
      setInput('');
      trackMessage();
      setTextareaHeight('auto');
      
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const isDisabled = isSubmitting || (!isPremium && messageCount >= 10);

  return (
    <>
      <PreferencesModal 
        isOpen={showPreferences}
        onClose={() => setShowPreferences(false)}
      />
      
      <div className={`p-4 border-t border-gray-200 dark:border-gray-700 ${
        darkMode ? 'bg-gray-800/95' : 'bg-white/95'
      } backdrop-blur-sm`}>
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <motion.button
            onClick={() => setShowPreferences(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:opacity-90 transition-colors"
            title="Customize AI responses"
          >
            <Settings className="w-5 h-5" />
            <span className="text-sm hidden sm:inline">Customize AI</span>
          </motion.button>

          <form onSubmit={handleSubmit} className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder={isDisabled ? "Upgrade to continue chatting" : "Type your message..."}
              disabled={isDisabled}
              className={`w-full p-3 pr-12 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-inter transition-all duration-200 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'
              }`}
              style={{
                height: textareaHeight,
                minHeight: '24px',
                maxHeight: '120px'
              }}
            />
            <motion.button
              type="submit"
              disabled={!input.trim() || isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </form>
        </div>
      </div>
    </>
  );
}