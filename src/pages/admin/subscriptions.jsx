import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminRoute from '../../components/admin/AdminRoute';
import { Search, Filter, ArrowUpCircle, ArrowDownCircle, XCircle, Gift, Mail } from 'lucide-react';

export default function AdminSubscriptions() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('all');

  useEffect(() => {
    fetchSubs();
  }, []);

  const fetchSubs = async () => {
    try {
      const res = await fetch('/api/admin/subscriptions', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('jj_admin_token')}` }
      });
      if (res.ok) setSubs(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action, plan = null) => {
    if (action === 'cancel' && !window.confirm('Are you sure you want to cancel this subscription? The lawyer will lose access to premium features immediately.')) return;
    
    try {
      const res = await fetch(`/api/admin/subscriptions/${id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('jj_admin_token')}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ action, plan })
      });
      
      if (res.ok) {
        const data = await res.json();
        setSubs(prev => prev.map(s => s._id === id ? data.lawyer : s));
      }
    } catch (err) {
      console.error('Action failed', err);
    }
  };

  const filteredSubs = subs.filter(s => {
    const matchSearch = s.name?.toLowerCase().includes(search.toLowerCase()) || 
                        s.email?.toLowerCase().includes(search.toLowerCase());
    
    if (!matchSearch) return false;
    if (planFilter === 'all') return true;
    return s.subscription === planFilter || (planFilter === 'free' && !s.subscription);
  });

  const summary = {
    active: subs.filter(s => s.subscription !== 'free' && s.subscription).length,
    basic: subs.filter(s => s.subscription === 'basic').length,
    pro: subs.filter(s => s.subscription === 'pro').length,
    elite: subs.filter(s => s.subscription === 'elite').length,
    revenue: subs.reduce((acc, s) => {
      if (s.subscription === 'elite') return acc + 4999;
      if (s.subscription === 'pro') return acc + 2999;
      if (s.subscription === 'basic') return acc + 999;
      return acc;
    }, 0)
  };

  return (
    <AdminRoute>
      <AdminLayout title="Subscriptions & Payments">
        
        {/* Summary Bar */}
        <div style={s.summaryBar}>
          <div style={s.summaryCard}>
            <div style={s.scLabel}>Total Active</div>
            <div style={s.scValue}>{summary.active}</div>
          </div>
          <div style={s.summaryCard}>
            <div style={s.scLabel}>Basic Plans</div>
            <div style={s.scValue}>{summary.basic}</div>
          </div>
          <div style={s.summaryCard}>
            <div style={s.scLabel}>Pro Plans</div>
            <div style={s.scValue}>{summary.pro}</div>
          </div>
          <div style={s.summaryCard}>
            <div style={s.scLabel}>Elite Plans</div>
            <div style={s.scValue}>{summary.elite}</div>
          </div>
          <div style={{...s.summaryCard, borderLeft: '4px solid #10b981'}}>
            <div style={s.scLabel}>Monthly Rev. (Est)</div>
            <div style={{...s.scValue, color: '#10b981'}}>₹{summary.revenue.toLocaleString()}</div>
          </div>
        </div>

        {/* Toolbar */}
        <div style={s.toolbar}>
          <div style={s.searchBox}>
            <Search size={18} color="#94a3b8" />
            <input 
              type="text" 
              placeholder="Search lawyer..." 
              style={s.searchInput}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          
          <div style={s.filterBox}>
            <Filter size={18} color="#94a3b8" />
            <select style={s.select} value={planFilter} onChange={e => setPlanFilter(e.target.value)}>
              <option value="all">All Plans</option>
              <option value="elite">Elite</option>
              <option value="pro">Pro</option>
              <option value="basic">Basic</option>
              <option value="free">Free</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div style={s.tableContainer}>
          <table style={s.table}>
            <thead style={s.thead}>
              <tr>
                <th style={s.th}>Lawyer</th>
                <th style={s.th}>Plan</th>
                <th style={s.th}>Sub ID</th>
                <th style={s.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" style={s.tdCenter}>Loading...</td></tr>
              ) : filteredSubs.length === 0 ? (
                <tr><td colSpan="4" style={s.tdCenter}>No subscriptions found.</td></tr>
              ) : (
                filteredSubs.map(sub => (
                  <tr key={sub._id} style={s.tr}>
                    <td style={s.td}>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{sub.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{sub.email}</div>
                    </td>
                    <td style={s.td}>
                      <span style={{
                        ...s.badge, 
                        backgroundColor: sub.subscription === 'elite' ? '#fef3c7' : sub.subscription === 'pro' ? '#e0e7ff' : sub.subscription === 'basic' ? '#dcfce7' : '#f1f5f9',
                        color: sub.subscription === 'elite' ? '#b45309' : sub.subscription === 'pro' ? '#4338ca' : sub.subscription === 'basic' ? '#15803d' : '#475569'
                      }}>
                        {sub.subscription?.toUpperCase() || 'FREE'}
                      </span>
                    </td>
                    <td style={s.td}>
                      <span style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: '#94a3b8' }}>
                        {sub.razorpaySubscriptionId || 'N/A'}
                      </span>
                    </td>
                    <td style={s.td}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <select 
                          style={s.actionSelect}
                          value=""
                          onChange={(e) => {
                            if (e.target.value) handleAction(sub._id, 'change_plan', e.target.value);
                          }}
                        >
                          <option value="">Change Plan...</option>
                          <option value="elite">Upgrade to Elite</option>
                          <option value="pro">Set to Pro</option>
                          <option value="basic">Set to Basic</option>
                          <option value="free">Downgrade to Free</option>
                        </select>
                        
                        {(sub.subscription && sub.subscription !== 'free') && (
                          <button onClick={() => handleAction(sub._id, 'cancel')} style={s.cancelBtn}>
                            <XCircle size={14} /> Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </AdminLayout>
    </AdminRoute>
  );
}

const s = {
  summaryBar: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' },
  summaryCard: { backgroundColor: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' },
  scLabel: { fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' },
  scValue: { fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' },
  
  toolbar: { display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  searchBox: { flex: 1, minWidth: '300px', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#fff', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0' },
  searchInput: { flex: 1, border: 'none', outline: 'none', fontSize: '0.95rem' },
  filterBox: { display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#fff', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0' },
  select: { border: 'none', outline: 'none', fontSize: '0.95rem', backgroundColor: 'transparent', cursor: 'pointer' },
  
  tableContainer: { backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  thead: { backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
  th: { padding: '1rem', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' },
  tr: { borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s', ':hover': { backgroundColor: '#f8fafc' } },
  td: { padding: '1rem', fontSize: '0.95rem', color: '#334155', verticalAlign: 'middle' },
  tdCenter: { padding: '3rem', textAlign: 'center', color: '#64748b' },
  
  badge: { padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, display: 'inline-block', letterSpacing: '1px' },
  actionSelect: { padding: '0.4rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none', cursor: 'pointer', backgroundColor: '#fff' },
  cancelBtn: { display: 'flex', alignItems: 'center', gap: 4, padding: '0.4rem 0.8rem', borderRadius: '6px', border: 'none', backgroundColor: '#fee2e2', color: '#ef4444', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }
};
