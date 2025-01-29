import { createClient } from 'https://esm.sh/@supabase/supabase-js';
import Stripe from 'https://esm.sh/stripe';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY') || '';
const frontendUrl = Deno.env.get('FRONTEND_URL') || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const stripe = new Stripe(stripeSecretKey, { apiVersion: '2023-10-16' });
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {

    if (req.method === 'OPTIONS') {
        return new Response('ok', {
            headers: corsHeaders,
        });
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
        const { priceId } = await req.json();
        const authHeader = req.headers.get('authorization');

        if (!authHeader) {
            return new Response(JSON.stringify({ message: 'Unauthorized' }), {
                status: 401,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        const { data: { user }, error: authError } = await supabase.auth.getUser(
            authHeader.replace('Bearer ', '')
        );

        if (authError || !user) {
            return new Response(JSON.stringify({ message: 'Invalid token' }), {
                status: 401,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        // Retrieve user profile from Supabase
        const { data: profile } = await supabase
            .from('profiles')
            .select('stripe_customer_id')
            .eq('id', user.id)
            .single();

        let customerId = profile?.stripe_customer_id;

        if (customerId) {
            try {
                await stripe.customers.retrieve(customerId);
            } catch (err) {
                console.error('Invalid Stripe customer ID, resetting:', err);
                await supabase
                    .from('profiles')
                    .update({ stripe_customer_id: null })
                    .eq('id', user.id);
                customerId = null;
            }
        }

        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                metadata: { supabase_id: user.id },
            });
            customerId = customer.id;

            await supabase
                .from('profiles')
                .update({ stripe_customer_id: customerId })
                .eq('id', user.id);
        }

        // Create Stripe Checkout session
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            line_items: [{ price: priceId, quantity: 1 }],
            mode: 'subscription',
            success_url: `${frontendUrl}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${frontendUrl}/pricing`,
            subscription_data: {
                trial_period_days: 14,
                metadata: { supabase_id: user.id },
            },
            metadata: { supabase_id: user.id },
        });

        return new Response(JSON.stringify({ sessionId: session.id }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Subscription creation error:', error);
        return new Response(JSON.stringify({ message: 'Failed to create subscription' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});