'use strict';
// Public API for embedding the temporal-verification layer in the Justice Junction backend (backend/ai/).
//   const jj = require('./temporal');
//   const out = await jj.answerWithVerification(question, { generateFn: async (query, segments) => llmText });
// `generateFn` receives the query and the applicability-filtered retrieval segments and must return answer text that
// cites provisions as "(Act Name, Sec. N)". The result is the verified (repaired / abstained) answer plus a trace.
const P = require('./pipeline');
const V = require('./verifier');
const { resolve } = require('./resolver');
module.exports = {
  answerWithVerification: (question, opts = {}) => P.run('C4', question, opts),
  baselineAnswer: (question, opts = {}) => P.run('C1', question, opts),
  verifyCitations: (answerText, { question, retrievedIds = null, tau } = {}) =>
    V.verifyAnswer(answerText, { retrievedIds, regime: resolve(question || '').regime, tau: tau || P.DEFAULTS.tau }),
  resolveDates: resolve,
};
