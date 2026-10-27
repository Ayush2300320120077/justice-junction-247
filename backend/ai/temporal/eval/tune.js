'use strict';
// Tunes the only two free parameters on the DEV split and writes data/params.json:
//   theta  - answerability threshold on idf-weighted query coverage (abstain below it)
//   tau    - V4 lexical-entailment coverage threshold
// Nothing here ever sees the test split.
const fs = require('fs'), path = require('path');
const Q = require('../data/jj_statqa_v2.json');
const R = require('../src/retriever');
const C = require('./challenge');

const dev = Q.filter(q => q.split === 'dev');
const rows = dev.map(q => { const r = R.retrieveBaseline(q.question, { k: 5 }); const top = Math.max(...r.segments[0].results.filter(x => !x.pinned).map(x => x.cov), 0); return { top, answerable: q.expected !== 'abstain', pinned: r.segments[0].results.some(x => x.pinned) }; });
let best = { bal: -1 };
for (let t = 0.2; t <= 0.95; t += 0.01) {
  const tp = rows.filter(r => r.answerable && (r.pinned || r.top >= t)).length / rows.filter(r => r.answerable).length;
  const tn = rows.filter(r => !r.answerable && !(r.pinned || r.top >= t)).length / rows.filter(r => !r.answerable).length;
  const bal = (tp + tn) / 2; if (bal > best.bal + 1e-9) best = { theta: +t.toFixed(2), bal, tp, tn };
}
const items = C.build('dev'); let bt = { J: -1 };
for (let tau = 0.4; tau <= 0.96; tau += 0.02) { const s = C.summary(C.evaluate(items, tau)); if (s.J > bt.J + 1e-9) bt = { tau: +tau.toFixed(2), ...s }; }
const params = { theta: best.theta, tau: bt.tau, _tuned_on: 'dev split only', _theta_balanced_acc: +best.bal.toFixed(3), _tau_youden_J: +bt.J.toFixed(3) };
fs.writeFileSync(path.join(__dirname, '../data/params.json'), JSON.stringify(params, null, 1));
console.log(params);
