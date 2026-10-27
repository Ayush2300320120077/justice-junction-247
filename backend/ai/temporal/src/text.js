'use strict';
// Small dependency-free text utilities (tokenizer, TF-IDF, BM25, cosine).
const STOP = new Set(('a an and are as at be by for from has have he her his in is it its of on or she that the their them they this to was were which who whom whose will with shall any such not may than then there these those under upon into other any provided case person persons section sections act code sanhita sub clause said also been being can could would should each every all one two three if when where whether so no nor but however').split(/\s+/));

function tokenize(s) {
  return (String(s || '').toLowerCase().match(/[a-z][a-z'-]*|\d+[a-z]?/g) || [])
    .filter(t => !STOP.has(t) && t.length > 1)
    .map(stem);
}
function stem(t) { // light suffix stripper, enough for statute English
  return t.replace(/(ations|ation|ings|ing|ies|ied|ness|ments|ment|ers|er|ed|es|s)$/,
    (m) => (m === 'ies' || m === 'ied') ? 'y' : '');
}
function ngrams(tokens, n = 2) {
  const out = tokens.slice();
  for (let i = 0; i + n <= tokens.length; i++) out.push(tokens.slice(i, i + n).join('_'));
  return out;
}

class TfIdf {
  constructor(docsTokens) {
    this.N = docsTokens.length; this.df = new Map();
    for (const toks of docsTokens) for (const t of new Set(toks)) this.df.set(t, (this.df.get(t) || 0) + 1);
    this.vecs = docsTokens.map(t => this.vec(t));
  }
  idf(t) { return Math.log(1 + this.N / (1 + (this.df.get(t) || 0))); }
  vec(tokens) {
    const tf = new Map(); for (const t of tokens) tf.set(t, (tf.get(t) || 0) + 1);
    const v = new Map(); let norm = 0;
    for (const [t, c] of tf) { const w = (1 + Math.log(c)) * this.idf(t); v.set(t, w); norm += w * w; }
    norm = Math.sqrt(norm) || 1; for (const [t, w] of v) v.set(t, w / norm);
    return v;
  }
}
function cosine(a, b) {
  if (a.size > b.size) [a, b] = [b, a];
  let s = 0; for (const [t, w] of a) { const x = b.get(t); if (x) s += w * x; } return s;
}

class BM25 {
  constructor(docsTokens, k1 = 1.4, b = 0.75) {
    this.k1 = k1; this.b = b; this.docs = docsTokens; this.N = docsTokens.length;
    this.len = docsTokens.map(d => d.length); this.avg = this.len.reduce((a, c) => a + c, 0) / (this.N || 1);
    this.df = new Map(); this.tf = docsTokens.map(d => { const m = new Map(); for (const t of d) m.set(t, (m.get(t) || 0) + 1); return m; });
    for (const m of this.tf) for (const t of m.keys()) this.df.set(t, (this.df.get(t) || 0) + 1);
  }
  scoreAll(qTokens) {
    const q = [...new Set(qTokens)]; const out = new Float64Array(this.N);
    for (const t of q) {
      const df = this.df.get(t); if (!df) continue;
      const idf = Math.log(1 + (this.N - df + 0.5) / (df + 0.5));
      for (let i = 0; i < this.N; i++) {
        const f = this.tf[i].get(t); if (!f) continue;
        out[i] += idf * (f * (this.k1 + 1)) / (f + this.k1 * (1 - this.b + this.b * this.len[i] / this.avg));
      }
    }
    return out;
  }
}
module.exports = { tokenize, ngrams, TfIdf, cosine, BM25, STOP };
