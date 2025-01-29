import type { LucideIcon } from 'lucide-react';

export interface QuizOption {
  value: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
}

export interface Quiz {
  title: string;
  icon: LucideIcon;
  questions: QuizQuestion[];
}

export interface QuizDetails {
  title: string;
  description: string;
  tips: string[];
}