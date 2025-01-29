import { loadStripe } from '@stripe/stripe-js';
import { supabase, usefullErrorMessage } from './supabase';


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
    // call supabase function to create subscription
    const {data, error}= await supabase.functions.invoke('create-subscription', {
        body:JSON.stringify({priceId})
    });


    if (error) {
        const errorMessage = await usefullErrorMessage(error);
        console.error('Subscription error:', errorMessage);
        throw new Error(errorMessage);
    }
    
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

    const { data, error } = await supabase.functions.invoke('subscription-success', {
        body: JSON.stringify({ sessionId }),
    })

    if (error) {
        const errorMessage = await usefullErrorMessage(error);
        console.error('Subscription verification error:', errorMessage);
        throw new Error(errorMessage);
    }
    return data;
  } catch (error) {
    console.error('Subscription verification error:', error);
    throw error;
  }
}