import { createClient } from 'https://esm.sh/@supabase/supabase-js';
import Stripe from 'https://esm.sh/stripe';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY') || '';
const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const stripe = new Stripe(stripeSecretKey, { apiVersion: '2023-10-16' });

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ message: 'Method not allowed' }), {
            status: 405,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    const sig = req.headers.get('stripe-signature');
    if (!sig || !endpointSecret) {
        return new Response(JSON.stringify({ message: 'Missing signature or webhook secret' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    try {
        const body = await req.text();
        const stripeEvent = await stripe.webhooks.constructEventAsync(
            body,
            sig,
            endpointSecret
        );

        switch (stripeEvent.type) {

            case 'customer.subscription.created':
            case 'customer.subscription.updated': {
                const subscription = stripeEvent.data.object;
                const supabaseId = subscription.metadata?.supabase_id;
                
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
                const subscription = stripeEvent.data.object;
                const supabaseId = subscription.metadata?.supabase_id;
                
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
                const invoice = stripeEvent.data.object;
                const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
                const supabaseId = subscription.metadata?.supabase_id;
                
                if (!supabaseId) break;
                
                await supabase
                    .from('profiles')
                    .update({ subscription_status: 'past_due' })
                    .eq('id', supabaseId);
                break;
            }
            
            default:
                console.log(`Unhandled event type: ${stripeEvent.type}`);
                break;
        }

        return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Webhook error:', error);
        return new Response(JSON.stringify({ message: 'Webhook error' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
