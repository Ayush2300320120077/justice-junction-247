'use strict';
// Machine-checks each curated pair against the corpus text: both sections must exist and be lexically related.
const corpus = require('../data/corpus.json'); const anchors = require('../data/anchors.json');
const { tokenize, ngrams, TfIdf, cosine } = require('../src/text');
const FAM = { PENAL: ['IPC', 'BNS'], PROCEDURE: ['CRPC', 'BNSS'], EVIDENCE: ['IEA', 'BSA'] };
const by = new Map(corpus.map(c => [`${c.code}_${c.section}`, c]));
const toks = c => ngrams(tokenize(c.title + ' ' + c.title + ' ' + c.text.slice(0, 1200)));
const tf = new TfIdf(corpus.map(toks)); const idx = new Map(corpus.map((c, i) => [c.id, i]));
const rows = []; let missing = 0;
for (const [fam, m] of Object.entries(anchors)) { if (fam[0] === '_') continue; const [o, n] = FAM[fam];
  for (const [os, ns] of Object.entries(m)) {
    const a = by.get(`${o}_${os}`), b = by.get(`${n}_${ns}`);
    if (!a || !b) { missing++; console.log('MISSING', fam, os, ns, !!a, !!b); continue; }
    rows.push({ fam, o: os, n: ns, sim: cosine(tf.vecs[idx.get(a.id)], tf.vecs[idx.get(b.id)]), ot: a.title, nt: b.title });
  } }
rows.sort((x, y) => x.sim - y.sim);
console.log('pairs', rows.length, 'missing', missing);
console.log('--- lowest-similarity pairs (inspect manually) ---');
for (const r of rows.slice(0, 40)) console.log(r.sim.toFixed(2), r.fam[0], r.o, '->', r.n, '|', r.ot.slice(0, 55), '=>', r.nt.slice(0, 55));
