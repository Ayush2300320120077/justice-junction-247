'use strict';
// Date resolver: extracts the offence date and proceeding date from a question and
// assigns the applicable code per axis (substantive by offence date, procedure/evidence by proceeding date).
// Everything is rule-based and deterministic; unresolved dates return null (-> ask / present both regimes).
const { CUTOVER, CODE_FAMILY, OLD_OF, NEW_OF } = require('./crosswalk');

const MONTHS = { jan: 1, january: 1, feb: 2, february: 2, mar: 3, march: 3, apr: 4, april: 4, may: 5, jun: 6, june: 6, jul: 7, july: 7,
  aug: 8, august: 8, sep: 9, sept: 9, september: 9, oct: 10, october: 10, nov: 11, november: 11, dec: 12, december: 12 };
const MON = '(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sept?(?:ember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)';
const pad = n => String(n).padStart(2, '0');
function valid(y, m, d) {
  if (y < 1800 || y > 2100 || m < 1 || m > 12 || d < 1) return false;
  return d <= new Date(Date.UTC(y, m, 0)).getUTCDate();
}
const iso = (y, m, d) => `${y}-${pad(m)}-${pad(d)}`;

// Each pattern yields {start,end,iso|null,precision}. Order matters: longest/most specific first.
function findDates(text) {
  const t = String(text);
  const hits = [];
  const taken = [];
  const free = (s, e) => !taken.some(([a, b]) => s < b && e > a);
  const push = (m, o) => { const s = m.index, e = m.index + m[0].length; if (!free(s, e)) return; taken.push([s, e]); hits.push({ start: s, end: e, raw: m[0], ...o }); };
  let m;
  // 12 June 2024 / 12th June, 2024 / 12 Jun 24 (4-digit years only for safety)
  let re = new RegExp(`\\b(\\d{1,2})(?:st|nd|rd|th)?\\s*(?:of\\s+)?${MON}\\.?,?\\s*(\\d{4})\\b`, 'gi');
  while ((m = re.exec(t))) { const d = +m[1], mo = MONTHS[m[2].toLowerCase()], y = +m[3]; if (valid(y, mo, d)) push(m, { iso: iso(y, mo, d), precision: 'day' }); }
  // June 12, 2024 / June 12th 2024
  re = new RegExp(`\\b${MON}\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?,?\\s*(\\d{4})\\b`, 'gi');
  while ((m = re.exec(t))) { const d = +m[2], mo = MONTHS[m[1].toLowerCase()], y = +m[3]; if (valid(y, mo, d)) push(m, { iso: iso(y, mo, d), precision: 'day' }); }
  // 2024-06-12
  re = /\b(\d{4})[-.](\d{1,2})[-.](\d{1,2})\b/g;
  while ((m = re.exec(t))) { if (valid(+m[1], +m[2], +m[3])) push(m, { iso: iso(+m[1], +m[2], +m[3]), precision: 'day' }); }
  // 12/06/2024, 12-06-2024, 12.06.2024  (Indian convention: DD/MM/YYYY)
  re = /\b(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})\b/g;
  while ((m = re.exec(t))) { if (valid(+m[3], +m[2], +m[1])) push(m, { iso: iso(+m[3], +m[2], +m[1]), precision: 'day' }); }
  // "June 2024", "in Aug, 2024" (month precision)
  re = new RegExp(`(?<!\\d(?:st|nd|rd|th)?\\s*(?:of\\s+)?)\\b${MON}\\.?,?\\s+(\\d{4})\\b`, 'gi');
  while ((m = re.exec(t))) { const mo = MONTHS[m[1].toLowerCase()], y = +m[2]; if (valid(y, mo, 1)) push(m, { iso: iso(y, mo, 1), precision: 'month', year: y, month: mo }); }
  // bare year "in 2023"
  re = /\b(?:in|during|of|year)\s+((?:19|20)\d{2})\b/gi;
  while ((m = re.exec(t))) push(m, { iso: `${m[1]}-01-01`, precision: 'year', year: +m[1] });
  hits.sort((a, b) => a.start - b.start);
  return hits;
}

// Is the whole span of a coarse date entirely on one side of the cut-over?
// Returns 'old' | 'new' | null (null = straddles 1 July 2024 -> cannot decide).
function sideOf(d) {
  if (!d) return null;
  if (d.precision === 'day') return d.iso < CUTOVER ? 'old' : 'new';
  if (d.precision === 'month') { const key = d.year * 100 + d.month; const cut = 202407; return key < cut ? 'old' : key > cut ? 'new' : null; }
  if (d.precision === 'year') return d.year < 2024 ? 'old' : d.year > 2024 ? 'new' : null;
  return null;
}

const OFFENCE_CUES = /\b(cheat\w*|robbed|extort\w*|threaten\w*|raped|molest\w*|beaten|injured|hurt|defrauded|forged|trespass\w*|misappropriat\w*|bribe\w*|burgl\w*|act done|done|offen[cs]e|crime|incident|occurred|occurence|happened|took place|committed|alleged(?:ly)?|act was done|accident|assault|theft|murder|robbery|cheating|killed|stabbed|attack(?:ed)?|fraud|stole|stolen|abducted|kidnapped|harass(?:ed|ment)?|defam\w+)\b/i;
const PROCEEDING_CUES = /\b(fir|f\.i\.r|first information report|registered|lodged|filed|complaint|arrest(?:ed)?|detained|remand(?:ed)?|investigation|chargesheet|charge-sheet|charge sheet|trial|hearing|proceedings?|cognizance|summons?|warrant|bail|inquiry|case was|court|produced before|magistrate|police)\b/i;
const EVIDENCE_LEX = /\b(evidence|confession|admissib\w+|witness\w*|proof|prove[nd]?|presumption|estoppel|burden|dying declaration|expert opinion|documentary evidence|electronic record|hearsay|relevan\w+|oath|cross-examin\w+)\b/i;
const PROCEDURE_LEX = /\b(arrest\w*|bail|fir|f\.i\.r|first information report|investigat\w+|charge-?\s?sheet|remand|summons?|warrant|search|seizure|inquiry|trial|cognizance|magistrate|police officer|custody|detention|appeal|revision|sentence procedure|compound\w*|complaint|jurisdiction|procedure|forum|sessions court|anticipatory)\b/i;

// Classify which legal family a text segment is about (rule-based).
function classifyFamily(text) {
  const ev = (String(text).match(new RegExp(EVIDENCE_LEX.source, 'gi')) || []).length;
  const pr = (String(text).match(new RegExp(PROCEDURE_LEX.source, 'gi')) || []).length;
  if (ev > 0 && ev >= pr) return 'EVIDENCE';
  if (pr > 0) return 'PROCEDURE';
  return 'PENAL';
}

// Which role does a date play? Looks at ~70 chars before the date and 30 after.
function roleOf(text, d) {
  const before = text.slice(Math.max(0, d.start - 70), d.start).toLowerCase();
  const after = text.slice(d.end, d.end + 30).toLowerCase();
  const ctx = before.split(/[.;?]/).pop() + ' ' + after.split(/[.;?]/)[0];
  const near = before.split(/[.;?]/).pop();
  // closest cue wins; check phrases most specific to proceedings first
  const pIdx = lastIndex(near, PROCEEDING_CUES), oIdx = lastIndex(near, OFFENCE_CUES);
  if (pIdx >= 0 || oIdx >= 0) return pIdx > oIdx ? 'proceeding' : 'offence';
  if (PROCEEDING_CUES.test(ctx)) return 'proceeding';
  if (OFFENCE_CUES.test(ctx)) return 'offence';
  return null;
}
function lastIndex(s, re) { const g = new RegExp(re.source, 'gi'); let m, last = -1; while ((m = g.exec(s))) last = m.index; return last; }

// Full resolution. `opts.today` (ISO) enables relative dates like "yesterday"; not used in evaluation.
function resolve(query, opts = {}) {
  const dates = findDates(query);
  const notes = [];
  let offence = null, proceeding = null;
  const family = classifyFamily(query);
  // a date introduced by "before/after/since ..." is a reference point, not an event date
  const isRef = d => /\b(before|after|prior to|since|until|till|from|on or after|on and after)\s+(the\s+)?(date\s+of\s+)?$/i.test(query.slice(Math.max(0, d.start - 24), d.start));
  const eventDates = dates.filter(d => !isRef(d));
  if (new RegExp('\\b\\d{1,2}(?:st|nd|rd|th)?\\s*(?:of\\s+)?' + MON + '\\.?,?\\s*\\d{4}\\b', 'i').test(query) && dates.length === 0) notes.push('invalid calendar date');
  const roles = eventDates.map(d => ({ d, role: roleOf(query, d) }));
  for (const r of roles) if (r.role === 'offence' && !offence) offence = r.d;
  // proceedings already pending at the cut-over continue under the old code, so the EARLIEST proceeding date decides
  const procs = roles.filter(r => r.role === 'proceeding').map(r => r.d).sort((a, b) => a.iso < b.iso ? -1 : a.iso > b.iso ? 1 : 0);
  if (procs.length) proceeding = procs.find(d => d.precision === 'day') || procs[0];
  // single unlabeled date: attribute it by the question's family
  const unlabeled = roles.filter(r => !r.role).map(r => r.d);
  if (unlabeled.length && !(offence && proceeding)) {
    const d = unlabeled[0];
    if (family === 'PENAL' && !offence) offence = d;
    else if (family !== 'PENAL' && !proceeding) proceeding = d;
    else if (!offence) offence = d; else if (!proceeding) proceeding = d;
  }
  // "before/after 1 July 2024", "after the new laws came into force"
  const lower = query.toLowerCase();
  const rel = /\b(after|since|post|following|on or after)\b[^.?]{0,40}(new (criminal )?(laws?|codes?)|bns|bnss|bsa|1\s*(st)?\s*july,?\s*2024|came into force)/.test(lower) ? 'new'
    : /\b(before|prior to|until|pre)\b[^.?]{0,40}(new (criminal )?(laws?|codes?)|bns|bnss|bsa|1\s*(st)?\s*july,?\s*2024|came into force)/.test(lower) ? 'old' : null;

  const sides = { PENAL: sideOf(offence), PROCEDURE: sideOf(proceeding), EVIDENCE: sideOf(proceeding) };
  // Savings-clause note: procedure follows the date the proceeding began (BNSS s.531 / BSA s.170).
  const regime = {};
  for (const fam of ['PENAL', 'PROCEDURE', 'EVIDENCE']) {
    const s = sides[fam] || (rel && !offence && !proceeding && fam === family ? rel : null);
    regime[fam] = s === 'old' ? OLD_OF[fam] : s === 'new' ? NEW_OF[fam] : null;
  }
  // Month-only July 2024 is genuinely ambiguous; say so.
  for (const d of [offence, proceeding]) if (d && d.precision !== 'day' && sideOf(d) === null) notes.push(`date "${d.raw}" straddles 1 July 2024; exact day needed`);
  if (!eventDates.length && !rel && !notes.length) notes.push('no date found; asking for offence/proceeding date');
  return {
    offence_date: offence && offence.precision === 'day' ? offence.iso : offence ? offence.iso.slice(0, offence.precision === 'month' ? 7 : 4) : null,
    proceeding_date: proceeding && proceeding.precision === 'day' ? proceeding.iso : proceeding ? proceeding.iso.slice(0, proceeding.precision === 'month' ? 7 : 4) : null,
    family, regime, relative: rel, notes,
    resolved: { PENAL: !!regime.PENAL, PROCEDURE: !!regime.PROCEDURE, EVIDENCE: !!regime.EVIDENCE },
  };
}

// Sentence-level axis split: a question can talk about an offence AND a procedural step on different dates.
function splitSegments(query) {
  const sents = String(query).replace(/\s+/g, ' ').split(/(?<=[.?!])\s+(?=[A-Z])/).map(s => s.trim()).filter(Boolean);
  return sents.length ? sents : [String(query)];
}

module.exports = { findDates, resolve, classifyFamily, sideOf, splitSegments, roleOf, CODE_FAMILY };
