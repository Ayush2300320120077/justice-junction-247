import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import AdminLayout from '../../components/admin/AdminLayout';
import CaseVaultRoute from '../../components/CaseVaultRoute';
import {
  ArrowLeft, Eye, Download, PenLine, Share2,
  Printer, ShieldX, ChevronLeft, ChevronRight,
  Filter, Search, Info
} from 'lucide-react';
import { API } from '../../api';

// ── Action metadata ───────────────────────────────────────────────────────────
const ACTION_META = {
  view:           { label: 'Viewed',         icon: Eye,      bg: '#eff6ff', text: '#1d4ed8' },
  download:       { label: 'Downloaded',     icon: Download, bg: '#f0fdf4', text: '#15803d' },
  edit:           { label: 'Edited',         icon: PenLine,  bg: '#fdf4ff', text: '#7e22ce' },
  share:          { label: 'Shared',         icon: Share2,   bg: '#fff7ed', text: '#c2410c' },
  print:          { label: 'Printed',        icon: Printer,  bg: '#fefce8', text: '#a16207' },
  'delete-attempt':{ label: 'Del. Attempt',  icon: ShieldX,  bg: '#fef2f2', text: '#991b1b' },
};

const s = {
  back:       { display:'inline-flex', alignItems:'center', gap:'0.4rem', background:'none', border:'none', color:'#64748b', fontSize:'0.85rem', fontWeight:600, cursor:'pointer', marginBottom:'1.5rem', padding:0 },
  header:     { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem', flexWrap:'wrap', gap:'1rem' },
  title:      { fontSize:'1.6rem', fontWeight:800, margin:0, color:'#0f172a' },
  sub:        { fontSize:'0.82rem', color:'#94a3b8', marginTop:'0.2rem' },
  filterBar:  { display:'flex', gap:'0.75rem', marginBottom:'1.25rem', flexWrap:'wrap', background:'#fff', padding:'0.85rem 1rem', borderRadius:12, border:'1px solid #e2e8f0', alignItems:'center' },
  searchBox:  { display:'flex', alignItems:'center', background:'#f1f5f9', padding:'0.4rem 0.75rem', borderRadius:8, flex:1, minWidth:180 },
  searchInput:{ border:'none', background:'transparent', outline:'none', fontSize:'0.85rem', width:'100%', marginLeft:6 },
  select:     { padding:'0.45rem 0.75rem', borderRadius:8, border:'1px solid #cbd5e1', fontSize:'0.82rem', outline:'none', background:'#fff' },
  table:      { width:'100%', borderCollapse:'collapse', background:'#fff', borderRadius:12, overflow:'hidden', border:'1px solid #e2e8f0' },
  th:         { padding:'0.75rem 1rem', fontSize:'0.72rem', fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.04em', textAlign:'left', borderBottom:'1px solid #e2e8f0', background:'#f8fafc' },
  td:         { padding:'0.8rem 1rem', fontSize:'0.85rem', color:'#334155', borderBottom:'1px solid #f1f5f9', verticalAlign:'middle' },
  badge:      { padding:'3px 9px', borderRadius:20, fontSize:'0.7rem', fontWeight:700, display:'inline-flex', alignItems:'center', gap:4, whiteSpace:'nowrap' },
  mono:       { fontFamily:'monospace', fontSize:'0.75rem', color:'#94a3b8' },
  pagination: { display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'1rem', background:'#fff', padding:'0.65rem 1rem', borderRadius:12, border:'1px solid #e2e8f0' },
  pgBtn:      { display:'inline-flex', alignItems:'center', gap:4, padding:'0.4rem 0.85rem', borderRadius:8, border:'1px solid #e2e8f0', background:'#f8fafc', cursor:'pointer', fontSize:'0.82rem', fontWeight:600, color:'#475569' },
  empty:      { textAlign:'center', padding:'3.5rem', background:'#fff', borderRadius:12, color:'#94a3b8', border:'1px solid #e2e8f0' },
  infoBox:    { display:'flex', alignItems:'flex-start', gap:'0.6rem', background:'#f0f9ff', borderRadius:10, padding:'0.75rem 1rem', marginBottom:'1.25rem', fontSize:'0.82rem', color:'#0369a1', lineHeight:1.5 },
};

function ActionBadge({ action }) {
  const m = ACTION_META[action] || { label: action, bg: '#f1f5f9', text: '#475569', icon: Eye };
  const Icon = m.icon;
  return (
    <span style={{ ...s.badge, backgroundColor: m.bg, color: m.text }}>
      <Icon size={11} />{m.label}
    </span>
  );
}

function SuccessBadge({ success }) {
  return (
    <span style={{ ...s.badge, backgroundColor: success ? '#f0fdf4' : '#fef2f2', color: success ? '#15803d' : '#991b1b' }}>
      {success ? 'Success' : 'Denied'}
    </span>
  );
}

export default function AuditLog() {
  const { docId } = useParams();
  const navigate  = useNavigate();
  const { showToast } = useToast();

  const [logs, setLogs]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal]   = useState(0);
  const [page, setPage]     = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [docTitle, setDocTitle]     = useState('');
  const [filters, setFilters] = useState({ action: '', success: '', search: '' });

  const fetchLogs = useCallback(async (pg = page) => {
    setLoading(true);
    try {
      const params = { page: pg, limit: 25 };
      if (filters.action)  params.action  = filters.action;
      if (filters.success !== '') params.success = filters.success;
      if (filters.search)  params.search  = filters.search;

      const data = await API.vault.getAuditLog(docId, params);
      setLogs(data.data || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
      // Response now always includes document metadata from the real endpoint
      if (data.document?.title) setDocTitle(data.document.title);
    } catch (err) {
      // Safety net — real endpoint exists now; this should only fire on network errors
      showToast(err.message || 'Failed to load audit log', 'error');
      setLogs([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [docId, filters, page]);

  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchLogs(1); }, filters.search ? 300 : 0);
    return () => clearTimeout(t);
  }, [filters]);

  const handlePageChange = (p) => { setPage(p); fetchLogs(p); };

  return (
    <CaseVaultRoute>
      <AdminLayout title="Audit Log">
        <Helmet>
          <title>Audit Log — Case Vault</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>

        <button style={s.back} onClick={() => navigate(-1)}>
          <ArrowLeft size={15} /> Back
        </button>

        <div style={s.header}>
          <div>
            <h1 style={s.title}>Access Audit Log</h1>
            {docTitle && <p style={s.sub}>Document: {docTitle}</p>}
          </div>
          <div style={{ fontSize:'0.82rem', color:'#64748b', fontWeight:600 }}>
            {total} event{total !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Info banner */}
        <div style={s.infoBox}>
          <Info size={16} style={{ flexShrink:0, marginTop:1 }} />
          <span>
            Audit logs are <strong>append-only</strong> and cannot be modified or deleted.
            Every access — including denied attempts — is recorded with timestamp and IP address.
          </span>
        </div>

        {/* Filter bar */}
        <div style={s.filterBar}>
          <div style={s.searchBox}>
            <Search size={14} color="#64748b" />
            <input
              style={s.searchInput}
              placeholder="Search user name or IP…"
              value={filters.search}
              onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            />
          </div>

          <select style={s.select} value={filters.action}
            onChange={e => setFilters(f => ({ ...f, action: e.target.value }))}>
            <option value="">All Actions</option>
            {Object.entries(ACTION_META).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>

          <select style={s.select} value={filters.success}
            onChange={e => setFilters(f => ({ ...f, success: e.target.value }))}>
            <option value="">All Results</option>
            <option value="true">Successful</option>
            <option value="false">Denied</option>
          </select>

          {(filters.action || filters.success || filters.search) && (
            <button
              style={{ padding:'0.4rem 0.8rem', borderRadius:8, border:'1px solid #e2e8f0', background:'#f8fafc', cursor:'pointer', fontSize:'0.8rem', fontWeight:600, color:'#64748b' }}
              onClick={() => setFilters({ action:'', success:'', search:'' })}
            >
              Clear
            </button>
          )}
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ textAlign:'center', padding:'4rem', color:'#94a3b8' }}>
            <div className="spinner" style={{ margin:'0 auto 1rem', width:28, height:28, border:'3px solid #e2e8f0', borderTopColor:'#7B1D2E', borderRadius:'50%' }} />
            Loading audit events…
          </div>
        ) : logs.length === 0 ? (
          <div style={s.empty}>
            <Eye size={36} style={{ margin:'0 auto 1rem', opacity:0.3 }} />
            <div style={{ fontWeight:700, marginBottom:'0.4rem' }}>No events recorded yet</div>
            <div style={{ fontSize:'0.85rem' }}>Access events will appear here as officers interact with this document.</div>
          </div>
        ) : (
          <>
            <div style={{ overflowX:'auto' }}>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>Timestamp</th>
                    <th style={s.th}>Actor</th>
                    <th style={s.th}>Role</th>
                    <th style={s.th}>Action</th>
                    <th style={s.th}>Result</th>
                    <th style={s.th}>IP Address</th>
                    <th style={s.th}>Version</th>
                    <th style={s.th}>User Agent</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, i) => (
                    <tr key={log._id || i} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <td style={s.td}>
                        <div style={{ fontWeight:600, whiteSpace:'nowrap' }}>
                          {new Date(log.timestamp).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}
                        </div>
                        <div style={{ fontSize:'0.75rem', color:'#94a3b8', whiteSpace:'nowrap' }}>
                          {new Date(log.timestamp).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', second:'2-digit' })} IST
                        </div>
                      </td>
                      <td style={s.td}>
                        <div style={{ fontWeight:600 }}>{log.actor?.name || 'Unknown'}</div>
                        <div style={{ fontSize:'0.75rem', color:'#94a3b8' }}>{log.actor?.email || '—'}</div>
                      </td>
                      <td style={s.td}>
                        <span style={{ fontSize:'0.75rem', fontWeight:700, color:'#64748b', background:'#f1f5f9', padding:'2px 8px', borderRadius:6 }}>
                          {log.actor?.role || '—'}
                        </span>
                      </td>
                      <td style={s.td}><ActionBadge action={log.action} /></td>
                      <td style={s.td}><SuccessBadge success={log.success} /></td>
                      <td style={s.td}>
                        <span style={s.mono}>{log.ipAddress || '—'}</span>
                      </td>
                      <td style={s.td}>
                        {log.documentVersion?.versionNumber
                          ? <span style={{ fontWeight:600 }}>v{log.documentVersion.versionNumber}</span>
                          : <span style={{ color:'#cbd5e1' }}>—</span>}
                      </td>
                      <td style={{ ...s.td, maxWidth:180 }}>
                        <div style={{ fontSize:'0.72rem', color:'#94a3b8', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}
                          title={log.userAgent}>
                          {log.userAgent
                            ? log.userAgent.replace(/\s*\(.*?\)\s*/g, ' ').trim().slice(0, 40) + (log.userAgent.length > 40 ? '…' : '')
                            : '—'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={s.pagination}>
                <button
                  style={{ ...s.pgBtn, opacity: page <= 1 ? 0.4 : 1, cursor: page <= 1 ? 'default':'pointer' }}
                  disabled={page <= 1}
                  onClick={() => handlePageChange(page - 1)}
                >
                  <ChevronLeft size={14} /> Previous
                </button>
                <span style={{ fontSize:'0.82rem', color:'#64748b', fontWeight:600 }}>
                  Page {page} of {totalPages} · {total} events
                </span>
                <button
                  style={{ ...s.pgBtn, opacity: page >= totalPages ? 0.4 : 1, cursor: page >= totalPages ? 'default':'pointer' }}
                  disabled={page >= totalPages}
                  onClick={() => handlePageChange(page + 1)}
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            )}
          </>
        )}
      </AdminLayout>
    </CaseVaultRoute>
  );
}
