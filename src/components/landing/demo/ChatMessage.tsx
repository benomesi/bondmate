import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { marked } from 'marked';

interface ChatMessageProps {
  content: string;
  isAI?: boolean;
  showTypingIndicator?: boolean;
}

export function ChatMessage({ content, isAI = false, showTypingIndicator = false }: ChatMessageProps) {
  if (showTypingIndicator) {
    return (
      <div className="flex items-start space-x-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-100 rounded-2xl p-4 shadow-md"
        >
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
          </div>
        </motion.div>
      </div>
    );
  }

  if (isAI) {
    return (
      <div className="flex items-start space-x-2">
        <MessageCircle className="w-6 h-6 text-blue-600 mt-2" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-100 rounded-2xl p-6 max-w-[80%] shadow-md prose prose-sm"
          dangerouslySetInnerHTML={{ __html: marked(content).trim() }}
        />
      </div>
    );
  }

  return (
    <div className="flex justify-end">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl p-4 max-w-[85%] shadow-lg relative"
      >
        <p>{content}</p>
        <div className="absolute bottom-0 right-0 transform translate-y-1/2 translate-x-1/2">
          <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-indigo-500 transform rotate-45" />
        </div>
      </motion.div>
    </div>
  );
}