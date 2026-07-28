import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  Bot, Download, Star, Filter, RefreshCw, ChevronLeft, ChevronRight, 
  CheckCircle, AlertTriangle, Clock, Layers, Save, Eye 
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function AdminAiEval() {
  const { showToast } = useToast();

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);

  // Filters
  const [moduleFilter, setModuleFilter] = useState('all');
  const [ragFailedFilter, setRagFailedFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');

  // Annotation form local state map
  const [annotations, setAnnotations] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [expandedLogId, setExpandedLogId] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchLogs(page);
  }, [page, moduleFilter, ragFailedFilter, ratingFilter]);

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const token = localStorage.getItem('jj_admin_token');
      const res = await fetch('/api/admin/ai-stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch AI stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchLogs = async (p = 1) => {
    setLogsLoading(true);
    try {
      const token = localStorage.getItem('jj_admin_token');
      const params = new URLSearchParams({
        page: p,
        limit: 15,
        module: moduleFilter,
        ragFailed: ragFailedFilter,
        userFeedbackRating: ratingFilter
      });

      const res = await fetch(`/api/admin/ai-logs?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
        setTotalPages(data.totalPages || 1);
        setTotalLogs(data.total || 0);

        // Populate local annotation state
        const initialMap = {};
        (data.logs || []).forEach(l => {
          initialMap[l._id] = {
            reviewerRating: l.reviewerRating || '',
            reviewerNotes: l.reviewerNotes || ''
          };
        });
        setAnnotations(initialMap);
      }
    } catch (err) {
      console.error('Failed to fetch AI logs:', err);
      showToast('Failed to load AI logs', 'error');
    } finally {
      setLogsLoading(false);
    }
  };

  const handleSaveAnnotation = async (logId) => {
    setSavingId(logId);
    try {
      const token = localStorage.getItem('jj_admin_token');
      const data = annotations[logId] || {};

      const res = await fetch(`/api/admin/ai-logs/${logId}/annotate`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          reviewerRating: data.reviewerRating ? Number(data.reviewerRating) : undefined,
          reviewerNotes: data.reviewerNotes
        })
      });

      if (res.ok) {
        showToast('Reviewer annotation saved!', 'success');
        fetchLogs(page);
      } else {
        showToast('Failed to save annotation', 'error');
      }
    } catch (err) {
      console.error('Save annotation error:', err);
      showToast('Error saving annotation', 'error');
    } finally {
      setSavingId(null);
    }
  };

  const handleExportCSV = () => {
    const token = localStorage.getItem('jj_admin_token');
    const params = new URLSearchParams({
      module: moduleFilter,
      ragFailed: ragFailedFilter,
      userFeedbackRating: ratingFilter
    });
    window.open(`/api/admin/ai-logs/export-csv?${params.toString()}`, '_blank');
  };

  return (
    <AdminLayout title="AI RAG Evaluation Tool">
      {/* ─── Top Stats Bar ─── */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}><Layers size={20} color="#7B1D2E" /></div>
          <div>
            <div style={styles.statLabel}>Total AI Interactions</div>
            <div style={styles.statVal}>{statsLoading ? '...' : stats?.totalLogs || 0}</div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}><Star size={20} color="#D97706" /></div>
          <div>
            <div style={styles.statLabel}>Avg User Rating</div>
            <div style={styles.statVal}>
              {statsLoading ? '...' : `${stats?.overallAvgRating || 0} / 5`}
            </div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}><AlertTriangle size={20} color="#DC2626" /></div>
          <div>
            <div style={styles.statLabel}>RAG Failure Rate</div>
            <div style={{ ...styles.statVal, color: (stats?.ragFailedRate || 0) > 0 ? '#DC2626' : '#16A34A' }}>
              {statsLoading ? '...' : `${stats?.ragFailedRate || 0}%`}
            </div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}><Clock size={20} color="#2563EB" /></div>
          <div>
            <div style={styles.statLabel}>Avg Latency</div>
            <div style={styles.statVal}>{statsLoading ? '...' : `${stats?.overallAvgLatency || 0} ms`}</div>
          </div>
        </div>
      </div>

      {/* ─── Filter & Toolbar ─── */}
      <div style={styles.toolbar}>
        <div style={styles.filterRow}>
          <div style={styles.filterItem}>
            <label style={styles.filterLabel}><Filter size={13} /> Module</label>
            <select style={styles.select} value={moduleFilter} onChange={e => { setModuleFilter(e.target.value); setPage(1); }}>
              <option value="all">All Modules</option>
              <option value="chat">Chat (RAG)</option>
              <option value="classify">Classify</option>
              <option value="match">Match</option>
            </select>
          </div>

          <div style={styles.filterItem}>
            <label style={styles.filterLabel}>RAG Status</label>
            <select style={styles.select} value={ragFailedFilter} onChange={e => { setRagFailedFilter(e.target.value); setPage(1); }}>
              <option value="all">All Statuses</option>
              <option value="false">Success Only</option>
              <option value="true">RAG Failures Only</option>
            </select>
          </div>

          <div style={styles.filterItem}>
            <label style={styles.filterLabel}>User Feedback</label>
            <select style={styles.select} value={ratingFilter} onChange={e => { setRatingFilter(e.target.value); setPage(1); }}>
              <option value="all">All Ratings</option>
              <option value="5">👍 5 Stars (Helpful)</option>
              <option value="1">👎 1 Star (Unhelpful)</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button style={styles.refreshBtn} onClick={() => { fetchStats(); fetchLogs(page); }}>
            <RefreshCw size={14} /> Refresh
          </button>
          <button style={styles.exportBtn} onClick={handleExportCSV}>
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* ─── Evaluation Logs Table ─── */}
      <div style={styles.tableCard}>
        <div style={styles.tableHeaderRow}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1E293B' }}>
            AiInteractionLog Records ({totalLogs})
          </h3>
        </div>

        {logsLoading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>Loading log records...</div>
        ) : logs.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>No interaction logs match the selected filters.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Timestamp</th>
                  <th style={styles.th}>Module</th>
                  <th style={styles.th}>Query & Chunks</th>
                  <th style={styles.th}>Latency</th>
                  <th style={styles.th}>RAG Status</th>
                  <th style={styles.th}>User Rating</th>
                  <th style={styles.th}>Reviewer Rating & Notes (Annotation)</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => {
                  const isExpanded = expandedLogId === log._id;
                  const currentAnno = annotations[log._id] || {};

                  return (
                    <tr key={log._id} style={styles.tr}>
                      <td style={styles.td}>
                        <div style={{ fontWeight: 600, fontSize: '.78rem' }}>
                          {new Date(log.createdAt).toLocaleDateString('en-IN')}
                        </div>
                        <div style={{ fontSize: '.7rem', color: '#64748B' }}>
                          {new Date(log.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      <td style={styles.td}>
                        <span style={{ ...styles.badge, background: log.module === 'chat' ? '#EFF6FF' : '#F0FDF4', color: log.module === 'chat' ? '#1D4ED8' : '#15803D' }}>
                          {log.module}
                        </span>
                      </td>

                      <td style={{ ...styles.td, maxWidth: 320 }}>
                        <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '.84rem' }}>{log.query}</div>
                        <div style={{ fontSize: '.72rem', color: '#475569', marginTop: 4 }}>
                          Retrieved Chunks: <strong>{log.retrievedChunks?.length || 0}</strong>
                        </div>
                        <button
                          style={styles.viewDetailsBtn}
                          onClick={() => setExpandedLogId(isExpanded ? null : log._id)}
                        >
                          <Eye size={12} /> {isExpanded ? 'Hide Full Details' : 'View Full Details & Response'}
                        </button>

                        {isExpanded && (
                          <div style={styles.expandedBox}>
                            <div style={{ fontWeight: 700, color: '#1E293B', marginBottom: 4 }}>Model Response:</div>
                            <div style={{ fontSize: '.78rem', color: '#334155', whiteSpace: 'pre-wrap', background: '#F8FAFC', padding: 8, borderRadius: 6, border: '1px solid #E2E8F0' }}>
                              {log.response || '(No response text logged)'}
                            </div>
                            {log.retrievedChunks && log.retrievedChunks.length > 0 && (
                              <div style={{ marginTop: 8 }}>
                                <div style={{ fontWeight: 700, color: '#1E293B', marginBottom: 4 }}>Top Chunks:</div>
                                {log.retrievedChunks.slice(0, 2).map((c, i) => (
                                  <div key={i} style={{ fontSize: '.7rem', color: '#475569', background: '#F1F5F9', padding: 6, borderRadius: 4, marginBottom: 4 }}>
                                    <strong>Sec. {c.metadata?.sectionNumber || 'N/A'}</strong> (Score: {c.score}) — {c.text?.substring(0, 100)}...
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </td>

                      <td style={styles.td}>
                        <span style={{ fontSize: '.8rem', fontWeight: 600 }}>{log.latencyMs || 0} ms</span>
                      </td>

                      <td style={styles.td}>
                        {log.metadata?.ragFailed ? (
                          <span style={{ ...styles.badge, background: '#FEF2F2', color: '#DC2626' }}>
                            <AlertTriangle size={11} /> Failed
                          </span>
                        ) : (
                          <span style={{ ...styles.badge, background: '#F0FDF4', color: '#16A34A' }}>
                            <CheckCircle size={11} /> OK
                          </span>
                        )}
                      </td>

                      <td style={styles.td}>
                        {log.userFeedbackRating ? (
                          <span style={{ fontWeight: 700, color: log.userFeedbackRating >= 4 ? '#16A34A' : '#DC2626' }}>
                            {log.userFeedbackRating === 5 ? '👍 5' : log.userFeedbackRating === 1 ? '👎 1' : `${log.userFeedbackRating} ★`}
                          </span>
                        ) : (
                          <span style={{ color: '#94A3B8', fontSize: '.75rem' }}>Unrated</span>
                        )}
                      </td>

                      {/* ─── Reviewer Annotation Column ─── */}
                      <td style={{ ...styles.td, minWidth: 260 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <label style={{ fontSize: '.72rem', fontWeight: 700, color: '#475569' }}>Rating:</label>
                            <select
                              style={styles.annotationSelect}
                              value={currentAnno.reviewerRating}
                              onChange={e => setAnnotations({
                                ...annotations,
                                [log._id]: { ...currentAnno, reviewerRating: e.target.value }
                              })}
                            >
                              <option value="">Unrated</option>
                              <option value="5">5 - Excellent RAG Response</option>
                              <option value="4">4 - Good / Minor Issues</option>
                              <option value="3">3 - Acceptable</option>
                              <option value="2">2 - Poor Context / Citation</option>
                              <option value="1">1 - Severe Hallucination / Failure</option>
                            </select>
                          </div>

                          <input
                            type="text"
                            placeholder="Reviewer notes..."
                            style={styles.annotationInput}
                            value={currentAnno.reviewerNotes}
                            onChange={e => setAnnotations({
                              ...annotations,
                              [log._id]: { ...currentAnno, reviewerNotes: e.target.value }
                            })}
                          />

                          <button
                            style={styles.saveAnnoBtn}
                            onClick={() => handleSaveAnnotation(log._id)}
                            disabled={savingId === log._id}
                          >
                            <Save size={12} /> {savingId === log._id ? 'Saving...' : 'Save Annotation'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ─── Pagination Footer ─── */}
        <div style={styles.paginationRow}>
          <div style={{ fontSize: '.82rem', color: '#64748B' }}>
            Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({totalLogs} total records)
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              style={styles.pageBtn}
              disabled={page <= 1}
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <button
              style={styles.pageBtn}
              disabled={page >= totalPages}
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

const styles = {
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' },
  statCard: { background: '#fff', padding: '1.2rem', borderRadius: '14px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' },
  statIcon: { width: '42px', height: '42px', borderRadius: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  statLabel: { fontSize: '.75rem', fontWeight: 600, color: '#64748B' },
  statVal: { fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', marginTop: 2 },

  toolbar: { background: '#fff', padding: '1rem 1.25rem', borderRadius: '14px', border: '1px solid #E2E8F0', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' },
  filterRow: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
  filterItem: { display: 'flex', flexDirection: 'column', gap: 4 },
  filterLabel: { fontSize: '.72rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: 4 },
  select: { padding: '.45rem .8rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '.82rem', background: '#fff', color: '#0F172A', outline: 'none' },
  refreshBtn: { padding: '.45rem .9rem', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '.82rem', fontWeight: 600, color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 },
  exportBtn: { padding: '.45rem .9rem', background: '#7B1D2E', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '.82rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 },

  tableCard: { background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' },
  tableHeaderRow: { padding: '1rem 1.25rem', borderBottom: '1px solid #E2E8F0', background: '#FAFAFA' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { padding: '.85rem 1rem', fontSize: '.74rem', fontWeight: 700, color: '#475569', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC', textTransform: 'uppercase', letterSpacing: '.5px' },
  td: { padding: '1rem', borderBottom: '1px solid #F1F5F9', fontSize: '.84rem', verticalAlign: 'top' },
  tr: { transition: 'background 0.15s' },
  badge: { display: 'inline-flex', alignItems: 'center', gap: 4, padding: '.25rem .6rem', borderRadius: '20px', fontSize: '.7rem', fontWeight: 700 },

  viewDetailsBtn: { marginTop: 6, background: 'none', border: 'none', color: '#2563EB', fontSize: '.72rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, padding: 0 },
  expandedBox: { marginTop: 8, padding: 8, background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' },

  annotationSelect: { padding: '.25rem .5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '.75rem', flex: 1 },
  annotationInput: { padding: '.35rem .6rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '.75rem', width: '100%', boxSizing: 'border-box' },
  saveAnnoBtn: { padding: '.3rem .6rem', background: '#0F172A', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '.7rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, alignSelf: 'flex-end' },

  paginationRow: { padding: '1rem 1.25rem', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FAFAFA' },
  pageBtn: { padding: '.4rem .8rem', background: '#fff', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '.8rem', fontWeight: 600, color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }
};
