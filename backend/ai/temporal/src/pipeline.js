'use strict';
// System configurations compared in the paper:
//   C0 LLM only | C1 baseline RAG | C1L "latest law only" RAG | C2 +date filter | C3 +verifier | C4 full
const X = require('./crosswalk');
const R = require('./retriever');
const G = require('./generator');
const V = require('./verifier');
const { resolve } = require('./resolver');
const { parseCitations } = require('./citations');

let TUNED = {};
try { TUNED = require('../data/params.json'); } catch (_) { /* untuned defaults */ }
const DEFAULTS = { m: 1, theta: 0.5, tau: 0.72, generator: 'offline', k: 5, ...TUNED };
const REFERRAL = 'I could not verify a provision that applies on the relevant date. Please consult a verified lawyer on Justice Junction.';
const ASK = 'Please tell me the date of the offence (for substantive law) and the date the case/FIR/trial began (for procedure and evidence): the applicable code depends on whether it was before or on/after 1 July 2024.';

async function generate(cfg, query, retrieval) {
  if (cfg.generateFn) return cfg.generateFn(query, retrieval ? retrieval.segments : null);   // host application's own LLM call
  if (cfg.generator === 'claude') return G.claudeGenerate({ query, segments: retrieval ? retrieval.segments : null });
  if (!retrieval) throw new Error('C0 (no retrieval) needs the Claude generator: set ANTHROPIC_API_KEY and --generator claude');
  return G.offlineGenerate({ segments: retrieval.segments, m: cfg.m, theta: cfg.theta });
}

function retrievalFor(config, query, cfg) {
  if (config === 'C0') return null;
  if (config === 'C1' || config === 'C3') return R.retrieveBaseline(query, { k: cfg.k });
  if (config === 'C1L') {      // naive "always the latest law" heuristic
    const r = R.retrieveBaseline(query, { k: 30 });
    for (const s of r.segments) s.results = s.results.filter(x => X.NEW_OF[x.chunk.code_family] === x.chunk.code).slice(0, cfg.k);
    return r;
  }
  return R.retrieveTemporal(query, { k: cfg.k });   // C2, C4
}

async function run(config, query, opts = {}) {
  const cfg = { ...DEFAULTS, ...opts };
  const trace = { config };
  const retrieval = retrievalFor(config, query, cfg);
  const retrievedIds = retrieval ? new Set(retrieval.segments.flatMap(s => s.results.map(r => r.chunk.id))) : new Set();
  let answer = await generate(cfg, query, retrieval);
  trace.retrieved = retrieval ? retrieval.segments.map(s => s.results.map(r => r.chunk.id)) : [];
  const info = resolve(query); trace.regime = info.regime; trace.notes = [...info.notes, ...(retrieval ? retrieval.notes : [])];
  const useVerifier = config === 'C3' || config === 'C4';
  let status = 'answered', verification = null;
  if (useVerifier) {
    const ctx = { retrievedIds, regime: info.regime, tau: cfg.tau };
    verification = V.verifyAnswer(answer, ctx);
    trace.initialFlags = verification.failed.map(f => ({ id: f.id, labels: f.labels, V1: f.V1, V2: f.V2, V3: f.V3, V4: f.V4 }));
    if (verification.failed.length) {
      const rep = V.repairAnswer(answer, verification, ctx);
      answer = rep.answer; trace.repairs = rep.log;
      for (const r of rep.log) if (r.to) retrievedIds.add(r.to);   // replacement text comes from corrected context
      verification = V.verifyAnswer(answer, ctx);
    }
    if (verification.failed.length) {                       // anything still failing is removed, never shown
      answer = answer.split('\n').filter(l => !verification.failed.some(f => l.includes(f.claim.slice(0, 60)))).join('\n');
      verification = V.verifyAnswer(answer, ctx);
    }
    trace.finalVerification = verification.citations.map(c => ({ id: c.id, verdict: c.verdict }));
  }
  let cites = parseCitations(answer);
  const needsDate = (retrieval && config !== 'C1' && config !== 'C1L' && config !== 'C3' && retrieval.segments.some(s => s.perCode)) ||
    (config === 'C3' && verification && verification.needsDate.length > 0);
  if (!cites.length) { status = 'abstained'; answer = useVerifier && trace.initialFlags && trace.initialFlags.length ? REFERRAL : answer; }
  else if (needsDate) { status = 'ask_dates'; answer = answer + '\n' + ASK; }
  return { config, query, status, answer, citations: cites.map(c => c.id), trace };
}

module.exports = { run, DEFAULTS, ASK, REFERRAL };
