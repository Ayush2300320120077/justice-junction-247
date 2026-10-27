'use strict';
// Verifier challenge set: take correct (question, answer) pairs and inject one error of each taxonomy class.
// Measures how often the verifier flags the corrupted citation (recall per class) and how often it wrongly
// flags a correct one (false-positive rate). Independent of any LLM.
const X = require('../src/crosswalk');
const G = require('../src/generator');
const V = require('../src/verifier');
const { resolve } = require('../src/resolver');
const { stripHdr } = require('../src/retriever');
const { tokenize } = require('../src/text');
const Q = require('../data/jj_statqa_v2.json');

let seed = 7;
const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const pick = a => a[Math.floor(rnd() * a.length)];
const byCode = {}; for (const c of X.corpus) (byCode[c.code] = byCode[c.code] || []).push(c);
const citeText = (c, text) => `${text.replace(/\s*\([^()]*Sec\.[^()]*\)\.?\s*$/, '')} ${G.cite(c)}.`;

function build(split, n = 200) {
  const src = Q.filter(q => q.split === split && ['temporal_lookup', 'boundary', 'month_only'].includes(q.type));
  const items = [];
  for (const q of src) {
    const gold = X.byId.get(q.gold_provisions[0]); const goldClaim = G.claimFor(gold);
    const lead = `${gold.title}: ${G.leadSentence(gold)}`;
    // clean
    items.push({ qid: q.qid, kind: 'clean', question: q.question, answer: goldClaim, expect: null, target: gold.id });
    // T1 fabricated section number
    let num = parseInt(gold.section, 10) + 700; while (X.get(gold.code, String(num))) num++;
    items.push({ qid: q.qid, kind: 'T1', question: q.question, answer: `${lead} (${G.SHORT[gold.code]}, Sec. ${num}).`, expect: 'T1', target: `${gold.code}_${num}` });
    // T2 wrong (real, unrelated) provision in the right code
    const tset = t => new Set(tokenize(t)); const gT = tset(gold.title);
    const jac = c => { const a = tset(c.title); const i = [...a].filter(x => gT.has(x)).length; return i / (a.size + gT.size - i || 1); };
    const unrelated = pick(byCode[gold.code].filter(c => c.id !== gold.id && stripHdr(c).length > 60 && jac(c) < 0.15));
    items.push({ qid: q.qid, kind: 'T2', question: q.question, answer: `${lead} ${G.cite(unrelated)}.`, expect: 'T2', target: unrelated.id });
    // T3 temporal misgrounding: correct content, but cited from the code NOT in force on the date
    const wrong = X.byId.get(q.wrong_code_provisions[0]);
    if (wrong && wrong.code !== gold.code) items.push({ qid: q.qid, kind: 'T3', question: q.question, answer: G.claimFor(wrong), expect: 'T3', target: wrong.id });
    // T4 cross-code mismatch: text of one code's section under the other code's name + same number
    const other = X.byId.get(q.wrong_code_provisions[0]);
    if (other) { const sameNum = X.get(gold.code, other.section); if (sameNum && sameNum.id !== gold.id && sameNum.code === gold.code) items.push({ qid: q.qid, kind: 'T4', question: q.question, answer: `${other.title}: ${G.leadSentence(other)} ${G.cite(sameNum)}.`, expect: 'T4', target: sameNum.id }); }
    // T5 unsupported claim: right provision, claim adds/changes something the section does not say
    const nums = [...goldClaim.matchAll(/\b(\d+|one|two|three|five|seven|ten)\s+(years?|months?|days?)/gi)];
    const alt = nums.length ? goldClaim.replace(nums[0][0], nums[0][0].replace(/\d+|one|two|three|five|seven|ten/i, m => (/^\d+$/.test(m) ? String(+m + 9) : 'nineteen'))) : null;
    const secNums = V.numbersIn(gold.title + ' ' + stripHdr(gold)); const fresh = [17, 23, 29, 31, 43].find(n => !secNums.has(String(n)));
    const added = lead + ` and the offender shall also be disqualified from holding public office for ${fresh} years ` + G.cite(gold) + '.';
    items.push({ qid: q.qid, kind: 'T5', question: q.question, answer: alt && rnd() < 0.5 ? alt : added, expect: 'T5', target: gold.id });
  }
  return items;
}

function evaluate(items, tau) {
  const res = {}; const labelHits = {};
  for (const it of items) {
    const ctx = { retrievedIds: null, regime: resolve(it.question).regime, tau };
    const rep = V.verifyAnswer(it.answer, ctx);
    const cit = rep.citations.find(c => c.id === it.target) || rep.citations[0];
    const flagged = !!cit && cit.verdict === 'fail';
    const r = res[it.kind] = res[it.kind] || { n: 0, flagged: 0, labelOk: 0 };
    r.n++; if (flagged) r.flagged++; if (flagged && it.expect && cit.labels.includes(it.expect)) r.labelOk++;
  }
  return res;
}
function summary(res) {
  const kinds = ['T1', 'T2', 'T3', 'T4', 'T5']; const tpr = kinds.filter(k => res[k]).map(k => res[k].flagged / res[k].n);
  const fpr = res.clean ? res.clean.flagged / res.clean.n : 0;
  return { avgRecall: tpr.reduce((a, c) => a + c, 0) / (tpr.length || 1), fpr, J: tpr.reduce((a, c) => a + c, 0) / (tpr.length || 1) - fpr };
}
module.exports = { build, evaluate, summary };

if (require.main === module) {
  const split = process.argv[2] || 'test'; const tau = process.argv[3] ? +process.argv[3] : require('../src/pipeline').DEFAULTS.tau;
  const items = build(split); const res = evaluate(items, tau);
  console.log(`split=${split} tau=${tau} items=${items.length}`);
  for (const [k, r] of Object.entries(res)) console.log(k.padEnd(6), `n=${r.n}`, `flagged=${(100 * r.flagged / r.n).toFixed(1)}%`, r.labelOk !== undefined && k !== 'clean' ? `label-correct=${(100 * r.labelOk / r.n).toFixed(1)}%` : '');
  console.log(summary(res));
}
