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

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  const sig = event.headers['stripe-signature'];
  if (!sig || !endpointSecret) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing signature or webhook secret' })
    };
  }

  try {
    const stripeEvent = stripe.webhooks.constructEvent(
      event.body || '',
      sig,
      endpointSecret
    );

    // Handle subscription events
    switch (stripeEvent.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = stripeEvent.data.object as Stripe.Subscription;
        const supabaseId = subscription.metadata.supabase_id;

        if (!supabaseId) break;

        await supabase
          .from('profiles')
          .update({ 
            is_premium: subscription.status === 'active',
            subscription_id: subscription.id,
            subscription_status: subscription.status
          })
          .eq('id', supabaseId);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = stripeEvent.data.object as Stripe.Subscription;
        const supabaseId = subscription.metadata.supabase_id;

        if (!supabaseId) break;

        await supabase
          .from('profiles')
          .update({ 
            is_premium: false,
            subscription_id: null,
            subscription_status: 'canceled'
          })
          .eq('id', supabaseId);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = stripeEvent.data.object as Stripe.Invoice;
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
        const supabaseId = subscription.metadata.supabase_id;

        if (!supabaseId) break;

        await supabase
          .from('profiles')
          .update({ 
            subscription_status: 'past_due'
          })
          .eq('id', supabaseId);
        break;
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true })
    };

  } catch (error) {
    console.error('Webhook error:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Webhook error' })
    };
  }
};