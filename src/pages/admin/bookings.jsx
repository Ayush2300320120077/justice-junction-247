import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminRoute from '../../components/admin/AdminRoute';
import { Search, Filter, CheckCircle, XCircle, ChevronRight, X, Calendar } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { showToast } = useToast();
  
  // Drawer state
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/admin/bookings', {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        const bookingList = Array.isArray(data) ? data : (data.data || data.bookings || []);
        setBookings(bookingList);
      }
    } catch (err) {
      console.error('Fetch bookings error:', err);
      showToast('Failed to load bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setActionInProgress(true);
    try {
      const res = await fetch(`/api/admin/bookings/${id}/status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Booking ${newStatus} successfully`, 'success');
        const updated = data.data;
        setBookings(prev => prev.map(b => b._id === id ? { ...b, ...updated } : b));
        if (selectedBooking?._id === id) setSelectedBooking(prev => ({ ...prev, ...updated }));
        
        // If it was just approved/rejected from table (no drawer open), or if it was from drawer
        if (!drawerOpen) {
           // Do nothing, list updates
        }
      } else {
        showToast(data.error || 'Failed to update status', 'error');
      }
    } catch (err) {
      console.error('Status update failed', err);
      showToast('An unexpected error occurred', 'error');
    } finally {
      setActionInProgress(false);
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchSearch = b.clientName?.toLowerCase().includes(search.toLowerCase()) || 
                        b.lawyerName?.toLowerCase().includes(search.toLowerCase()) || 
                        b.caseType?.toLowerCase().includes(search.toLowerCase()) ||
                        b.caseNumber?.toLowerCase().includes(search.toLowerCase());
    
    if (!matchSearch) return false;
    if (statusFilter === 'all') return true;
    return b.status === statusFilter;
  });

  return (
    <AdminRoute>
      <AdminLayout title="Bookings Management">
        
        {/* Toolbar */}
        <div style={s.toolbar}>
          <div style={s.searchBox}>
            <Search size={18} color="#94a3b8" />
            <input 
              type="text" 
              placeholder="Search by client, lawyer, case type, or booking ID..." 
              style={s.searchInput}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          
          <div style={s.filterBox}>
            <Filter size={18} color="#94a3b8" />
            <select style={s.select} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">All Statuses ({bookings.length})</option>
              <option value="pending">Pending ({bookings.filter(b => b.status === 'pending').length})</option>
              <option value="confirmed">Confirmed ({bookings.filter(b => b.status === 'confirmed').length})</option>
              <option value="completed">Completed ({bookings.filter(b => b.status === 'completed').length})</option>
              <option value="cancelled">Cancelled ({bookings.filter(b => b.status === 'cancelled').length})</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div style={s.tableContainer}>
          <table style={s.table}>
            <thead style={s.thead}>
              <tr>
                <th style={s.th}>Booking Details</th>
                <th style={s.th}>Client</th>
                <th style={s.th}>Lawyer</th>
                <th style={s.th}>Schedule</th>
                <th style={s.th}>Status</th>
                <th style={s.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={s.tdCenter}>Loading Bookings...</td></tr>
              ) : filteredBookings.length === 0 ? (
                <tr><td colSpan="6" style={s.tdCenter}>No bookings found matching your filter.</td></tr>
              ) : (
                filteredBookings.map(b => (
                  <tr key={b._id} style={s.tr}>
                    <td style={s.td}>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{b.caseType}</div>
                      <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#64748b' }}>{b.caseNumber || b._id.substring(0, 8)}</div>
                    </td>
                    <td style={s.td}>{b.clientName || 'Unknown'}</td>
                    <td style={s.td}>{b.lawyerName || 'Unknown'}</td>
                    <td style={s.td}>
                      <div>{new Date(b.scheduledDate).toLocaleDateString()}</div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{b.scheduledTime}</div>
                    </td>
                    <td style={s.td}>
                      <span style={{
                        ...s.badge, 
                        backgroundColor: 
                          b.status === 'confirmed' ? '#dcfce7' : 
                          b.status === 'completed' ? '#e0e7ff' : 
                          b.status === 'cancelled' ? '#fee2e2' : '#fef9c3',
                        color: 
                          b.status === 'confirmed' ? '#15803d' : 
                          b.status === 'completed' ? '#3730a3' : 
                          b.status === 'cancelled' ? '#b91c1c' : '#a16207'
                      }}>
                        {(b.status || 'pending').toUpperCase()}
                      </span>
                    </td>
                    <td style={s.td}>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <button 
                          onClick={() => { setSelectedBooking(b); setDrawerOpen(true); }}
                          style={s.actionBtn}
                        >
                          View <ChevronRight size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Side Drawer */}
        {drawerOpen && selectedBooking && (
          <>
            <div style={s.overlay} onClick={() => setDrawerOpen(false)}></div>
            <div style={s.drawer}>
              <div style={s.drawerHeader}>
                <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a' }}>Booking Details</h2>
                <button onClick={() => setDrawerOpen(false)} style={s.closeBtn}><X size={24}/></button>
              </div>
              
              <div style={s.drawerContent}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: '#f1f5f9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                    <Calendar size={32} />
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a' }}>{selectedBooking.caseType}</h3>
                  <p style={{ margin: '4px 0 0', color: '#64748b', fontFamily: 'monospace' }}>{selectedBooking.caseNumber}</p>
                  
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
                    {selectedBooking.status === 'pending' && (
                      <>
                        <button disabled={actionInProgress} onClick={() => handleStatusChange(selectedBooking._id, 'confirmed')} style={{...s.btn, backgroundColor: '#10b981', color: '#fff'}}><CheckCircle size={16}/> Confirm</button>
                        <button disabled={actionInProgress} onClick={() => handleStatusChange(selectedBooking._id, 'cancelled')} style={{...s.btn, backgroundColor: '#fee2e2', color: '#ef4444'}}><XCircle size={16}/> Reject</button>
                      </>
                    )}
                    {selectedBooking.status === 'confirmed' && (
                      <button disabled={actionInProgress} onClick={() => handleStatusChange(selectedBooking._id, 'completed')} style={{...s.btn, backgroundColor: '#4f46e5', color: '#fff'}}><CheckCircle size={16}/> Mark Completed</button>
                    )}
                  </div>
                </div>

                <div style={s.section}>
                  <h4 style={s.sectionTitle}>Participants</h4>
                  <div style={s.detailRow}><span>Client:</span> <strong>{selectedBooking.clientName}</strong></div>
                  <div style={s.detailRow}><span>Lawyer:</span> <strong>{selectedBooking.lawyerName}</strong></div>
                </div>

                <div style={s.section}>
                  <h4 style={s.sectionTitle}>Schedule & Payment</h4>
                  <div style={s.detailRow}><span>Date:</span> <strong>{new Date(selectedBooking.scheduledDate).toLocaleDateString()}</strong></div>
                  <div style={s.detailRow}><span>Time:</span> <strong>{selectedBooking.scheduledTime}</strong></div>
                  <div style={s.detailRow}><span>Status:</span> <strong style={{ textTransform: 'capitalize' }}>{selectedBooking.status}</strong></div>
                  <div style={s.detailRow}><span>Payment Status:</span> <strong>{selectedBooking.isPaid ? 'Paid' : 'Unpaid'}</strong></div>
                  {selectedBooking.fee && <div style={s.detailRow}><span>Fee:</span> <strong>₹{selectedBooking.fee}</strong></div>}
                </div>
                
                {selectedBooking.description && (
                  <div style={s.section}>
                    <h4 style={s.sectionTitle}>Description</h4>
                    <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.5, margin: 0 }}>
                      {selectedBooking.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

      </AdminLayout>
    </AdminRoute>
  );
}

const s = {
  toolbar: { display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  searchBox: { flex: 1, minWidth: '300px', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#fff', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0' },
  searchInput: { flex: 1, border: 'none', outline: 'none', fontSize: '0.95rem' },
  filterBox: { display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#fff', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0' },
  select: { border: 'none', outline: 'none', fontSize: '0.95rem', backgroundColor: 'transparent', cursor: 'pointer' },
  
  tableContainer: { backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  thead: { backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
  th: { padding: '1rem', fontSize: '0.8rem', fontWeight: 600, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em' },
  tr: { borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' },
  td: { padding: '1rem', fontSize: '0.95rem', color: '#334155', verticalAlign: 'middle' },
  tdCenter: { padding: '3rem', textAlign: 'center', color: '#64748b' },
  
  badge: { padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, display: 'inline-block' },
  actionBtn: { display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: '#7B1D2E', fontWeight: 700, cursor: 'pointer', padding: '0.5rem', borderRadius: '6px' },
  
  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100 },
  drawer: { position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: 400, backgroundColor: '#fff', zIndex: 101, boxShadow: '-5px 0 25px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' },
  drawerHeader: { padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' },
  drawerContent: { padding: '1.5rem', overflowY: 'auto', flex: 1 },
  
  section: { marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' },
  sectionTitle: { margin: '0 0 1rem 0', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' },
  detailRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.95rem', color: '#334155' },
  
  btn: { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.5rem 1rem', border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }
};
