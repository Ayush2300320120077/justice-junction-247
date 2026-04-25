const SYSTEM_PROMPT = `You are a helpful Indian legal assistant for Justice Junction 24/7. Answer legal questions in simple Hindi or English based on Indian law (IPC, CPC, Constitution, Consumer Protection Act, RTI Act, POCSO, IT Act, etc.). Keep answers under 150 words. Be clear and practical. Always end with: "For personalized advice, speak to a verified lawyer on Justice Junction 24/7." Never give specific legal advice for individual cases. Never suggest illegal actions.`

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { messages } = req.body
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array is required' })
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    // Graceful fallback if key not configured
    return res.status(200).json({
      reply: "I'm here to help with your legal questions. For the best assistance, please speak to a verified lawyer on Justice Junction 24/7."
    })
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.slice(-6) // Keep last 6 messages for context window
        ],
        max_tokens: 200,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const err = await response.json()
      console.error('OpenAI error:', err)
      return res.status(200).json({
        reply: "I'm having trouble connecting right now. Please try again in a moment. For urgent legal help, speak to a verified lawyer on Justice Junction 24/7."
      })
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content || "I couldn't generate a response. Please try again."
    return res.status(200).json({ reply })
  } catch (err) {
    console.error('Chat API error:', err)
    return res.status(200).json({
      reply: "I'm temporarily unavailable. For personalized advice, speak to a verified lawyer on Justice Junction 24/7."
    })
  }
}
