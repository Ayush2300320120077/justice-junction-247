import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useToast } from '../../context/ToastContext';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminRoute from '../../components/admin/AdminRoute';
import { Search, ChevronLeft, ChevronRight, Briefcase, FileText, IndianRupee, User, Mail, Phone, Clock, Calendar, CheckCircle, XCircle } from 'lucide-react';

const s = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  title: { fontSize: '1.8rem', fontWeight: 800, margin: 0, color: '#0f172a' },
  filterBar: { display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', background: '#fff', padding: '1rem', borderRadius: 12, border: '1px solid #e2e8f0' },
  input: { padding: '0.6rem 1rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', minWidth: 250 },
  select: { padding: '0.6rem 1rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', background: '#fff' },
  tableContainer: { background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' },
  th: { padding: '1rem', borderBottom: '2px solid #e2e8f0', color: '#64748b', fontWeight: 600 },
  td: { padding: '1rem', borderBottom: '1px solid #e2e8f0', color: '#334155' },
  row: { cursor: 'pointer', transition: 'background 0.2s' },
  badge: { padding: '4px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 },
  statusColors: { 
    pending: { bg: '#fef3c7', text: '#d97706' }, 
    confirmed: { bg: '#dbeafe', text: '#2563eb' },
    completed: { bg: '#dcfce7', text: '#16a34a' },
    cancelled: { bg: '#fee2e2', text: '#dc2626' }
  },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modal: { background: '#fff', width: '90%', maxWidth: 700, borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' },
  modalHeader: { padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' },
  modalBody: { padding: '1.5rem', maxHeight: '70vh', overflowY: 'auto' },
  modalFooter: { padding: '1rem 1.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' },
  sectionTitle: { fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
  infoItem: { marginBottom: '0.75rem' },
  infoLabel: { fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.2rem' },
  infoValue: { fontSize: '0.95rem', color: '#0f172a', fontWeight: 500 },
  btn: { padding: '0.6rem 1.2rem', borderRadius: 8, fontWeight: 600, border: 'none', cursor: 'pointer', background: '#e2e8f0', color: '#334155' },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', padding: '1.5rem 1rem' },
  pageBtn: { background: '#f8fafc', border: '1px solid #cbd5e1', padding: '0.5rem', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center' }
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: 'all', search: '', page: 1 });
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [selectedCase, setSelectedCase] = useState(null);
  const { showToast } = useToast();

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      params.append('page', filters.page);
      
      const res = await fetch(`/api/admin/bookings?${params.toString()}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      const data = await res.json();
      if (data.success) {
        setBookings(data.data);
        setPagination({ total: data.total, totalPages: data.totalPages });
      } else {
        showToast(data.error, 'error');
      }
    } catch (err) {
      showToast('Failed to fetch cases', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBookings();
    }, 300);
    return () => clearTimeout(timer);
  }, [filters]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setFilters(prev => ({ ...prev, page: newPage }));
    }
  };

  return (
    <AdminRoute>
      <AdminLayout>
        <Helmet><title>Case Management — Admin</title></Helmet>
        
        <div style={s.header}>
          <h1 style={s.title}>Real-Time Case Dashboard</h1>
        </div>

        <div style={s.filterBar}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', padding: '0.4rem 0.8rem', borderRadius: 8, flex: 1, minWidth: 250 }}>
            <Search size={18} color="#64748b" style={{ marginRight: 8 }} />
            <input 
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.9rem', width: '100%' }} 
              placeholder="Search Case Number, Client, or Lawyer..." 
              value={filters.search}
              onChange={e => setFilters(prev => ({...prev, search: e.target.value, page: 1}))}
            />
          </div>
          
          <select 
            style={s.select} 
            value={filters.status} 
            onChange={e => setFilters(prev => ({...prev, status: e.target.value, page: 1}))}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div style={s.tableContainer}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Case Number</th>
                <th style={s.th}>Date & Time</th>
                <th style={s.th}>Client</th>
                <th style={s.th}>Lawyer</th>
                <th style={s.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}>Loading cases...</td></tr>
              ) : bookings.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>No cases found.</td></tr>
              ) : (
                bookings.map(b => (
                  <tr 
                    key={b._id} 
                    style={s.row} 
                    onClick={() => setSelectedCase(b)}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ ...s.td, fontWeight: 700, color: '#2563eb' }}>{b.caseNumber}</td>
                    <td style={s.td}>
                      {new Date(b.scheduledDate).toLocaleDateString()} <br/>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{b.scheduledTime} ({b.duration}m)</span>
                    </td>
                    <td style={s.td}>{b.clientName}</td>
                    <td style={s.td}>{b.lawyerName}</td>
                    <td style={s.td}>
                      <span style={{ 
                        ...s.badge, 
                        backgroundColor: s.statusColors[b.status]?.bg || '#f1f5f9', 
                        color: s.statusColors[b.status]?.text || '#475569' 
                      }}>
                        {b.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {pagination.totalPages > 1 && (
            <div style={s.pagination}>
              <button 
                style={{ ...s.pageBtn, opacity: filters.page === 1 ? 0.5 : 1 }} 
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page === 1}
              ><ChevronLeft size={18} /></button>
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Page {filters.page} of {pagination.totalPages}</span>
              <button 
                style={{ ...s.pageBtn, opacity: filters.page === pagination.totalPages ? 0.5 : 1 }} 
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page === pagination.totalPages}
              ><ChevronRight size={18} /></button>
            </div>
          )}
        </div>

        {/* Case Detail Modal */}
        {selectedCase && (
          <div style={s.modalOverlay} onClick={() => setSelectedCase(null)}>
            <div style={s.modal} onClick={e => e.stopPropagation()}>
              <div style={s.modalHeader}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>Case: {selectedCase.caseNumber}</h2>
                  <div style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.3rem' }}>{selectedCase.caseType}</div>
                </div>
                <button onClick={() => setSelectedCase(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                  <XCircle size={28} color="#94a3b8" />
                </button>
              </div>
              
              <div style={s.modalBody}>
                <div style={{ ...s.badge, marginBottom: '1.5rem', backgroundColor: s.statusColors[selectedCase.status]?.bg, color: s.statusColors[selectedCase.status]?.text, padding: '6px 12px', fontSize: '0.85rem' }}>
                  Status: {selectedCase.status.toUpperCase()}
                </div>

                <div style={s.grid2}>
                  {/* Client Info */}
                  <div>
                    <h3 style={s.sectionTitle}><User size={18} /> Client Details</h3>
                    <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                      <div style={s.infoItem}><div style={s.infoLabel}>Name</div><div style={s.infoValue}>{selectedCase.client?.name || selectedCase.clientName}</div></div>
                      <div style={s.infoItem}><div style={s.infoLabel}>Email</div><div style={s.infoValue}><a href={`mailto:${selectedCase.client?.email}`}>{selectedCase.client?.email || 'N/A'}</a></div></div>
                      <div style={s.infoItem}><div style={s.infoLabel}>Phone</div><div style={s.infoValue}>{selectedCase.client?.phone || 'N/A'}</div></div>
                    </div>
                  </div>

                  {/* Lawyer Info */}
                  <div>
                    <h3 style={s.sectionTitle}><Briefcase size={18} /> Lawyer Details</h3>
                    <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                      <div style={s.infoItem}><div style={s.infoLabel}>Name</div><div style={s.infoValue}>{selectedCase.lawyer?.name || selectedCase.lawyerName}</div></div>
                      <div style={s.infoItem}><div style={s.infoLabel}>Email</div><div style={s.infoValue}><a href={`mailto:${selectedCase.lawyer?.email}`}>{selectedCase.lawyer?.email || 'N/A'}</a></div></div>
                      <div style={s.infoItem}><div style={s.infoLabel}>Phone</div><div style={s.infoValue}>{selectedCase.lawyer?.phone || 'N/A'}</div></div>
                    </div>
                  </div>
                </div>

                <h3 style={s.sectionTitle}><Calendar size={18} /> Appointment Details</h3>
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                  <div style={s.grid2}>
                    <div style={s.infoItem}><div style={s.infoLabel}>Date</div><div style={s.infoValue}>{new Date(selectedCase.scheduledDate).toLocaleDateString()}</div></div>
                    <div style={s.infoItem}><div style={s.infoLabel}>Time (Duration)</div><div style={s.infoValue}>{selectedCase.scheduledTime} ({selectedCase.duration} mins)</div></div>
                  </div>
                  <div style={s.infoItem}>
                    <div style={s.infoLabel}>Case Description</div>
                    <div style={{ ...s.infoValue, whiteSpace: 'pre-wrap', fontSize: '0.9rem', color: '#475569', marginTop: '0.5rem' }}>
                      {selectedCase.description || 'No description provided.'}
                    </div>
                  </div>
                </div>

                <h3 style={s.sectionTitle}><IndianRupee size={18} /> Financial Breakdown</h3>
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 8, border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                  <div style={s.infoItem}><div style={s.infoLabel}>Total Fee</div><div style={{ ...s.infoValue, fontSize: '1.2rem', fontWeight: 800 }}>₹{selectedCase.fee}</div></div>
                  <div style={s.infoItem}><div style={s.infoLabel}>Platform Fee (10%)</div><div style={{ ...s.infoValue, color: '#ea580c' }}>₹{selectedCase.platformFee}</div></div>
                  <div style={s.infoItem}><div style={s.infoLabel}>Lawyer Payout</div><div style={{ ...s.infoValue, color: '#16a34a' }}>₹{selectedCase.lawyerPayout}</div></div>
                  <div style={s.infoItem}>
                    <div style={s.infoLabel}>Payment Status</div>
                    <div style={s.infoValue}>
                      {selectedCase.isPaid ? <span style={{ color: '#16a34a', display: 'flex', alignItems: 'center', gap: 4 }}><CheckCircle size={16}/> Paid</span> : <span style={{ color: '#dc2626' }}>Unpaid</span>}
                    </div>
                  </div>
                </div>
              </div>
              
              <div style={s.modalFooter}>
                <button style={s.btn} onClick={() => setSelectedCase(null)}>Close</button>
              </div>
            </div>
          </div>
        )}

      </AdminLayout>
    </AdminRoute>
  );
}
