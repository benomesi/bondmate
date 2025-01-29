import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './supabase';

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

if (!STRIPE_PUBLIC_KEY) {
  console.warn('Missing Stripe public key');
}

let stripePromise: Promise<any> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLIC_KEY || '');
  }
  return stripePromise;
};

export async function createSubscription(priceId: string) {
  try {
    // Get current session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch('/.netlify/functions/create-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({ priceId }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to create subscription');
    }

    const data = await response.json();
    
    // Redirect to Stripe Checkout
    const { sessionId } = data;
    const stripe = await getStripe();
    const result = await stripe?.redirectToCheckout({ sessionId });

    if (result?.error) {
      throw new Error(result.error.message);
    }

  } catch (error) {
    console.error('Subscription error:', error);
    throw error;
  }
}

export async function handleSubscriptionSuccess(sessionId: string) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch('/.netlify/functions/subscription-success', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({ sessionId }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to verify subscription');
    }

    return await response.json();

  } catch (error) {
    console.error('Subscription verification error:', error);
    throw error;
  }
}