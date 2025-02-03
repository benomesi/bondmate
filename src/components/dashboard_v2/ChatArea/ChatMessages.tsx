import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { marked } from 'marked';
import { useChat } from '../../../hooks/useChat';
import { endChatSession, startChatSession } from '../../../lib/analytics';

interface MessageProps {
    message: {
        id: string;
        content: string;
        isAI: boolean;
    }
}

function Message({ message }: MessageProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`flex ${message.isAI ? 'justify-start' : 'justify-end'} mb-2`}
            layout
        >
            <div
                className={`max-w-[85%] rounded-xl p-4 ${
                    message.isAI 
                        ? 'bg-white text-gray-700 shadow-sm border border-gray-100' 
                        : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                }`}
            >
                <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ 
                        __html: marked(message.content) as string
                    }}
                />
            </div>
        </motion.div>
    );
}

export function ChatMessages({ relationshipId }: { relationshipId: string }) {
    const { messages, isSubmitting } = useChat(relationshipId);

    useEffect(() => {
        startChatSession();
        return () => {
            endChatSession();
        };
    }, []);

    return (
        <div className="chat-container flex-1 overflow-y-auto px-8 sm:px-4 py-4 space-y-2 pb-[8.5rem]">
            <AnimatePresence mode="popLayout">
                {messages.map((message) => (
                    <Message 
                        key={message.id} 
                        message={message}
                    />
                ))}
                
                {isSubmitting && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex justify-start"
                    >
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                            <div className="flex space-x-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}