import { createClient } from 'https://esm.sh/@supabase/supabase-js';
import OpenAI from 'https://esm.sh/openai';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const openaiApiKey = Deno.env.get('OPENAI_API_KEY') || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const openai = new OpenAI({ apiKey: openaiApiKey });

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatRequest {
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  context: {
    name: string;
    type: string;
    interests: string[];
    goals: string[];
  };
  preferences: {
    tone: string;
    length: string;
    style: string;
  };
  messageCount: number;
  isPremium: boolean;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify request method
    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    // Get auth token from request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Get request body
    const { messages, context, preferences, messageCount, isPremium }: ChatRequest = await req.json();

    // Validate message limit for free users
    if (!isPremium && messageCount >= 10) {
      throw new Error('Message limit reached');
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: isPremium ? 'gpt-4-0125-preview' : 'gpt-3.5-turbo',
      messages,
      temperature: 0.7,
      max_tokens: preferences.length === 'concise' ? 300 : 
                 preferences.length === 'detailed' ? 2000 : 1000,
      presence_penalty: 0.6,
      frequency_penalty: 0.5
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    return new Response(
      JSON.stringify({ message: response }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Chat error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An error occurred'
      }),
      { 
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});