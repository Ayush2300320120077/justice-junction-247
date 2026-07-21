require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const connectDB = require('../middleware/db');
const CaseOutcome = require('../models/CaseOutcome');

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

const router = express.Router();

const SYSTEM_PROMPT = `You are a professional legal drafting assistant specializing in Indian law.
Your task is to draft a formal legal document of the specified type using ONLY the provided fields (answers).
Do not invent any facts, names, dates, locations, or numbers that are not provided in the answers. If any crucial information is missing, use underscores or placeholders like "________".
You must write the document in formal legal language appropriate for India (e.g., standard terminology under Indian statutes like the Indian Contract Act, 1872, Negotiable Instruments Act, 1881, etc.).

CRITICAL REQUIREMENT:
You must identify any clauses or terms that require professional legal review (such as jurisdiction-specific terms, liability limits, indemnification clauses, dispute resolution, or waiver of rights). Next to every such clause, you MUST insert a bracketed placeholder in exactly this format: [VERIFY WITH LAWYER: <reason>], where <reason> is a short explanation of why a lawyer should review this specific clause (e.g., "Verify governing law and jurisdiction", "Verify liability limitation under Indian law"). Do not make the reasons generic; make them specific to the clause context.

Provide only the drafted document text. Do not include any conversational intro or outro.`;

function generateMockDocument(documentType, answers) {
  const now = new Date().toLocaleDateString('en-IN');
  let draftText = '';
  
  if (documentType === 'rental') {
    draftText = `RENTAL AGREEMENT / LEASE DEED

This RENTAL AGREEMENT is made and executed on this ${answers.startDate || now} at ${answers.state || '________'}, between:

LANDLORD: ${answers.landlord || '________'}
ADDRESS: ${answers.propertyAddress || '________'}
(Hereinafter referred to as the "LESSOR" / "FIRST PARTY")

AND

TENANT: ${answers.tenant || '________'}
(Hereinafter referred to as the "LESSEE" / "SECOND PARTY")

The LESSOR is the absolute owner of the property situated at: ${answers.propertyAddress || '________'}

TERMS AND CONDITIONS:

1. LEASE PERIOD: The Lessor hereby lets and the Lessee hereby takes on rent the said premises for a period of ${answers.period || '11'} months, commencing from ${answers.startDate || now}. [VERIFY WITH LAWYER: Verify if an 11-month lease term requires registration in the state of ${answers.state || 'jurisdiction'}]

2. MONTHLY RENT: The Lessee agrees to pay a monthly rent of ₹${answers.rent || '________'} (Rupees Only) to the Lessor on or before the 5th day of every calendar month.

3. SECURITY DEPOSIT: The Lessee has deposited a sum of ₹${answers.deposit || '0'} (Rupees Only) as an interest-free security deposit, which shall be refunded by the Lessor at the time of vacating the premises, subject to deductions for any damages or outstanding dues. [VERIFY WITH LAWYER: Check if the security deposit amount and refund terms comply with local state laws]

4. USAGE: The premises shall be used solely for residential purposes and the Lessee shall not sub-let or part with possession of the premises to any third party.

5. MAINTENANCE: The Lessee shall maintain the premises in good condition and shall be responsible for minor repairs and electricity/water charges.

6. TERMINATION: Either party may terminate this agreement by giving one month's prior written notice to the other party. [VERIFY WITH LAWYER: Confirm if a one-month notice period is standard and sufficient under state laws]

7. JURISDICTION: This agreement shall be governed by the laws of India and any disputes shall be subject to the jurisdiction of the courts in the State of ${answers.state || '________'}. [VERIFY WITH LAWYER: Verify that the governing courts and jurisdiction are appropriately defined]

IN WITNESS WHEREOF, the parties have signed this agreement on the date mentioned above.


_________________________          _________________________
Signature of Lessor                Signature of Lessee
${answers.landlord || '________'}     ${answers.tenant || '________'}


Witness 1: _________________________

Witness 2: _________________________`;
  } else if (documentType === 'legal-notice') {
    draftText = `LEGAL NOTICE

Date: ${answers.noticeDate || now}

TO,
${answers.recipientName || '________'}
${answers.recipientAddress || '________'}

SUBJECT: ${answers.subject || '________'}

Sir/Madam,

Under the instructions and on behalf of my client, ${answers.senderName || '________'}, residing at ${answers.senderAddress || '________'}, I hereby serve upon you this Legal Notice:

1. That the facts of the matter are as follows: ${answers.noticeBody || '________'}

2. That by way of this notice, my client seeks the following relief: ${answers.relief || '________'} [VERIFY WITH LAWYER: Ensure the relief sought is legally enforceable and appropriate under Indian civil/criminal law]

3. You are hereby called upon to comply with the above demands within ${answers.daysToRespond || '15'} days of receipt of this notice, failing which my client shall be constrained to initiate appropriate legal proceedings against you, including civil and criminal actions, at your cost and consequences. [VERIFY WITH LAWYER: Confirm if the notice response period matches the statutory minimum for this cause of action]

Issued under instructions.


_________________________
ADVOCATE FOR SENDER
(Office of ${answers.senderName || '________'})`;
  } else if (documentType === 'affidavit') {
    draftText = `GENERAL AFFIDAVIT

BEFORE THE COMPETENT AUTHORITY / NOTARY PUBLIC AT ${answers.city || '________'}

I, ${answers.name || '________'}, S/o / W/o ${answers.fatherName || '________'}, aged about ${answers.age || '___'} years, residing at ${answers.address || '________'}, do hereby solemnly affirm and state on oath as follows:

1. That I am the deponent in this affidavit and I am well conversant with the facts stated herein.

2. That the purpose of this affidavit is: ${answers.statement || '________'} [VERIFY WITH LAWYER: Check if this statement requires specific statutory wording for court submission]

3. That I declare that the contents of this affidavit are true and correct to the best of my knowledge, information, and belief, and nothing material has been concealed therefrom. [VERIFY WITH LAWYER: Deponent is criminally liable under IPC Section 193 for false statements in affidavits]

I verify that the above statement is true and correct.

Verified at ${answers.city || '________'} on this ${answers.date || now}.


_________________________
Signature of Deponent
(${answers.name || '________'})


IDENTIFIED BY ME,
ADVOCATE`;
  } else {
    // Default fallback document
    draftText = `LEGAL DOCUMENT DRAFT (${documentType.toUpperCase()})

This document is drafted based on user answers:
${Object.entries(answers || {}).map(([k, v]) => `${k}: ${v}`).join('\n')}

[VERIFY WITH LAWYER: Verify that the document type and legal clauses are valid and enforceable under Indian law]`;
  }
  
  return draftText;
}

router.post('/generate-document', async (req, res) => {
  try {
    await connectDB();
    const { documentType, answers } = req.body;
    if (!documentType) {
      return res.status(400).json({ error: 'documentType is required' });
    }
    if (!answers) {
      return res.status(400).json({ error: 'answers is required' });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    let draftText = '';

    if (!apiKey || apiKey.startsWith('your_') || apiKey.includes('placeholder')) {
      console.log('Anthropic API key is not configured, falling back to local document generation.');
      draftText = generateMockDocument(documentType, answers);
    } else {
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
            max_tokens: 4000,
            system: SYSTEM_PROMPT,
            messages: [
              {
                role: 'user',
                content: `Draft the following document type: "${documentType}".\nHere are the user-provided answers to incorporate:\n${JSON.stringify(answers, null, 2)}`
              }
            ]
          })
        });

        if (!response.ok) {
          const err = await response.json();
          console.error('Anthropic API error:', err);
          draftText = generateMockDocument(documentType, answers);
        } else {
          const data = await response.json();
          draftText = data.content?.[0]?.text || '';
          if (!draftText) {
            draftText = generateMockDocument(documentType, answers);
          }
        }
      } catch (apiErr) {
        console.error('Anthropic network/fetch error:', apiErr);
        draftText = generateMockDocument(documentType, answers);
      }
    }

    // Parse draftText for all instances of [VERIFY WITH LAWYER: <reason>]
    const flaggedSections = [];
    const regex = /\[VERIFY WITH LAWYER: [^\]]+\]/g;
    let match;
    while ((match = regex.exec(draftText)) !== null) {
      flaggedSections.push(match[0]);
    }

    return res.status(200).json({ draftText, flaggedSections });
  } catch (err) {
    console.error('AI generate document endpoint error:', err);
    return res.status(500).json({ error: err.message });
  }
});

/* ─── GET /api/ai/case-estimate?caseType=X ─── */
router.get('/case-estimate', async (req, res) => {
  try {
    await connectDB();
    const { caseType } = req.query;
    if (!caseType) return res.status(400).json({ error: 'caseType query param is required' });

    const results = await CaseOutcome.aggregate([
      { $match: { caseType: { $regex: new RegExp(`^${caseType.trim()}$`, 'i') } } },
      {
        $group: {
          _id: null,
          total:        { $sum: 1 },
          favorable:    { $sum: { $cond: [{ $in: ['$outcome', ['won', 'settled']] }, 1, 0] } },
          totalDuration:{ $sum: '$durationDays' }
        }
      }
    ]);

    const sampleSize = results[0]?.total ?? 0;

    if (sampleSize < 10) {
      return res.status(200).json({ caseType, insufficientData: true, sampleSize });
    }

    const favorable      = results[0].favorable;
    const totalDuration  = results[0].totalDuration;
    const winRate        = Math.round((favorable / sampleSize) * 100);
    const avgDurationDays= Math.round(totalDuration / sampleSize);

    return res.status(200).json({ caseType, winRate, avgDurationDays, sampleSize, insufficientData: false });
  } catch (err) {
    console.error('case-estimate error:', err);
    return res.status(500).json({ error: err.message });
  }
});

/* ─── POST /api/ai/log-outcome ─── */
router.post('/log-outcome', async (req, res) => {
  try {
    await connectDB();

    // JWT auth — same pattern as api/auth.js line 108
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Unauthorized: no token provided' });
    let decoded;
    try {
      decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ error: 'Unauthorized: invalid or expired token' });
    }
    if (decoded.role !== 'lawyer') {
      return res.status(403).json({ error: 'Forbidden: only lawyers can log case outcomes' });
    }

    const { caseType, outcome, durationDays, dateClosed } = req.body;

    // Validation
    if (!caseType || !outcome || durationDays === undefined || !dateClosed) {
      return res.status(400).json({ error: 'caseType, outcome, durationDays, and dateClosed are all required' });
    }
    if (!['won', 'lost', 'settled'].includes(outcome)) {
      return res.status(400).json({ error: 'outcome must be one of: won, lost, settled' });
    }
    if (typeof durationDays !== 'number' || durationDays < 0) {
      return res.status(400).json({ error: 'durationDays must be a non-negative number' });
    }

    const doc = await CaseOutcome.create({
      caseType: caseType.trim(),
      outcome,
      durationDays,
      dateClosed: new Date(dateClosed),
      lawyerId: decoded.id
    });

    return res.status(201).json({ success: true, outcome: doc });
  } catch (err) {
    console.error('log-outcome error:', err);
    return res.status(500).json({ error: err.message });
  }
});

/* ─── Rate Limiter for AI Chat (20 msgs / hr per IP/User) ─── */
const chatRateLimitMap = new Map();

/* ─── POST /api/ai/chat ─── */
const CHAT_SYSTEM_PROMPT = `You are Justice Junction's official AI Legal Assistant specializing in Indian law (IPC/BNS, CPC, Constitution, Consumer Protection, RTI, Family Law, etc.).

CRITICAL CONSTRAINTS & BEHAVIOR:
1. INFORMATIONAL ONLY: Provide clear, concise, and accurate general legal information based on Indian law. Never provide case-specific legal advice or outcome guarantees.
2. PLATFORM GUIDANCE & FEATURE RECOMMENDATION:
   - If the user asks about drafting contracts, agreements, legal notices, affidavits, or document generation, recommend our Document Generator tool and include a suggestedAction of type "document" with link "/document-generator".
   - If the user asks about case outcome probability, success rates, win chances, or duration estimates, recommend our Case Outcome Estimator tool and include a suggestedAction of type "estimate" with link "/search".
   - If the user asks to find, search for, or book a lawyer or advocate, recommend searching our verified lawyer directory and include a suggestedAction of type "lawyer" with link "/search".
3. LITIGATION / ACTIVE PROCEEDING REFUSAL:
   - If the user describes an active ongoing lawsuit, court hearing, arrest, criminal summons, or needs direct legal representation, politely inform them that AI cannot assist with active litigation and advise consulting a verified lawyer on Justice Junction immediately. Include a suggestedAction of type "lawyer" with link "/search".

RESPONSE FORMAT:
You MUST respond with valid JSON with no markdown formatting or backticks around it, like this:
{
  "reply": "Clear, concise legal information here.",
  "suggestedAction": { "type": "document" | "estimate" | "lawyer", "link": "/document-generator" | "/search" }
}
Note: "suggestedAction" is optional and should only be included if a specific platform feature is relevant.`;

router.post('/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'message string is required' });
    }

    // Rate Limiting (20 messages per IP/user per 60 minutes)
    let rateKey = 'anonymous';
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
        if (decoded && decoded.id) rateKey = `user_${decoded.id}`;
      } catch (e) {
        // Fallback to IP on invalid token
      }
    }
    if (rateKey === 'anonymous') {
      const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
      rateKey = `ip_${rawIp.toString().split(',')[0].trim()}`;
    }

    const now = Date.now();
    const windowMs = 60 * 60 * 1000; // 1 hour
    const userTimestamps = (chatRateLimitMap.get(rateKey) || []).filter(ts => now - ts < windowMs);

    if (userTimestamps.length >= 20) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        reply: 'You have reached the limit of 20 AI queries per hour. For immediate legal help, please connect with a verified lawyer.',
        suggestedAction: { type: 'lawyer', link: '/search' }
      });
    }

    userTimestamps.push(now);
    chatRateLimitMap.set(rateKey, userTimestamps);

    // Call Anthropic API
    const apiKey = process.env.ANTHROPIC_API_KEY;
    const fallbackResponse = {
      reply: "I am Justice Junction's AI Legal Assistant. I can provide general legal information on Indian law or help you navigate our document generator, case estimation tool, and lawyer directory. For specific advice on your case, please consult a verified lawyer on our platform.",
      suggestedAction: { type: 'lawyer', link: '/search' }
    };

    if (!apiKey || apiKey.startsWith('your_') || apiKey.includes('placeholder')) {
      // Local fallback if API key is not set
      let action = null;
      const lower = message.toLowerCase();
      if (lower.includes('draft') || lower.includes('agreement') || lower.includes('document') || lower.includes('notice') || lower.includes('affidavit')) {
        action = { type: 'document', link: '/document-generator' };
      } else if (lower.includes('estimate') || lower.includes('win') || lower.includes('chance') || lower.includes('succeed') || lower.includes('duration')) {
        action = { type: 'estimate', link: '/search' };
      } else if (lower.includes('lawyer') || lower.includes('advocate') || lower.includes('hire') || lower.includes('consult') || lower.includes('book')) {
        action = { type: 'lawyer', link: '/search' };
      }

      return res.status(200).json({
        reply: "I provide general legal information under Indian law. For personalized assistance, you can generate legal documents, estimate case timelines, or search for a verified lawyer on Justice Junction 24/7.",
        suggestedAction: action || { type: 'lawyer', link: '/search' }
      });
    }

    // Format rolling history (max 6 messages)
    const formattedHistory = [];
    if (Array.isArray(history)) {
      history.slice(-6).forEach(item => {
        const role = item.role === 'assistant' || item.role === 'bot' ? 'assistant' : 'user';
        const content = item.content || item.text;
        if (content) {
          formattedHistory.push({ role, content });
        }
      });
    }
    formattedHistory.push({ role: 'user', content: message });

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
          max_tokens: 1000,
          system: CHAT_SYSTEM_PROMPT,
          messages: formattedHistory
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        console.error('Anthropic API Error in /chat:', errData);
        return res.status(200).json(fallbackResponse);
      }

      const data = await response.json();
      const rawText = data.content?.[0]?.text?.trim() || '';

      try {
        const parsed = JSON.parse(rawText.replace(/^```json\s*/i, '').replace(/\s*```$/i, ''));
        return res.status(200).json({
          reply: parsed.reply || rawText,
          suggestedAction: parsed.suggestedAction || undefined
        });
      } catch (jsonErr) {
        return res.status(200).json({ reply: rawText || fallbackResponse.reply });
      }
    } catch (apiErr) {
      console.error('Anthropic fetch error in /chat:', apiErr);
      return res.status(200).json(fallbackResponse);
    }
  } catch (err) {
    console.error('POST /api/ai/chat route error:', err);
    return res.status(500).json({
      error: 'Internal server error',
      reply: 'An error occurred while processing your request. Please try searching for a verified lawyer directly.',
      suggestedAction: { type: 'lawyer', link: '/search' }
    });
  }
});

app.use('/api/ai', router);
module.exports = app;

