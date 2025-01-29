// Pricing definitions and types
export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  priceId: string; // Stripe Price ID
  features: string[];
  popular?: boolean;
  cta: {
    text: string;
    subtext: string;
    icon: string;
  };
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free Trial',
    description: 'Try our basic features',
    price: '0',
    priceId: '0', // Replace with your Stripe Price ID
    features: [
      'Up to 10 AI coach messages',
      'Basic profile review',
      'Essential dating tips',
      'Community support'
    ],
    cta: {
      text: 'Start Free Trial',
      subtext: 'No risk. No credit card. Just results.',
      icon: 'ArrowRight'
    }
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Unlock your full dating potential',
    price: '20',
    priceId: import.meta.env.VITE_PRICE_ID, // Replace with your Stripe Price ID
    features: [
      'Unlimited AI coach messages',
      'Advanced profile optimization',
      'Message review and feedback',
      'Date planning assistance',
      'Priority support',
      'Conversation strategy guides',
      'Success tracking analytics'
    ],
    popular: true,
    cta: {
      text: 'Start 14-Day Free Trial',
      subtext: 'Try Premium free for 14 days. Cancel anytime.',
      icon: 'Crown'
    }
  }
];