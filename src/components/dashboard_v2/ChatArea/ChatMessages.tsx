import { useCallback, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { marked } from 'marked';
import { useChat } from '../../../hooks/useChat';
import { endChatSession, startChatSession } from '../../../lib/analytics';
import { useAppSelector } from '../../../hooks/useAppSelector';
import scrollIntoView from 'scroll-into-view-if-needed'

interface MessageProps {
    message: {
        id: string;
        content: string;
        isAI: boolean;
    }
}

function Message({ message }: MessageProps) {
    const aiClass = message.id === 'error' ? 'border-red-300 border bg-white text-gray-700 shadow-sm w-full' : 'bg-white text-gray-700 shadow-sm border border-gray-100' 
    return (
        <div
            className={`flex ${message.isAI ? 'justify-start' : 'justify-end'} mb-2`}
            // layout
        >
            <div
                className={`max-w-[85%] rounded-xl p-4 ${
                    message.isAI 
                        ? aiClass 
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
        </div>
    );
}

export function ChatMessages({ relationshipId }: { relationshipId: string }) {
    const { messages, isSubmitting } = useChat(relationshipId);
    const {temporaryMessage} = useAppSelector((state) => state.app);
    const bottomRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        startChatSession();
        return () => {
            endChatSession();
        };
    }, []);
    const scrollToBottom = useCallback(() => {
        if (bottomRef.current) {
          scrollIntoView(bottomRef.current, {
            scrollMode: 'if-needed',
            block: 'end',
            inline: 'nearest',
            behavior: 'smooth',
          });
        }
      }, [bottomRef]); 
    useEffect(() => {
        scrollToBottom();
    }, [scrollToBottom, temporaryMessage, isSubmitting ]);
    return (
        <div className="chat-container flex-1 overflow-y-auto px-8 sm:px-4 py-4 space-y-2">
            <AnimatePresence mode="popLayout">
                {messages.map((message) => (
                    <Message 
                        key={message.id} 
                        message={message}
                    />
                ))}
                {temporaryMessage && (
                    <Message 
                        key={temporaryMessage.id} 
                        message={temporaryMessage}
                    />
                )}
                
                
            </AnimatePresence>
            <div 
                className="pb-[8rem]"
            ref={bottomRef} />
        </div>
    );
}