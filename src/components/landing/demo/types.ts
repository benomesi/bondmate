import { DivideIcon as LucideIcon } from 'lucide-react';

export interface Scenario {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  prompt: string;
}

export interface AIResponse {
  initial: string;
  followUps: {
    [key: string]: {
      response: string;
      options: string[];
    };
  };
  final: string;
}