import connectDB from '../../../../middleware/db'
import AIConversation from '../../../../models/AIConversation'
import AIRequestLog from '../../../../models/AIRequestLog'
import jwt from 'jsonwebtoken'

const SYSTEM_PROMPT = `You are a legal information assistant for JusticeJunction, a platform connecting users with verified lawyers in India. You provide GENERAL LEGAL INFORMATION only, never specific legal advice. Help users understand what type of legal issue they have (property, family, criminal, corporate, consumer, labor, etc.) and what category of lawyer they should search for. Always end responses involving a specific legal question with a disclaimer that this is not legal advice and they should consult a verified lawyer on the platform for their specific case. Keep responses concise (3-5 sentences max) and India-law-context aware.

CRITICAL:
1. Do NOT generate or reference specific case outcomes, guarantees of winning, or specific fee amounts. Keep all responses informational and routing-only.
2. You MUST respond in a valid JSON format with exactly the following keys:
- "reply": "Your concise reply (3-5 sentences max). Must end with a disclaimer if a specific legal question is asked."
- "category": "One of these exact categories: 'Criminal Defence', 'Family Law', 'Property Law', 'Corporate Law', 'Consumer Rights', 'Labour Law'. Set to null if the legal issue is not clear or does not fit these categories."`;

// Smart rule-based local fallback for testing without a live Claude API key
function getFallbackResponse(message) {
  const msg = message.toLowerCase();
  let category = null;
  let reply = "";

  if (msg.includes('property') || msg.includes('rent') || msg.includes('tenant') || msg.includes('landlord') || msg.includes('house') || msg.includes('possession') || msg.includes('builder')) {
    category = 'Property Law';
    reply = "It sounds like you are dealing with a property-related matter, such as a rental agreement dispute, possession issue, or builder conflict. Under Indian property laws, including the Transfer of Property Act and RERA, these matters require careful documentation review. We recommend consulting a Property Law specialist who can guide you on the legal process. Please note that this is general information and not legal advice; you should speak with a verified Property lawyer on JusticeJunction for your specific situation.";
  } else if (msg.includes('divorce') || msg.includes('marriage') || msg.includes('custody') || msg.includes('maintenance') || msg.includes('spouse') || msg.includes('wife') || msg.includes('husband')) {
    category = 'Family Law';
    reply = "Your issue appears to fall under Family Law, which covers matters like divorce, child custody, alimony, and family maintenance under personal laws like the Hindu Marriage Act or Special Marriage Act. Navigating these situations requires sensitive handling and understanding of procedural requirements. We suggest consulting a Family Law attorney to understand your options. Please note this information is for general awareness only and does not constitute legal advice. Consult a verified lawyer on our platform for guidance.";
  } else if (msg.includes('arrest') || msg.includes('bail') || msg.includes('police') || msg.includes('fir') || msg.includes('theft') || msg.includes('fraud') || msg.includes('cheating') || msg.includes('criminal')) {
    category = 'Criminal Defence';
    reply = "This matter concerns criminal allegations, FIRs, bail, or police procedures under the Indian Penal Code (IPC) / Bharatiya Nyaya Sanhita (BNS) and Code of Criminal Procedure (CrPC). In criminal issues, acting quickly to secure your legal rights is critical. We strongly recommend speaking to a Criminal Defence advocate who can assist with anticipatory bail or FIR quashing. Note: This general info is not legal advice. For your case, please consult a verified lawyer on JusticeJunction.";
  } else if (msg.includes('company') || msg.includes('contract') || msg.includes('startup') || msg.includes('agreement') || msg.includes('corporate') || msg.includes('partnership') || msg.includes('shareholder')) {
    category = 'Corporate Law';
    reply = "Your query relates to Corporate Law, which governs company registration, contract drafting, startup compliance, and partnership agreements under the Companies Act, 2013. Protecting business interests with well-drafted legal documents is highly recommended. You should search for a Corporate Law expert on our platform to review your documents. Please note that this is general legal information and not legal advice; you should consult a verified corporate advocate for your business needs.";
  } else if (msg.includes('consumer') || msg.includes('refund') || msg.includes('defective') || msg.includes('shop') || msg.includes('warranty') || msg.includes('rera') || msg.includes('scam')) {
    category = 'Consumer Rights';
    reply = "It seems you have a consumer dispute regarding a defective product, service deficiency, or unfair trade practice. Under the Consumer Protection Act, 2019, you can file a complaint with the Consumer Forum for compensation or refunds. We recommend consulting a Consumer Rights lawyer to draft your notice or filing. Note: This general guide is not legal advice. For custom assistance, consult a verified advocate on JusticeJunction.";
  } else if (msg.includes('salary') || msg.includes('termination') || msg.includes('employer') || msg.includes('employee') || msg.includes('pf') || msg.includes('job') || msg.includes('labour')) {
    category = 'Labour Law';
    reply = "Your issue is related to Labour Law and employment issues, such as wrongful termination, salary delays, or PF/gratuity disputes under Indian industrial and labour legislation. Having an expert review your employment contract can clarify your rights. You should consult a Labour Law attorney to pursue appropriate remedies. Disclaimer: This information is not legal advice. Please connect with a verified advocate on the platform for your case.";
  } else {
    reply = "Hello! I can help you categorize your legal query and recommend the right type of advocate. Could you provide a bit more detail? For example, does this involve property, a family matter, a criminal concern, or an employment dispute? Please note that I provide general legal information only, and you should always consult a verified lawyer on JusticeJunction for specific legal advice.";
  }

  return { reply, category };
}

function getUser(req) {
  const auth = req.headers.authorization;
  if (!auth) return null;
  try {
    return jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await connectDB();

  try {
    const { message, conversationHistory, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    // Authenticate user if token is present
    const user = getUser(req);
    const userId = user ? user.id : null;

    // Rate-limiting identifier (userId or sessionId)
    const rateLimitKey = userId ? userId.toString() : sessionId;

    // Perform Rate Limiting check
    const rateLimitCount = await AIRequestLog.countDocuments({ identifier: rateLimitKey });
    if (rateLimitCount >= 20) {
      return res.status(429).json({
        reply: "You have reached the maximum limit of 20 legal assistant queries per hour. Please wait a while or contact a verified lawyer directly for immediate assistance.",
        category: null,
        error: "Rate limit exceeded"
      });
    }

    // Register this request for rate-limiting
    await AIRequestLog.create({ identifier: rateLimitKey });

    const apiKey = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY;
    let assistantReply = '';
    let suggestedCategory = null;

    if (!apiKey || apiKey.startsWith('your_') || apiKey.includes('placeholder')) {
      // API Key not configured: Fall back to smart rule-based response
      const fallback = getFallbackResponse(message);
      assistantReply = fallback.reply;
      suggestedCategory = fallback.category;
    } else {
      // Format messages history for Claude API
      // Filter out system messages and ensure format is alternates of user and assistant
      const claudHistory = (conversationHistory || [])
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({
          role: m.role,
          content: m.content
        }));

      // Add current message to the chain if it's not already at the end
      if (claudHistory.length === 0 || claudHistory[claudHistory.length - 1].content !== message) {
        claudHistory.push({ role: 'user', content: message });
      }

      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            model: 'claude-3-5-haiku-20241022',
            max_tokens: 600,
            system: SYSTEM_PROMPT,
            messages: claudHistory
          })
        });

        if (!response.ok) {
          const err = await response.json();
          console.error('Claude API call failed:', err);
          const fallback = getFallbackResponse(message);
          assistantReply = fallback.reply;
          suggestedCategory = fallback.category;
        } else {
          const data = await response.json();
          const responseText = data.content?.[0]?.text || '';
          
          // Parse JSON from Claude
          try {
            const parsed = JSON.parse(responseText.trim());
            assistantReply = parsed.reply;
            suggestedCategory = parsed.category;
          } catch (jsonErr) {
            // Regex parsing fallback
            const replyMatch = responseText.match(/"reply"\s*:\s*"([^"]+)"/);
            const categoryMatch = responseText.match(/"category"\s*:\s*"([^"]+)"/);
            assistantReply = replyMatch ? replyMatch[1] : responseText;
            suggestedCategory = categoryMatch ? categoryMatch[1] : null;
          }
        }
      } catch (apiErr) {
        console.error('Anthropic fetch exception:', apiErr);
        const fallback = getFallbackResponse(message);
        assistantReply = fallback.reply;
        suggestedCategory = fallback.category;
      }
    }

    // Save conversation to MongoDB for review
    const dbMessages = [
      ...(conversationHistory || []).map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: message },
      { role: 'assistant', content: assistantReply }
    ];

    await AIConversation.findOneAndUpdate(
      { sessionId },
      {
        userId,
        sessionId,
        messages: dbMessages,
        createdAt: new Date()
      },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      reply: assistantReply,
      category: suggestedCategory
    });

  } catch (err) {
    console.error('AI assistant endpoint error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
