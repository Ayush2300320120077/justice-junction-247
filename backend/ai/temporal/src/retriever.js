'use strict';
// Hybrid lexical retriever (BM25 + TF-IDF cosine) over the version-aware corpus.
// Two modes: 'baseline' (date-blind, like the production Justice Junction retriever) and 'temporal'
// (applicability-filtered + crosswalk expansion).
const { tokenize, ngrams, TfIdf, cosine, BM25 } = require('./text');
const X = require('./crosswalk');
const { parseRefs } = require('./citations');
const { resolve, splitSegments, classifyFamily } = require('./resolver');
const OFFENCE_RE = /\b(offen[cs]e|crime|committed|occurred|took place|happened|act done|alleged)\b/i;

const stripHdr = c => c.text.replace(/^\s*\d+[A-Za-z]{0,2}\.\s*[^\n]{0,200}?\.[—–-]+\s*/, '');
const docTokens = c => ngrams(tokenize((c.title + ' ').repeat(3) + stripHdr(c).slice(0, 1500)));

// question-framing words that carry no statutory content (used only for the answerability/coverage signal)
const FRAME = new Set(tokenize('my case involves took place applies applicable governs dealt deals covers cited right explain provides provide alleged acted follows happened registered began commenced instituted proceedings trial fir police accused charged incident committed offence offences which what under apply'));
let _idx = null;
function index() {
  if (_idx) return _idx;
  const toks = X.corpus.map(docTokens);
  const uni = toks.map((t, i) => { const set = new Set(t.filter(x => !x.includes('_'))); set.title = new Set(tokenize(X.corpus[i].title)); return set; });
  _idx = { toks, uni, tfidf: new TfIdf(toks), bm25: new BM25(toks), pos: new Map(X.corpus.map((c, i) => [c.id, i])) };
  return _idx;
}

// strip dates / section refs / filler so they do not dominate the lexical match
function cleanQuery(q) {
  return String(q)
    .replace(/\b\d{1,2}(?:st|nd|rd|th)?\s*(?:of\s+)?[A-Za-z]{3,9}\.?,?\s*\d{4}\b/g, ' ')
    .replace(/\b[A-Za-z]{3,9}\.?\s+\d{1,2}(?:st|nd|rd|th)?,?\s*\d{4}\b/g, ' ')
    .replace(/\b[A-Za-z]{3,9}\.?,?\s+\d{4}\b/g, ' ')
    .replace(/\b\d{1,4}[\/.\-]\d{1,2}[\/.\-]\d{1,4}\b/g, ' ')
    .replace(/\b(?:sections?|sec\.?|s\.|u\/s)\s*\d+[A-Za-z]{0,2}/gi, ' ');
}

function rank(query, pool, k) {
  const { toks, tfidf, bm25, pos, uni } = index();
  const qt = ngrams(tokenize(cleanQuery(query)));
  const qu = [...new Set(qt.filter(t => !t.includes('_') && !FRAME.has(t)))];
  const qIdf = qu.map(t => tfidf.idf(t)), qIdfSum = qIdf.reduce((a, c) => a + c, 0) || 1;
  const qv = tfidf.vec(qt);
  const bm = bm25.scoreAll(qt);
  let bmMax = 0; for (const c of pool) bmMax = Math.max(bmMax, bm[pos.get(c.id)]);
  const qset = new Set(qu);
  const scored = pool.map(c => {
    const i = pos.get(c.id), cos = cosine(qv, tfidf.vecs[i]);
    const cov = qu.reduce((a, t, j) => a + (uni[i].has(t) ? qIdf[j] : 0), 0) / qIdfSum;        // idf-weighted query coverage
    const tt = uni[i].title; const tcov = tt.size ? [...tt].filter(t => qset.has(t)).length / tt.size : 0;
    return { chunk: c, cos, cov, tcov, bm25: bm[i], score: 0.4 * cos + 0.45 * (bmMax ? bm[i] / bmMax : 0) + 0.15 * tcov };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k);
}

function explicitHits(query) {
  return parseRefs(query).map(r => X.get(r.code, r.section)).filter(Boolean);
}

// ---- baseline: no dates, no filtering; literal section numbers still match (section-aware chunk headers) ----
function retrieveBaseline(query, { k = 5 } = {}) {
  const pins = explicitHits(query);
  const res = rank(query, X.corpus, k);
  const out = [];
  for (const c of pins) out.push({ chunk: c, cos: 1, cov: 1, bm25: 0, score: 2, pinned: true });
  for (const r of res) if (!out.some(o => o.chunk.id === r.chunk.id)) out.push(r);
  return { regimeInfo: null, segments: [{ text: query, family: null, regime: null, results: out.slice(0, k) }], notes: [] };
}

// ---- temporal: resolver -> applicability filter -> crosswalk expansion ----
function retrieveTemporal(query, { k = 5, family: forceFamily } = {}) {
  let segs = splitSegments(query);
  const contentLen = t => tokenize(cleanQuery(t)).filter(w => !FRAME.has(w)).length;
  // Fold date-only / fragment sentences into a neighbour, UNLESS the fragment carries its own event date whose role
  // (offence vs proceeding) differs from the neighbour's: that is a separate legal axis ("A case of kidnapping was
  // committed on <D1>. The FIR was registered on <D2>.") and must keep its own segment and regime.
  const roleOfSeg = t => { const r = resolve(t); return r.offence_date ? 'offence' : r.proceeding_date ? 'proceeding' : null; };
  const distinctAxis = (a, b) => { const ra = roleOfSeg(a), rb = roleOfSeg(b); return ra && rb && ra !== rb; };
  const merged = [];
  for (let i = 0; i < segs.length; i++) {
    let t = segs[i];
    while (i + 1 < segs.length && contentLen(t) < 3 && !distinctAxis(t, segs[i + 1])) t += ' ' + segs[++i];
    merged.push(t);
  }
  if (merged.length > 1 && contentLen(merged[merged.length - 1]) < 3 && !distinctAxis(merged[merged.length - 2], merged[merged.length - 1])) { const last = merged.pop(); merged[merged.length - 1] += ' ' + last; }
  segs = merged;
  const whole = resolve(query);
  const segments = [], notes = [...whole.notes];
  // Only split when the question has more than one dated/role-bearing sentence; otherwise treat as one segment.
  const datedSegs = segs.filter(s => resolve(s).offence_date || resolve(s).proceeding_date);
  const useSegs = segs.length > 1 && datedSegs.length > 1 ? segs : [query];
  for (const text of useSegs) {
    const info = useSegs.length > 1 ? resolve(text) : whole;
    const pinsRaw = parseRefs(text).map(r => X.get(r.code, r.section)).filter(Boolean);
    let family = forceFamily || (pinsRaw.length ? pinsRaw[0].code_family : classifyFamily(text));
    if (!forceFamily && !pinsRaw.length) {
      if (info.offence_date && !info.proceeding_date) family = 'PENAL';
      else if (info.proceeding_date && !info.offence_date && family === 'PENAL' && !OFFENCE_RE.test(text)) family = 'PROCEDURE';
    }
    // dates may live in a different sentence than the topic: fall back to whole-query regime for that family
    const regime = { ...whole.regime, ...Object.fromEntries(Object.entries(info.regime).filter(([, v]) => v)) };
    const want = regime[family];                       // applicable code for this segment's family
    const codes = want ? [want] : [X.OLD_OF[family], X.NEW_OF[family]];
    const pool = X.corpus.filter(c => codes.includes(c.code));
    // crosswalk-aware explicit references
    const pins = [];
    for (const r of parseRefs(text)) {
      const c = X.get(r.code, r.section); if (!c) continue;
      const fam = c.code_family;
      const wantF = regime[fam];
      if (!wantF || c.code === wantF) pins.push(c);          // already the right code (or date unknown -> keep as asked)
      if (!wantF || c.code !== wantF) for (const cp of X.counterpartsOf(c.id)) { const cc = X.byId.get(cp); if (cc && (!wantF || cc.code === wantF)) pins.push(cc); }
      if (wantF && c.code !== wantF && !X.counterpartsOf(c.id).length) notes.push(`${c.code} ${c.section} has no counterpart in ${wantF}; not applicable on the resolved date`);
    }
    const pinFamilies = new Set(pins.map(p => p.code_family));
    const usePool = pins.length ? X.corpus.filter(c => (codes.includes(c.code)) || (pinFamilies.has(c.code_family) && regime[c.code_family] === c.code)) : pool;
    let res = rank(text, usePool, k);
    if (want && !pins.length) {            // crosswalk-bridged retrieval: search the other regime's text, map hits to the applicable code
      const otherCode = want === X.OLD_OF[family] ? X.NEW_OF[family] : X.OLD_OF[family];
      const bridged = new Map(res.map(r => [r.chunk.id, r]));
      for (const r of rank(text, X.corpus.filter(c => c.code === otherCode), k))
        for (const cid of X.counterpartIn(r.chunk.id, want)) {
          const cc = X.byId.get(cid), sc = 0.95 * r.score, prev = bridged.get(cid);
          if (!prev || sc > prev.score) bridged.set(cid, { chunk: cc, cos: r.cos, cov: Math.max(r.cov, prev ? prev.cov : 0), bm25: r.bm25, score: sc, bridged: true });
        }
      res = [...bridged.values()].sort((a, b) => b.score - a.score).slice(0, k);
    }
    const out = [];
    for (const c of pins) if (!out.some(o => o.chunk.id === c.id)) out.push({ chunk: c, cos: 1, cov: 1, bm25: 0, score: 2, pinned: true });
    for (const r of res) if (!out.some(o => o.chunk.id === r.chunk.id)) out.push(r);
    segments.push({ text, family, regime, resolved: !!want, perCode: !want, results: out.slice(0, k) });
  }
  return { regimeInfo: whole, segments, notes };
}

module.exports = { index, rank, retrieveBaseline, retrieveTemporal, explicitHits, stripHdr };
