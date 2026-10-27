'use strict';
// Builds JJ-StatQA v2: a deterministic (seeded) benchmark of date-dependent Indian statutory questions.
//  - crosswalk-derived questions: gold provision = the code in force on the question's date
//  - hand-written questions: ambiguous (no date), unanswerable (outside corpus), no-counterpart (retroactivity traps)
// Output: data/jj_statqa_v2.json (+ .jsonl).  Every record carries `split` (dev|test); thresholds are tuned on dev only.
const fs = require('fs'), path = require('path');
const X = require('../src/crosswalk');
const { stripHdr } = require('../src/retriever');
const anchors = require('../data/anchors.json');

let seed = 20261010;
const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const pick = a => a[Math.floor(rnd() * a.length)];
const randInt = (a, b) => a + Math.floor(rnd() * (b - a + 1));
const pad = n => String(n).padStart(2, '0');
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const ord = d => d + ((d % 10 === 1 && d !== 11) ? 'st' : (d % 10 === 2 && d !== 12) ? 'nd' : (d % 10 === 3 && d !== 13) ? 'rd' : 'th');

function randDate(side, boundary) {
  let y, m, d;
  if (boundary) { [y, m, d] = side === 'old' ? [2024, 6, randInt(26, 30)] : [2024, 7, randInt(1, 4)]; }
  else if (side === 'old') { const t = randInt(Date.UTC(2023, 0, 1) / 864e5, Date.UTC(2024, 5, 25) / 864e5) * 864e5; const dt = new Date(t); [y, m, d] = [dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate()]; }
  else { const t = randInt(Date.UTC(2024, 6, 5) / 864e5, Date.UTC(2026, 8, 30) / 864e5) * 864e5; const dt = new Date(t); [y, m, d] = [dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate()]; }
  return { y, m, d, iso: `${y}-${pad(m)}-${pad(d)}` };
}
const FORMATS = [
  ({ y, m, d }) => `${d} ${MONTHS[m - 1]} ${y}`, ({ y, m, d }) => `${MONTHS[m - 1]} ${d}, ${y}`, ({ y, m, d }) => `${ord(d)} ${MONTHS[m - 1]}, ${y}`,
  ({ y, m, d }) => `${pad(d)}/${pad(m)}/${y}`, ({ y, m, d }) => `${pad(d)}-${pad(m)}-${y}`, ({ y, m, d }) => `${pad(d)}.${pad(m)}.${y}`,
  ({ y, m, d }) => `${d} ${MONTHS[m - 1].slice(0, 3)} ${y}`, ({ y, m, d }) => `${y}-${pad(m)}-${pad(d)}`,
];
const fmtDate = dt => { const i = randInt(0, FORMATS.length - 1); return { text: FORMATS[i](dt), fmt: i }; };

const lc = s => { s = s.replace(/[.\s]+$/, '').replace(/\s*,?\s*etc\.?$/i, ''); return /^[A-Z]{2,}/.test(s) ? s : s.charAt(0).toLowerCase() + s.slice(1); };
const clean = s => s.replace(/([a-z])\d+(?=[\s,.;:)])/g, '$1').replace(/\s+/g, ' ').trim();
function fragment(c) {
  let t = clean(stripHdr(c)); t = t.replace(/^\(?1\)\s*/, '');
  const m = t.slice(0, 190); const i = m.search(/[.;:](?=\s|$)/);
  let f = (i > 50 ? m.slice(0, i) : m.replace(/\s+\S*$/, '')).replace(/^Whoever,?\s*/i, 'a person who ').replace(/^Any person who /i, 'a person who ');
  f = f.replace(/[,\s]+$/, ''); return /^[A-Z]{2,}/.test(f) ? f : f.charAt(0).toLowerCase() + f.slice(1);
}

const TPL = {
  PENAL: {
    title: [t => `Which section deals with ${t} for an act done on {D}?`, t => `A person is accused of ${t} in an incident on {D}. Under which section will they be charged?`,
      t => `What is the applicable provision for ${t}, the offence having been committed on {D}?`, t => `My case involves ${t} that took place on {D}. Which section applies?`],
    scenario: [f => `Someone is alleged to have acted as follows: ${f}. This happened on {D}. Which section applies?`, f => `On {D}, ${f}. What provision governs this offence?`],
  },
  PROCEDURE: {
    title: [t => `In a case where the FIR was registered on {D}, which provision governs ${t}?`, t => `The police registered the case on {D}. Which section covers ${t}?`,
      t => `An investigation began on {D}; under which section is ${t} dealt with?`],
    scenario: [f => `A case was registered on {D}. Which provision provides that ${f}?`, f => `Proceedings began on {D}. Under which section: ${f}?`],
  },
  EVIDENCE: {
    title: [t => `In a trial that began on {D}, which section deals with ${t}?`, t => `Proceedings were instituted on {D}. Which provision covers ${t}?`],
    scenario: [f => `A trial commenced on {D}. Which provision of the law of evidence says: ${f}?`, f => `Court proceedings began on {D}; which section provides that ${f}?`],
  },
};

// ---- crosswalk pairs ----
const FAM = { PENAL: ['IPC', 'BNS'], PROCEDURE: ['CRPC', 'BNSS'], EVIDENCE: ['IEA', 'BSA'] };
const pairs = [];
const skipped = [];
for (const [fam, m] of Object.entries(anchors)) {
  if (fam[0] === '_') continue; const [o, n] = FAM[fam];
  for (const [os, ns] of Object.entries(m)) {
    const a = X.get(o, os), b = X.get(n, ns);
    if (!a || !b) { skipped.push([fam, os, ns, 'missing']); continue; }
    if (stripHdr(a).length < 60 || stripHdr(b).length < 60) { skipped.push([fam, os, ns, 'empty/short text']); continue; }
    pairs.push({ fam, old: a, new: b });
  }
}
const hashStr = s => { let h = 2166136261; for (const ch of s) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const splitOf = key => (hashStr(key) % 100) < 30 ? 'dev' : 'test';

const Q = []; let qn = 0;
const add = o => Q.push({ qid: `Q${String(++qn).padStart(4, '0')}`, ...o });

function dateAxes(fam, dt, extra = {}) { return fam === 'PENAL' ? { offence_date: dt.iso, proceeding_date: null, ...extra } : { offence_date: null, proceeding_date: dt.iso, ...extra }; }

for (const p of pairs) {
  const key = `${p.fam}:${p.old.id}:${p.new.id}`, split = splitOf(key);
  const style = rnd() < 0.5 ? 'title' : 'scenario';
  const tpls = TPL[p.fam][style];
  const ti = randInt(0, tpls.length - 1);
  const body = style === 'title' ? tpls[ti](lc(p.old.title)) : tpls[ti](fragment(p.old));
  for (const side of ['old', 'new']) {
    const boundary = rnd() < 0.14;
    const dt = randDate(side, boundary); const f = fmtDate(dt);
    const gold = side === 'old' ? p.old : p.new;
    add({ type: boundary ? 'boundary' : 'temporal_lookup', family: p.fam, style, question: body.replace('{D}', f.text), date_format: f.fmt, date_precision: 'day',
      gold_dates: dateAxes(p.fam, dt), gold_regime: { [p.fam]: gold.code }, gold_provisions: [gold.id], wrong_code_provisions: [(side === 'old' ? p.new : p.old).id],
      expected: 'answer', pair: [p.old.id, p.new.id], side, split });
  }
}

// month-only phrasing (the "June 2024 vs August 2024" case), PENAL + PROCEDURE pairs
{
  const cand = pairs.filter(p => p.fam !== 'EVIDENCE'); const chosen = [];
  while (chosen.length < 30) { const p = pick(cand); if (!chosen.includes(p)) chosen.push(p); }
  for (const p of chosen) {
    const key = `${p.fam}:${p.old.id}:${p.new.id}`, split = splitOf(key);
    const tpl = TPL[p.fam].title[0]; const body = tpl(lc(p.old.title));
    for (const [mon, side] of [['June 2024', 'old'], ['August 2024', 'new']]) {
      const gold = side === 'old' ? p.old : p.new; const iso = side === 'old' ? '2024-06' : '2024-08';
      add({ type: 'month_only', family: p.fam, style: 'title', question: body.replace('{D}', `${mon}`).replace(/ on (June|August) 2024/, ' in $1 2024'), date_precision: 'month',
        gold_dates: dateAxes(p.fam, { iso }), gold_regime: { [p.fam]: gold.code }, gold_provisions: [gold.id], wrong_code_provisions: [(side === 'old' ? p.new : p.old).id], expected: 'answer', pair: [p.old.id, p.new.id], side, split });
    }
  }
}

// explicit-section traps: user names the wrong code for the date
{
  const cand = pairs.filter(p => p.fam === 'PENAL' || p.fam === 'PROCEDURE'); const used = new Set();
  let made = 0;
  while (made < 44) {
    const p = pick(cand); if (used.has(p.old.id)) continue; used.add(p.old.id);
    const key = `${p.fam}:${p.old.id}:${p.new.id}`, split = splitOf(key);
    const toNew = rnd() < 0.5;                                                      // named code is wrong for the date
    const named = toNew ? p.old : p.new; const gold = toNew ? p.new : p.old;
    const dt = randDate(toNew ? 'new' : 'old', false); const f = fmtDate(dt);
    const act = { IPC: 'IPC', BNS: 'BNS', CRPC: 'CrPC', BNSS: 'BNSS' }[named.code];
    const tail = p.fam === 'PENAL' ? `for an offence committed on ${f.text}` : `in a case registered on ${f.text}`;
    const forms = [`What does Section ${named.section} ${act} provide ${tail}?`, `Is Section ${named.section} of the ${act} the right provision ${tail}? What should be cited?`, `Explain Section ${named.section} ${act} as it applies ${tail}.`];
    add({ type: 'explicit_trap', family: p.fam, style: 'explicit', question: pick(forms), date_format: f.fmt, date_precision: 'day', gold_dates: dateAxes(p.fam, dt), gold_regime: { [p.fam]: gold.code }, gold_provisions: [gold.id],
      wrong_code_provisions: [named.id], gold_any_of: X.counterpartIn(named.id, gold.code), expected: 'answer', pair: [p.old.id, p.new.id], side: toNew ? 'new' : 'old', split }); made++;
  }
}

// two-axis questions: offence date decides the substantive code, proceeding date the procedural/evidence code
{
  const pen = pairs.filter(p => p.fam === 'PENAL' && !/^(Rioting|Unlawful assembly)/.test(p.old.title)), proc = pairs.filter(p => p.fam === 'PROCEDURE'), evi = pairs.filter(p => p.fam === 'EVIDENCE');
  const combos = [['old', 'new', 20], ['old', 'old', 10], ['new', 'new', 10]];
  for (const [os, ps, n] of combos) for (let i = 0; i < n; i++) {
    const a = pick(pen), useEv = rnd() < 0.2, b = useEv ? pick(evi) : pick(proc);
    const key = `MIX:${a.old.id}:${b.old.id}`, split = splitOf(key);
    let d1 = randDate(os, false), d2;
    if (os === 'old' && ps === 'new') d2 = randDate('new', false); else if (os === 'old') { d2 = randDate('old', false); if (d2.iso < d1.iso) [d1, d2] = [d2, d1]; } else { d2 = randDate('new', false); if (d2.iso < d1.iso) [d1, d2] = [d2, d1]; }
    const f1 = fmtDate(d1), f2 = fmtDate(d2); const ga = os === 'old' ? a.old : a.new, gb = ps === 'old' ? b.old : b.new;
    const s1 = `A case of ${lc(a.old.title)} was committed on ${f1.text}.`;
    const s2 = useEv ? `The trial began on ${f2.text}. Which provision deals with ${lc(b.old.title)}, and which section covers the offence?`
      : `The FIR was registered on ${f2.text}. Which provision governs ${lc(b.old.title)}, and which section covers the offence?`;
    add({ type: 'two_axis', family: 'MIXED', style: 'two_axis', question: `${s1} ${s2}`, date_precision: 'day', gold_dates: { offence_date: d1.iso, proceeding_date: d2.iso },
      gold_regime: { PENAL: ga.code, [useEv ? 'EVIDENCE' : 'PROCEDURE']: gb.code }, gold_provisions: [ga.id, gb.id], wrong_code_provisions: [(os === 'old' ? a.new : a.old).id, (ps === 'old' ? b.new : b.old).id],
      expected: 'answer', pair: [a.old.id, b.old.id], side: `${os}/${ps}`, split });
  }
}

// ambiguous: no date at all -> system should ask for the date / present both regimes
{
  const cand = pairs.slice(); const used = new Set(); let made = 0;
  while (made < 24) {
    const p = pick(cand); if (used.has(p.old.id)) continue; used.add(p.old.id); made++;
    const key = `AMB:${p.old.id}`, split = splitOf(key);
    const t = lc(p.old.title);
    const q = p.fam === 'PENAL' ? pick([`Which section deals with ${t}?`, `What is the provision for ${t}?`]) : pick([`Which section governs ${t}?`, `Under which provision is ${t} dealt with?`]);
    add({ type: 'ambiguous_no_date', family: p.fam, style: 'title', question: q, date_precision: null, gold_dates: { offence_date: null, proceeding_date: null }, gold_regime: {},
      gold_provisions: [p.old.id, p.new.id], expected: 'ask_dates', pair: [p.old.id, p.new.id], split });
  }
}

// hand-written: outside the corpus -> abstain
const UNANS = [
  'What is the GST rate applicable on mobile phones sold on 5 August 2024?', 'How can I register a trademark for my startup?',
  'What is the procedure for divorce by mutual consent under the Hindu Marriage Act?', 'What penalty applies for dishonour of a cheque under the Negotiable Instruments Act for a cheque bounced on 12 June 2024?',
  'What is the notice period for terminating a workman under the Industrial Disputes Act?', 'How is income tax calculated on agricultural income?', 'What is the procedure to file an RTI application with a public authority?',
  'What are the rights of a tenant under the Rent Control Act in Uttar Pradesh?', 'What is the limitation period for filing a civil suit for recovery of money lent on 2 March 2023?', 'How do I renew my driving licence that expired on 3 March 2024?',
  'What fine applies under the Motor Vehicles Act for riding without a helmet on 20 July 2024?', 'What are the registration requirements for a private limited company under the Companies Act?',
  'What compensation can a consumer claim under the Consumer Protection Act, 2019 for a defective product bought on 4 May 2024?', 'What is the process of adoption under the Juvenile Justice Act?',
  'Can a landlord evict a tenant under the Transfer of Property Act without notice?', 'What is the stamp duty on a sale deed in Delhi?', 'How are disputes referred to an arbitrator under the Arbitration and Conciliation Act?',
  'What is the minimum wage for unskilled workers in Maharashtra?', 'How is maintenance calculated under the Hindu Adoptions and Maintenance Act for a petition filed on 14 September 2024?', 'What are the SEBI rules for insider trading disclosures?',
  'What is the procedure for obtaining a succession certificate under the Indian Succession Act?', 'How do I claim provident fund withdrawal after leaving a job on 30 August 2024?',
];
UNANS.forEach((q, i) => add({ type: 'unanswerable', family: null, style: 'hand', question: q, date_precision: null, gold_dates: {}, gold_regime: {}, gold_provisions: [], expected: 'abstain', split: i % 3 === 0 ? 'dev' : 'test', source: 'hand' }));

// hand-written: retroactivity / repealed-provision traps -> must not cite a provision of a code not in force on the date
const TRAPS = [
  ['A gang committed organised crime, including contract killing, on 10 June 2024. Which section punishes organised crime?', ['BNS_111']],
  ['Which section defines a terrorist act for an offence committed on 20 May 2024?', ['BNS_113']],
  ['A man had sexual intercourse with a woman on a false promise of marriage on 3 April 2024. Which provision covers sexual intercourse by deceitful means?', ['BNS_69']],
  ['Snatching of a mobile phone from a pedestrian took place on 15 March 2024. Which section punishes snatching?', ['BNS_304']],
  ['Which section punishes organised crime committed on 22 February 2024?', ['BNS_111']],
  ['What section defines a terrorist act when the act was done on 5 January 2024?', ['BNS_113']],
  ['An offence of snatching was committed on 28 June 2024. Which provision applies?', ['BNS_304']],
  ['Is sedition under Section 124A IPC still punishable for an act committed on 10 August 2024?', ['IPC_124A']],
  ['Section 124A IPC for words spoken on 3 October 2024: can it be cited?', ['IPC_124A']],
  ['A person is charged with sedition for a speech made on 18 December 2024. Which section applies?', ['IPC_124A']],
];
TRAPS.forEach(([q, forb], i) => add({ type: 'retroactivity_trap', family: 'PENAL', style: 'hand', question: q, date_precision: 'day', gold_dates: { offence_date: (q.match(/(\d{1,2}) (\w+) (\d{4})/) || []).slice(1).join(' ') }, gold_regime: { PENAL: forb[0].startsWith('BNS') ? 'IPC' : 'BNS' },
  gold_provisions: [], forbidden: forb, expected: 'safe', split: i % 3 === 0 ? 'dev' : 'test', source: 'hand' }));
// normalise trap gold dates to ISO
const MI = Object.fromEntries(MONTHS.map((m, i) => [m, i + 1]));
for (const q of Q) if (q.type === 'retroactivity_trap') { const m = q.question.match(/(\d{1,2}) (\w+) (\d{4})/); q.gold_dates = { offence_date: `${m[3]}-${pad(MI[m[2]])}-${pad(+m[1])}`, proceeding_date: null }; }

// sanity: every referenced provision exists
for (const q of Q) for (const id of [...(q.gold_provisions || []), ...(q.forbidden || []), ...(q.wrong_code_provisions || [])]) if (!X.byId.has(id)) throw new Error(`${q.qid}: unknown provision ${id}`);

// Well-posedness flag (system-independent rule, applied after generation so the seeded RNG stream is unchanged):
// a title-driven question is ill-posed when a gold provision's title is shared by >1 section of the same code
// (e.g. "Punishment", "Force") or has fewer than 3 words, because the question text then does not identify one section.
{
  const norm = t => String(t).trim().toLowerCase();
  const tc = new Map(); for (const c of X.corpus) { const k = `${c.code}|${norm(c.title)}`; tc.set(k, (tc.get(k) || 0) + 1); }
  for (const q of Q) {
    q.ill_posed = false;
    if (!(q.style === 'title' || q.type === 'two_axis') || !(q.gold_provisions || []).length) continue;
    for (const id of q.gold_provisions) {
      const c = X.byId.get(id); if (!c) continue;
      if (tc.get(`${c.code}|${norm(c.title)}`) > 1 || (norm(c.title).match(/[a-z]+/g) || []).length < 3) { q.ill_posed = true; break; }
    }
  }
}
const out = path.join(__dirname, '../data');
fs.writeFileSync(path.join(out, 'jj_statqa_v2.json'), JSON.stringify(Q, null, 1));
fs.writeFileSync(path.join(out, 'jj_statqa_v2.jsonl'), Q.map(q => JSON.stringify(q)).join('\n'));
const cnt = (f) => Q.reduce((a, q) => (a[f(q)] = (a[f(q)] || 0) + 1, a), {});
console.log('questions', Q.length, '| crosswalk pairs used', pairs.length, '| skipped', skipped.length, JSON.stringify(skipped));
console.log('ill-posed', Q.filter(q => q.ill_posed).length); console.log('by type', cnt(q => q.type)); console.log('by split', cnt(q => q.split)); console.log('by family', cnt(q => q.family));
