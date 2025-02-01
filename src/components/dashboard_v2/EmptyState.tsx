import {  Plus } from 'lucide-react';
import { useAppSelector } from '../../hooks/useAppSelector';

interface EmptyStateProps {
    hasRelationships: boolean;
    onAddRelationship: () => void;
}

export function EmptyState({onAddRelationship }: EmptyStateProps) {
    const relationships = useAppSelector((state) => state.app.relationships);
    const hasRelationships = relationships.length > 0;
    
    return (
    <div className='h-screen flex pt-[20%] justify-center'>
        <div className="max-w-2xl mx-auto p-4">
            <div className="text-center">
                <h2 className="text-4xl font-medium mb-3 text-gray-900">
                    {hasRelationships ? 'Select a Relationship' : 'Add your first relationship'}
                </h2>
                <p className="text-gray-500 mt-8 text-[1.4rem]">
                    {hasRelationships 
                        ? 'Choose a relationship from the sidebar to start chatting and get personalized advice'
                        : 'Start by adding someone important in your life to get personalized relationship advice'
                    }
                </p>
                {!hasRelationships && (
                    <button
                        onClick={onAddRelationship}
                        className="mt-14 px-12 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:opacity-90 transition-colors inline-flex items-center opacity-75"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Relationship
                    </button>
                )}
            </div>
        </div>
        </div>
    );
}
