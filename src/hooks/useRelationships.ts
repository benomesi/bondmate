import { useState, useEffect } from 'react';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { setRelationships, setSelectedRelationship, setError } from '../store/slices/appSlice';
import { relationshipService } from '../services/relationships';
import type { Relationship } from '../types';

export function useRelationships() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { relationships, selectedRelationship } = useAppSelector(state => state.app);
  const [isLoading, setIsLoading] = useState(true);

  // Load relationships on mount and when user changes
  useEffect(() => {
    const loadRelationships = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { relationships: loadedRelationships, error } = await relationshipService.getRelationships(user.id);
        if (error) throw error;

        // Update Redux store
        dispatch(setRelationships(loadedRelationships));

        // If there's a selected relationship, validate it still exists
        if (selectedRelationship) {
          const stillExists = loadedRelationships.some(r => r.id === selectedRelationship.id);
          if (!stillExists) {
            dispatch(setSelectedRelationship(null));
          }
        }
      } catch (error) {
        console.error('Failed to load relationships:', error);
        dispatch(setError('Failed to load relationships'));
      } finally {
        setIsLoading(false);
      }
    };

    loadRelationships();
  }, [user, dispatch]);

  // Group relationships by type
  const groupedRelationships = relationships.reduce((groups, relationship) => {
    const type = relationship.type;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(relationship);
    return groups;
  }, {} as Record<string, Relationship[]>);

  // Sort relationships within each group by name
  Object.values(groupedRelationships).forEach(group => {
    group.sort((a, b) => a.name.localeCompare(b.name));
  });

  return {
    relationships,
    groupedRelationships,
    selectedRelationship,
    isLoading,
    selectRelationship: (relationship: Relationship | null) => {
      dispatch(setSelectedRelationship(relationship));
    }
  };
}