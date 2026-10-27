'use strict';
const test = require('node:test'), assert = require('node:assert');
const { resolve } = require('../src/resolver');
const { parseRefs, parseCitations } = require('../src/citations');
const X = require('../src/crosswalk');
const V = require('../src/verifier');
const P = require('../src/pipeline');
const jj = require('../src');

test('resolver: 30 June 2024 -> IPC, 1 July 2024 -> BNS', () => {
  assert.equal(resolve('Theft on 30 June 2024.').regime.PENAL, 'IPC');
  assert.equal(resolve('Theft on 1 July 2024.').regime.PENAL, 'BNS');
});
test('resolver: June vs August 2024 (month precision)', () => {
  assert.equal(resolve('Murder in June 2024.').regime.PENAL, 'IPC');
  assert.equal(resolve('Murder in August 2024.').regime.PENAL, 'BNS');
  assert.equal(resolve('Murder in July 2024.').regime.PENAL, null);
});
test('resolver: two axes, offence date vs proceeding date', () => {
  const r = resolve('The offence was committed on 20 June 2024. The FIR was registered on 10 July 2024.');
  assert.equal(r.regime.PENAL, 'IPC'); assert.equal(r.regime.PROCEDURE, 'BNSS');
});
test('resolver: pending proceedings use the earliest proceeding date', () => {
  assert.equal(resolve('Trial began on 1 Oct 2024; the FIR was registered on 20 June 2024.').regime.PROCEDURE, 'CRPC');
});
test('resolver: no date -> unresolved, never guesses', () => {
  const r = resolve('Which section punishes murder?'); assert.deepEqual(r.regime, { PENAL: null, PROCEDURE: null, EVIDENCE: null });
});
test('citation parser handles common formats', () => {
  const ids = parseRefs('Section 302 of the Indian Penal Code, (Bharatiya Nyaya Sanhita, Sec. 103), BNSS 35(1), Cr.P.C. s. 41, IPC 304B').map(r => r.code + r.section);
  assert.deepEqual(ids, ['IPC302', 'BNS103', 'BNSS35', 'CRPC41', 'IPC304B']);
});
test('crosswalk: IPC 302 <-> BNS 103 and applicability dates', () => {
  assert.ok(X.counterpartsOf('IPC_302').includes('BNS_103'));
  assert.equal(X.inForce(X.byId.get('IPC_302'), '2024-06-30'), true);
  assert.equal(X.inForce(X.byId.get('IPC_302'), '2024-07-01'), false);
  assert.equal(X.inForce(X.byId.get('BNS_103'), '2024-06-30'), false);
});
test('verifier flags fabricated, temporal, cross-code and unsupported citations', () => {
  const ctx = { retrievedIds: null, regime: { PENAL: 'BNS', PROCEDURE: null, EVIDENCE: null }, tau: P.DEFAULTS.tau };
  const v = a => V.verifyAnswer(a, ctx).citations[0];
  assert.ok(v('Murder: whoever commits murder shall be punished with death or imprisonment for life (Bharatiya Nyaya Sanhita, Sec. 103).').verdict === 'pass');
  assert.deepEqual(v('Murder (Bharatiya Nyaya Sanhita, Sec. 9999).').labels, ['T1']);
  assert.ok(v('Murder: whoever commits murder shall be punished with death or imprisonment for life (Indian Penal Code, Sec. 302).').labels.includes('T3'));
  assert.ok(v('Murder: whoever commits murder shall be punished with death or imprisonment for life and disqualified for 17 years (Bharatiya Nyaya Sanhita, Sec. 103).').verdict === 'fail');
});
test('pipeline C4: post-cut-over murder -> BNS 103; pre -> IPC 302; no date -> asks; off-topic -> abstains', async () => {
  assert.deepEqual((await P.run('C4', 'What is the punishment for murder committed on 15 August 2024?')).citations, ['BNS_103']);
  assert.deepEqual((await P.run('C4', 'What is the punishment for murder committed on 15 June 2024?')).citations, ['IPC_302']);
  assert.equal((await P.run('C4', 'What is the punishment for murder?')).status, 'ask_dates');
  assert.equal((await P.run('C4', 'What is the GST rate on mobile phones sold on 5 August 2024?')).status, 'abstained');
});
test('baseline RAG exhibits the failure the paper describes (wrong code for a post-cut-over offence)', async () => {
  const r = await P.run('C1', 'Explain Section 302 IPC for an offence committed on 5 August 2024.');
  assert.ok(r.citations.includes('IPC_302'));
  const fixed = await P.run('C4', 'Explain Section 302 IPC for an offence committed on 5 August 2024.');
  assert.deepEqual(fixed.citations, ['BNS_103']);
});
test('C3 repairs an inapplicable citation through the crosswalk', async () => {
  const r = await P.run('C3', 'Explain Section 302 IPC for an offence committed on 5 August 2024.');
  assert.deepEqual(r.citations, ['BNS_103']); assert.ok(r.trace.repairs.some(x => x.action === 'replace'));
});
test('public API answerWithVerification accepts a host LLM function and repairs its output', async () => {
  const out = await jj.answerWithVerification('Punishment for murder, offence on 10 September 2024?', { generateFn: async () => 'Murder is punishable with death or life imprisonment (Indian Penal Code, Sec. 302).' });
  assert.deepEqual(out.citations, ['BNS_103']); assert.ok(out.trace.initialFlags.length === 1);
});
test('dataset: >=200 questions, valid gold, pairs never split across dev/test', () => {
  const Q = require('../data/jj_statqa_v2.json'); assert.ok(Q.length >= 200);
  for (const q of Q) for (const id of [...q.gold_provisions, ...(q.forbidden || [])]) assert.ok(X.byId.has(id), id);
  const seen = new Map(); for (const q of Q) if (q.pair) { const k = q.type === 'two_axis' ? null : q.pair.join('|') + q.family; if (k && q.type !== 'explicit_trap' && q.type !== 'month_only' && q.type !== 'ambiguous_no_date') { if (seen.has(k) && seen.get(k) !== q.split) assert.fail('pair split across dev/test ' + k); seen.set(k, q.split); } }
});

test('two-axis question keeps a separate offence segment (offence date != proceeding date)', () => {
  const R = require('../src/retriever');
  const r = R.retrieveTemporal('A case of kidnapping was committed on 10/11/2023. The FIR was registered on 11 May 2026. Which provision governs power to summon material witness, or examine person present, and which section covers the offence?');
  const codes = r.segments.map(s => s.results[0] && s.results[0].chunk.code);
  assert.ok(codes.includes('IPC'), 'offence segment must resolve to IPC: ' + codes);
  assert.ok(codes.includes('BNSS'), 'procedure segment must resolve to BNSS: ' + codes);
});
