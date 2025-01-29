import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { addRelationship, updateRelationship } from '../store/slices/appSlice';
import { relationshipService } from '../services/relationships';
import { RelationshipWizard } from './RelationshipWizard';
import type { Relationship, RelationType } from '../types';

interface RelationshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  relationship?: Relationship;
}

const SUGGESTED_INTERESTS = [
  'Reading', 'Writing', 'Cooking', 'Gaming', 'Photography', 'Travel',
  'Music', 'Art', 'Sports', 'Fitness', 'Technology', 'Movies',
  'Nature', 'Animals', 'Fashion', 'Dance', 'Yoga', 'Meditation'
];

const SUGGESTED_GOALS = [
  'Better Communication', 'Quality Time', 'Personal Growth',
  'Mutual Support', 'Shared Activities', 'Trust Building',
  'Open Communication', 'Understanding', 'Fun & Adventure',
  'Long-term Connection', 'Emotional Support', 'Common Interests'
];

const COMMUNICATION_STYLES = [
  { value: 'direct', label: 'Direct - Straightforward and to the point' },
  { value: 'diplomatic', label: 'Diplomatic - Tactful and considerate' },
  { value: 'expressive', label: 'Expressive - Emotional and enthusiastic' },
  { value: 'analytical', label: 'Analytical - Logical and detail-oriented' }
];

export function RelationshipModal({ isOpen, onClose, relationship }: RelationshipModalProps) {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<Partial<Relationship>>(
    relationship || {
      name: '',
      type: 'friendship',
      interests: [],
      goals: [],
      communicationStyle: ''
    }
  );
  const [customInterest, setCustomInterest] = useState('');
  const [customGoal, setCustomGoal] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isOpen) {
      setFormData(relationship || {
        name: '',
        type: 'friendship',
        interests: [],
        goals: [],
        communicationStyle: ''
      });
    }
  }, [relationship, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      if (relationship) {
        // Update existing relationship
        const { error } = await relationshipService.updateRelationship(relationship.id, formData);
        if (error) throw error;
        dispatch(updateRelationship({ ...relationship, ...formData }));
      } else {
        // Create new relationship
        const { relationship: newRelationship, error } = await relationshipService.createRelationship(
          user.id,
          formData
        );
        if (error) throw error;
        if (newRelationship) {
          dispatch(addRelationship(newRelationship));
        }
      }
      onClose();
    } catch (error) {
      console.error('Failed to save relationship:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleInterest = (interest: string) => {
    const interests = formData.interests || [];
    setFormData(prev => ({
      ...prev,
      interests: interests.includes(interest)
        ? interests.filter(i => i !== interest)
        : [...interests, interest]
    }));
  };

  const toggleGoal = (goal: string) => {
    const goals = formData.goals || [];
    setFormData(prev => ({
      ...prev,
      goals: goals.includes(goal)
        ? goals.filter(g => g !== goal)
        : [...goals, goal]
    }));
  };

  const addCustomInterest = () => {
    if (customInterest.trim()) {
      toggleInterest(customInterest.trim());
      setCustomInterest('');
    }
  };

  const addCustomGoal = () => {
    if (customGoal.trim()) {
      toggleGoal(customGoal.trim());
      setCustomGoal('');
    }
  };

  if (!isOpen) return null;

  // For new relationships, show the wizard
  if (!relationship) {
    return <RelationshipWizard onClose={onClose} />;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {relationship ? 'Edit Relationship' : 'Add New Relationship'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-8rem)]">
          <div className="p-4 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Relationship Type
              </label>
              <select
                value={formData.type || 'friendship'}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as RelationType })}
                className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="romantic">Romantic</option>
                <option value="family">Family</option>
                <option value="friendship">Friendship</option>
                <option value="professional">Professional</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Shared Interests
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {SUGGESTED_INTERESTS.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                      ${formData.interests?.includes(interest)
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customInterest}
                  onChange={(e) => setCustomInterest(e.target.value)}
                  placeholder="Add custom interest"
                  className="flex-1 p-2 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={addCustomInterest}
                  className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:opacity-90"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Relationship Goals
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {SUGGESTED_GOALS.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleGoal(goal)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                      ${formData.goals?.includes(goal)
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customGoal}
                  onChange={(e) => setCustomGoal(e.target.value)}
                  placeholder="Add custom goal"
                  className="flex-1 p-2 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={addCustomGoal}
                  className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:opacity-90"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Their Communication Style
              </label>
              <div className="space-y-2">
                {COMMUNICATION_STYLES.map(({ value, label }) => (
                  <label
                    key={value}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200
                      ${formData.communicationStyle === value
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                        : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                  >
                    <input
                      type="radio"
                      name="communicationStyle"
                      value={value}
                      checked={formData.communicationStyle === value}
                      onChange={(e) => setFormData({ ...formData, communicationStyle: e.target.value })}
                      className="hidden"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-white p-4 border-t border-gray-200">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:opacity-90"
              >
                {isSubmitting 
                  ? (relationship ? 'Saving...' : 'Adding...')
                  : (relationship ? 'Save Changes' : 'Add Relationship')
                }
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}