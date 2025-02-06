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
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        if (req.method !== 'POST') {
            throw new Error('Method not allowed');
        }

        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            throw new Error('Missing authorization header');
        }

        const { data: { user }, error: authError } = await supabase.auth.getUser(
            authHeader.replace('Bearer ', '')
        );

        if (authError || !user) {
            throw new Error('Unauthorized');
        }

        const { messages, context, preferences, messageCount, isPremium }: ChatRequest = await req.json();
        if (!isPremium && messageCount >= 10) {
            throw new Error('Message limit reached');
        }

        const systemPrompt = generateSystemPrompt(context, preferences);
        messages.unshift({ role: 'system', content: systemPrompt });

        const completion = await openai.chat.completions.create({
            model: isPremium ? 'gpt-4-0125-preview' : 'gpt-3.5-turbo',
            messages,
            temperature: 0.7,
            max_tokens: preferences.length === 'concise' ? 300 : 
            preferences.length === 'detailed' ? 2000 : 1000,
            presence_penalty: 0.6,
            frequency_penalty: 0.5,
            stream: true
        });

        const readableStream = new ReadableStream({
            async start(controller) {
                const decoder = new TextDecoder();
                const encoder = new TextEncoder();
                for await (const chunk of completion.toReadableStream()) {
                    const text = decoder.decode(chunk);
                    controller.enqueue(encoder.encode(`data: ${text}\n\n`));
                }
                controller.close();
            },
        });

        return new Response(readableStream, {
            headers: { 
                ...corsHeaders, 
                'Content-Type': 'text/event-stream'
            }
        });

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

function generateSystemPrompt(relationship, preferences) {
    return `You are an expert dating coach focused on helping with dating advice. Your responses should feel like talking to a knowledgeable friend who genuinely wants to help.
  
  Response Format:
  1. Brief Welcome (1 line)
     "I understand [their situation/concern]..."
  
  2. Key Points (2-3 sections)
     Each section should be formatted as:
     **[Section Title]**
     • Point 1 with specific detail
     • Point 2 with clear action
     • Point 3 with expected outcome
  
  3. Follow-up Question (1 line)
     Always end with a question to encourage continued dialogue.
  
  Context:
  - User Type: ${relationship.type}
  - Interests: ${relationship.interests.join(", ")}
  - Goals: ${relationship.goals.join(", ")}
  
  Preferences:
  - Tone: ${preferences?.tone || "empathetic"}
  - Length: ${preferences?.length || "balanced"}
  - Style: ${preferences?.style || "supportive"}`;
}
