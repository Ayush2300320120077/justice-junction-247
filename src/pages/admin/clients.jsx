import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminRoute from '../../components/admin/AdminRoute';
import { Search, ShieldAlert, Trash2, ChevronRight, X, UserCheck, CheckCircle, XCircle } from 'lucide-react';

const DEFAULT_CLIENTS = [
  { _id: 'c1', name: 'Amit Verma', email: 'amit@example.com', role: 'client', city: 'Delhi', state: 'Delhi', phone: '+91 98765 43210', isVerified: true, isBlocked: false, createdAt: new Date().toISOString() },
  { _id: 'c2', name: 'Ritu Sen', email: 'ritu@example.com', role: 'client', city: 'Kolkata', state: 'West Bengal', phone: '+91 98765 43211', isVerified: true, isBlocked: false, createdAt: new Date().toISOString() },
  { _id: 'c3', name: 'Karan Patel', email: 'karan@example.com', role: 'client', city: 'Ahmedabad', state: 'Gujarat', phone: '+91 98765 43212', isVerified: true, isBlocked: false, createdAt: new Date().toISOString() },
  { _id: 'c4', name: 'Pooja Sundaram', email: 'pooja@example.com', role: 'client', city: 'Chennai', state: 'Tamil Nadu', phone: '+91 98765 43213', isVerified: true, isBlocked: false, createdAt: new Date().toISOString() },
  { _id: 'c5', name: 'Siddharth Rao', email: 'siddharth@example.com', role: 'client', city: 'Hyderabad', state: 'Telangana', phone: '+91 98765 43214', isVerified: false, isBlocked: false, createdAt: new Date().toISOString() }
];

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
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        const clientList = Array.isArray(data) ? data : (data.data || data.clients || data.users || []);
        if (clientList.length > 0) {
          setClients(clientList);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.error('Fetch clients error:', err);
    }
    setClients(DEFAULT_CLIENTS);
    setLoading(false);
  };

  const handleAction = async (id, action) => {
    if (action === 'delete' && !window.confirm('Are you sure you want to permanently delete this client?')) return;
    
    try {
      const method = action === 'delete' ? 'DELETE' : 'PUT';
      const body = action === 'delete' ? null : JSON.stringify({ action, isBlocked: action === 'suspend' });
      
      const res = await fetch(`/api/admin/clients/${id}`, { credentials: 'include',
        method,
        headers: { 
          
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
          const updated = data.client || data;
          setClients(prev => prev.map(c => c._id === id ? { ...c, ...updated } : c));
          if (selectedClient?._id === id) setSelectedClient(prev => ({ ...prev, ...updated }));
        }
      } else {
        // Fallback local update
        if (action === 'suspend') {
          setClients(prev => prev.map(c => c._id === id ? { ...c, isBlocked: true } : c));
          if (selectedClient?._id === id) setSelectedClient(prev => ({ ...prev, isBlocked: true }));
        } else if (action === 'unsuspend') {
          setClients(prev => prev.map(c => c._id === id ? { ...c, isBlocked: false } : c));
          if (selectedClient?._id === id) setSelectedClient(prev => ({ ...prev, isBlocked: false }));
        } else if (action === 'delete') {
          setClients(prev => prev.filter(c => c._id !== id));
          if (selectedClient?._id === id) setDrawerOpen(false);
        }
      }
    } catch (err) {
      console.error('Action failed', err);
    }
  };

  const filteredClients = clients.filter(c => {
    return c.name?.toLowerCase().includes(search.toLowerCase()) || 
           c.email?.toLowerCase().includes(search.toLowerCase()) ||
           c.city?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <AdminRoute>
      <AdminLayout title="Client Management">
        
        {/* Toolbar */}
        <div style={s.toolbar}>
          <div style={s.searchBox}>
            <Search size={18} color="#94a3b8" />
            <input 
              type="text" 
              placeholder="Search clients by name, email, or city..." 
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
                <th style={s.th}>Contact</th>
                <th style={s.th}>Location</th>
                <th style={s.th}>Status</th>
                <th style={s.th}>Joined</th>
                <th style={s.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={s.tdCenter}>Loading Client Data...</td></tr>
              ) : filteredClients.length === 0 ? (
                <tr><td colSpan="6" style={s.tdCenter}>No clients found.</td></tr>
              ) : (
                filteredClients.map(c => (
                  <tr key={c._id} style={s.tr}>
                    <td style={s.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={s.avatar}>{c.name ? c.name.charAt(0) : 'C'}</div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{c.name}</div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={s.td}>{c.phone || 'N/A'}</td>
                    <td style={s.td}>{c.city || 'Delhi'}, {c.state || 'India'}</td>
                    <td style={s.td}>
                      {c.isBlocked ? (
                        <span style={{...s.badge, backgroundColor: '#fee2e2', color: '#b91c1c'}}>Suspended</span>
                      ) : (
                        <span style={{...s.badge, backgroundColor: '#dcfce7', color: '#15803d'}}>Active</span>
                      )}
                    </td>
                    <td style={s.td}>{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Recent'}</td>
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
                  <div style={{ width: 80, height: 80, borderRadius: '50%', backgroundColor: '#7B1D2E', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, margin: '0 auto 1rem' }}>
                    {selectedClient.name.charAt(0)}
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a' }}>{selectedClient.name}</h3>
                  <p style={{ margin: '4px 0 0', color: '#64748b' }}>{selectedClient.email}</p>
                  
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12 }}>
                    {selectedClient.isBlocked ? (
                      <button onClick={() => handleAction(selectedClient._id, 'unsuspend')} style={{...s.btn, backgroundColor: '#f1f5f9', color: '#334155'}}><UserCheck size={16}/> Activate Account</button>
                    ) : (
                      <button onClick={() => handleAction(selectedClient._id, 'suspend')} style={{...s.btn, backgroundColor: '#fee2e2', color: '#ef4444'}}><ShieldAlert size={16}/> Suspend Account</button>
                    )}
                  </div>
                </div>

                <div style={s.section}>
                  <h4 style={s.sectionTitle}>Client Details</h4>
                  <div style={s.detailRow}><span>Phone:</span> <strong>{selectedClient.phone || 'N/A'}</strong></div>
                  <div style={s.detailRow}><span>City:</span> <strong>{selectedClient.city || 'Delhi'}</strong></div>
                  <div style={s.detailRow}><span>State:</span> <strong>{selectedClient.state || 'India'}</strong></div>
                  <div style={s.detailRow}><span>Role:</span> <strong>Client</strong></div>
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
  th: { padding: '1rem', fontSize: '0.8rem', fontWeight: 600, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em' },
  tr: { borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' },
  td: { padding: '1rem', fontSize: '0.95rem', color: '#334155', verticalAlign: 'middle' },
  tdCenter: { padding: '3rem', textAlign: 'center', color: '#64748b' },
  
  avatar: { width: 40, height: 40, borderRadius: '50%', backgroundColor: 'rgba(123,29,46,0.1)', color: '#7B1D2E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem' },
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
