'use strict';
// Version-aware statute registry + IPC<->BNS, CrPC<->BNSS, IEA<->BSA crosswalk.
const corpus = require('../data/corpus.json');
const anchors = require('../data/anchors.json');

const CUTOVER = '2024-07-01';
const FAMILIES = { PENAL: ['IPC', 'BNS'], PROCEDURE: ['CRPC', 'BNSS'], EVIDENCE: ['IEA', 'BSA'] };
const CODE_FAMILY = { IPC: 'PENAL', BNS: 'PENAL', CRPC: 'PROCEDURE', BNSS: 'PROCEDURE', IEA: 'EVIDENCE', BSA: 'EVIDENCE' };
const OLD_OF = { PENAL: 'IPC', PROCEDURE: 'CRPC', EVIDENCE: 'IEA' };
const NEW_OF = { PENAL: 'BNS', PROCEDURE: 'BNSS', EVIDENCE: 'BSA' };

const byId = new Map(corpus.map(c => [c.id, c]));
const idOf = (code, section) => `${code}_${String(section).toUpperCase()}`;
const get = (code, section) => byId.get(idOf(code, section)) || null;

// counterpart maps: id -> [ids]  (many-to-one is legal: IPC 141/143 -> BNS 189)
const counterparts = new Map();
const add = (a, b) => { if (!counterparts.has(a)) counterparts.set(a, new Set()); counterparts.get(a).add(b); };
for (const [fam, m] of Object.entries(anchors)) {
  if (fam[0] === '_') continue;
  const [o, n] = FAMILIES[fam];
  for (const [os, ns] of Object.entries(m)) {
    const a = idOf(o, os), b = idOf(n, ns);
    if (byId.has(a) && byId.has(b)) { add(a, b); add(b, a); }
  }
}

function counterpartsOf(id) { return [...(counterparts.get(id) || [])]; }
function counterpartIn(id, code) { return counterpartsOf(id).filter(x => x.startsWith(code + '_')); }

// A provision is applicable on a date iff its code was in force on that date. Cut-over is 1 July 2024:
// the old codes cover everything before it, the new codes everything on/after it.
function inForce(chunk, isoDate) {
  if (!isoDate) return null;
  if (chunk.effective_from && isoDate < chunk.effective_from) return false;
  if (chunk.repealed_on && isoDate >= chunk.repealed_on) return false;
  return true;
}
function codeFor(family, isoDate) {
  if (!isoDate) return null;
  return isoDate < CUTOVER ? OLD_OF[family] : NEW_OF[family];
}

module.exports = { CUTOVER, FAMILIES, CODE_FAMILY, OLD_OF, NEW_OF, corpus, byId, idOf, get, counterpartsOf, counterpartIn, inForce, codeFor };
