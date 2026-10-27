import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Send, CheckCircle, AlertTriangle, ShieldCheck, Sparkles, Scale, RefreshCw, BookOpen, Clock, Info } from 'lucide-react'
import { API } from '../api'

const TABLE_A_DATA = [
  { config: 'C1 Standard RAG (date-blind)', ansAcc: '38.3 (33.6–43.0)', tempAcc: '39.9', citPrec: '45.2', inappCit: '54.8', wrongCode: '52.2', recall5: '85.4', mrr: '0.639', abstain: '64.3' },
  { config: 'C1L RAG + "always latest law"', ansAcc: '36.3 (31.9–41.0)', tempAcc: '37.2', citPrec: '48.0', inappCit: '52.0', wrongCode: '44.8', recall5: '43.6', mrr: '0.425', abstain: '64.3' },
  { config: 'C2 + date resolver/filter', ansAcc: '86.9 (83.7–90.1)', tempAcc: '85.8', citPrec: '99.5', inappCit: '0.5', wrongCode: '0.0', recall5: '89.9', mrr: '0.886', abstain: '100.0' },
  { config: 'C3 RAG + citation verifier', ansAcc: '87.4 (84.2–90.6)', tempAcc: '87.4', citPrec: '98.9', inappCit: '1.1', wrongCode: '0.3', recall5: '85.4', mrr: '0.639', abstain: '64.3' },
  { config: 'C4 Full (filter + verifier)', ansAcc: '86.9 (83.7–90.4)', tempAcc: '85.8', citPrec: '99.5', inappCit: '0.5', wrongCode: '0.0', recall5: '89.9', mrr: '0.886', abstain: '100.0' }
]

const TABLE_B_DATA = [
  { config: 'C1 Standard RAG (date-blind)', ansAcc: '42.2 (36.9–47.4)', tempAcc: '43.7', citPrec: '46.4', inappCit: '53.6', wrongCode: '52.4', recall5: '86.7', mrr: '0.664', abstain: '64.3' },
  { config: 'C1L RAG + "always latest law"', ansAcc: '36.6 (31.7–41.9)', tempAcc: '37.0', citPrec: '44.8', inappCit: '55.2', wrongCode: '48.9', recall5: '41.3', mrr: '0.408', abstain: '64.3' },
  { config: 'C2 + date resolver/filter', ansAcc: '90.4 (87.2–93.3)', tempAcc: '89.7', citPrec: '99.4', inappCit: '0.6', wrongCode: '0.0', recall5: '91.3', mrr: '0.905', abstain: '100.0' },
  { config: 'C3 RAG + citation verifier', ansAcc: '91.9 (89.0–94.8)', tempAcc: '92.6', citPrec: '99.7', inappCit: '0.3', wrongCode: '0.3', recall5: '86.7', mrr: '0.664', abstain: '64.3' },
  { config: 'C4 Full (filter + verifier)', ansAcc: '90.4 (87.2–93.3)', tempAcc: '89.7', citPrec: '99.4', inappCit: '0.6', wrongCode: '0.0', recall5: '91.3', mrr: '0.905', abstain: '100.0' }
]

const TABLE_C_DATA = [
  { type: 'temporal_lookup', n: 220, c1: '47.7', c1l: '45.9', c2: '85.9', c3: '96.4', c4: '85.9' },
  { type: 'boundary', n: 44, c1: '52.3', c1l: '40.9', c2: '84.1', c3: '95.5', c4: '84.1' },
  { type: 'month_only', n: 42, c1: '42.9', c1l: '40.5', c2: '85.7', c3: '85.7', c4: '85.7' },
  { type: 'explicit_trap', n: 30, c1: '0.0', c1l: '0.0', c2: '100.0', c3: '100.0', c4: '100.0' },
  { type: 'two_axis', n: 30, c1: '0.0', c1l: '0.0', c2: '73.3', c3: '0.0', c4: '73.3' },
  { type: 'ambiguous_no_date', n: 19, c1: '0.0', c1l: '0.0', c2: '94.7', c3: '100.0', c4: '94.7' },
  { type: 'unanswerable', n: 14, c1: '64.3', c1l: '64.3', c2: '100.0', c3: '64.3', c4: '100.0' },
  { type: 'retroactivity_trap', n: 6, c1: '0.0', c1l: '33.3', c2: '100.0', c3: '100.0', c4: '100.0' }
]

const TABLE_D_DATA = [
  { slice: 'Overall', n: 391, acc: '99.5', exact: '99.5' },
  { slice: 'temporal_lookup', n: 220, acc: '99.5', exact: '99.5' },
  { slice: 'boundary', n: 44, acc: '97.7', exact: '97.7' },
  { slice: 'month_only', n: 42, acc: '100.0', exact: '100.0' },
  { slice: 'explicit_trap', n: 30, acc: '100.0', exact: '100.0' },
  { slice: 'two_axis', n: 30, acc: '100.0', exact: '100.0' },
  { slice: 'ambiguous_no_date', n: 19, acc: '100.0', exact: '100.0' },
  { slice: 'retroactivity_trap', n: 6, acc: '100.0', exact: '100.0' },
  { slice: 'boundary-new', n: 21, acc: '100.0', exact: '100.0' },
  { slice: 'boundary-old', n: 23, acc: '95.7', exact: '95.7' },
  { slice: 'June 2024', n: 21, acc: '100.0', exact: '100.0' },
  { slice: 'August 2024', n: 21, acc: '100.0', exact: '100.0' }
]

const TABLE_E_DATA = [
  { condition: 'clean', n: 306, flagged: '0.0%', labelCorrect: '—', note: 'Untouched correct baseline (false-positive rate = 0)' },
  { condition: 'T1 (Wrong act / regime)', n: 306, flagged: '100.0%', labelCorrect: '100.0%', note: 'e.g. IPC cited for an offence committed after 1 July 2024' },
  { condition: 'T2 (Wrong section number)', n: 306, flagged: '98.0%', labelCorrect: '62.4%', note: 'Section title does not match statutory text' },
  { condition: 'T3 (Repealed section as current)', n: 306, flagged: '99.3%', labelCorrect: '99.3%', note: 'Repealed provision invoked for post-transition conduct' },
  { condition: 'T4 (Future section prematurely)', n: 253, flagged: '100.0%', labelCorrect: '100.0%', note: 'New statute cited for pre-transition conduct' },
  { condition: 'T5 (Non-existent provision)', n: 306, flagged: '94.8%', labelCorrect: '94.8%', note: 'Section number does not exist in cited statute' }
]

const SAMPLE_QUERIES = [
  "What is the punishment for murder committed on 15 August 2024?",
  "What was the procedure for arrest on 10 January 2024?",
  "An offence occurred on 20 May 2024 and charge sheet was filed on 10 August 2024. Which laws apply?"
]

export default function ResearchTemporal() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState(null)
  const [error, setError] = useState(null)

  const handleRunQuery = async (textToRun) => {
    const q = textToRun || query
    if (!q.trim() || loading) return

    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      const res = await API.chat({ message: q, history: [] })
      setResponse(res)
    } catch (err) {
      setError(err.message || 'Failed to execute query')
    } finally {
      setLoading(false)
    }
  }

  const formatRegime = (regime) => {
    if (!regime) return 'Not determined'
    if (typeof regime === 'string') return regime
    const parts = []
    if (regime.penal) parts.push(`Penal: ${regime.penal}`)
    if (regime.procedure) parts.push(`Procedure: ${regime.procedure}`)
    if (regime.evidence) parts.push(`Evidence: ${regime.evidence}`)
    return parts.length > 0 ? parts.join(' | ') : JSON.stringify(regime)
  }

  return (
    <div style={styles.page}>
      {/* Hero Header */}
      <section style={styles.hero}>
        <div style={styles.container}>
          <div style={styles.badgeRow}>
            <span style={styles.paperBadge}>
              <Scale size={14} style={{ marginRight: 6 }} /> Empirical Research Benchmark
            </span>
            <span style={styles.splitBadge}>JJ-StatQA v2</span>
          </div>
          <h1 style={styles.title}>
            Temporally-Grounded Citation Verification for Retrieval-Augmented Legal Question Answering under India's Criminal-Law Transition
          </h1>
          <p style={styles.abstract}>
            On 1 July 2024, India replaced its foundational penal, procedural, and evidentiary codes (IPC, CrPC, and IEA) with the Bharatiya Nyaya Sanhita (BNS), Bharatiya Nagarik Suraksha Sanhita (BNSS), and Bharatiya Sakshya Adhiniyam (BSA). Because substantive criminal liability strictly attaches to the statute in force on the date of commission, standard retrieval-augmented generation systems exhibit widespread temporal misalignment, frequently citing repealed or inapplicable enactments. We formalize statutory citation verification under this transition, evaluate a pipeline that extracts temporal anchors and validates citations against a structured crosswalk, and demonstrate near-total elimination of wrong-code citations across 570 statutory questions.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.container}>

          {/* Interactive "Try it" Demo Card */}
          <section style={styles.tryCard}>
            <div style={styles.tryHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={styles.tryIconWrap}>
                  <Sparkles size={20} style={{ color: '#D97706' }} />
                </div>
                <div>
                  <h2 style={styles.tryTitle}>Interactive Citation Verification Demo</h2>
                  <p style={styles.trySubtitle}>Test temporal regime resolution and statutory citation auditing live against the API</p>
                </div>
              </div>
              <div style={styles.disclaimerPill}>
                <AlertTriangle size={13} style={{ color: '#B45309', marginRight: 4 }} />
                <span>AI assistant, not legal advice</span>
              </div>
            </div>

            <div style={styles.tryBody}>
              <div style={styles.inputRow}>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRunQuery()}
                  placeholder="e.g. What is the punishment for murder committed on 15 August 2024?"
                  style={styles.input}
                  disabled={loading}
                />
                <button
                  onClick={() => handleRunQuery()}
                  disabled={!query.trim() || loading}
                  style={{
                    ...styles.sendBtn,
                    opacity: !query.trim() || loading ? 0.6 : 1,
                    cursor: !query.trim() || loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? <RefreshCw size={16} className="spin" /> : <Send size={16} />}
                  <span style={{ marginLeft: 6 }}>{loading ? 'Evaluating...' : 'Send'}</span>
                </button>
              </div>

              {/* Sample Queries */}
              <div style={styles.samplesRow}>
                <span style={styles.samplesLabel}>Try sample queries:</span>
                <div style={styles.samplesList}>
                  {SAMPLE_QUERIES.map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setQuery(sample)
                        handleRunQuery(sample)
                      }}
                      style={styles.sampleBtn}
                    >
                      {sample}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div style={styles.errorBox}>
                  <AlertTriangle size={16} style={{ color: '#DC2626', marginRight: 8, flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}

              {/* Response output */}
              {response && (
                <div style={styles.outputCard}>
                  {/* Verification Status & Regime Header */}
                  <div style={styles.outputMetaRow}>
                    <div style={styles.metaItem}>
                      <span style={styles.metaLabel}>Verification Status:</span>
                      <span style={{
                        ...styles.statusBadge,
                        background: response.verification?.status === 'answered' ? '#DEF7EC' : response.verification?.status === 'ask_dates' ? '#FEF3C7' : '#F3F4F6',
                        color: response.verification?.status === 'answered' ? '#03543F' : response.verification?.status === 'ask_dates' ? '#92400E' : '#374151',
                        border: `1px solid ${response.verification?.status === 'answered' ? '#BCF0DA' : response.verification?.status === 'ask_dates' ? '#FDE68A' : '#E5E7EB'}`
                      }}>
                        {response.verification?.status || 'not_applicable'}
                      </span>
                    </div>

                    <div style={styles.metaItem}>
                      <span style={styles.metaLabel}>Resolved Regime:</span>
                      <span style={styles.regimeVal}>
                        {formatRegime(response.verification?.regime)}
                      </span>
                    </div>
                  </div>

                  {/* Repaired note */}
                  {response.verification?.repaired?.length > 0 && (
                    <div style={styles.repairAlert}>
                      <Info size={15} style={{ color: '#2563EB', marginRight: 6, flexShrink: 0 }} />
                      <span>A citation from a repealed code was replaced with its current counterpart.</span>
                    </div>
                  )}

                  {/* Ask dates hint */}
                  {response.verification?.status === 'ask_dates' && (
                    <div style={styles.askDatesAlert}>
                      <Clock size={15} style={{ color: '#D97706', marginRight: 6, flexShrink: 0 }} />
                      <span>Tell me the date of the offence and the date the case/FIR began; the applicable law depends on whether it was before or on/after 1 July 2024.</span>
                    </div>
                  )}

                  {/* Answer Text */}
                  <div style={styles.answerSection}>
                    <h4 style={styles.sectionHeading}>Model Response:</h4>
                    <p style={styles.answerText}>{response.reply}</p>
                  </div>

                  {/* Sources List with Badges */}
                  {response.sources && response.sources.length > 0 && (
                    <div style={styles.sourcesSection}>
                      <h4 style={styles.sectionHeading}>
                        <BookOpen size={15} style={{ marginRight: 6, color: '#7B1D2E' }} />
                        Cited Legal Sources ({response.sources.length})
                      </h4>
                      <div style={styles.sourcesGrid}>
                        {response.sources.map((src, idx) => (
                          <div key={idx} style={styles.sourceCard}>
                            <div style={styles.sourceTop}>
                              <span style={styles.sourceTitle}>
                                {src.actName} · Sec. {src.sectionNumber}
                              </span>
                              {src.verdict === 'pass' && (
                                <span style={styles.badgePass}>Applicable on your date</span>
                              )}
                              {src.verdict === 'needs_date' && (
                                <span style={styles.badgeNeedsDate}>Date needed</span>
                              )}
                            </div>
                            {src.sectionTitle && (
                              <div style={styles.sourceSnippet}>{src.sectionTitle}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Mandatory Empirical Evaluation Notice */}
          <div style={styles.noticeBox}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <ShieldCheck size={22} style={{ color: '#1E3A8A', flexShrink: 0, marginTop: 2 }} />
              <div>
                <h3 style={styles.noticeHeading}>Evaluation Setup & Benchmark Scope</h3>
                <p style={styles.noticeText}>
                  Results below use an offline extractive reader on JJ-StatQA v2 (570 questions: 165 dev, 405 test). They isolate retrieval, date filtering and citation verification and do not measure free-text LLM hallucination. Gold labels derive from a hand-curated IPC-BNS crosswalk that is pending independent legal review.
                </p>
              </div>
            </div>
          </div>

          {/* Section: Main Benchmark Results */}
          <div style={styles.sectionCard}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.tableTitle}>Table A. Main comparison, test split, all questions (n=405)</h2>
              <p style={styles.tableSubtitle}>Comprehensive evaluation across standard RAG, heuristic recency, date filtering, and citation verification.</p>
            </div>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.theadRow}>
                    <th style={styles.thLeft}>Configuration</th>
                    <th style={styles.th}>Answer acc. % (95% CI)</th>
                    <th style={styles.th}>Temporal acc.* %</th>
                    <th style={styles.th}>Citation precision %</th>
                    <th style={styles.th}>Temporally-inapplicable cit. %</th>
                    <th style={styles.th}>Wrong-code cited %</th>
                    <th style={styles.th}>Recall@5 %</th>
                    <th style={styles.th}>MRR</th>
                    <th style={styles.th}>Abstain on unanswerable %</th>
                  </tr>
                </thead>
                <tbody>
                  {TABLE_A_DATA.map((row, idx) => (
                    <tr key={idx} style={idx % 2 === 1 ? styles.trAlt : styles.tr}>
                      <td style={styles.tdBold}>{row.config}</td>
                      <td style={styles.tdCenter}>{row.ansAcc}</td>
                      <td style={styles.tdCenter}>{row.tempAcc}</td>
                      <td style={styles.tdCenter}>{row.citPrec}</td>
                      <td style={styles.tdCenter}>{row.inappCit}</td>
                      <td style={styles.tdCenter}>{row.wrongCode}</td>
                      <td style={styles.tdCenter}>{row.recall5}</td>
                      <td style={styles.tdCenter}>{row.mrr}</td>
                      <td style={styles.tdCenter}>{row.abstain}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={styles.notesBlock}>
              <div style={styles.notesTitle}>Paired tests (per-question correctness):</div>
              <ul style={styles.notesList}>
                <li>C4 vs C1: C4-only-correct 213, other-only-correct 16, McNemar exact p &lt; 0.0001</li>
                <li>C4 vs C1L: C4-only-correct 218, other-only-correct 13, McNemar exact p &lt; 0.0001</li>
                <li>C4 vs C2: C4-only-correct 0, other-only-correct 0, McNemar exact p 1.000</li>
                <li>C4 vs C3: C4-only-correct 29, other-only-correct 31, McNemar exact p 0.897</li>
              </ul>
              <div style={styles.asteriskNote}>
                *Temporal acc. = accuracy on the date-dependent types (temporal_lookup, boundary, month_only, two_axis, explicit_trap).
              </div>
            </div>
          </div>

          {/* Section: Table B Well-Posed Subset */}
          <div style={styles.sectionCard}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.tableTitle}>Table B. Same, test split, well-posed subset (n=344)</h2>
              <p style={styles.tableSubtitle}>Drops questions whose gold section title is non-unique or &lt;3 words; rule fixed before evaluation.</p>
            </div>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.theadRow}>
                    <th style={styles.thLeft}>Configuration</th>
                    <th style={styles.th}>Answer acc. % (95% CI)</th>
                    <th style={styles.th}>Temporal acc.* %</th>
                    <th style={styles.th}>Citation precision %</th>
                    <th style={styles.th}>Temporally-inapplicable cit. %</th>
                    <th style={styles.th}>Wrong-code cited %</th>
                    <th style={styles.th}>Recall@5 %</th>
                    <th style={styles.th}>MRR</th>
                    <th style={styles.th}>Abstain on unanswerable %</th>
                  </tr>
                </thead>
                <tbody>
                  {TABLE_B_DATA.map((row, idx) => (
                    <tr key={idx} style={idx % 2 === 1 ? styles.trAlt : styles.tr}>
                      <td style={styles.tdBold}>{row.config}</td>
                      <td style={styles.tdCenter}>{row.ansAcc}</td>
                      <td style={styles.tdCenter}>{row.tempAcc}</td>
                      <td style={styles.tdCenter}>{row.citPrec}</td>
                      <td style={styles.tdCenter}>{row.inappCit}</td>
                      <td style={styles.tdCenter}>{row.wrongCode}</td>
                      <td style={styles.tdCenter}>{row.recall5}</td>
                      <td style={styles.tdCenter}>{row.mrr}</td>
                      <td style={styles.tdCenter}>{row.abstain}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={styles.notesBlock}>
              <div style={styles.notesTitle}>Paired tests:</div>
              <ul style={styles.notesList}>
                <li>C4 vs C1: C4-only-correct 180, other-only-correct 14, McNemar exact p &lt; 0.0001</li>
                <li>C4 vs C1L: C4-only-correct 196, other-only-correct 11, McNemar exact p &lt; 0.0001</li>
                <li>C4 vs C2: C4-only-correct 0, other-only-correct 0, McNemar exact p 1.000</li>
                <li>C4 vs C3: C4-only-correct 22, other-only-correct 27, McNemar exact p 0.568</li>
              </ul>
            </div>
          </div>

          {/* Section: Table C Accuracy by Question Type */}
          <div style={styles.sectionCard}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.tableTitle}>Table C. Accuracy by question type (test, all questions)</h2>
              <p style={styles.tableSubtitle}>Breakdown across temporal lookups, boundaries, explicit traps, and dual-axis procedural questions.</p>
            </div>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.theadRow}>
                    <th style={styles.thLeft}>Question type</th>
                    <th style={styles.th}>n</th>
                    <th style={styles.th}>C1</th>
                    <th style={styles.th}>C1L</th>
                    <th style={styles.th}>C2</th>
                    <th style={styles.th}>C3</th>
                    <th style={styles.th}>C4</th>
                  </tr>
                </thead>
                <tbody>
                  {TABLE_C_DATA.map((row, idx) => (
                    <tr key={idx} style={idx % 2 === 1 ? styles.trAlt : styles.tr}>
                      <td style={styles.tdCode}>{row.type}</td>
                      <td style={styles.tdCenter}>{row.n}</td>
                      <td style={styles.tdCenter}>{row.c1}</td>
                      <td style={styles.tdCenter}>{row.c1l}</td>
                      <td style={styles.tdCenter}>{row.c2}</td>
                      <td style={styles.tdCenter}>{row.c3}</td>
                      <td style={styles.tdCenter}>{row.c4}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Side by Side Grid for Tables D and E */}
          <div style={styles.twoColGrid}>
            {/* Table D Date Resolver */}
            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <h2 style={styles.tableTitle}>Table D. Date resolver (test split)</h2>
                <p style={styles.tableSubtitle}>Independent evaluation of temporal expression extraction and regime matching across 391 date-bearing questions.</p>
              </div>
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.theadRow}>
                      <th style={styles.thLeft}>Slice</th>
                      <th style={styles.th}>n</th>
                      <th style={styles.th}>Applicable-code accuracy %</th>
                      <th style={styles.th}>Date-extraction exact match %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TABLE_D_DATA.map((row, idx) => (
                      <tr key={idx} style={row.slice === 'Overall' ? styles.trHighlight : idx % 2 === 1 ? styles.trAlt : styles.tr}>
                        <td style={row.slice === 'Overall' ? styles.tdBold : styles.td}>{row.slice}</td>
                        <td style={styles.tdCenter}>{row.n}</td>
                        <td style={styles.tdCenter}>{row.acc}</td>
                        <td style={styles.tdCenter}>{row.exact}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table E Verifier Stress Test */}
            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <h2 style={styles.tableTitle}>Table E. Verifier stress test</h2>
                <p style={styles.tableSubtitle}>Synthetic error injection on test split (tau=0.6, items=1783; NOT a measure of LLM behaviour).</p>
              </div>
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.theadRow}>
                      <th style={styles.thLeft}>Condition / Error Class</th>
                      <th style={styles.th}>n</th>
                      <th style={styles.th}>Flagged %</th>
                      <th style={styles.th}>Label-Correct %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TABLE_E_DATA.map((row, idx) => (
                      <tr key={idx} style={idx % 2 === 1 ? styles.trAlt : styles.tr}>
                        <td style={styles.tdBold}>
                          <div>{row.condition}</div>
                          <div style={{ fontSize: '.72rem', color: '#64748B', fontWeight: 400 }}>{row.note}</div>
                        </td>
                        <td style={styles.tdCenter}>{row.n}</td>
                        <td style={styles.tdCenter}>{row.flagged}</td>
                        <td style={styles.tdCenter}>{row.labelCorrect}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={styles.notesBlock}>
                <div style={styles.metricSummary}>
                  <div style={styles.metricPill}>
                    <span style={styles.metricLabel}>Average Recall:</span>
                    <span style={styles.metricValue}>0.9843 (98.4%)</span>
                  </div>
                  <div style={styles.metricPill}>
                    <span style={styles.metricLabel}>False Positive Rate:</span>
                    <span style={styles.metricValue}>0.0%</span>
                  </div>
                  <div style={styles.metricPill}>
                    <span style={styles.metricLabel}>Youden's J:</span>
                    <span style={styles.metricValue}>0.9843</span>
                  </div>
                </div>
                <div style={styles.asteriskNote}>
                  Each correct answer is corrupted with one error of each taxonomy class; "flagged" = verifier rejects the corrupted citation, "clean flagged" = false-positive rate on untouched correct citations.
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#F8FAFC',
    color: '#0F172A',
    fontFamily: 'var(--font-body, system-ui, -apple-system, sans-serif)',
    paddingBottom: '4rem'
  },
  hero: {
    background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
    color: '#FFFFFF',
    padding: '4rem 1.5rem 3.5rem',
    borderBottom: '1px solid #334155'
  },
  container: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 1rem'
  },
  badgeRow: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    marginBottom: '1.25rem',
    flexWrap: 'wrap'
  },
  paperBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    background: 'rgba(217, 119, 6, 0.2)',
    color: '#FBBF24',
    border: '1px solid rgba(217, 119, 6, 0.4)',
    padding: '4px 12px',
    borderRadius: 9999,
    fontSize: '.78rem',
    fontWeight: 700,
    letterSpacing: '.03em',
    textTransform: 'uppercase'
  },
  splitBadge: {
    display: 'inline-block',
    background: 'rgba(255, 255, 255, 0.1)',
    color: '#E2E8F0',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '4px 10px',
    borderRadius: 9999,
    fontSize: '.75rem',
    fontWeight: 600
  },
  title: {
    fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
    fontWeight: 800,
    lineHeight: 1.25,
    maxWidth: 960,
    marginBottom: '1.5rem',
    letterSpacing: '-.02em',
    color: '#FFFFFF'
  },
  abstract: {
    fontSize: '1.02rem',
    lineHeight: 1.7,
    color: '#CBD5E1',
    maxWidth: 960
  },
  main: {
    marginTop: '2.5rem'
  },
  tryCard: {
    background: '#FFFFFF',
    borderRadius: 18,
    border: '1px solid #E2E8F0',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    padding: '1.75rem',
    marginBottom: '2rem'
  },
  tryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
    borderBottom: '1px solid #F1F5F9',
    paddingBottom: '1rem',
    marginBottom: '1.25rem',
    flexWrap: 'wrap'
  },
  tryIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    background: '#FEF3C7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  tryTitle: {
    fontSize: '1.2rem',
    fontWeight: 800,
    color: '#0F172A',
    margin: 0
  },
  trySubtitle: {
    fontSize: '.85rem',
    color: '#64748B',
    margin: '3px 0 0'
  },
  disclaimerPill: {
    display: 'inline-flex',
    alignItems: 'center',
    background: '#FEF3C7',
    color: '#92400E',
    border: '1px solid #FDE68A',
    padding: '4px 10px',
    borderRadius: 8,
    fontSize: '.74rem',
    fontWeight: 600
  },
  tryBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  inputRow: {
    display: 'flex',
    gap: 10,
    alignItems: 'center'
  },
  input: {
    flex: 1,
    padding: '.75rem 1rem',
    borderRadius: 12,
    border: '1px solid #CBD5E1',
    background: '#F8FAFC',
    fontSize: '.92rem',
    color: '#0F172A',
    outline: 'none',
    transition: 'border-color .2s'
  },
  sendBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#7B1D2E',
    color: '#FFFFFF',
    border: 'none',
    padding: '.75rem 1.4rem',
    borderRadius: 12,
    fontSize: '.9rem',
    fontWeight: 700,
    transition: 'background .2s',
    flexShrink: 0
  },
  samplesRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6
  },
  samplesLabel: {
    fontSize: '.75rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '.04em',
    color: '#64748B'
  },
  samplesList: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap'
  },
  sampleBtn: {
    background: '#F1F5F9',
    border: '1px solid #E2E8F0',
    borderRadius: 8,
    padding: '4px 10px',
    fontSize: '.76rem',
    color: '#334155',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background .15s'
  },
  errorBox: {
    background: '#FEF2F2',
    border: '1px solid #FECACA',
    borderRadius: 10,
    padding: '.75rem 1rem',
    color: '#991B1B',
    fontSize: '.85rem',
    display: 'flex',
    alignItems: 'center'
  },
  outputCard: {
    marginTop: '.5rem',
    background: '#F8FAFC',
    borderRadius: 14,
    border: '1px solid #E2E8F0',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  outputMetaRow: {
    display: 'flex',
    gap: 20,
    flexWrap: 'wrap',
    alignItems: 'center',
    borderBottom: '1px solid #E2E8F0',
    paddingBottom: '.75rem'
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8
  },
  metaLabel: {
    fontSize: '.78rem',
    fontWeight: 700,
    color: '#64748B'
  },
  statusBadge: {
    padding: '3px 10px',
    borderRadius: 9999,
    fontSize: '.75rem',
    fontWeight: 700,
    textTransform: 'uppercase'
  },
  regimeVal: {
    fontSize: '.82rem',
    fontWeight: 700,
    color: '#0F172A',
    background: '#FFFFFF',
    border: '1px solid #CBD5E1',
    padding: '3px 8px',
    borderRadius: 6
  },
  repairAlert: {
    display: 'flex',
    alignItems: 'center',
    background: '#EFF6FF',
    border: '1px solid #BFDBFE',
    borderRadius: 8,
    padding: '.5rem .75rem',
    color: '#1E40AF',
    fontSize: '.78rem'
  },
  askDatesAlert: {
    display: 'flex',
    alignItems: 'center',
    background: '#FEF3C7',
    border: '1px solid #FCD34D',
    borderRadius: 8,
    padding: '.5rem .75rem',
    color: '#92400E',
    fontSize: '.78rem'
  },
  answerSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6
  },
  sectionHeading: {
    fontSize: '.82rem',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '.04em',
    color: '#475569',
    margin: 0,
    display: 'flex',
    alignItems: 'center'
  },
  answerText: {
    fontSize: '.92rem',
    lineHeight: 1.6,
    color: '#1E293B',
    whiteSpace: 'pre-wrap',
    margin: 0
  },
  sourcesSection: {
    borderTop: '1px solid #E2E8F0',
    paddingTop: '.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  },
  sourcesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 10
  },
  sourceCard: {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: 10,
    padding: '.65rem .85rem',
    display: 'flex',
    flexDirection: 'column',
    gap: 4
  },
  sourceTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap'
  },
  sourceTitle: {
    fontSize: '.82rem',
    fontWeight: 700,
    color: '#0F172A'
  },
  sourceSnippet: {
    fontSize: '.72rem',
    color: '#64748B'
  },
  badgePass: {
    fontSize: '.66rem',
    fontWeight: 700,
    color: '#065F46',
    background: '#D1FAE5',
    border: '1px solid #A7F3D0',
    borderRadius: 9999,
    padding: '1px 8px',
    whiteSpace: 'nowrap'
  },
  badgeNeedsDate: {
    fontSize: '.66rem',
    fontWeight: 700,
    color: '#92400E',
    background: '#FEF3C7',
    border: '1px solid #FDE68A',
    borderRadius: 9999,
    padding: '1px 8px',
    whiteSpace: 'nowrap'
  },
  noticeBox: {
    background: '#EFF6FF',
    border: '1px solid #BFDBFE',
    borderRadius: 14,
    padding: '1.25rem 1.5rem',
    marginBottom: '2rem',
    boxShadow: '0 2px 8px rgba(30, 58, 138, 0.05)'
  },
  noticeHeading: {
    fontSize: '.95rem',
    fontWeight: 800,
    color: '#1E3A8A',
    margin: '0 0 6px'
  },
  noticeText: {
    fontSize: '.88rem',
    lineHeight: 1.6,
    color: '#1E40AF',
    margin: 0
  },
  sectionCard: {
    background: '#FFFFFF',
    borderRadius: 16,
    border: '1px solid #E2E8F0',
    padding: '1.75rem',
    marginBottom: '2rem',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)'
  },
  sectionHeader: {
    marginBottom: '1.25rem'
  },
  tableTitle: {
    fontSize: '1.15rem',
    fontWeight: 800,
    color: '#0F172A',
    margin: '0 0 4px'
  },
  tableSubtitle: {
    fontSize: '.84rem',
    color: '#64748B',
    margin: 0
  },
  tableWrapper: {
    overflowX: 'auto',
    borderRadius: 10,
    border: '1px solid #E2E8F0'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '.82rem',
    textAlign: 'left'
  },
  theadRow: {
    background: '#F8FAFC',
    borderBottom: '2px solid #E2E8F0'
  },
  thLeft: {
    padding: '10px 14px',
    fontWeight: 800,
    color: '#1E293B',
    textAlign: 'left',
    whiteSpace: 'nowrap'
  },
  th: {
    padding: '10px 12px',
    fontWeight: 800,
    color: '#1E293B',
    textAlign: 'center',
    whiteSpace: 'nowrap'
  },
  tr: {
    background: '#FFFFFF',
    borderBottom: '1px solid #F1F5F9'
  },
  trAlt: {
    background: '#FBFDFE',
    borderBottom: '1px solid #F1F5F9'
  },
  trHighlight: {
    background: '#F0FDF4',
    borderBottom: '1px solid #DCFCE7'
  },
  tdBold: {
    padding: '10px 14px',
    fontWeight: 700,
    color: '#0F172A',
    whiteSpace: 'nowrap'
  },
  td: {
    padding: '10px 14px',
    color: '#334155',
    whiteSpace: 'nowrap'
  },
  tdCode: {
    padding: '10px 14px',
    fontFamily: 'monospace',
    fontWeight: 600,
    color: '#0F172A'
  },
  tdCenter: {
    padding: '10px 12px',
    textAlign: 'center',
    color: '#334155',
    whiteSpace: 'nowrap'
  },
  notesBlock: {
    marginTop: '1rem',
    padding: '.85rem 1rem',
    background: '#F8FAFC',
    borderRadius: 10,
    border: '1px solid #F1F5F9',
    fontSize: '.78rem',
    color: '#475569'
  },
  notesTitle: {
    fontWeight: 700,
    color: '#334155',
    marginBottom: 4
  },
  notesList: {
    margin: '0 0 6px 1.25rem',
    padding: 0,
    lineHeight: 1.6
  },
  asteriskNote: {
    fontStyle: 'italic',
    color: '#64748B',
    marginTop: 4
  },
  twoColGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
    gap: '1.5rem'
  },
  metricSummary: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
    marginBottom: 8
  },
  metricPill: {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: 8,
    padding: '4px 10px',
    display: 'flex',
    alignItems: 'center',
    gap: 6
  },
  metricLabel: {
    fontSize: '.72rem',
    color: '#64748B',
    fontWeight: 600
  },
  metricValue: {
    fontSize: '.78rem',
    color: '#0F172A',
    fontWeight: 800
  }
}
