'use strict';
// Normalises the six raw statute files into one version-aware corpus (data/corpus.json).
const fs = require('fs'), path = require('path');
const raw = f => JSON.parse(fs.readFileSync(path.join(__dirname, '../data/raw', f), 'utf8'));
const REG = {
  IPC:  { name: 'Indian Penal Code, 1860',                  family: 'PENAL',     status: 'repealed', effective_from: '1862-01-01', repealed_on: '2024-07-01' },
  BNS:  { name: 'Bharatiya Nyaya Sanhita, 2023',            family: 'PENAL',     status: 'in_force', effective_from: '2024-07-01', repealed_on: null },
  CRPC: { name: 'Code of Criminal Procedure, 1973',         family: 'PROCEDURE', status: 'repealed', effective_from: '1974-04-01', repealed_on: '2024-07-01' },
  BNSS: { name: 'Bharatiya Nagarik Suraksha Sanhita, 2023', family: 'PROCEDURE', status: 'in_force', effective_from: '2024-07-01', repealed_on: null },
  IEA:  { name: 'Indian Evidence Act, 1872',                family: 'EVIDENCE',  status: 'repealed', effective_from: '1872-09-01', repealed_on: '2024-07-01' },
  BSA:  { name: 'Bharatiya Sakshya Adhiniyam, 2023',        family: 'EVIDENCE',  status: 'in_force', effective_from: '2024-07-01', repealed_on: null },
};
const clean = s => String(s || '').replace(/\r/g, '').replace(/[\t ]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
const out = [];
const add = (code, section, title, text) => out.push({
  id: `${code}_${section}`, code, act: REG[code].name, code_family: REG[code].family, status: REG[code].status,
  effective_from: REG[code].effective_from, repealed_on: REG[code].repealed_on, superseded_by: null,
  section: String(section), title: clean(title), text: clean(text),
});
for (const x of raw('ipc.json')) add('IPC', x.Section, x.section_title, x.section_desc);
for (const x of raw('crpc.json')) add('CRPC', x.section, x.section_title, x.section_desc);
for (const x of raw('iea.json')) add('IEA', x.section, x.section_title, x.section_desc);
const stripCtx = t => String(t).replace(/^\[Context:[^\]]*\]\s*/, '');
for (const [f, code] of [['bns_sections.json', 'BNS'], ['bnss_sections.json', 'BNSS'], ['bsa_sections.json', 'BSA']])
  for (const x of raw(f)) add(code, x.section_number ?? x.chunk_id.split('_')[1], x.section_title, stripCtx(x.text));
fs.writeFileSync(path.join(__dirname, '../data/corpus.json'), JSON.stringify(out));
const c = {}; for (const r of out) c[r.code] = (c[r.code] || 0) + 1;
console.log('chunks', out.length, c);
