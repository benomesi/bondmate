import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { addRelationship } from '../../store/slices/appSlice';
import type { RelationType } from '../../types';

interface FirstRelationshipFlowProps {
  onComplete: () => void;
}

export function FirstRelationshipFlow({ onComplete }: FirstRelationshipFlowProps) {
  const dispatch = useAppDispatch();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    type: 'friendship' as RelationType,
    context: '',
    interests: [] as string[],
    goals: [] as string[]
  });

  const handleSubmit = () => {
    dispatch(addRelationship({
      ...formData,
      id: crypto.randomUUID()
    }));
    onComplete();
  };

  // ... (keep rest of the component implementation)
}