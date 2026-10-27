import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import AdminLayout from '../../components/admin/AdminLayout';
import CaseVaultRoute from '../../components/CaseVaultRoute';
import {
  Search, Plus, Filter, FolderOpen, ChevronLeft, ChevronRight,
  Building2, Clock, CheckCircle2, AlertCircle, ArchiveIcon, FileSearch
} from 'lucide-react';
import { API } from '../../api';

// ── Constants ──────────────────────────────────────────────────────────────
const VAULT_ROLES_CREATE = ['officer', 'admin'];

const STATUS_META = {
  open:                { label: 'Open',              bg: '#dbeafe', text: '#1d4ed8' },
  'under-investigation':{ label: 'Investigating',    bg: '#fef9c3', text: '#a16207' },
  'sub-judice':         { label: 'Sub-Judice',       bg: '#ede9fe', text: '#6d28d9' },
  closed:               { label: 'Closed',           bg: '#dcfce7', text: '#15803d' },
  archived:             { label: 'Archived',         bg: '#f1f5f9', text: '#475569' },
};

const DEPARTMENTS = [
  'CBI','State Police','NIA','ED','CID',
  'Cybercrime Cell','Anti-Corruption Bureau',
  'Narcotics Control Bureau','Court Registry','Other',
];

// ── Style tokens (mirror admin/queries.jsx) ──────────────────────────────────
const s = {
  header:    { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem' },
  title:     { fontSize:'1.8rem', fontWeight:800, margin:0, color:'#0f172a' },
  subtitle:  { fontSize:'0.85rem', color:'#64748b', marginTop:'0.25rem' },
  filterBar: { display:'flex', gap:'0.75rem', marginBottom:'1.5rem', flexWrap:'wrap', background:'#fff', padding:'1rem', borderRadius:12, border:'1px solid #e2e8f0', alignItems:'center' },
  searchBox: { display:'flex', alignItems:'center', background:'#f1f5f9', padding:'0.4rem 0.8rem', borderRadius:8, flex:1, minWidth:200 },
  searchInput:{ border:'none', background:'transparent', outline:'none', fontSize:'0.9rem', width:'100%', marginLeft:8 },
  select:    { padding:'0.5rem 0.8rem', borderRadius:8, border:'1px solid #cbd5e1', fontSize:'0.85rem', outline:'none', background:'#fff', color:'#0f172a' },
  dateInput: { padding:'0.5rem 0.8rem', borderRadius:8, border:'1px solid #cbd5e1', fontSize:'0.85rem', outline:'none', color:'#0f172a' },
  card:      { background:'#fff', borderRadius:12, border:'1px solid #e2e8f0', marginBottom:'0.75rem', overflow:'hidden', cursor:'pointer', transition:'box-shadow 0.15s, transform 0.15s' },
  cardInner: { padding:'1rem 1.25rem', display:'flex', alignItems:'center', gap:'1rem', justifyContent:'space-between' },
  badge:     { padding:'3px 10px', borderRadius:20, fontSize:'0.72rem', fontWeight:700, display:'inline-flex', alignItems:'center', gap:4, whiteSpace:'nowrap' },
  btn:       { display:'inline-flex', alignItems:'center', gap:'0.5rem', padding:'0.6rem 1.2rem', borderRadius:8, fontWeight:700, border:'none', cursor:'pointer', fontSize:'0.85rem', transition:'background 0.15s' },
  emptyBox:  { textAlign:'center', padding:'4rem 2rem', background:'#fff', borderRadius:12, color:'#94a3b8', border:'1px solid #e2e8f0' },
  pagination:{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'1.5rem', background:'#fff', padding:'0.75rem 1.25rem', borderRadius:12, border:'1px solid #e2e8f0' },
  pgBtn:     { display:'inline-flex', alignItems:'center', gap:4, padding:'0.4rem 0.9rem', borderRadius:8, border:'1px solid #e2e8f0', background:'#f8fafc', cursor:'pointer', fontSize:'0.85rem', fontWeight:600, color:'#475569' },
};

function StatusBadge({ status }) {
  const m = STATUS_META[status] || STATUS_META.open;
  return <span style={{ ...s.badge, backgroundColor: m.bg, color: m.text }}>{m.label}</span>;
}

export default function CaseVaultDashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [cases, setCases]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters]   = useState({ search:'', status:'', department:'', from:'', to:'' });
  const [hoveredId, setHoveredId] = useState(null);

  const fetchCases = useCallback(async (pg = page) => {
    setLoading(true);
    try {
      const params = { page: pg, limit: 20 };
      if (filters.search)     params.search     = filters.search;
      if (filters.status)     params.status     = filters.status;
      if (filters.department) params.department = filters.department;
      if (filters.from)       params.from       = filters.from;
      if (filters.to)         params.to         = filters.to;

      const data = await API.vault.listCases(params);
      setCases(data.data || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      showToast(err.message || 'Failed to load cases', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  // Debounce search, instant for other filters
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchCases(1); }, filters.search ? 350 : 0);
    return () => clearTimeout(t);
  }, [filters]);

  const handlePageChange = (p) => {
    setPage(p);
    fetchCases(p);
  };

  const canCreate = VAULT_ROLES_CREATE.includes(user?.role);

  return (
    <CaseVaultRoute>
      <AdminLayout title="Case Vault">
        <Helmet>
          <title>Case Vault — Justice Junction</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>

        {/* Header */}
        <div style={s.header}>
          <div>
            <h1 style={s.title}>Case Vault</h1>
            <p style={s.subtitle}>SIH26190 · Secure Document Management · Ministry of Home Affairs</p>
          </div>
          {canCreate && (
            <button
              style={{ ...s.btn, background:'#7B1D2E', color:'#fff' }}
              onClick={() => navigate('/case-vault/create')}
              onMouseEnter={e => e.currentTarget.style.background = '#5C1521'}
              onMouseLeave={e => e.currentTarget.style.background = '#7B1D2E'}
            >
              <Plus size={16} /> New Case
            </button>
          )}
        </div>

        {/* Filter bar */}
        <div style={s.filterBar}>
          <div style={s.searchBox}>
            <Search size={16} color="#64748b" />
            <input
              style={s.searchInput}
              placeholder="Search case number or title…"
              value={filters.search}
              onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            />
          </div>

          <select
            style={s.select}
            value={filters.status}
            onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
          >
            <option value="">All Statuses</option>
            {Object.entries(STATUS_META).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>

          <select
            style={s.select}
            value={filters.department}
            onChange={e => setFilters(f => ({ ...f, department: e.target.value }))}
          >
            <option value="">All Departments</option>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <input type="date" style={s.dateInput} value={filters.from}
            onChange={e => setFilters(f => ({ ...f, from: e.target.value }))}
            title="From date" />
          <input type="date" style={s.dateInput} value={filters.to}
            onChange={e => setFilters(f => ({ ...f, to: e.target.value }))}
            title="To date" />

          {(filters.search || filters.status || filters.department || filters.from || filters.to) && (
            <button
              style={{ ...s.btn, background:'#f1f5f9', color:'#475569', padding:'0.5rem 0.8rem' }}
              onClick={() => setFilters({ search:'', status:'', department:'', from:'', to:'' })}
            >
              Clear
            </button>
          )}
        </div>

        {/* Results meta */}
        {!loading && (
          <div style={{ fontSize:'0.82rem', color:'#64748b', marginBottom:'0.75rem' }}>
            {total === 0 ? 'No cases found' : `${total} case${total !== 1 ? 's' : ''} found`}
          </div>
        )}

        {/* Case list */}
        {loading ? (
          <div style={{ textAlign:'center', padding:'4rem', color:'#94a3b8' }}>
            <div className="spinner" style={{ margin:'0 auto 1rem', width:32, height:32, border:'3px solid #e2e8f0', borderTopColor:'#7B1D2E', borderRadius:'50%' }} />
            Loading cases…
          </div>
        ) : cases.length === 0 ? (
          <div style={s.emptyBox}>
            <FileSearch size={40} style={{ margin:'0 auto 1rem', opacity:0.4 }} />
            <div style={{ fontWeight:700, fontSize:'1.1rem', marginBottom:'0.5rem' }}>No cases match your filters</div>
            <div style={{ fontSize:'0.9rem' }}>Try adjusting the search or filter criteria.</div>
          </div>
        ) : (
          <>
            {cases.map(c => (
              <div
                key={c._id}
                style={{
                  ...s.card,
                  boxShadow: hoveredId === c._id ? '0 4px 20px rgba(123,29,46,0.12)' : '0 1px 4px rgba(0,0,0,0.05)',
                  transform: hoveredId === c._id ? 'translateY(-1px)' : 'none',
                }}
                onClick={() => navigate(`/case-vault/cases/${c._id}`)}
                onMouseEnter={() => setHoveredId(c._id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div style={s.cardInner}>
                  {/* Left */}
                  <div style={{ display:'flex', alignItems:'center', gap:'1rem', minWidth:0 }}>
                    <div style={{ width:40, height:40, borderRadius:10, background:'#fef2f2', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <FolderOpen size={20} color="#7B1D2E" />
                    </div>
                    <div style={{ minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', flexWrap:'wrap' }}>
                        <span style={{ fontWeight:800, color:'#0f172a', fontSize:'0.95rem' }}>{c.caseNumber}</span>
                        <StatusBadge status={c.status} />
                      </div>
                      <div style={{ fontSize:'0.88rem', color:'#334155', fontWeight:600, marginTop:'0.15rem', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:'40vw' }}>
                        {c.title}
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginTop:'0.3rem', flexWrap:'wrap' }}>
                        <span style={{ fontSize:'0.75rem', color:'#64748b', display:'flex', alignItems:'center', gap:4 }}>
                          <Building2 size={12} />{c.department}
                        </span>
                        <span style={{ fontSize:'0.75rem', color:'#94a3b8', display:'flex', alignItems:'center', gap:4 }}>
                          <Clock size={12} />{new Date(c.createdAt).toLocaleDateString('en-IN')}
                        </span>
                        {c.assignedOfficers?.length > 0 && (
                          <span style={{ fontSize:'0.75rem', color:'#94a3b8' }}>
                            {c.assignedOfficers.length} officer{c.assignedOfficers.length !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right */}
                  <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', flexShrink:0 }}>
                    <span style={{ fontSize:'0.75rem', color:'#94a3b8' }}>
                      {c.createdBy?.name || '—'}
                    </span>
                    <ChevronRight size={18} color="#cbd5e1" />
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={s.pagination}>
                <button
                  style={{ ...s.pgBtn, opacity: page <= 1 ? 0.4 : 1, cursor: page <= 1 ? 'default' : 'pointer' }}
                  disabled={page <= 1}
                  onClick={() => handlePageChange(page - 1)}
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                <span style={{ fontSize:'0.85rem', color:'#64748b', fontWeight:600 }}>
                  Page {page} of {totalPages}
                </span>
                <button
                  style={{ ...s.pgBtn, opacity: page >= totalPages ? 0.4 : 1, cursor: page >= totalPages ? 'default' : 'pointer' }}
                  disabled={page >= totalPages}
                  onClick={() => handlePageChange(page + 1)}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </AdminLayout>
    </CaseVaultRoute>
  );
}
