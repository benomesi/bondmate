import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send } from 'lucide-react';

// Debug flag
const DEBUG = true;

interface DatingDemoProps {
  initialPrompt: string;
  onReset: () => void;
}

interface Message {
  id: string;
  content: string;
  isAI: boolean;
}

export function DatingDemo({ initialPrompt, onReset }: DatingDemoProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  // Debug mount
  useEffect(() => {
    if (DEBUG) {
      console.log('DatingDemo mounted', { initialPrompt });
    }
  }, []);

  // Process initial prompt
  useEffect(() => {
    if (initialPrompt && messages.length === 0) {
      handleSubmit(initialPrompt);
    }
  }, [initialPrompt]);

  // Auto-scroll effect
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (content: string = input) => {
    if (!content.trim()) return;

    if (DEBUG) {
      console.log('DatingDemo: handleSubmit', { content });
    }

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      content: content.trim(),
      isAI: false
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: "Thanks for your message! This is a demo response. In the full version, you'll get personalized AI coaching for all your dating questions.",
        isAI: true
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  if (DEBUG) {
    console.log('DatingDemo rendering', {
      messageCount: messages.length,
      isTyping
    });
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-red-500 to-red-600 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          <span className="font-semibold font-poppins">AI Dating Coach</span>
        </div>
        <button
          onClick={onReset}
          className="text-sm px-3 py-1 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
        >
          New Chat
        </button>
      </div>

      {/* Chat Area */}
      <div 
        ref={chatRef}
        className="h-[500px] overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50 to-white"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isAI ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-4 ${
                message.isAI 
                  ? 'bg-white text-gray-900 shadow-md' 
                  : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl p-4 shadow-md">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="p-4 border-t flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}