import React, { useState, useEffect, useRef } from 'react';
import { Crown, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { marked } from 'marked';

// Debug flag
const DEBUG = true;

interface Message {
  id: string;
  content: string;
  isAI: boolean;
}

interface SimpleDatingChatProps {
  initialPrompt: string;
  onReset: () => void;
}

// Mock AI responses for testing
const mockResponses = {
  profile: "Here's how to improve your dating profile:\n\n1. **Photos Matter**\n- Use high-quality, recent photos\n- Include a mix of close-up and full-body shots\n- Show yourself doing activities you enjoy\n\n2. **Bio Tips**\n- Keep it positive and authentic\n- Share specific interests and passions\n- Add a clear call-to-action\n\nWould you like specific tips for your photos or bio?",
  messages: "Let's craft engaging messages that get responses:\n\n1. **Opening Lines**\n- Reference something from their profile\n- Ask an open-ended question\n- Use humor appropriately\n\n2. **Follow-up Tips**\n- Show genuine interest\n- Share related experiences\n- Keep the conversation flowing\n\nWould you like example messages to try?",
  dates: "Here are some creative date ideas:\n\n1. **Active Dates**\n- Cooking class together\n- Outdoor adventure\n- Art gallery visit\n\n2. **Planning Tips**\n- Choose interactive activities\n- Consider their interests\n- Have a backup plan\n\nWould you like more specific date suggestions?",
  default: "I understand you want to improve your dating life. Let's break this down:\n\n1. **First Steps**\n- Clarify your dating goals\n- Identify areas for improvement\n- Create an action plan\n\n2. **Next Steps**\n- Implement specific strategies\n- Track your progress\n- Adjust as needed\n\nWhat specific aspect would you like to focus on?"
};

function getMockResponse(prompt: string): string {
  const promptLower = prompt.toLowerCase();
  if (promptLower.includes('profile')) return mockResponses.profile;
  if (promptLower.includes('message')) return mockResponses.messages;
  if (promptLower.includes('date')) return mockResponses.dates;
  return mockResponses.default;
}

export function SimpleDatingChat({ initialPrompt, onReset }: SimpleDatingChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Debug mount
  useEffect(() => {
    if (DEBUG) console.log('SimpleDatingChat: mounted', { initialPrompt });
  }, []);

  // Process initial prompt
  useEffect(() => {
    if (initialPrompt && messages.length === 0) {
      if (DEBUG) console.log('SimpleDatingChat: processing initial prompt', { initialPrompt });
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  // Scroll to bottom effect
  useEffect(() => {
    if (DEBUG) console.log('SimpleDatingChat: scrolling to bottom', { messageCount: messages.length });
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (DEBUG) console.log('SimpleDatingChat: handleSendMessage', { content });
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isAI: false
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse = getMockResponse(content);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        isAI: true
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    handleSendMessage(inputMessage);
  };

  if (DEBUG) {
    console.log('SimpleDatingChat: render', { 
      messageCount: messages.length,
      isTyping,
      hasInput: !!inputMessage
    });
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-red-600 to-red-500 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5" />
          <span className="font-semibold">AI Dating Coach</span>
        </div>
        <button
          onClick={onReset}
          className="px-3 py-1 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
        >
          New Chat
        </button>
      </div>

      {/* Messages */}
      <div className="h-[400px] overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
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

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || isTyping}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}