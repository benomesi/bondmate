import { MessageSquare, Plus } from 'lucide-react';
import { AuthUserDetails } from './AuthUserDetails';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { RelationshipButton } from './RelationshipButton';
import RemainingMessages from './RemainingMessages';
import { useAppSelector } from '../../hooks/useAppSelector';
import { RelationshipModal } from '../RelationshipModal';
import { Menu } from 'lucide-react';
import { X } from 'lucide-react';

type RelationshipGroup = {
    [key: string]: {
        label: string;
        relationships: any[];
    };
};

const RELATIONSHIP_TYPES = {
    romantic: 'Romantic',
    family: 'Family',
    friendship: 'Friends',
    professional: 'Professional'
};

export const SideBar = () => {
    const [isPremium, relationships] = useAppSelector((state) => [state.app.isPremium, state.app.relationships]);
    const [showMobileSideBar, setShowMobileSideBar] = useState(false);
    const [isRelationshipModalOpen, setIsRelationshipModalOpen] = useState(false);
    const {pathname} = useLocation();

    useEffect(() => {
        setShowMobileSideBar(false);
    }, [pathname]);

    // Group relationships by type
    const groupedRelationships = relationships.reduce((groups, relationship) => {
        const type = relationship.type;
        if (!groups[type]) {
            groups[type] = {
                label: RELATIONSHIP_TYPES[type as keyof typeof RELATIONSHIP_TYPES] || type,
                relationships: []
            };
        }
        groups[type].relationships.push(relationship);
        return groups;
    }, {} as RelationshipGroup);

    // Sort relationships within each group by name
    Object.values(groupedRelationships).forEach(group => {
        group.relationships.sort((a, b) => a.name.localeCompare(b.name));
    });

    return (
        <>
            {showMobileSideBar ? (
                <MobileSideBar 
                    setShowMobileSideBar={setShowMobileSideBar} 
                    groupedRelationships={groupedRelationships}
                    isPremium={isPremium}
                    onAddRelationship={() => setIsRelationshipModalOpen(true)}  
                />
            ) : (
                <DesktopSideBar 
                    setShowMobileSideBar={setShowMobileSideBar}
                    groupedRelationships={groupedRelationships}
                    isPremium={isPremium}
                    onAddRelationship={() => setIsRelationshipModalOpen(true)}
                />
            )}

            <RelationshipModal
                isOpen={isRelationshipModalOpen}
                onClose={() => setIsRelationshipModalOpen(false)}
            />
        </>
    );
};

const MobileSideBar = ({
    setShowMobileSideBar,
    groupedRelationships,
    isPremium,
    onAddRelationship
}: {
    setShowMobileSideBar: (show: boolean) => void;
    groupedRelationships: RelationshipGroup;
    isPremium: boolean;
    onAddRelationship: () => void;

}) => {

    
    return (
        <div className="min-w-screen min-h-screen z-50 backdrop-blur-md fixed left-0 top-0 flex backdrop:bg-black backdrop-brightness-50">
            <div className="w-[80vw] bg-white p-6 flex flex-col space-y-3">
                <div className="flex-1">
                    <SiteLogo />
                <div>
                    {!isPremium && <RemainingMessages />}
                
                <div className="space-y-6 mt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-sm font-semibold text-gray-500">
                            YOUR RELATIONSHIPS
                        </h2>
                        <button
                            onClick={onAddRelationship}
                            className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:opacity-90 transition-colors"
                            title="Add new relationship"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    {Object.entries(groupedRelationships).map(([type, group]) => (
                        <div key={type} className="space-y-2">
                            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                {group.label}
                            </h3>
                            {group.relationships.map((relationship) => (
                                <RelationshipButton
                                    key={relationship.id}
                                    relationship={relationship}
                                    setShowMobileSideBar={setShowMobileSideBar}
                                />
                            ))}
                        </div>
                    ))}

                    {Object.keys(groupedRelationships).length === 0 && (
                        <div className="text-center text-gray-500 py-4">
                            No relationships yet. Click the + button to add one!
                        </div>
                    )}
                </div> 
                    </div>
                </div>
                <AuthUserDetails />
            </div>
            <div
                onClick={() => setShowMobileSideBar(false)}
                className="w-[20vw] flex justify-end items-start p-6"
            >
                <button onClick={() => setShowMobileSideBar(false)}>
                   <X />
                </button>
            </div>
        </div>
    );
};

const DesktopSideBar = ({
    setShowMobileSideBar,
    groupedRelationships,
    isPremium,
    onAddRelationship
}: {
    setShowMobileSideBar: (show: boolean) => void;
    groupedRelationships: RelationshipGroup;
    isPremium: boolean;
    onAddRelationship: () => void;
}) => {
    return (
        <div className="p-4 py-6 relative h-full w-full">
            <div className="flex items-center space-x-3 justify-between px-2">
                <SiteLogo />
                <button
                    onClick={() => setShowMobileSideBar(true)}
                    className="md:hidden"
                >
                   <Menu />
                </button>
            </div>

            <div className="hidden md:block max-h-[80%] overflow-y-auto">
                {!isPremium && <RemainingMessages />}
                
                <div className="space-y-6 mt-6 py-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-sm font-semibold text-gray-500">
                            YOUR RELATIONSHIPS
                        </h2>
                        <button
                            onClick={onAddRelationship}
                            className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:opacity-90 transition-colors"
                            title="Add new relationship"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    {Object.entries(groupedRelationships).map(([type, group]) => (
                        <div key={type} className="space-y-2">
                            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                {group.label}
                            </h3>
                            {group.relationships.map((relationship) => (
                                <RelationshipButton
                                    key={relationship.id}
                                    relationship={relationship}
                                    setShowMobileSideBar={setShowMobileSideBar}
                                />
                            ))}
                        </div>
                    ))}
                      



                    {Object.keys(groupedRelationships).length === 0 && (
                        <div className="text-center text-gray-500 py-4">
                            No relationships yet. Click the + button to add one!
                        </div>
                    )}
                </div>
            </div>

            <div className="bottom-0 absolute w-full right-0 p-4 hidden md:block">
                <AuthUserDetails />
            </div>
        </div>
    );
};

const SiteLogo = () => {
    return (
        <Link to="/" className="flex space-x-3 items-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-poppins">
              BondMate
            </span>
        </Link>
    );
};