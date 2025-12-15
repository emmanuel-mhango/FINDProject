import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not found');
    }

    const systemPrompt = `You are Victor Balawe, a helpful AI assistant for the FIND app - a platform for taxi booking, job searching, and roommate matching in Malawi. 

Your role is to help users navigate the app and solve problems they might encounter. You can assist with:

1. **Taxi Booking**: Help users understand how to book taxis, use the map interface, calculate prices based on distance, and explain the booking process.

2. **Job Search**: Assist users in finding job opportunities, understanding application processes, and providing career advice relevant to Malawi.

3. **Roommate Matching**: Help users find compatible roommates based on university, program of study, and gender preferences.

4. **App Navigation**: Guide users through different features of the app and troubleshoot any issues they might have.

5. **General Support**: Answer questions about universities in Malawi, provide local information, and offer helpful advice.

Always be friendly, professional, and provide specific, actionable advice. If you don't know something specific about Malawi or the app's current state, be honest and offer to help them find the information they need.

Keep your responses concise but helpful, and always try to direct users to the specific features of the app that can help them.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    return new Response(JSON.stringify({ 
      message: assistantMessage,
      assistant: 'Victor Balawe'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AI assistant:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to get response from AI assistant',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});