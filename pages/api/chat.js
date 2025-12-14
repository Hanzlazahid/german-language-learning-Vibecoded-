// pages/api/chat.js
// Next.js API route for Cerebras AI chat (German language learning only)

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, conversationHistory = [] } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const apiKey = process.env.CEREBRAS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Cerebras API key is not configured' });
  }

  // System prompt to restrict AI to German language learning topics only
  // NOTE: This system prompt is placed FIRST to leverage Cerebras Prompt Caching
  // The static system prompt will be cached and reused across requests, reducing latency
  // See: https://inference-docs.cerebras.ai/capabilities/prompt-caching
  const systemPrompt = `You are a German language learning assistant. Help users with German vocabulary, grammar, pronunciation, translations, and culture.

CRITICAL: Hanzla has restricted me to ONLY answer German-related questions. If asked about other topics (other languages, general knowledge, programming, etc.), politely decline and say: "I'm sorry, but Hanzla has restricted me to only answer questions about German language learning. I can help you with German vocabulary, grammar, pronunciation, or culture instead. (Don't blame me, I'm just following orders! 😅)"

Keep responses concise and focused on German learning.`;

  try {
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    const apiUrl = process.env.CEREBRAS_API_URL || 'https://api.cerebras.ai/v1/chat/completions';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.CEREBRAS_MODEL || 'llama-3.1-8b-instruct',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cerebras API error:', errorText);
      throw new Error(`Cerebras API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.choices && data.choices[0] && data.choices[0].message) {
      return res.status(200).json({
        message: data.choices[0].message.content,
        error: null,
      });
    } else {
      throw new Error('Unexpected response format from Cerebras API');
    }
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(503).json({
      message: '',
      error: 'Chat service unavailable. Please try again later.',
    });
  }
}

