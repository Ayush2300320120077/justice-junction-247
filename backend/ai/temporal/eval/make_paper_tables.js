'use strict';
// Builds results/PAPER_RESULTS.md directly from results_*.json (no hand-typed numbers).
const fs = require('fs'), path = require('path');
const R = f => JSON.parse(fs.readFileSync(path.join(__dirname, '../results', f), 'utf8'));
const f = x => Number.isFinite(x) ? (100 * x).toFixed(1) : 'n/a';
const CFG = ['C1', 'C1L', 'C2', 'C3', 'C4'];
const NAME = { C1: 'C1 Standard RAG (date-blind)', C1L: 'C1L RAG + "always latest law"', C2: 'C2 + date resolver/filter', C3: 'C3 RAG + citation verifier', C4: 'C4 Full (filter + verifier)' };
function table(res, m = 1) {
  const A = res.byM[m].agg, L = [];
  L.push(`| Configuration | Answer acc. % (95% CI) | Temporal acc.* % | Citation precision % | Temporally-inapplicable cit. % | Wrong-code cited % | Recall@5 % | MRR | Abstain on unanswerable % |`);
  L.push('|---|---|---|---|---|---|---|---|---|');
  for (const c of CFG) {
    const a = A[c], t = ['temporal_lookup', 'boundary', 'month_only', 'two_axis', 'explicit_trap'].reduce((s, k) => { const b = a.byType[k]; return [s[0] + b.acc * b.n, s[1] + b.n]; }, [0, 0]);
    L.push(`| ${NAME[c]} | ${f(a.accuracy_all)} (${f(a.ci95[0])}–${f(a.ci95[1])}) | ${f(t[0] / t[1])} | ${f(a.citation.CP)} | ${f(a.citation.TIR)} | ${f(a.temporal.wrong_code_cited_rate)} | ${f(a.retrieval.recall_at_5)} | ${a.retrieval.mrr.toFixed(3)} | ${f(a.behaviour.abstain_on_unanswerable)} |`);
  }
  return L.join('\n');
}
function byType(res, m = 1) {
  const A = res.byM[m].agg, ts = Object.keys(A.C1.byType), L = [`| Question type | n | ${CFG.join(' | ')} |`, '|---|---|' + CFG.map(() => '---').join('|') + '|'];
  for (const t of ts) L.push(`| ${t} | ${A.C1.byType[t].n} | ${CFG.map(c => f(A[c].byType[t].acc)).join(' | ')} |`);
  return L.join('\n');
}
function sig(res, m = 1) { return Object.entries(res.byM[m].sig).map(([k, v]) => `- ${k.replace('_vs_', ' vs ')}: C4-only-correct ${v.c4_only_correct}, other-only-correct ${v.other_only_correct}, McNemar exact p ${v.mcnemar_exact_p < 1e-4 ? '< 0.0001' : v.mcnemar_exact_p.toFixed(3)}`).join('\n'); }
function resolver(res) {
  const r = res.resolver, L = ['| Slice | n | Applicable-code accuracy % | Date-extraction exact match % |', '|---|---|---|---|'];
  L.push(`| **Overall** | ${r.overall.n} | ${f(r.overall.regime)} | ${f(r.overall.date)} |`);
  for (const [k, v] of Object.entries(r.byType)) L.push(`| ${k} | ${v.n} | ${f(v.regime)} | ${f(v.date)} |`);
  for (const [k, v] of Object.entries(r.bySide)) L.push(`| ${k} | ${v.n} | ${f(v.regime)} | ${f(v.date)} |`);
  return L.join('\n');
}
const T = R('results_test_offline.json'), W = R('results_test_wp_offline.json'), D = R('results_dev_offline.json');
const ch = fs.readFileSync(path.join(__dirname, '../results/challenge_test.txt'), 'utf8');
const out = `# JJ-StatQA v2 – results for the paper (auto-generated; ${new Date().toISOString().slice(0, 10)})

Dataset: 570 questions (dev 165 / test 405) in 8 types. Hyper-parameters (theta=${T.meta.params.theta}, tau=${T.meta.params.tau}, k=${T.meta.params.k}) were tuned on dev only; every number below is on the **held-out test split** unless stated.
Reader: deterministic *extractive* generator (cites top-1 provision per question segment). These runs therefore isolate retrieval + temporal filtering + citation verification. They do **not** measure free-text LLM hallucination or the no-retrieval LLM (C0) – see "What is still missing".
*Temporal acc.* = accuracy on the date-dependent types (temporal_lookup, boundary, month_only, two_axis, explicit_trap).

## Table A. Main comparison, test split, all questions (n=${T.meta.n})
${table(T)}

Paired tests (per-question correctness):
${sig(T)}

## Table B. Same, test split, well-posed subset (n=${W.meta.n}; drops questions whose gold section title is non-unique or <3 words, rule fixed before evaluation)
${table(W)}

Paired tests:
${sig(W)}

## Table C. Accuracy by question type (test, all questions)
${byType(T)}

## Table D. Date resolver (test split, independent of configuration)
${resolver(T)}

## Table E. Verifier stress test (synthetic error injection, test split; NOT a measure of LLM behaviour)
\`\`\`
${ch.trim()}
\`\`\`
Each correct answer is corrupted with one error of each taxonomy class; "flagged" = verifier rejects the corrupted citation, "clean flagged" = false-positive rate on untouched correct citations.

## Dev split (for reference, n=${D.meta.n})
${table(D)}
`;
fs.writeFileSync(path.join(__dirname, '../results/PAPER_RESULTS.md'), out); console.log(out.length, 'chars');
