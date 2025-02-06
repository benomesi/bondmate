import { createClient } from 'https://esm.sh/@supabase/supabase-js';
import OpenAI from 'https://esm.sh/openai';
import { serve } from "https://deno.land/std/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY") });

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  
  try {
    const { messages, relationship, preferences, messageCount = 0, isPremium = false } = await req.json();

    if (!Deno.env.get("OPENAI_API_KEY")) {
      return new Response(
        JSON.stringify({
          message: "I understand you're looking for advice. However, this is running in demo mode without an OpenAI API key.",
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const model = isPremium ? "gpt-4" : "gpt-3.5-turbo";
    const systemPrompt = generateSystemPrompt(relationship, preferences);

    const formattedMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((msg) => ({
        role: msg.role,
        content: typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content),
      })),
    ];

    const completion = await openai.chat.completions.create({
      model,
      messages: formattedMessages,
      temperature: 0.8,
      max_tokens: 1024,
      presence_penalty: 0.3,
      frequency_penalty: 0.3,
      top_p: 0.9,
    });

    return new Response(
      JSON.stringify({ response: completion.choices[0]?.message?.content || "Failed to get response" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
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