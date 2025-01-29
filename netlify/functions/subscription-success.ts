import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'
});

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  try {
    const { sessionId } = JSON.parse(event.body || '{}');
    
    // Retrieve checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription']
    });

    if (!session?.metadata?.supabase_id) {
      throw new Error('No Supabase ID in session metadata');
    }

    // Update user's premium status
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        is_premium: true,
        subscription_id: session.subscription?.id,
        subscription_status: 'active'
      })
      .eq('id', session.metadata.supabase_id);

    if (updateError) {
      throw updateError;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true,
        customerId: session.customer,
        subscriptionId: session.subscription?.id
      })
    };

  } catch (error) {
    console.error('Subscription verification error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to verify subscription' })
    };
  }
};