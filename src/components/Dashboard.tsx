import React, { useState } from 'react';
import { Sidebar } from './dashboard/Sidebar';
import { ChatArea } from './dashboard/ChatArea';
import { EmptyState } from './dashboard/EmptyState';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { useRelationships } from '../hooks/useRelationships';
import { setDarkMode, deleteRelationship, setError } from '../store/slices/appSlice';
import { relationshipService } from '../services/relationships';
import { ProfileModal } from './ProfileModal';
import { RelationshipModal } from './RelationshipModal';
import { UpgradeModal } from './UpgradeModal';
import type { Relationship } from '../types';
import { OnboardingWizard } from './onboarding/OnboardingWizard';
import { Menu, X } from 'lucide-react';

export function Dashboard() {
  const dispatch = useAppDispatch();
  const { hasCompletedOnboarding } = useAppSelector((state) => state.app);
  const { selectedRelationship } = useRelationships();
  const { 
    darkMode, 
    isLoading,
    error,
    messageCount,
    isPremium,
    quizResults
  } = useAppSelector((state) => state.app);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isRelationshipModalOpen, setIsRelationshipModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [editingRelationship, setEditingRelationship] = useState<Relationship | undefined>();
  const [showSidebar, setShowSidebar] = useState(false);

  const handleEditRelationship = (relationship: Relationship) => {
    setEditingRelationship(relationship);
    setIsRelationshipModalOpen(true);
    setShowSidebar(false);
  };

  const handleAddRelationship = () => {
    setEditingRelationship(undefined);
    setIsRelationshipModalOpen(true);
    setShowSidebar(false);
  };

  const handleDeleteRelationship = async (id: string) => {
    try {
      const { error } = await relationshipService.deleteRelationship(id);
      if (error) throw error;
      dispatch(deleteRelationship(id));
    } catch (error) {
      console.error('Failed to delete relationship:', error);
      dispatch(setError('Failed to delete relationship. Please try again.'));
    }
  };

  if (!hasCompletedOnboarding) {
    return <OnboardingWizard />;
  }

  return (
    <div className={`h-screen flex ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className={`md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg shadow-lg ${
          darkMode 
            ? 'bg-gray-800 text-gray-300' 
            : 'bg-white text-gray-600'
        }`}
      >
        {showSidebar ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar - Hidden on mobile by default */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-40
        w-72 transform transition-transform duration-300 ease-in-out
        ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        <Sidebar
          darkMode={darkMode}
          isPremium={isPremium}
          messageCount={messageCount}
          quizResults={quizResults}
          onAddRelationship={handleAddRelationship}
          onEditRelationship={handleEditRelationship}
          onDeleteRelationship={handleDeleteRelationship}
          onOpenProfile={() => {
            setIsProfileModalOpen(true);
            setShowSidebar(false);
          }}
          onToggleDarkMode={() => dispatch(setDarkMode(!darkMode))}
          onUpgrade={() => {
            setIsUpgradeModalOpen(true);
            setShowSidebar(false);
          }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        {selectedRelationship ? (
          <ChatArea
            selectedRelationship={selectedRelationship}
            error={error}
            isLoading={isLoading}
            darkMode={darkMode}
            messageCount={messageCount}
            isPremium={isPremium}
            onUpgrade={() => setIsUpgradeModalOpen(true)}
          />
        ) : (
          <EmptyState
            darkMode={darkMode}
            hasRelationships={false}
            onAddRelationship={handleAddRelationship}
          />
        )}
      </div>

      {/* Modals */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
      <RelationshipModal
        isOpen={isRelationshipModalOpen}
        onClose={() => {
          setIsRelationshipModalOpen(false);
          setEditingRelationship(undefined);
        }}
        relationship={editingRelationship}
      />
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />

      {/* Mobile Sidebar Overlay */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}
    </div>
  );
}