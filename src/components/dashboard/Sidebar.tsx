import React, { useState } from 'react';
import { Users, Plus, Edit, Trash2, Crown, UserCircle, Moon, Sun, LogOut, X } from 'lucide-react';
import { QuizResults } from '../QuizResults';
import { DeleteConfirmationModal } from '../DeleteConfirmationModal';
import { useRelationships } from '../../hooks/useRelationships';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { clearAuth } from '../../store/slices/authSlice';
import type { Relationship } from '../../types';

interface SidebarProps {
  darkMode: boolean;
  isPremium: boolean;
  messageCount: number;
  quizResults: any;
  onAddRelationship: () => void;
  onEditRelationship: (relationship: Relationship) => void;
  onDeleteRelationship: (id: string) => void;
  onOpenProfile: () => void;
  onToggleDarkMode: () => void;
  onUpgrade: () => void;
}

export function Sidebar({
  darkMode,
  isPremium,
  messageCount,
  quizResults,
  onAddRelationship,
  onEditRelationship,
  onDeleteRelationship,
  onOpenProfile,
  onToggleDarkMode,
  onUpgrade
}: SidebarProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { groupedRelationships, selectedRelationship, selectRelationship, isLoading } = useRelationships();
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const remainingMessages = 10 - messageCount;
  const messageProgress = (messageCount / 10) * 100;

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      dispatch(clearAuth());
      navigate('/sign-in');
    } catch (error) {
      console.error('Sign out error:', error);
      dispatch(clearAuth());
      navigate('/sign-in');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmation) return;
    setIsDeleting(true);
    try {
      await onDeleteRelationship(deleteConfirmation.id);
      setDeleteConfirmation(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={`w-72 flex flex-col h-full ${darkMode ? 'bg-gray-800' : 'bg-white'} border-r border-gray-200 dark:border-gray-700`}>
      {/* Message Counter with Padding */}
      {!isPremium && (
        <div className="p-4 pt-12 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Free Messages Remaining
            </span>
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {remainingMessages} / 10
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
              style={{ width: `${messageProgress}%` }}
            />
          </div>
        </div>
      )}
        
      {/* Relationships List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-sm font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
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
          
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            </div>
          </div>
        ) : (
          Object.entries(groupedRelationships).map(([type, relationships]) => (
            <div key={type} className="space-y-2 mb-6">
              <h3 className={`text-xs font-medium mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider`}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </h3>
              {relationships.map((rel) => (
                <div
                  key={rel.id}
                  className={`group relative w-full text-left p-2.5 rounded-lg mb-1 flex items-center space-x-3 cursor-pointer transition-all duration-200
                    ${selectedRelationship?.id === rel.id 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg scale-[1.02]' 
                      : darkMode 
                        ? 'text-gray-300 hover:bg-gray-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  onClick={() => selectRelationship(rel)}
                >
                  <Users className="w-5 h-5" />
                  <span className="flex-1 font-medium">{rel.name}</span>
                  <div className={`space-x-1 ${selectedRelationship?.id === rel.id ? 'text-white' : 'text-gray-400'} opacity-0 group-hover:opacity-100 transition-opacity`}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditRelationship(rel);
                      }}
                      className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmation({ id: rel.id, name: rel.name });
                      }}
                      className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* User Profile */}
      <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <button
          onClick={onOpenProfile}
          className={`w-full p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-3`}
        >
          <div className={`p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white transform transition-transform group-hover:scale-110`}>
            <UserCircle className="w-5 h-5" />
          </div>
          <div className={darkMode ? 'text-white' : 'text-gray-900'}>
            <div className="font-medium text-left">Account Settings</div>
            <div className="text-sm text-gray-500">Manage your account</div>
          </div>
        </button>

        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={onToggleDarkMode}
            className={`flex-1 p-2 rounded-lg ${
              darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
            } hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button
            onClick={handleSignOut}
            className="flex-1 p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteConfirmation !== null}
        onClose={() => setDeleteConfirmation(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        name={deleteConfirmation?.name || ''}
      />
    </div>
  );
}