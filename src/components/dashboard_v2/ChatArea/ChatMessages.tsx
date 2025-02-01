import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { marked } from 'marked';
import { useChat } from '../../../hooks/useChat';
// import { useAppSelector } from '../../../hooks/useAppSelector';
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
                className={`rounded-xl text-sm  leading-[1.6rem] ${
                    message.isAI 
                        ? 'text-gray-700 font-normal max-w-[85%] my-[1.5rem] '
                        : 'bg-gray-100 max-w-[65%] font-normal'
                }`}
            >
                <div 
                    className="p-4"
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
    console.log(isSubmitting)
    // Start chat session when component mounts
    useEffect(() => {
        startChatSession();
        return () => {
            endChatSession();
        };
    }, []);

    return (
        <div 
            className="flex-1 overflow-y-auto px-8 sm:px-4 py-4 space-y-2 pb-[8.5rem]"
        >
            <AnimatePresence mode="popLayout">
                {messages.map((message) => (
                    <Message 
                        key={message.id} 
                        message={message}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}
