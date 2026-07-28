require('dotenv').config();
const connectDB = require('../../middleware/db');
const AiInteractionLog = require('../../models/AiInteractionLog');


const ALLOWED_CATEGORIES = [
  'Criminal Defence',
  'Family Law',
  'Property Law',
  'Corporate Law',
  'Consumer Rights',
  'Labour Law',
  'Cyber Law',
  'Intellectual Property',
  'Taxation',
  'Civil Disputes',
  'Divorce',
  'Bail & FIR'
];

const EMERGENCY_KEYWORDS = [
  'arrest', 'police', 'jail', 'bail', 'fir', 'custody', 'raid',
  'domestic violence', 'assault', 'threat', 'eviction', 'harassment',
  'seizure', 'kidnap', 'lockup', 'beaten', 'extortion'
];

/**
 * Local fallback keyword classifier when no Anthropic API key is set.
 */
function localClassifyFallback(text) {
  const lower = text.toLowerCase();
  let category = 'Civil Disputes'; // Default fallback
  let confidence = 0.70;

  if (lower.includes('hack') || lower.includes('cyber') || lower.includes('phishing') || lower.includes('fake profile') || lower.includes('online fraud') || lower.includes('social media')) {
    category = 'Cyber Law';
    confidence = 0.93;
  } else if (lower.includes('tax') || lower.includes('gst') || lower.includes('income tax') || lower.includes('audit notice')) {
    category = 'Taxation';
    confidence = 0.92;
  } else if (lower.includes('trademark') || lower.includes('patent') || lower.includes('copyright') || lower.includes('logo') || lower.includes('brand')) {
    category = 'Intellectual Property';
    confidence = 0.94;
  } else if (lower.includes('divorce') || lower.includes('alimony') || lower.includes('mutual consent divorce')) {
    category = 'Divorce';
    confidence = 0.92;
  } else if (lower.includes('bail') || lower.includes('fir') || lower.includes('police lockup') || lower.includes('complaint at police station')) {
    category = 'Bail & FIR';
    confidence = 0.90;
  } else if (lower.includes('arrest') || lower.includes('crime') || lower.includes('criminal defence') || lower.includes('accused of theft') || lower.includes('accused of assault')) {
    category = 'Criminal Defence';
    confidence = 0.88;
  } else if (lower.includes('custody') || lower.includes('guardianship') || lower.includes('adoption') || lower.includes('family dispute')) {
    category = 'Family Law';
    confidence = 0.85;
  } else if (lower.includes('property') || lower.includes('land') || lower.includes('flat') || lower.includes('builder') || lower.includes('tenant') || lower.includes('lease') || lower.includes('rent')) {
    category = 'Property Law';
    confidence = 0.89;
  } else if (lower.includes('defective') || lower.includes('consumer') || lower.includes('refund') || lower.includes('warranty')) {
    category = 'Consumer Rights';
    confidence = 0.91;
  } else if (lower.includes('job') || lower.includes('salary') || lower.includes('employer') || lower.includes('employee') || lower.includes('labour') || lower.includes('severance')) {
    category = 'Labour Law';
    confidence = 0.88;
  } else if (lower.includes('company') || lower.includes('startup') || lower.includes('shareholder') || lower.includes('equity') || lower.includes('incorporation')) {
    category = 'Corporate Law';
    confidence = 0.87;
  }


  const isEmergency = EMERGENCY_KEYWORDS.some(k => lower.includes(k));
  const urgency = isEmergency ? 'emergency' : 'routine';
  const urgencyReason = isEmergency
    ? 'Problem description contains immediate police, arrest, custody, or emergency safety concerns.'
    : 'Standard legal guidance and consultation requested.';

  return {
    category,
    confidence,
    urgency,
    urgencyReason
  };
}

/**
 * Classifies a free-text legal problem into one of 12 categories + emergency/routine urgency.
 * @param {string} freeText Client problem description
 * @param {object} [options] Options object { userId }
 * @returns {Promise<{ category: string, confidence: number, urgency: 'emergency'|'routine', urgencyReason: string }>}
 */
async function classifyIssue(freeText, options = {}) {
  const startTime = Date.now();
  if (!freeText || typeof freeText !== 'string' || !freeText.trim()) {
    return {
      category: 'Civil Disputes',
      confidence: 0.5,
      urgency: 'routine',
      urgencyReason: 'Empty query text provided.'
    };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  let result = null;

  if (!apiKey || apiKey.startsWith('your_') || apiKey.includes('placeholder')) {
    result = localClassifyFallback(freeText);
  } else {
    const prompt = `You are a formal Indian legal classifier. Analyze the following user problem description and categorize it into EXACTLY ONE of the allowed specializations listed below. Also evaluate whether this matter requires emergency immediate legal intervention (e.g. active arrest, police station summons, FIR, immediate eviction, domestic violence, threat to personal safety).

ALLOWED SPECIALIZATIONS (YOU MUST PICK EXACTLY ONE FROM THIS LIST):
${JSON.stringify(ALLOWED_CATEGORIES, null, 2)}

USER PROBLEM DESCRIPTION:
"${freeText.trim()}"

RESPONSE FORMAT:
Respond ONLY with valid JSON with no markdown formatting or backticks around it:
{
  "category": "One of the 12 allowed specializations listed above",
  "confidence": 0.95,
  "urgency": "emergency" or "routine",
  "urgencyReason": "Short explanation for urgency rating"
}`;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 300,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const rawText = data.content?.[0]?.text?.trim() || '';
        try {
          const parsed = JSON.parse(rawText.replace(/^```json\s*/i, '').replace(/\s*```$/i, ''));
          if (ALLOWED_CATEGORIES.includes(parsed.category)) {
            result = {
              category: parsed.category,
              confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.9,
              urgency: parsed.urgency === 'emergency' ? 'emergency' : 'routine',
              urgencyReason: parsed.urgencyReason || ''
            };
          }
        } catch (e) {
          console.warn('Failed to parse Claude JSON response for classifier:', rawText);
        }
      }
    } catch (err) {
      console.warn('Anthropic API fetch error in classifyIssue:', err.message);
    }

    if (!result) {
      result = localClassifyFallback(freeText);
    }
  }

  const latencyMs = Date.now() - startTime;

  // Log every call to AiInteractionLog (module: "classify")
  try {
    await connectDB();
    await AiInteractionLog.create({
      userId: options.userId || null,
      query: freeText,
      retrievedChunks: [],
      response: JSON.stringify(result),
      module: 'classify',
      latencyMs
    });
  } catch (logErr) {
    // Non-blocking log error
  }

  return result;
}

module.exports = {
  classifyIssue,
  ALLOWED_CATEGORIES
};
