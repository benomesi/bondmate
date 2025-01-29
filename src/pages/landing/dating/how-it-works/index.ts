// How It Works definitions and types
export interface Step {
  id: string;
  icon: string;
  title: string;
  description: string;
  gradient: string;
  animation: {
    path: string;
    duration: number;
  };
}

export const STEPS: Step[] = [
  {
    id: 'ask',
    icon: 'MessageCircle',
    title: 'Share Your Situation',
    description: 'Tell our AI coach about your dating challenges or goals. No question is too big or small.',
    gradient: 'from-red-500 to-red-600',
    animation: {
      path: 'M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z',
      duration: 1.5
    }
  },
  {
    id: 'advice',
    icon: 'Sparkles',
    title: 'Get Personalized Guidance',
    description: 'Receive data-driven advice tailored to your unique situation and goals.',
    gradient: 'from-red-600 to-red-700',
    animation: {
      path: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z',
      duration: 2
    }
  },
  {
    id: 'transform',
    icon: 'Heart',
    title: 'See Real Results',
    description: 'Apply proven strategies and watch your dating success transform.',
    gradient: 'from-red-700 to-red-800',
    animation: {
      path: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z',
      duration: 1.8
    }
  }
];