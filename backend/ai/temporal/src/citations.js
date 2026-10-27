'use strict';
// Parsing of statute references ("Section 302 IPC", "(Bharatiya Nyaya Sanhita, Sec. 103)", "BNSS 35") from free text.
const ACT_ALIASES = [
  [/bharatiya\s+nagarik\s+suraksha\s+sanhita(?:,?\s*2023)?/i, 'BNSS'],
  [/bharatiya\s+nyaya\s+sanhita(?:,?\s*2023)?/i, 'BNS'],
  [/bharatiya\s+sakshya\s+adhiniyam(?:,?\s*2023)?/i, 'BSA'],
  [/code\s+of\s+criminal\s+procedure(?:,?\s*1973)?/i, 'CRPC'],
  [/indian\s+penal\s+code(?:,?\s*1860)?/i, 'IPC'],
  [/(?:indian\s+)?evidence\s+act(?:,?\s*1872)?/i, 'IEA'],
  [/\bbnss\b/i, 'BNSS'], [/\bbns\b/i, 'BNS'], [/\bbsa\b/i, 'BSA'],
  [/\bcr\.?\s?p\.?\s?c\.?(?=[\s,.;:)]|$)/i, 'CRPC'], [/\bipc\b/i, 'IPC'], [/\biea\b/i, 'IEA'],
];
const ACT_SRC = ACT_ALIASES.map(([r]) => r.source).join('|');
const SEC = '(\\d{1,4}(?:-?[A-Za-z]{1,2}(?![A-Za-z]))?)';       // 302, 304B, 304-B (no space: avoids '302 of')
const SUB = '((?:\\s*\\([0-9a-zA-Z]{1,4}\\))*)';        // (1)(a)
const KW = '(?:sections?|sec\\.?|s\\.|u\\/s|§)';

function normCode(name) {
  for (const [r, c] of ACT_ALIASES) if (new RegExp('^(?:' + r.source + ')$', 'i').test(name.trim())) return c;
  for (const [r, c] of ACT_ALIASES) if (r.test(name)) return c;
  return null;
}
function normSection(s) { return String(s).replace(/[\s-]/g, '').toUpperCase(); }

// returns [{code, section, sub, index, end, raw}] for every reference found.
function parseRefs(text) {
  const t = String(text), out = [], seen = [];
  const free = (s, e) => !seen.some(([a, b]) => s < b && e > a);
  const take = (m, code, section, sub) => {
    const s = m.index, e = m.index + m[0].length;
    if (!code || !free(s, e)) return; seen.push([s, e]);
    out.push({ code, section: normSection(section), sub: (sub || '').replace(/\s+/g, ''), index: s, end: e, raw: m[0] });
  };
  let m;
  // "Section 302 of the Indian Penal Code" / "Sec. 103 BNS" / "Sections 302 IPC"
  let re = new RegExp(`${KW}\\s*${SEC}${SUB}\\s*(?:(?:of|under)\\s+)?(?:the\\s+)?(${ACT_SRC})`, 'gi');
  while ((m = re.exec(t))) take(m, normCode(m[3]), m[1], m[2]);
  // "(Bharatiya Nyaya Sanhita, Sec. 103)" / "IPC Section 302" / "BNS, s. 103"
  re = new RegExp(`(${ACT_SRC})\\s*,?\\s*(?:${KW})\\s*${SEC}${SUB}`, 'gi');
  while ((m = re.exec(t))) take(m, normCode(m[1]), m[2], m[3]);
  // bare "IPC 302", "BNSS 35(1)" (reject years)
  re = new RegExp(`\\b(ipc|bnss|bns|bsa|crpc|iea)\\s+${SEC}${SUB}(?![\\d])`, 'gi');
  while ((m = re.exec(t))) { if (+m[2] >= 1800 && /^\d{4}$/.test(m[2])) continue; take(m, normCode(m[1]), m[2], m[3]); }
  out.sort((a, b) => a.index - b.index);
  return out;
}

// citations in an ANSWER, each with the sentence that contains it (the claim to be checked)
function parseCitations(answer) {
  const text = String(answer);
  const refs = parseRefs(text);
  const bounds = []; const re = /[^.!?\n]+(?:\.(?!\s*[A-Z\n(])[^.!?\n]*)*[.!?]?/g; let m;
  while ((m = re.exec(text))) if (m[0].trim()) bounds.push([m.index, m.index + m[0].length, m[0].trim()]);
  return refs.map(r => {
    const b = bounds.find(([s, e]) => r.index >= s && r.index < e);
    return { ...r, claim: b ? b[2] : text.slice(Math.max(0, r.index - 120), r.end + 120), id: `${r.code}_${r.section}` };
  });
}
module.exports = { parseRefs, parseCitations, normCode, normSection };
