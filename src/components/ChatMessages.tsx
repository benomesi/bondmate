import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { marked } from 'marked';
import { useChat } from '../hooks/useChat';
import { useAppSelector } from '../hooks/useAppSelector';
import { startChatSession, endChatSession } from '../lib/analytics';

interface MessageProps {
  message: any;
  darkMode: boolean;
}

function Message({ message, darkMode }: MessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex ${message.isAI ? 'justify-start' : 'justify-end'} mb-2`}
      layout
    >
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-xl p-2.5 ${
          message.isAI 
            ? darkMode
              ? 'bg-gray-800 text-white border border-gray-700'
              : 'bg-white text-gray-900 border border-gray-100'
            : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
        }`}
      >
        <div 
          className="prose prose-sm max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ 
            __html: marked(message.content)
          }}
        />
      </div>
    </motion.div>
  );
}

export function ChatMessages({ relationshipId }: { relationshipId: string }) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { messages, isSubmitting } = useChat(relationshipId);
  const { darkMode } = useAppSelector((state) => state.app);
  const [hasInitialScroll, setHasInitialScroll] = useState(false);

  // Calculate available height for messages
  const [containerHeight, setContainerHeight] = useState('calc(100vh - 180px)');

  useEffect(() => {
    const updateHeight = () => {
      const headerHeight = 64; // Height of the header
      const inputHeight = 80; // Height of the input area
      const spacing = 36; // Additional spacing/padding
      const newHeight = window.innerHeight - (headerHeight + inputHeight + spacing);
      setContainerHeight(`${newHeight}px`);
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // Start chat session when component mounts
  useEffect(() => {
    startChatSession();
    return () => {
      endChatSession();
    };
  }, []);

  // Initial scroll to bottom
  useEffect(() => {
    if (!hasInitialScroll && messages.length > 0 && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
      setHasInitialScroll(true);
    }
  }, [messages, hasInitialScroll]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (messagesEndRef.current && containerRef.current) {
      const container = containerRef.current;
      const shouldAutoScroll = 
        container.scrollHeight - container.scrollTop - container.clientHeight < 100;

      if (shouldAutoScroll) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [messages, isSubmitting]);

  return (
    <div 
      ref={containerRef}
      className={`flex-1 overflow-y-auto overscroll-y-contain px-2 sm:px-4 py-4 space-y-2 ${
        darkMode ? 'bg-gray-900' : 'bg-blue-50'
      }`}
      style={{ 
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'thin',
        scrollbarColor: darkMode ? '#4B5563 #1F2937' : '#93C5FD #EFF6FF',
        height: containerHeight,
        maxHeight: '100%'
      }}
    >
      <AnimatePresence mode="popLayout">
        {messages.map((message) => (
          <Message 
            key={message.id} 
            message={message}
            darkMode={darkMode}
          />
        ))}
        
        {isSubmitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-start"
          >
            <div className={`rounded-xl p-3 shadow-md ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div ref={messagesEndRef} className="h-0" />
    </div>
  );
}