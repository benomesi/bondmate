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
            autoScrollPageBottom();
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const autoScrollPageBottom = useCallback(() => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    }, []);


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
            <div className="p-4 bottom-0 z-[10] fixed  md:w-[70%] md:right-[39%] transform translate-x-1/2 w-[100%] right-[50%]">
               
                <div className='border border-gray-300 rounded-xl p-4 bg-white'>

                    <textarea
                            ref={textareaRef}
                            value={input}
                            rows={1}
                            onChange={handleTextareaChange}
                            placeholder={isDisabled ? "Upgrade to continue chatting" : "Type your message..."}
                            disabled={isDisabled}
                            className="w-full p-3 border-none rounded-lg resize-none focus:outline-none focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed font-inter transition-all duration-200 bg-white text-gray-900"
                            style={{
                                height: textareaHeight,
                                minHeight: '14px',
                                maxHeight: '120px'
                            }}
                    />

                    <div className='flex justify-between space-x-4 items-center'>
                        <div className='flex items-center space-x-3'>
                            <button
                                onClick={() => setShowPreferences(true)}
                                className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:opacity-90 transition-colors"
                                title="Customize AI responses"
                            >
                                <Settings className="w-5 h-5" />
                                <span className="text-sm hidden sm:inline">Customize AI</span>
                            </button>
                            {premiumRequired && (
                              <button
                                onClick={() => setIsUpgradeModalOpen(true)}
                                className='flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:opacity-90 transition-colors animate-pulse'
                                >
                                <Crown className="w-5 h-5 text-yellow-400"
                                />
                                <span className="text-sm hidden sm:inline">Upgrade Now</span>
                            </button>
                            )}
                        </div>
                        
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={!input.trim() || isSubmitting}
                            className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {
                                isSubmitting ?
                                   <LoaderPinwheel className='w-5 h-5 animate-spin'/>
                                   : <Send className="w-5 h-5" />
                            }
                            
                        </button>
                    </div>

                </div>

            </div>
        </>
    );
}
