'use strict';
// Hand-written date-phrasing stress test for the resolver. Written independently of the dataset templates.
// Set A was used while developing the resolver; set B was written afterwards and run once, unmodified.
// expect.regime lists only the families that must be resolved; `unresolved` lists families that MUST stay null.
const { resolve } = require('../src/resolver');

const A = [
  ['He was stabbed on 14 June 2024 outside a bar. Which section punishes this?', { off: '2024-06-14', regime: { PENAL: 'IPC' } }],
  ['The accident happened on 2nd August 2024. What is the punishment for causing death by negligence?', { off: '2024-08-02', regime: { PENAL: 'BNS' } }],
  ['The FIR was lodged on 3 July 2024 at the local police station. Under which section can the police arrest without warrant?', { proc: '2024-07-03', regime: { PROCEDURE: 'BNSS', EVIDENCE: 'BSA' } }],
  ['Theft happened on 25 June 2024 but the complaint was filed on 5 July 2024. Which sections apply?', { off: '2024-06-25', proc: '2024-07-05', regime: { PENAL: 'IPC', PROCEDURE: 'BNSS' } }],
  ['An FIR was registered on 2 Aug 2024 for an incident of cheating on 20 June 2024.', { off: '2024-06-20', proc: '2024-08-02', regime: { PENAL: 'IPC', PROCEDURE: 'BNSS' } }],
  ['The assault took place at 11:58 PM on 30 June 2024.', { off: '2024-06-30', regime: { PENAL: 'IPC' } }],
  ['The assault took place at 00:05 AM on 1 July 2024.', { off: '2024-07-01', regime: { PENAL: 'BNS' } }],
  ['The robbery occurred in June 2024. Which section applies?', { off: '2024-06', regime: { PENAL: 'IPC' } }],
  ['The robbery occurred in July 2024. Which section applies?', { off: '2024-07', unresolved: ['PENAL'] }],
  ['The fraud was committed during 2023.', { off: '2023', regime: { PENAL: 'IPC' } }],
  ['The fraud was committed in 2025.', { off: '2025', regime: { PENAL: 'BNS' } }],
  ['The fraud was committed in 2024.', { off: '2024', unresolved: ['PENAL'] }],
  ['Which section punishes murder?', { unresolved: ['PENAL', 'PROCEDURE', 'EVIDENCE'] }],
  ['Offence of kidnapping on 1st July, 2024; which provision applies?', { off: '2024-07-01', regime: { PENAL: 'BNS' } }],
  ['Case number 123/2024 was filed; what does Section 420 say?', { unresolved: ['PENAL'] }],
  ['An incident on 30.06.2024 led to an FIR on 01.07.2024.', { off: '2024-06-30', proc: '2024-07-01', regime: { PENAL: 'IPC', PROCEDURE: 'BNSS' } }],
  ['The trial began on 12/03/2024. Is the confession to police admissible?', { proc: '2024-03-12', regime: { PROCEDURE: 'CRPC', EVIDENCE: 'IEA' } }],
  ['He was arrested on 10 July 2024 for a theft that occurred on 15 June 2024.', { off: '2024-06-15', proc: '2024-07-10', regime: { PENAL: 'IPC', PROCEDURE: 'BNSS' } }],
  ['Trial began on 1 Oct 2024; the FIR had been registered on 20 June 2024. Which code governs the trial procedure?', { proc: '2024-06-20', regime: { PROCEDURE: 'CRPC' } }],
  ['Chargesheet filed on 12 Sept 2024 in a case where the FIR was registered on 5 April 2024.', { proc: '2024-04-05', regime: { PROCEDURE: 'CRPC' } }],
  ['Is bail available? The accused was arrested on 28 June 2024.', { proc: '2024-06-28', regime: { PROCEDURE: 'CRPC' } }],
  ['Defamation occurred on March 3, 2024 and the complaint was lodged on August 9, 2024.', { off: '2024-03-03', proc: '2024-08-09', regime: { PENAL: 'IPC', PROCEDURE: 'BNSS' } }],
  ['Mera case 15 June 2024 ko hua tha, chori ka. Kaun si dhara lagegi?', { off: '2024-06-15', regime: { PENAL: 'IPC' } }],
  ['Chori 20 August 2024 ko hui. Punishment kya hai?', { off: '2024-08-20', regime: { PENAL: 'BNS' } }],
  ['For an act committed before 1 July 2024, which code applies?', { regime: { PENAL: 'IPC' } }],
  ['For an act committed after 1 July 2024, which code applies?', { regime: { PENAL: 'BNS' } }],
  ['The offence was committed on 31/12/2023.', { off: '2023-12-31', regime: { PENAL: 'IPC' } }],
  ['The offence was committed on 2024-07-02.', { off: '2024-07-02', regime: { PENAL: 'BNS' } }],
  ['The incident happened on 29 Feb 2024 (leap day).', { off: '2024-02-29', regime: { PENAL: 'IPC' } }],
  ['The incident happened on 31 June 2024.', { off: null }],
  ['Evidence was recorded on 5 Nov 2024 in proceedings begun 3 May 2023.', { proc: '2023-05-03', regime: { EVIDENCE: 'IEA' } }],
];
const B = [
  ['The victim was robbed on 9 May 2024. Which section punishes robbery?', { off: '2024-05-09', regime: { PENAL: 'IPC' } }],
  ['A man cheated me on 17th September, 2024. What provision applies?', { off: '2024-09-17', regime: { PENAL: 'BNS' } }],
  ['Police registered the case on 22 July 2024. Under which section is a statement recorded by police?', { proc: '2024-07-22', regime: { PROCEDURE: 'BNSS' } }],
  ['Dowry harassment started on 4 Jan 2024; FIR filed 18 Aug 2024.', { off: '2024-01-04', proc: '2024-08-18', regime: { PENAL: 'IPC', PROCEDURE: 'BNSS' } }],
  ['The complaint was lodged on 11 March 2024 about a crime that took place on 2 March 2024.', { off: '2024-03-02', proc: '2024-03-11', regime: { PENAL: 'IPC', PROCEDURE: 'CRPC' } }],
  ['The crime occurred on 30 June 2024 at 11:59 PM.', { off: '2024-06-30', regime: { PENAL: 'IPC' } }],
  ['It happened on the night of 1 July 2024.', { off: '2024-07-01', regime: { PENAL: 'BNS' } }],
  ['The theft happened in May 2024.', { off: '2024-05', regime: { PENAL: 'IPC' } }],
  ['The theft happened in December 2024.', { off: '2024-12', regime: { PENAL: 'BNS' } }],
  ['The theft happened in July 2024.', { off: '2024-07', unresolved: ['PENAL'] }],
  ['Which section deals with rioting?', { unresolved: ['PENAL', 'PROCEDURE', 'EVIDENCE'] }],
  ['Investigation commenced on 13-06-2024; the trial is now going on. Which section governs remand?', { proc: '2024-06-13', regime: { PROCEDURE: 'CRPC' } }],
  ['Search and seizure was done on 4 Oct 2024 after the FIR dated 1 Oct 2024.', { proc: '2024-10-01', regime: { PROCEDURE: 'BNSS' } }],
  ['Is a dying declaration relevant? The trial commenced on 20 June 2024.', { proc: '2024-06-20', regime: { EVIDENCE: 'IEA' } }],
  ['Is an electronic record admissible? The court proceedings started on 2 Sep 2024.', { proc: '2024-09-02', regime: { EVIDENCE: 'BSA' } }],
  ['Punishment for rioting if the riot occurred on 6/7/2024 (6 July)?', { off: '2024-07-06', regime: { PENAL: 'BNS' } }],
  ['The accused committed forgery on 12th Feb 2025 and was arrested the same day, 12 Feb 2025.', { off: '2025-02-12', proc: '2025-02-12', regime: { PENAL: 'BNS', PROCEDURE: 'BNSS' } }],
  ['After the new criminal laws came into force, a man committed a theft. What is the punishment?', { regime: { PENAL: 'BNS' } }],
  ['Before the new criminal laws came into force, a theft was committed. What is the punishment?', { regime: { PENAL: 'IPC' } }],
  ['He was cheated on Dec 30, 2023, and the FIR was lodged on Jan 4, 2024.', { off: '2023-12-30', proc: '2024-01-04', regime: { PENAL: 'IPC', PROCEDURE: 'CRPC' } }],
  ['Section 302 applies? Murder committed on 31 Jan 2025.', { off: '2025-01-31', regime: { PENAL: 'BNS' } }],
  ['Alleged offence: 10 March 2023; complaint registered: 15 July 2024; hearing: 10 Dec 2024.', { off: '2023-03-10', proc: '2024-07-15', regime: { PENAL: 'IPC', PROCEDURE: 'BNSS' } }],
  ['My brother was kidnapped on 24-05-2024. Which section?', { off: '2024-05-24', regime: { PENAL: 'IPC' } }],
  ['My brother was kidnapped on 24-09-2024. Which section?', { off: '2024-09-24', regime: { PENAL: 'BNS' } }],
  ['The incident of extortion took place sometime last year.', { unresolved: ['PENAL'] }],
  ['An act of defamation was done on 8th of August 2024.', { off: '2024-08-08', regime: { PENAL: 'BNS' } }],
  ['Rs 5,00,000 was extorted on 3 Feb 2024.', { off: '2024-02-03', regime: { PENAL: 'IPC' } }],
  ['The crime was committed on 2024.06.30.', { off: '2024-06-30', regime: { PENAL: 'IPC' } }],
  ['Arrested on 1 July 2024 for an offence committed on 28 June 2024.', { off: '2024-06-28', proc: '2024-07-01', regime: { PENAL: 'IPC', PROCEDURE: 'BNSS' } }],
  ['The witness was cross-examined on 14 Nov 2024; the FIR is of 11 Jan 2024.', { proc: '2024-01-11', regime: { EVIDENCE: 'IEA', PROCEDURE: 'CRPC' } }],
];

function run(set) {
  const fails = []; let ok = 0;
  for (const [text, exp] of set) {
    const r = resolve(text); const why = [];
    if ('off' in exp && r.offence_date !== exp.off) why.push(`offence ${r.offence_date} != ${exp.off}`);
    if ('proc' in exp && r.proceeding_date !== exp.proc) why.push(`proceeding ${r.proceeding_date} != ${exp.proc}`);
    for (const [f, c] of Object.entries(exp.regime || {})) if (r.regime[f] !== c) why.push(`${f} ${r.regime[f]} != ${c}`);
    for (const f of exp.unresolved || []) if (r.regime[f] !== null) why.push(`${f} should be unresolved, got ${r.regime[f]}`);
    if (why.length) fails.push({ text, why }); else ok++;
  }
  return { n: set.length, ok, fails };
}
module.exports = { A, B, run };
if (require.main === module) {
  for (const [name, set] of [['A (development)', A], ['B (held out)', B]]) {
    const r = run(set); console.log(`Set ${name}: ${r.ok}/${r.n} correct (${(100 * r.ok / r.n).toFixed(1)}%)`);
    for (const f of r.fails) console.log('  FAIL:', f.text, '\n        ', f.why.join('; '));
  }
}
