import { useAppSelector } from '../../hooks/useAppSelector';
import ChatArea from './ChatArea/Entry';
import { EmptyState } from './EmptyState';
import { RelationshipModal } from '../RelationshipModal';
import { useState } from 'react';

export const DashboardInterface = () => {
    const {selectedRelationship, relationships} = useAppSelector((state) => state.app);
    const [isRelationshipModalOpen, setIsRelationshipModalOpen] = useState(false);
    
    return (
        <div className="flex-1 flex flex-col min-h-0">
            {selectedRelationship ? (
                <ChatArea />
            ) : (
                <EmptyState
                    hasRelationships={relationships.length > 0}
                    onAddRelationship={() => setIsRelationshipModalOpen(true)}
                />
            )}

            <RelationshipModal
                isOpen={isRelationshipModalOpen}
                onClose={() => setIsRelationshipModalOpen(false)}
            />
        </div>
    );
}