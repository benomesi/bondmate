import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Moon, Sun, UserCircle, Plus, Edit, Trash2, MessageSquare, Menu, Crown } from 'lucide-react';
import { ChatInput } from '../components/ChatInput';
import { ChatMessages } from '../components/ChatMessages';
import { RelationshipModal } from '../components/RelationshipModal';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { setDarkMode, setSelectedRelationship, deleteRelationship } from '../store/slices/appSlice';
import type { Relationship } from '../types';

export function TestingArea() {
  const dispatch = useAppDispatch();
  const [isRelationshipModalOpen, setIsRelationshipModalOpen] = useState(false);
  const [editingRelationship, setEditingRelationship] = useState<Relationship | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const { 
    darkMode, 
    selectedRelationship,
    relationships,
    isLoading,
    error,
    user,
    messageCount,
    isPremium
  } = useAppSelector((state) => state.app);

  const handleEditRelationship = (relationship: any) => {
    setEditingRelationship(relationship);
    setIsRelationshipModalOpen(true);
  };

  const handleDeleteRelationship = (id: string) => {
    if (window.confirm('Are you sure you want to delete this relationship? This action cannot be undone.')) {
      dispatch(deleteRelationship(id));
    }
  };

  const remainingMessages = 10 - messageCount;
  const messageProgress = (messageCount / 10) * 100;

  return (
    <div className={`h-screen flex flex-col md:flex-row ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Mobile Toggle */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="md:hidden fixed bottom-4 right-4 z-50 p-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-lg"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <div className={`${
        showSidebar ? 'translate-x-0' : '-translate-x-full'
      } fixed md:relative md:translate-x-0 z-40 w-full md:w-72 h-full flex flex-col transition-transform duration-300 ease-in-out ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } border-r border-gray-200`}>
        <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-xl">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Testing</h1>
            </div>
            <Link
              to="/"
              className={`p-2 rounded-lg ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
        </div>
        {/* Message Limit Progress Bar */}
        {!isPremium && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
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
              onClick={() => setIsRelationshipModalOpen(true)}
              className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-colors"
              title="Add new relationship"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          {relationships.map((rel) => (
            <div
              key={rel.id}
              className={`group relative w-full text-left p-4 rounded-xl mb-3 flex items-center space-x-3 cursor-pointer transition-all duration-200
                ${selectedRelationship?.id === rel.id 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg scale-[1.02]' 
                  : darkMode 
                    ? 'text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              onClick={() => dispatch(setSelectedRelationship(rel))}
            >
              <Users className="w-5 h-5" />
              <span className="flex-1 font-medium">{rel.name}</span>
              <div className={`space-x-1 ${selectedRelationship?.id === rel.id ? 'text-white' : 'text-gray-400'} opacity-0 group-hover:opacity-100 transition-opacity`}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditRelationship(rel);
                  }}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteRelationship(rel.id);
                  }}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* User Profile */}
        <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className={`flex items-center space-x-3 w-full p-3 rounded-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <UserCircle className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <div className="font-medium text-left">Test User</div>
              <div className="text-sm text-gray-500">Testing Mode</div>
            </div>
          </div>
          <button
            onClick={() => dispatch(setDarkMode(!darkMode))}
            className={`mt-3 w-full p-3 rounded-xl flex items-center justify-center space-x-2 ${
              darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
            } hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        {selectedRelationship ? (
          <>
            {/* Chat Header */}
            <div className={`p-4 md:p-6 border-b ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 backdrop-blur-sm border-gray-200'} sticky top-0 z-10`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedRelationship.name}
                  </h2>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {selectedRelationship.type.charAt(0).toUpperCase() + selectedRelationship.type.slice(1)} Relationship
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">{error}</div>
                {!isPremium && messageCount >= 10 && (
                  <button
                    onClick={() => setIsUpgradeModalOpen(true)}
                    className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-lg hover:opacity-90 transition-colors flex items-center space-x-2 whitespace-nowrap"
                  >
                    <Crown className="w-4 h-4" />
                    <span>Upgrade Now</span>
                  </button>
                )}
              </div>
            )}

            {/* Chat Container */}
            <div className="flex-1 flex flex-col min-h-0">
              {/* Messages */}
              <div className="flex-1 overflow-hidden">
                <ChatMessages relationshipId={selectedRelationship.id} />
              </div>

              {/* Loading Indicator */}
              {isLoading && (
                <div className={`p-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'} text-center`}>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  </div>
                </div>
              )}

              {/* Message Input */}
              <ChatInput relationshipId={selectedRelationship.id} />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h2 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Select a Relationship
              </h2>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} max-w-md mx-auto`}>
                Choose a relationship from the sidebar to start chatting and get personalized advice
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Relationship Modal */}
      <RelationshipModal
        isOpen={isRelationshipModalOpen}
        onClose={() => setIsRelationshipModalOpen(false)}
        relationship={editingRelationship}
      />
    </div>
  );
}