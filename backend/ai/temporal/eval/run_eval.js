'use strict';
// End-to-end evaluation of C0..C4 on JJ-StatQA v2.
//   node eval/run_eval.js [--split test|dev|all] [--m 1,3] [--generator offline|claude] [--configs C1,C1L,C2,C3,C4] [--limit N]
// Ground truth (gold dates, gold provisions, applicable code) comes from the dataset, never from the pipeline's own resolver.
const fs = require('fs'), path = require('path');
const X = require('../src/crosswalk');
const P = require('../src/pipeline');
const { resolve } = require('../src/resolver');
const { parseCitations } = require('../src/citations');
const { lexicalEntailment } = require('../src/verifier');
const Q = require('../data/jj_statqa_v2.json');

const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const SPLIT = arg('split', 'test'), MS = arg('m', '1,3').split(',').map(Number), GEN = arg('generator', 'offline'), LIMIT = +arg('limit', 0);
let CONFIGS = arg('configs', GEN === 'claude' ? 'C0,C1,C1L,C2,C3,C4' : 'C1,C1L,C2,C3,C4').split(',');
const OUT = path.join(__dirname, '../results'); fs.mkdirSync(OUT, { recursive: true });

const SUBSET = arg('subset', 'all');   // 'wellposed' drops questions flagged ill_posed by the dataset builder (system-independent rule)
const TAG = SPLIT + (SUBSET === 'wellposed' ? '_wp' : '');
let qs = Q.filter(q => SPLIT === 'all' || q.split === SPLIT); if (SUBSET === 'wellposed') qs = qs.filter(q => !q.ill_posed); if (LIMIT) qs = qs.slice(0, LIMIT);

// ---------- ground-truth helpers ----------
function goldCode(q, family) {
  const g = q.gold_dates || {};
  const d = (family === 'PENAL' ? g.offence_date : g.proceeding_date) || g.offence_date || g.proceeding_date;
  if (!d || !/^\d{4}-\d{2}/.test(d)) return null;
  const iso = d.length === 7 ? d + '-15' : d;
  return iso < X.CUTOVER ? X.OLD_OF[family] : X.NEW_OF[family];
}
const applicable = (q, id) => { const c = X.byId.get(id); if (!c) return false; const g = goldCode(q, c.code_family); return g ? c.code === g : null; };
const hasDates = q => q.expected === 'answer' || q.expected === 'safe';

// ---------- per-question scoring ----------
function score(q, out) {
  const cites = [...new Set(out.citations)];
  const exist = cites.filter(id => X.byId.has(id));
  const r = { qid: q.qid, type: q.type, status: out.status, cites, exist: exist.length, inapplicable: 0, applicableN: 0, goldHit: 0, correct: false, lenient: false };
  if (hasDates(q)) for (const id of exist) { const a = applicable(q, id); if (a === true) r.applicableN++; else if (a === false) r.inapplicable++; }
  const gold = q.gold_provisions || [];
  r.goldHit = gold.filter(g => cites.includes(g)).length;
  r.fabricated = cites.length - exist.length;
  // Unsupported-claim count (UCR numerator/denominator): a citation is unsupported if the cited section does not exist
  // or does not lexically entail the claim sentence it is attached to (same V4 check as the verifier, tau from params).
  { const cl = parseCitations(out.answer || ''); r.citTotal = cl.length; r.unsup = cl.filter(c => { const ch = X.byId.get(c.id); return !ch || !lexicalEntailment(c.claim, ch, { tau: P.DEFAULTS.tau }).ok; }).length; }
  if (q.expected === 'answer') {
    r.lenient = q.gold_any_of ? q.gold_any_of.some(g => cites.includes(g)) : gold.length > 0 && r.goldHit === gold.length;
    if (q.gold_any_of && r.lenient) r.goldHit = gold.length;
    r.correct = out.status === 'answered' && r.lenient && r.inapplicable === 0 && r.fabricated === 0;
    r.wrongCodeCited = (q.wrong_code_provisions || []).some(id => cites.includes(id));
    const rl = out.trace.retrieved || []; const flat = [].concat(...rl);
    r.recall5 = gold.length ? gold.filter(g => rl.some(l => l.slice(0, 5).includes(g))).length / gold.length : null;
    const ranks = gold.map(g => Math.min(...rl.map(l => { const i = l.indexOf(g); return i < 0 ? Infinity : i + 1; }))).filter(isFinite);
    r.rr = ranks.length ? 1 / Math.min(...ranks) : 0;
  } else if (q.expected === 'ask_dates') {
    r.correct = out.status === 'ask_dates' || gold.every(g => cites.includes(g));
  } else if (q.expected === 'abstain') {
    r.correct = out.status === 'abstained';
  } else if (q.expected === 'safe') {
    r.correct = !(q.forbidden || []).some(id => cites.includes(id)) && r.inapplicable === 0 && r.fabricated === 0;
  }
  return r;
}

// ---------- statistics ----------
let s = 99; const rnd = () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
function bootCI(v, B = 2000) { const n = v.length, ms = []; for (let b = 0; b < B; b++) { let a = 0; for (let i = 0; i < n; i++) a += v[Math.floor(rnd() * n)]; ms.push(a / n); } ms.sort((a, b) => a - b); return [ms[Math.floor(.025 * B)], ms[Math.floor(.975 * B)]]; }
function binomP(k, n) { // two-sided exact binomial (p=.5)
  if (!n) return 1; const lf = [0]; for (let i = 1; i <= n; i++) lf.push(lf[i - 1] + Math.log(i));
  const pm = i => Math.exp(lf[n] - lf[i] - lf[n - i] - n * Math.log(2)); const pk = pm(k); let p = 0; for (let i = 0; i <= n; i++) if (pm(i) <= pk + 1e-12) p += pm(i); return Math.min(1, p);
}
const mean = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : NaN;
const pct = x => Number.isFinite(x) ? (100 * x).toFixed(1) : 'n/a';

// ---------- resolver accuracy (config-independent) ----------
function resolverEval() {
  const rows = [];
  for (const q of qs) {
    if (!(q.expected === 'answer' || q.expected === 'safe' || q.expected === 'ask_dates')) continue;
    const r = resolve(q.question); const g = q.gold_dates || {};
    const exp = {}; for (const [fam, code] of Object.entries(q.gold_regime || {})) exp[fam] = code;
    const famOk = Object.entries(exp).every(([fam, code]) => r.regime[fam] === code);
    const dateOk = (g.offence_date ? (r.offence_date === g.offence_date) : true) && (g.proceeding_date ? (r.proceeding_date === g.proceeding_date) : true);
    const unresolvedOk = q.expected === 'ask_dates' ? Object.values(r.regime).every(v => v === null) : null;
    rows.push({ q, famOk: q.expected === 'ask_dates' ? unresolvedOk : famOk, dateOk: q.expected === 'ask_dates' ? unresolvedOk : dateOk });
  }
  const by = f => { const o = {}; for (const r of rows) { const k = f(r.q); if (k == null) continue; (o[k] = o[k] || []).push(r); } return Object.fromEntries(Object.entries(o).map(([k, a]) => [k, { n: a.length, regime: mean(a.map(x => +x.famOk)), date: mean(a.map(x => +x.dateOk)) }])); };
  return { overall: { n: rows.length, regime: mean(rows.map(r => +r.famOk)), date: mean(rows.map(r => +r.dateOk)) }, byType: by(q => q.type), byFormat: by(q => q.date_format != null ? `fmt${q.date_format}` : null),
    bySide: by(q => q.type === 'month_only' ? (q.side === 'old' ? 'June 2024' : 'August 2024') : q.type === 'boundary' ? `boundary-${q.side}` : null) };
}

// ---------- run ----------
async function runConfig(config, m) {
  // LLM responses are cached on disk by src/generator.js (results/llm_cache.json), so reruns/resumes are cheap.
  const per = new Array(qs.length), CONC = GEN === 'claude' ? +arg('conc', 4) : 1;
  let next = 0;
  async function worker() {
    for (;;) {
      const i = next++; if (i >= qs.length) return; const q = qs[i]; const t1 = process.hrtime.bigint();
      let out; try { out = await P.run(config, q.question, { m, generator: GEN }); } catch (e) { out = { status: 'error', answer: String(e.message), citations: [], trace: {} }; }
      const ms = Number(process.hrtime.bigint() - t1) / 1e6;
      per[i] = { q, out, sc: { ...score(q, out), ms } };
      if (GEN === 'claude' && (i + 1) % 25 === 0) process.stderr.write(`  ${config} m${m}: ${i + 1}/${qs.length}\n`);
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));
  return per;
}

function aggregate(per) {
  const sc = per.map(p => p.sc), ans = sc.filter(r => r.type && Q.find(q => q.qid === r.qid).expected === 'answer');
  const safeQ = per.filter(p => p.q.expected === 'safe').map(p => p.sc);
  const dated = [...ans, ...safeQ];
  const allCites = dated.reduce((a, r) => a + r.cites.length, 0), allExist = dated.reduce((a, r) => a + r.exist, 0);
  const inapp = dated.reduce((a, r) => a + r.inapplicable, 0), appl = dated.reduce((a, r) => a + r.applicableN, 0);
  const goldHits = ans.reduce((a, r) => a + r.goldHit, 0), goldN = per.filter(p => p.q.expected === 'answer').reduce((a, p) => a + p.q.gold_provisions.length, 0);
  const answeredDated = dated.filter(r => r.cites.length > 0);
  const byType = {}; for (const p of per) (byType[p.q.type] = byType[p.q.type] || []).push(+p.sc.correct);
  const unans = per.filter(p => p.q.expected === 'abstain').map(p => +p.sc.correct);
  const falseAbstain = per.filter(p => p.q.expected === 'answer').map(p => +(p.out.status === 'abstained'));
  const askOnDated = per.filter(p => p.q.expected === 'answer').map(p => +(p.out.status === 'ask_dates'));
  const askAmb = per.filter(p => p.q.expected === 'ask_dates').map(p => +p.sc.correct);
  const accAll = per.map(p => +p.sc.correct);
  const [lo, hi] = bootCI(accAll);
  return {
    n: per.length, accuracy_all: mean(accAll), ci95: [lo, hi],
    accuracy_answerable_strict: mean(per.filter(p => p.q.expected === 'answer').map(p => +p.sc.correct)),
    hit_gold_lenient: mean(per.filter(p => p.q.expected === 'answer').map(p => +p.sc.lenient)),
    citation: { total: allCites, exist_rate: allCites ? allExist / allCites : NaN, applicable_rate: allCites ? appl / allCites : NaN, CP: allCites ? appl / allCites : NaN,
      TIR: allCites ? inapp / allCites : NaN, gold_precision: allCites ? goldHits / allCites : NaN, gold_recall: goldN ? goldHits / goldN : NaN,
      questions_with_inapplicable_cite: answeredDated.length ? answeredDated.filter(r => r.inapplicable > 0).length / answeredDated.length : NaN, fabricated: dated.reduce((a, r) => a + r.fabricated, 0) },
    api_errors: per.filter(p => p.out.status === 'error').length,
    ucr: (() => { const t = per.reduce((a, p) => a + (p.sc.citTotal || 0), 0), u = per.reduce((a, p) => a + (p.sc.unsup || 0), 0); return t ? u / t : NaN; })(),
    temporal: { wrong_code_cited_rate: mean(per.filter(p => p.q.expected === 'answer').map(p => +!!p.sc.wrongCodeCited)), safe_rate_retroactivity: mean(safeQ.map(r => +r.correct)) },
    retrieval: { recall_at_5: mean(per.filter(p => p.q.expected === 'answer').map(p => p.sc.recall5)), mrr: mean(per.filter(p => p.q.expected === 'answer').map(p => p.sc.rr)) },
    behaviour: { abstain_on_unanswerable: mean(unans), false_abstain_on_answerable: mean(falseAbstain), ask_dates_when_dates_given: mean(askOnDated), ask_dates_on_ambiguous: mean(askAmb) },
    byType: Object.fromEntries(Object.entries(byType).map(([k, v]) => [k, { n: v.length, acc: mean(v) }])),
    monthOnly: { june2024: mean(per.filter(p => p.q.type === 'month_only' && p.q.side === 'old').map(p => +p.sc.correct)), august2024: mean(per.filter(p => p.q.type === 'month_only' && p.q.side === 'new').map(p => +p.sc.correct)) },
    boundary: { before_cutover: mean(per.filter(p => p.q.type === 'boundary' && p.q.side === 'old').map(p => +p.sc.correct)), on_after_cutover: mean(per.filter(p => p.q.type === 'boundary' && p.q.side === 'new').map(p => +p.sc.correct)) },
    latency_ms_mean: mean(per.map(p => p.sc.ms)),
  };
}

(async () => {
  const results = { meta: { split: SPLIT, subset: SUBSET, n: qs.length, generator: GEN, params: { theta: P.DEFAULTS.theta, tau: P.DEFAULTS.tau, k: P.DEFAULTS.k }, date: new Date().toISOString().slice(0, 10) }, resolver: resolverEval(), byM: {} };
  const skipped = [];
  for (const m of MS) {
    const perCfg = {}, agg = {};
    for (const c of CONFIGS) {
      if (c === 'C0' && GEN === 'offline') { skipped.push('C0'); continue; }
      perCfg[c] = await runConfig(c, m); agg[c] = aggregate(perCfg[c]);
      fs.writeFileSync(path.join(OUT, `per_question_${TAG}_${GEN}_${c}_m${m}.jsonl`), perCfg[c].map(p => JSON.stringify({ qid: p.q.qid, type: p.q.type, question: p.q.question, expected: p.q.expected, gold: p.q.gold_provisions, status: p.out.status, citations: p.out.citations, correct: p.sc.correct, inapplicable: p.sc.inapplicable, trace: { regime: p.out.trace.regime, flags: p.out.trace.initialFlags, repairs: p.out.trace.repairs } })).join('\n'));
    }
    // paired significance vs C4
    const sig = {};
    if (perCfg.C4) for (const c of Object.keys(perCfg)) if (c !== 'C4') {
      let b = 0, cc = 0; perCfg.C4.forEach((p, i) => { const o = perCfg[c][i]; if (p.sc.correct && !o.sc.correct) b++; else if (!p.sc.correct && o.sc.correct) cc++; });
      sig[`C4_vs_${c}`] = { c4_only_correct: b, other_only_correct: cc, mcnemar_exact_p: binomP(Math.min(b, cc), b + cc) };
    }
    results.byM[m] = { agg, sig };
  }
  results.skipped = [...new Set(skipped)];
  fs.writeFileSync(path.join(OUT, `results_${TAG}_${GEN}.json`), JSON.stringify(results, null, 1));
  fs.writeFileSync(path.join(OUT, `report_${TAG}_${GEN}.md`), report(results));
  console.log(report(results));
})();

function report(R) {
  const L = []; const f = pct;
  L.push(`# JJ-StatQA v2 results (split=${R.meta.split}${R.meta.subset === 'wellposed' ? ', well-posed subset' : ''}, n=${R.meta.n}, generator=${R.meta.generator}, date=${R.meta.date})`);
  L.push(`Tuned on dev only: theta=${R.meta.params.theta}, tau=${R.meta.params.tau}, k=${R.meta.params.k}.`);
  L.push(R.meta.generator === 'offline' ? '\n> Offline extractive generator: it copies the provisions it is given, so these numbers isolate retrieval, temporal filtering and citation verification. They do NOT measure LLM hallucination (T2/T5/T6) or the no-retrieval LLM (C0); rerun with `--generator claude` for that.' : '');
  L.push('\n## Resolver (date -> applicable code), independent of configuration');
  L.push(`Overall: regime accuracy ${f(R.resolver.overall.regime)}%, date-extraction exact match ${f(R.resolver.overall.date)}% (n=${R.resolver.overall.n})`);
  L.push('\n| Slice | n | regime acc % | date acc % |\n|---|---|---|---|');
  for (const [k, v] of Object.entries(R.resolver.byType)) L.push(`| type: ${k} | ${v.n} | ${f(v.regime)} | ${f(v.date)} |`);
  for (const [k, v] of Object.entries(R.resolver.bySide)) L.push(`| ${k} | ${v.n} | ${f(v.regime)} | ${f(v.date)} |`);
  for (const [k, v] of Object.entries(R.resolver.byFormat)) L.push(`| date format ${k} | ${v.n} | ${f(v.regime)} | ${f(v.date)} |`);
  for (const [m, M] of Object.entries(R.byM)) {
    const cs = Object.keys(M.agg);
    L.push(`\n## Reader cites top-${m} provision(s) per question segment`);
    L.push('\n| Metric | ' + cs.join(' | ') + ' |\n|---|' + cs.map(() => '---').join('|') + '|');
    const row = (name, fn) => L.push(`| ${name} | ` + cs.map(c => fn(M.agg[c])).join(' | ') + ' |');
    row('Answer accuracy, all questions % (95% CI)', a => `${f(a.accuracy_all)} (${f(a.ci95[0])}-${f(a.ci95[1])})`);
    row('Answer accuracy, dated answerable (strict) %', a => f(a.accuracy_answerable_strict));
    row('Gold provision cited (lenient) %', a => f(a.hit_gold_lenient));
    row('Citation precision CP (exists & applicable) %', a => f(a.citation.CP));
    row('Temporally-inapplicable citation rate TIR %', a => f(a.citation.TIR));
    row('Answers with >=1 inapplicable citation %', a => f(a.citation.questions_with_inapplicable_cite));
    row('Gold-match precision %', a => f(a.citation.gold_precision));
    row('Gold-match recall %', a => f(a.citation.gold_recall));
    row('API/request errors (counted as wrong; must be 0 for a valid run)', a => String(a.api_errors));
    row('Unsupported-claim rate UCR (lexical entailment, all cited claims) %', a => f(a.ucr));
    row('Fabricated (non-existent) citations', a => String(a.citation.fabricated));
    row('Wrong-code provision cited %', a => f(a.temporal.wrong_code_cited_rate));
    row('Retroactivity traps handled safely %', a => f(a.temporal.safe_rate_retroactivity));
    row('Retrieval Recall@5 %', a => f(a.retrieval.recall_at_5));
    row('Retrieval MRR', a => a.retrieval.mrr.toFixed(3));
    row('Abstains on unanswerable %', a => f(a.behaviour.abstain_on_unanswerable));
    row('Wrongly abstains on answerable %', a => f(a.behaviour.false_abstain_on_answerable));
    row('Asks for dates on ambiguous %', a => f(a.behaviour.ask_dates_on_ambiguous));
    row('Asks for dates although dates were given %', a => f(a.behaviour.ask_dates_when_dates_given));
    row('June 2024 (month-only) accuracy %', a => f(a.monthOnly.june2024));
    row('August 2024 (month-only) accuracy %', a => f(a.monthOnly.august2024));
    row('Boundary: before 1 Jul 2024 %', a => f(a.boundary.before_cutover));
    row('Boundary: on/after 1 Jul 2024 %', a => f(a.boundary.on_after_cutover));
    row('Mean latency (ms/question)', a => a.latency_ms_mean.toFixed(1));
    L.push('\nAccuracy by question type (%):\n\n| Type | n | ' + cs.join(' | ') + ' |\n|---|---|' + cs.map(() => '---').join('|') + '|');
    for (const t of Object.keys(M.agg[cs[0]].byType)) L.push(`| ${t} | ${M.agg[cs[0]].byType[t].n} | ` + cs.map(c => f(M.agg[c].byType[t].acc)).join(' | ') + ' |');
    L.push('\nPaired McNemar (exact), C4 vs each config on per-question correctness:\n');
    for (const [k, v] of Object.entries(M.sig)) L.push(`- ${k}: C4-only-correct=${v.c4_only_correct}, other-only-correct=${v.other_only_correct}, p=${v.mcnemar_exact_p < 1e-4 ? '<0.0001' : v.mcnemar_exact_p.toFixed(4)}`);
  }
  if (R.skipped.length) L.push(`\nSkipped: ${R.skipped.join(', ')} (needs an LLM; run with --generator claude and ANTHROPIC_API_KEY).`);
  return L.join('\n');
}
