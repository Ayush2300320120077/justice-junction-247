require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const connectDB = require('../../middleware/db');
const CaseOutcome = require('../../models/CaseOutcome');
const AiInteractionLog = require('../../models/AiInteractionLog');
const AIRequestLog = require('../../models/AIRequestLog');
const ChatQuery = require('../../models/ChatQuery');
const PlatformSettings = require('../../models/PlatformSettings');
const { requireAuth } = require('../../middleware/auth');
const { retrieveContext } = require('../../backend/ai/retrieve');
const { classifyIssue } = require('../../backend/ai/classify');

const optionalAuth = (req, res, next) => {
  let token = req.cookies?.accessToken;
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    req.user = null;
    return next();
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    req.user = null;
  }
  next();
};

const app = express();

// ── AI rate limiter: 20 requests per user per hour ────────────────────────────
// keyGenerator uses req.user.id (set by requireAuth) so limits are per-user,
// not per-IP — prevents sharing a single IP limit across all users on a network.
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 AI requests per user per hour
  message: { error: 'AI request limit reached. Please try again in an hour.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user.id, // req.user is guaranteed to exist when this limiter is used
});

const aiAnonLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 AI requests per IP per hour for unauthenticated users
  message: { error: 'You have reached the free question limit. Please sign up for more.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const chatRateLimiter = (req, res, next) => {
  if (req.user) {
    return aiLimiter(req, res, next);
  } else {
    return aiAnonLimiter(req, res, next);
  }
};

// ── Daily cap helper ──────────────────────────────────────────────────────────
// Checks AIRequestLog (TTL-indexed, 1-hr expiry per doc) to enforce a 50-req/day
// ceiling on top of the hourly rate limit. Returns true if the user is over cap.
async function isOverDailyCap(userId) {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const countToday = await AIRequestLog.countDocuments({
    identifier: userId,
    timestamp: { $gte: since }
  });
  return countToday >= 50;
}

// ── Non-blocking AI request logger ───────────────────────────────────────────
async function logAIRequest(userId) {
  try {
    await AIRequestLog.create({ identifier: userId });
  } catch (logErr) {
    console.error('AIRequestLog write error (non-blocking):', logErr.message);
  }
}

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

router.post('/generate-document', requireAuth, aiLimiter, async (req, res) => {
  try {
    await connectDB();

    // ── Daily cap check (50 requests / 24 hours per user) ──────────────────────
    if (await isOverDailyCap(req.user.id)) {
      return res.status(429).json({ error: 'Daily AI usage limit reached. Please try again tomorrow.' });
    }

    const { documentType, answers } = req.body;
    if (!documentType) {
      return res.status(400).json({ error: 'documentType is required' });
    }
    if (!answers) {
      return res.status(400).json({ error: 'answers is required' });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    let draftText = '';
    let isMock = false;

    if (!apiKey || apiKey.startsWith('your_') || apiKey.includes('placeholder')) {
      console.log('Anthropic API key is not configured, falling back to local document generation.');
      draftText = generateMockDocument(documentType, answers);
      isMock = true;
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
          isMock = true;
        } else {
          const data = await response.json();
          draftText = data.content?.[0]?.text || '';
          if (!draftText) {
            draftText = generateMockDocument(documentType, answers);
            isMock = true;
          }
        }
      } catch (apiErr) {
        console.error('Anthropic network/fetch error:', apiErr);
        draftText = generateMockDocument(documentType, answers);
        isMock = true;
      }
    }

    // Parse draftText for all instances of [VERIFY WITH LAWYER: <reason>]
    const flaggedSections = [];
    const regex = /\[VERIFY WITH LAWYER: [^\]]+\]/g;
    let match;
    while ((match = regex.exec(draftText)) !== null) {
      flaggedSections.push(match[0]);
    }

    // ── Log this AI request (non-blocking) ────────────────────────────────────
    logAIRequest(req.user.id);

    return res.status(200).json({ draftText, flaggedSections, isMock });
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

/* ─── PATCH /api/ai/feedback ─── */
router.patch('/feedback', async (req, res) => {
  try {
    await connectDB();
    const { logId, rating } = req.body;
    if (!logId || rating === undefined) {
      return res.status(400).json({ error: 'logId and rating are required' });
    }
    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ error: 'rating must be a number between 1 and 5' });
    }
    const updated = await AiInteractionLog.findByIdAndUpdate(
      logId,
      { userFeedbackRating: numRating },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Log entry not found' });
    }
    return res.status(200).json({ success: true, logId: updated._id, userFeedbackRating: updated.userFeedbackRating });
  } catch (err) {
    console.error('AI feedback endpoint error:', err);
    return res.status(500).json({ error: err.message });
  }
});

/* ─── POST /api/ai/classify ─── */
router.post('/classify', requireAuth, aiLimiter, async (req, res) => {
  try {
    // ── Daily cap check (50 requests / 24 hours per user) ──────────────────────
    await connectDB();
    if (await isOverDailyCap(req.user.id)) {
      return res.status(429).json({ error: 'Daily AI usage limit reached. Please try again tomorrow.' });
    }

    const { text } = req.body;
    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'text string is required' });
    }

    // req.user is guaranteed by requireAuth — no manual Bearer decode needed
    const userId = req.user.id;

    const result = await classifyIssue(text, { userId });

    // ── Log this AI request (non-blocking) ────────────────────────────────────
    logAIRequest(userId);

    return res.status(200).json(result);
  } catch (err) {
    console.error('POST /api/ai/classify error:', err);
    return res.status(500).json({ error: err.message });
  }
});

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

router.post('/chat', optionalAuth, chatRateLimiter, async (req, res) => {
  const startTime = Date.now();
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'message string is required' });
    }

    // ── Daily cap check (50 requests / 24 hours per user) ──────────────────────
    await connectDB();
    if (req.user) {
      if (await isOverDailyCap(req.user.id)) {
        return res.status(429).json({
          error: 'Daily AI usage limit reached. Please try again tomorrow.',
          suggestedAction: { type: 'lawyer', link: '/search' }
        });
      }
    }

    // req.user is set by optionalAuth — no manual Bearer decode needed
    const user = req.user;
    const rateKey = user ? `user_${user.id}` : `anon_${req.ip}`;

    // 1. RAG Retrieval Phase
    let retrievedChunks = [];
    let ragFailed = false;

    // Minimum cosine similarity threshold for context relevance.
    // Dense embeddings (Voyage AI / OpenAI) score 0.60+, while local TF-IDF sparse fallback vectors score lower (~0.30+).
    // TODO: Maintain RELEVANCE_THRESHOLD = 0.60 as default once live Voyage AI (voyage-law-2) or OpenAI embeddings are active.
    const isLiveEmbedder = Boolean((process.env.VOYAGE_API_KEY && !process.env.VOYAGE_API_KEY.includes('your_')) || (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('your_')));
    const RELEVANCE_THRESHOLD = isLiveEmbedder ? 0.60 : 0.30;

    try {
      retrievedChunks = await retrieveContext(message.trim(), 5);
    } catch (ragErr) {
      console.warn('RAG Retrieval failed, executing fallback:', ragErr.message);
      ragFailed = true;
      retrievedChunks = [];
    }

    const relevantChunks = retrievedChunks.filter(c => c.score >= RELEVANCE_THRESHOLD);
    const hasHighRelevance = relevantChunks.length > 0;

    // Build Sources List for Frontend Widget
    const sources = relevantChunks.slice(0, 3).map(c => ({
      actName: c.metadata?.actName || 'Bare Act / Statute',
      sectionNumber: c.metadata?.sectionNumber || 'General',
      sectionTitle: c.metadata?.sectionTitle || '',
      score: c.score
    }));

    // Build Dynamic RAG System Prompt
    let contextText = '';
    if (hasHighRelevance) {
      contextText = relevantChunks.map((c, idx) => {
        return `[LEGAL CONTEXT CHUNK ${idx + 1}]\nAct Name: ${c.metadata?.actName || 'Statute'}\nSection: ${c.metadata?.sectionNumber || 'N/A'} - ${c.metadata?.sectionTitle || 'General'}\nRelevance Score: ${c.score}\nExcerpt:\n${c.text}`;
      }).join('\n\n');
    } else {
      contextText = 'NO HIGH-RELEVANCE LEGAL CONTEXT FOUND IN VECTOR DATABASE FOR THIS QUERY.';
    }

    const RAG_SYSTEM_PROMPT = `You are Justice Junction's official AI Legal Assistant specializing in Indian law (IPC/BNS, CPC, Consumer Protection, Constitution, RTI, Family Law, etc.).

RETRIEVED LEGAL CONTEXT FROM DATABASE:
${contextText}

CRITICAL CONSTRAINTS & BEHAVIOR:
1. CITATION REQUIREMENT:
   - Answer the user query using the retrieved legal context above and general Indian legal principles.
   - For every legal rule or claim, cite the specific Act name + section number from the retrieved context in this exact format: "(Act Name, Sec. SectionNumber)". Example: "(Consumer Protection Act, 2019, Sec. 35)".
   - Do NOT invent section numbers or statute names that are not present in the retrieved context or standard Indian law.
2. INSUFFICIENT CONTEXT FALLBACK:
   ${!hasHighRelevance ? '- The vector database did NOT return high-relevance specific legal sections for this exact query. State clearly that specific statutory section details for this exact query are not in the current database, provide a concise general overview under Indian law, and recommend consulting a verified lawyer on Justice Junction.' : ''}
3. MANDATORY DISCLAIMER:
   - Include the explicit statement: "This is general legal information, not legal advice. I recommend booking a verified lawyer on the platform for your specific situation."
4. SUGGESTED PLATFORM ACTIONS:
   - If user asks about drafting documents, agreements, or legal notices, include a suggestedAction with type "document" and link "/document-generator".
   - If user asks about case duration or win chance, include a suggestedAction with type "estimate" and link "/search".
   - If user asks to find/book a lawyer or needs active representation, include a suggestedAction with type "lawyer" and link "/search".

RESPONSE FORMAT:
Respond ONLY with valid JSON with no markdown formatting or backticks around it:
{
  "reply": "Your clear legal answer with citations like (Consumer Protection Act, 2019, Sec. 35)...",
  "suggestedAction": { "type": "document" | "estimate" | "lawyer", "link": "/document-generator" | "/search" }
}`;

        // Fetch PlatformSettings for API Key
    const settings = await PlatformSettings.findOne({}) || {};
    const aiProvider = settings.aiProvider || 'mock';
    let apiKey = settings.aiApiKey || '';
    
    // Fallback to env vars if setting is empty but provider is chosen
    if (!apiKey) {
      if (aiProvider === 'gemini') apiKey = process.env.GEMINI_API_KEY || '';
      if (aiProvider === 'anthropic') apiKey = process.env.ANTHROPIC_API_KEY || '';
    }

    // Handle Local Fallback
    if (aiProvider === 'mock' || !apiKey || apiKey.startsWith('your_') || apiKey.includes('placeholder')) {
      let action = null;
      const lower = message.toLowerCase();
      if (lower.includes('draft') || lower.includes('agreement') || lower.includes('document') || lower.includes('notice') || lower.includes('affidavit')) {
        action = { type: 'document', link: '/document-generator' };
      } else if (lower.includes('estimate') || lower.includes('win') || lower.includes('chance') || lower.includes('succeed') || lower.includes('duration')) {
        action = { type: 'estimate', link: '/search' };
      } else if (lower.includes('lawyer') || lower.includes('advocate') || lower.includes('hire') || lower.includes('consult') || lower.includes('book')) {
        action = { type: 'lawyer', link: '/search' };
      }

      let responseText = '';
      if (hasHighRelevance) {
        const top = relevantChunks[0];
        const citeStr = `(${top.metadata?.actName || 'Bare Act'}, Sec. ${top.metadata?.sectionNumber || 'N/A'})`;
        responseText = `Based on Indian legal provisions ${citeStr}:\n\n${top.text.replace(/\[.*?\]\n/, '')}\n\nThis is general legal information, not legal advice. I recommend booking a verified lawyer on the platform for your specific situation.`;
      } else {
        responseText = `Specific statutory sections for this query are not present in our current database. Under general Indian legal procedures, complaints or disputes can be filed before the competent tribunal or civil court.\n\nThis is general legal information, not legal advice. I recommend booking a verified lawyer on the platform for your specific situation.`;
      }

      const latencyMs = Date.now() - startTime;
      let logDoc = null;
      try {
        logDoc = await AiInteractionLog.create({
          userId: user?.id || null,
          query: message,
          retrievedChunks: retrievedChunks.map(c => ({
            sourceId: c.sourceId,
            score: c.score,
            metadata: c.metadata,
            text: c.text
          })),
          response: responseText,
          module: 'chat',
          latencyMs,
          ...(ragFailed ? { 'metadata.ragFailed': true } : {})
        });
      } catch (logErr) { /* non-blocking */ }

      // ── Log this AI request (non-blocking) ──────────────────────────────────
      if (user) {
        logAIRequest(user.id);
      }

      return res.status(200).json({
        reply: responseText,
        suggestedAction: action || { type: 'lawyer', link: '/search' },
        logId: logDoc?._id || null,
        sources,
        isMock: true
      });
    }

    let finalReply = '';
    let suggestedAction = undefined;
    let responseTextRaw = '';

    if (aiProvider === 'gemini') {
      const formattedHistory = [];
      if (Array.isArray(history)) {
        history.slice(-6).forEach(item => {
          const role = item.role === 'assistant' || item.role === 'bot' ? 'model' : 'user';
          const content = item.content || item.text;
          if (content) formattedHistory.push({ role, parts: [{ text: content }] });
        });
      }
      formattedHistory.push({ role: 'user', parts: [{ text: message }] });

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: RAG_SYSTEM_PROMPT }] },
          contents: formattedHistory
        })
      });

      if (!response.ok) throw new Error('Gemini API Error');
      const data = await response.json();
      responseTextRaw = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    } else {
      // Anthropic
      const formattedHistory = [];
      if (Array.isArray(history)) {
        history.slice(-6).forEach(item => {
          const role = item.role === 'assistant' || item.role === 'bot' ? 'assistant' : 'user';
          const content = item.content || item.text;
          if (content) formattedHistory.push({ role, content });
        });
      }
      formattedHistory.push({ role: 'user', content: message });

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20240620',
          max_tokens: 1000,
          system: RAG_SYSTEM_PROMPT,
          messages: formattedHistory
        })
      });

      if (!response.ok) throw new Error('Anthropic API Error');
      const data = await response.json();
      responseTextRaw = data.content?.[0]?.text?.trim() || '';
    }

    try {
      const parsed = JSON.parse(responseTextRaw.replace(/^\s*```json\s*/i, '').replace(/\s*```\s*$/i, ''));
      finalReply = parsed.reply || responseTextRaw;
      suggestedAction = parsed.suggestedAction || undefined;
    } catch (jsonErr) {
      finalReply = responseTextRaw;
    }

    const latencyMs = Date.now() - startTime;
    let logDoc = null;
    try {
      logDoc = await AiInteractionLog.create({
        userId: user?.id || null,
        query: message,
        retrievedChunks: retrievedChunks.map(c => ({ sourceId: c.sourceId, score: c.score, metadata: c.metadata, text: c.text })),
        response: finalReply,
        module: 'chat',
        latencyMs,
        ...(ragFailed ? { 'metadata.ragFailed': true } : {})
      });
    } catch (logErr) { /* non-blocking */ }

    if (user) {
      logAIRequest(user.id);
    }

    return res.status(200).json({
      reply: finalReply,
      suggestedAction,
      logId: logDoc?._id || null,
      sources
    });
    } catch (apiErr) {
      console.error('Anthropic fetch error in /chat:', apiErr);
      const latencyMs = Date.now() - startTime;
      let logDoc = null;
      try {
        logDoc = await AiInteractionLog.create({
          userId: user?.id || null,
          query: message,
          retrievedChunks: retrievedChunks.map(c => ({ sourceId: c.sourceId, score: c.score, metadata: c.metadata, text: c.text })),
          response: "An error occurred while processing your request.",
          module: 'chat',
          latencyMs,
          ...(ragFailed ? { 'metadata.ragFailed': true } : {})
        });
      } catch (lErr) {}

      return res.status(200).json({
        reply: "An error occurred while processing your request. This is general legal information, not legal advice. I recommend booking a verified lawyer on the platform for your specific situation.",
        suggestedAction: { type: 'lawyer', link: '/search' },
        logId: logDoc?._id || null,
        sources,
        isMock: true
      });
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

