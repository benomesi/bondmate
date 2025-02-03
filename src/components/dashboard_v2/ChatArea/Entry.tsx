import { Crown } from 'lucide-react';
import { ChatInput } from './ChatInput';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { EmptyState } from '../EmptyState';
import { ChatMessages } from './ChatMessages';

const titleCase = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function ChatArea() {
    const {
        selectedRelationship,
        error,
        messageCount,
        isPremium,
    } = useAppSelector((state) => state.app);
    const relationshipType = titleCase(selectedRelationship?.type || '');
    const onUpgrade = () => {};

    if (!selectedRelationship) {
        return <EmptyState hasRelationships={false} onAddRelationship={() => {}} />;
    }

    return (
        <div className="relative flex-1 flex flex-col min-h-0">
            {/* Chat Header */}
            <div className="p-4 md:px-8 md:p-6 border-b bg-white/95 border-gray-200 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto flex items-center justify-between">                    
                    <div className='space-y-3'>
                        <h2 className="text-2xl font-medium text-gray-900">
                            {titleCase(selectedRelationship?.name)}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {relationshipType} Relationship
                        </p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 flex items-center justify-between">
                    <div className="flex-1">{error}</div>
                    {!isPremium && messageCount >= 10 && (
                        <button
                            onClick={onUpgrade}
                            className="ml-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:opacity-90 transition-colors flex items-center space-x-2 shadow-lg"
                        >
                            <Crown className="w-4 h-4" />
                            <span>Upgrade Now</span>
                        </button>
                    )}
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-hidden">
                <ChatMessages relationshipId={selectedRelationship.id} />
            </div>

            {/* Message Input */}
            <ChatInput relationshipId={selectedRelationship.id} />
        </div>
    );
}