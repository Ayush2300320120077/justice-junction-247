'use strict';
// Answer generators. `offline` is a deterministic extractive reader (no network): it cites the retrieved
// provisions it is given, so it isolates retrieval + temporal + verification effects.
// `claude` calls the Anthropic Messages API (needs ANTHROPIC_API_KEY) and is the one to use for the
// no-retrieval (C0) baseline and for measuring true generative hallucination (T2/T5/T6).
const X = require('./crosswalk');
const { stripHdr } = require('./retriever');

const SHORT = { IPC: 'Indian Penal Code', BNS: 'Bharatiya Nyaya Sanhita', CRPC: 'Code of Criminal Procedure', BNSS: 'Bharatiya Nagarik Suraksha Sanhita', IEA: 'Indian Evidence Act', BSA: 'Bharatiya Sakshya Adhiniyam' };
const cite = c => `(${SHORT[c.code]}, Sec. ${c.section})`;
function leadSentence(c, max = 240) {
  const t = stripHdr(c).replace(/\s+/g, ' ').trim();
  if (!t) return c.title;
  const cut = t.slice(0, max); const i = cut.search(/[.;:](?=\s|$)/);
  return (i > 40 ? cut.slice(0, i) : cut).replace(/[\s,]+$/, '');
}
const claimFor = c => `${c.title}: ${leadSentence(c)} ${cite(c)}.`;

// theta: minimum idf-weighted query-term coverage for a chunk to count as "relevant context found"
function offlineGenerate({ segments, m = 1, theta = 0.25 }) {
  const lines = []; let any = false;
  for (const seg of segments) {
    const rs = seg.results.filter(r => r.pinned || r.cov >= theta);
    if (!rs.length) continue;
    let chosen;
    if (seg.resolved === false && seg.perCode) {           // date unknown: one provision per candidate regime
      const byCode = new Map();
      for (const r of rs) if (!byCode.has(r.chunk.code)) byCode.set(r.chunk.code, r);
      chosen = [...byCode.values()];
    } else chosen = rs.slice(0, m);
    for (const r of chosen) { lines.push(claimFor(r.chunk)); any = true; }
  }
  return any ? lines.join('\n') : 'No relevant provision was found in the available context.';
}

// ---- optional LLM generator (not executed in the offline harness) ----
// Responses are cached on disk (results/llm_cache.json) keyed by the full request, so identical prompts (e.g. C1 and C3,
// or C2 and C4) are generated once and an interrupted run resumes where it stopped. 429/5xx/network errors are retried.
const fs = require('fs'), nodePath = require('path'), crypto = require('crypto');
const CACHE_FILE = process.env.JJ_LLM_CACHE || nodePath.join(__dirname, '../results/llm_cache.json');
let _cache = null, _dirty = 0;
function cacheLoad() { if (!_cache) { try { _cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8')); } catch (_) { _cache = {}; } } return _cache; }
function cacheFlush() { if (_cache && _dirty) { fs.mkdirSync(nodePath.dirname(CACHE_FILE), { recursive: true }); fs.writeFileSync(CACHE_FILE, JSON.stringify(_cache)); _dirty = 0; } }
process.on('exit', cacheFlush);
const sleep = ms => new Promise(r => setTimeout(r, ms));
// Provider: JJ_PROVIDER=claude (default) or gemini. Gemini needs GEMINI_API_KEY (free tier from Google AI Studio) and optionally
// JJ_MODEL (default gemini-2.5-flash; use whichever free model AI Studio lists for your project).
async function callClaude({ system, user, model, maxTokens = 700 }) {
  const gem = (process.env.JJ_PROVIDER || (process.env.GEMINI_API_KEY && !process.env.ANTHROPIC_API_KEY ? 'gemini' : 'claude')) === 'gemini';
  model = model || process.env.JJ_MODEL || (gem ? 'gemini-2.5-flash' : 'claude-sonnet-5-5');
  const key = gem ? process.env.GEMINI_API_KEY : process.env.ANTHROPIC_API_KEY; if (!key) throw new Error((gem ? 'GEMINI_API_KEY' : 'ANTHROPIC_API_KEY') + ' not set');
  const base = (gem ? (process.env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com') : (process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com')).replace(/\/$/, '');
  const ck = crypto.createHash('sha256').update(JSON.stringify([gem ? 'gemini' : 'claude', base, model, maxTokens, system, user])).digest('hex');
  const c = cacheLoad(); if (c[ck] !== undefined) return c[ck];
  const url = gem ? `${base}/v1beta/models/${model}:generateContent` : base + '/v1/messages';
  const headers = gem ? { 'content-type': 'application/json', 'x-goog-api-key': key } : { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' };
  const body = gem
    ? { systemInstruction: { parts: [{ text: system }] }, contents: [{ role: 'user', parts: [{ text: user }] }], generationConfig: { temperature: 0, maxOutputTokens: Math.max(maxTokens, 4096) } }
    : { model, max_tokens: maxTokens, temperature: 0, system, messages: [{ role: 'user', content: user }] };
  let lastErr;
  for (let attempt = 0; attempt < 6; attempt++) {
    try {
      const r = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
      if (r.status === 429 || r.status >= 500) { lastErr = new Error(`LLM API ${r.status}`); await sleep(2000 * 2 ** attempt); continue; }
      if (!r.ok) throw new Error(`LLM API ${r.status}: ${(await r.text()).slice(0, 200)}`);
      const j = await r.json();
      const text = gem ? (j.candidates || []).flatMap(x => (x.content && x.content.parts) || []).map(x => x.text || '').join('') : (j.content || []).map(x => x.text || '').join('');
      if (!text) { lastErr = new Error('LLM API returned an empty response'); await sleep(1000); continue; }
      c[ck] = text; if (++_dirty >= 20) cacheFlush(); return text;
    } catch (e) { if (/^LLM API 4\d\d/.test(e.message) && !/429/.test(e.message)) throw e; lastErr = e; await sleep(2000 * 2 ** attempt); }
  }
  throw lastErr;
}
const CITE_RULE = 'Cite every legal proposition as "(Act Name, Sec. N)" using the full act name (e.g. "(Bharatiya Nyaya Sanhita, Sec. 103)"). Keep the answer under 150 words. End with: "This is general information, not legal advice."';
async function claudeGenerate({ query, segments }) {
  if (!segments) {   // C0: no retrieval
    return callClaude({ system: `You are an assistant answering questions on Indian law. ${CITE_RULE}`, user: query });
  }
  const ctx = segments.flatMap(s => s.results).filter((r, i, a) => a.findIndex(x => x.chunk.id === r.chunk.id) === i)
    .map(r => `[${SHORT[r.chunk.code]} – Section ${r.chunk.section}: ${r.chunk.title}]\n${stripHdr(r.chunk).slice(0, 1200)}`).join('\n\n');
  return callClaude({
    system: `You are an Indian legal information assistant. Use the retrieved context below; you may add general Indian legal principles. If nothing relevant was found, say so. ${CITE_RULE}\n\nCONTEXT:\n${ctx}`,
    user: query,
  });
}
// LLM-as-judge entailment (V4 with a model). Returns true/false.
async function claudeEntails(claim, sectionText) {
  const out = await callClaude({ maxTokens: 5, system: 'You judge whether a statutory text entails a claim. Reply with exactly YES or NO.', user: `STATUTE TEXT:\n${sectionText.slice(0, 1800)}\n\nCLAIM:\n${claim}\n\nDoes the statute text entail the claim?` });
  return /^\s*yes/i.test(out);
}
module.exports = { SHORT, cite, claimFor, leadSentence, offlineGenerate, claudeGenerate, claudeEntails, callClaude };
