'use strict';
// Four-check citation verifier:  V1 exists, V2 supported by retrieved context, V3 temporally applicable,
// V4 claim entailed by the cited section.  Failures are labelled with the six-class taxonomy (T1..T6) and
// can be repaired via the crosswalk or dropped.
const X = require('./crosswalk');
const { tokenize } = require('./text');
const { parseCitations } = require('./citations');
const { stripHdr } = require('./retriever');
const G = require('./generator');

const NUM_WORDS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, fourteen: 14, fifteen: 15, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, ninety: 90, hundred: 100 };
function numbersIn(s) {
  const out = new Set();
  for (const m of String(s).matchAll(/\b\d[\d,]*\b/g)) out.add(m[0].replace(/,/g, ''));
  for (const w of String(s).toLowerCase().match(/[a-z]+/g) || []) if (NUM_WORDS[w]) out.add(String(NUM_WORDS[w]));
  return out;
}
// remove the citation + lead-in ("Title:") so the cited section's own title does not inflate overlap
function claimBody(claim) {
  return claim.replace(/\((?:[^()]*?),\s*Sec(?:tion)?\.?\s*[^()]*\)/gi, ' ').replace(/\b(?:section|sec\.?)\s*\d+[A-Za-z]?\b/gi, ' ');
}
function sectionTokens(c) { return new Set(tokenize(c.title + ' ' + stripHdr(c))); }

// Lexical entailment: share of the claim's content tokens present in the cited section, and every
// number in the claim must also occur in the section (punishment terms, ages, days).
function lexicalEntailment(claim, chunk, { tau = 0.72 } = {}) {
  const body = claimBody(claim); const ct = [...new Set(tokenize(body))];
  if (!ct.length) return { ok: true, coverage: 1, numOk: true };
  const st = sectionTokens(chunk);
  const cov = ct.filter(t => st.has(t)).length / ct.length;
  const secNums = numbersIn(chunk.title + ' ' + stripHdr(chunk));
  const bad = [...numbersIn(body)].filter(n => !secNums.has(n) && !/^(19|20)\d\d$/.test(n));
  return { ok: cov >= tau && bad.length === 0, coverage: cov, numOk: bad.length === 0, badNumbers: bad };
}

function sameNumberOtherCode(c) {   // e.g. cited BNS 302 -> IPC 302 (claim written for the old number)
  const fam = c.code_family; const out = [];
  for (const code of [X.OLD_OF[fam], X.NEW_OF[fam]]) if (code !== c.code) { const o = X.get(code, c.section); if (o) out.push(o); }
  return out;
}

// ctx: { retrievedIds:Set|null, regime:{PENAL,PROCEDURE,EVIDENCE} , tau, judge?:async fn }
function verifyOne(cit, ctx) {
  const chunk = X.byId.get(cit.id) || null;
  const r = { id: cit.id, code: cit.code, section: cit.section, claim: cit.claim, V1: !!chunk, V2: null, V3: null, V4: null, labels: [], detail: {} };
  if (!chunk) { r.labels.push('T1'); r.verdict = 'fail'; return r; }
  r.V2 = ctx.retrievedIds ? ctx.retrievedIds.has(cit.id) : null;
  const want = ctx.regime ? ctx.regime[chunk.code_family] : null;
  r.V3 = want ? chunk.code === want : null;           // null = date unresolved (cannot decide)
  const ent = lexicalEntailment(cit.claim, chunk, { tau: ctx.tau });
  r.V4 = ent.ok; r.detail.entail = ent;
  if (r.V3 === false) r.labels.push('T3');
  if (r.V4 === false) {
    const alt = sameNumberOtherCode(chunk).find(o => lexicalEntailment(cit.claim, o, { tau: ctx.tau }).ok);
    if (alt && alt.code !== chunk.code) { r.labels.push('T4'); r.detail.claimMatches = alt.id; }
    else if (ent.numOk && ent.coverage < 0.4) r.labels.push('T2');
    else r.labels.push('T5');
  }
  if (r.V2 === false) r.detail.notInContext = true;
  r.verdict = (r.V3 === false || r.V4 === false || r.V2 === false) ? 'fail' : (r.V3 === null ? 'needs_date' : 'pass');
  return r;
}

function verifyAnswer(answer, ctx) {
  const cits = parseCitations(answer).map(c => verifyOne(c, ctx));
  return { citations: cits, ok: cits.every(c => c.verdict === 'pass' || c.verdict === 'needs_date'), failed: cits.filter(c => c.verdict === 'fail'), needsDate: cits.filter(c => c.verdict === 'needs_date') };
}

// Repair: replace a temporally inapplicable citation by its counterpart in the applicable code (claim regenerated
// from the counterpart text); drop everything else that failed. Returns new answer text and a log.
function repairAnswer(answer, report, ctx) {
  const lines = String(answer).split('\n'); const log = [];
  const failedByClaim = new Map();
  for (const f of report.failed) failedByClaim.set(f.claim, f);
  const out = [];
  for (const line of lines) {
    const hit = [...failedByClaim.entries()].find(([claim]) => line.includes(claim.slice(0, 60)));
    if (!hit) { out.push(line); continue; }
    const f = hit[1]; const chunk = X.byId.get(f.id);
    const want = chunk && ctx.regime ? ctx.regime[chunk.code_family] : null;
    let repl = null;
    if (chunk && want && f.V3 === false) repl = X.counterpartIn(chunk.id, want).map(id => X.byId.get(id))[0] || null;
    else if (f.labels.includes('T4') && f.detail.claimMatches) { const o = X.byId.get(f.detail.claimMatches); if (o && (!want || o.code === want)) repl = o; }
    if (repl) { out.push(G.claimFor(repl)); log.push({ action: 'replace', from: f.id, to: repl.id, labels: f.labels }); }
    else log.push({ action: 'drop', id: f.id, labels: f.labels });
  }
  return { answer: out.join('\n'), log };
}

module.exports = { verifyAnswer, verifyOne, repairAnswer, lexicalEntailment, numbersIn };
