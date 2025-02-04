import React, { useState, useCallback, useRef } from 'react';
import { LoaderPinwheel, Send, Settings, Crown } from 'lucide-react';
import { useChat } from '../../../hooks/useChat';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { trackMessage } from '../../../lib/analytics';
import { PreferencesModal } from '../../PreferencesModal';
import { UpgradeModal } from '../../UpgradeModal';

export function ChatInput({ relationshipId }: { relationshipId: string }) {
    const [input, setInput] = useState('');
    const [textareaHeight, setTextareaHeight] = useState('auto');
    const [showPreferences, setShowPreferences] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { sendMessage, isSubmitting } = useChat(relationshipId);
    const { isPremium, messageCount } = useAppSelector((state) => state.app);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

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
    const premiumRequired = !isPremium && messageCount >= 10;

    return (
        <>
         <PreferencesModal 
                    isOpen={showPreferences}
                    onClose={() => setShowPreferences(false)}
                />
                <UpgradeModal
                    isOpen={isUpgradeModalOpen}
                    onClose={() => setIsUpgradeModalOpen(false)}
                />
            <div className="fixed bottom-0 lg:left-[25%] md:left-[34%] right-0 bg-white border-t border-gray-200 chat-container w-screen md:w-[66%] lg:w-auto -z-[10]">
               
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 flex-col ">
                            <button
                                onClick={() => setShowPreferences(true)}
                                className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:opacity-90 transition-colors"
                                title="Customize AI responses"
                            >
                                <Settings className="w-5 h-5" />
                                <span className="text-sm hidden lg:inline">Customize AI</span>
                            </button>
                            {premiumRequired && (
                                <button
                                    onClick={() => setIsUpgradeModalOpen(true)}
                                    className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:opacity-90 transition-colors animate-pulse"
                                >
                                    <Crown className="w-5 h-5 text-yellow-400" />
                                    <span className="text-sm hidden lg:inline">Upgrade Now</span>
                                </button>
                            )}
                        </div>

                        <div className="flex-1 relative">
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={handleTextareaChange}
                                onKeyDown={handleKeyDown}
                                placeholder={isDisabled ? "Upgrade to continue chatting" : "Type your message..."}
                                disabled={isDisabled}
                                className="w-full p-3 pr-12 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-inter transition-all duration-200 bg-white text-gray-900"
                                style={{
                                    height: textareaHeight,
                                    minHeight: '24px',
                                    maxHeight: '120px'
                                }}
                            />
                            <button
                                onClick={handleSubmit}
                                disabled={!input.trim() || isSubmitting}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 
                                    <LoaderPinwheel className="w-5 h-5 animate-spin"/> : 
                                    <Send className="w-5 h-5" />
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}