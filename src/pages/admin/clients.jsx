import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminRoute from '../../components/admin/AdminRoute';
import { Search, ShieldAlert, Trash2, ChevronRight, X } from 'lucide-react';

export default function AdminClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Drawer state
  const [selectedClient, setSelectedClient] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await fetch('/api/admin/clients', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('jj_admin_token')}` }
      });
      if (res.ok) setClients(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    if (action === 'delete' && !window.confirm('Are you sure you want to permanently delete this client?')) return;
    
    try {
      const method = action === 'delete' ? 'DELETE' : 'PUT';
      const body = action === 'delete' ? null : JSON.stringify({ action });
      
      const res = await fetch(`/api/admin/clients/${id}`, {
        method,
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('jj_admin_token')}`,
          'Content-Type': 'application/json' 
        },
        body
      });
      
      if (res.ok) {
        if (action === 'delete') {
          setClients(prev => prev.filter(c => c._id !== id));
          if (selectedClient?._id === id) setDrawerOpen(false);
        } else {
          const data = await res.json();
          setClients(prev => prev.map(c => c._id === id ? { ...c, isBlocked: data.client.isBlocked } : c));
          if (selectedClient?._id === id) setSelectedClient(data.client);
        }
      }
    } catch (err) {
      console.error('Action failed', err);
    }
  };

  const filteredClients = clients.filter(c => 
    c.name?.toLowerCase().includes(search.toLowerCase()) || 
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminRoute>
      <AdminLayout title="Client Management">
        
        {/* Toolbar */}
        <div style={s.toolbar}>
          <div style={s.searchBox}>
            <Search size={18} color="#94a3b8" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              style={s.searchInput}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div style={s.tableContainer}>
          <table style={s.table}>
            <thead style={s.thead}>
              <tr>
                <th style={s.th}>Client</th>
                <th style={s.th}>Phone</th>
                <th style={s.th}>Total Bookings</th>
                <th style={s.th}>Status</th>
                <th style={s.th}>Registered</th>
                <th style={s.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={s.tdCenter}>Loading...</td></tr>
              ) : filteredClients.length === 0 ? (
                <tr><td colSpan="6" style={s.tdCenter}>No clients found.</td></tr>
              ) : (
                filteredClients.map(c => (
                  <tr key={c._id} style={s.tr}>
                    <td style={s.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={s.avatar}>{c.name.charAt(0)}</div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{c.name}</div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={s.td}>{c.phone || 'N/A'}</td>
                    <td style={s.td}><span style={s.pill}>{c.totalBookings || 0}</span></td>
                    <td style={s.td}>
                      {c.isBlocked ? (
                        <span style={{...s.badge, backgroundColor: '#fee2e2', color: '#b91c1c'}}>Suspended</span>
                      ) : (
                        <span style={{...s.badge, backgroundColor: '#dcfce7', color: '#15803d'}}>Active</span>
                      )}
                    </td>
                    <td style={s.td}>{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td style={s.td}>
                      <button 
                        onClick={() => { setSelectedClient(c); setDrawerOpen(true); }}
                        style={s.actionBtn}
                      >
                        View <ChevronRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Side Drawer */}
        {drawerOpen && selectedClient && (
          <>
            <div style={s.overlay} onClick={() => setDrawerOpen(false)}></div>
            <div style={s.drawer}>
              <div style={s.drawerHeader}>
                <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a' }}>Client Profile</h2>
                <button onClick={() => setDrawerOpen(false)} style={s.closeBtn}><X size={24}/></button>
              </div>
              
              <div style={s.drawerContent}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <div style={{ width: 80, height: 80, borderRadius: '50%', backgroundColor: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, margin: '0 auto 1rem' }}>
                    {selectedClient.name.charAt(0)}
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a' }}>{selectedClient.name}</h3>
                  <p style={{ margin: '4px 0 0', color: '#64748b' }}>{selectedClient.email}</p>
                  
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12 }}>
                    {selectedClient.isBlocked ? (
                      <button onClick={() => handleAction(selectedClient._id, 'unsuspend')} style={{...s.btn, backgroundColor: '#f1f5f9', color: '#334155'}}><ShieldAlert size={16}/> Unsuspend</button>
                    ) : (
                      <button onClick={() => handleAction(selectedClient._id, 'suspend')} style={{...s.btn, backgroundColor: '#fee2e2', color: '#ef4444'}}><ShieldAlert size={16}/> Suspend</button>
                    )}
                  </div>
                </div>

                <div style={s.section}>
                  <h4 style={s.sectionTitle}>Danger Zone</h4>
                  <button onClick={() => handleAction(selectedClient._id, 'delete')} style={{...s.btn, backgroundColor: '#fee2e2', color: '#ef4444', width: '100%', justifyContent: 'center'}}>
                    <Trash2 size={16}/> Permanently Delete Client
                  </button>
                </div>
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
  
  tableContainer: { backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  thead: { backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
  th: { padding: '1rem', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' },
  tr: { borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s', ':hover': { backgroundColor: '#f8fafc' } },
  td: { padding: '1rem', fontSize: '0.95rem', color: '#334155', verticalAlign: 'middle' },
  tdCenter: { padding: '3rem', textAlign: 'center', color: '#64748b' },
  
  avatar: { width: 40, height: 40, borderRadius: '50%', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1rem' },
  badge: { padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, display: 'inline-block' },
  pill: { backgroundColor: '#f1f5f9', color: '#475569', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 700 },
  actionBtn: { display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: '#3b82f6', fontWeight: 600, cursor: 'pointer', padding: '0.5rem', borderRadius: '6px', transition: 'background-color 0.2s' },
  
  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100 },
  drawer: { position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: 400, backgroundColor: '#fff', zIndex: 101, boxShadow: '-5px 0 25px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', animation: 'slideIn 0.3s ease-out forwards' },
  drawerHeader: { padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' },
  drawerContent: { padding: '1.5rem', overflowY: 'auto', flex: 1 },
  
  section: { marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' },
  sectionTitle: { margin: '0 0 1rem 0', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' },
  btn: { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.5rem 1rem', border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }
};
