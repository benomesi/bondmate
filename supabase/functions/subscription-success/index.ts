import { createClient } from 'https://esm.sh/@supabase/supabase-js';
import Stripe from 'https://esm.sh/stripe';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY') || '';

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

    if (!stripeSecretKey) {
        return new Response(JSON.stringify({ message: 'Something went wrong' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    try {
        const { sessionId } = await req.json();
        
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

        return new Response(JSON.stringify({
            success: true,
            customerId: session.customer,
            subscriptionId: session.subscription?.id
        }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Subscription verification error:', error);
        return new Response(JSON.stringify({ message: 'Failed to verify subscription' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
