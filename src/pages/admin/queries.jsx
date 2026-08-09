import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useToast } from '../../context/ToastContext';
import { API } from '../../api';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminRoute from '../../components/admin/AdminRoute';
import { Search, Filter, MessageSquare, MessageCircle, Star, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

const s = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
  title: { fontSize: '1.8rem', fontWeight: 800, margin: 0, color: '#0f172a' },
  filterBar: { display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', background: '#fff', padding: '1rem', borderRadius: 12, border: '1px solid #e2e8f0' },
  input: { padding: '0.6rem 1rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', minWidth: 200 },
  select: { padding: '0.6rem 1rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', background: '#fff' },
  card: { background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: '1rem', overflow: 'hidden' },
  cardHeader: { padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: '#f8fafc' },
  cardBody: { padding: '1rem', borderTop: '1px solid #e2e8f0', background: '#fff' },
  badge: { padding: '4px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 },
  sourceIcon: { contact: <MessageSquare size={14}/>, chat: <MessageCircle size={14}/>, review: <Star size={14}/> },
  sourceColor: { contact: { bg: '#e0e7ff', text: '#4338ca' }, chat: { bg: '#dcfce7', text: '#15803d' }, review: { bg: '#fef3c7', text: '#b45309' } },
  btnGroup: { display: 'flex', gap: '0.5rem', marginTop: '1rem' },
  btn: { padding: '0.5rem 1rem', borderRadius: 8, fontWeight: 600, border: 'none', cursor: 'pointer', fontSize: '0.85rem' },
  textarea: { width: '100%', padding: '0.75rem', borderRadius: 8, border: '1px solid #cbd5e1', minHeight: 80, marginBottom: '1rem', fontFamily: 'inherit' }
};

export default function AdminQueries() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: 'all', resolved: 'all', search: '' });
  const [expandedId, setExpandedId] = useState(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const { showToast } = useToast();

  const fetchQueries = async () => {
    setLoading(true);
    try {
      // Build query string
      const params = new URLSearchParams();
      if (filters.type !== 'all') params.append('type', filters.type);
      if (filters.resolved !== 'all') params.append('resolved', filters.resolved);
      if (filters.search) params.append('search', filters.search);
      
      const res = await fetch(`/api/admin/queries?${params.toString()}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      const data = await res.json();
      if (data.success) {
        setQueries(data.data);
      } else {
        showToast(data.error, 'error');
      }
    } catch (err) {
      showToast('Failed to fetch queries', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      fetchQueries();
    }, 300);
    return () => clearTimeout(timer);
  }, [filters]);

  const handleResolve = async (id, sourceType, currentResolved) => {
    try {
      const res = await fetch('/api/admin/queries/resolve', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ id, sourceType, resolved: !currentResolved })
      });
      const data = await res.json();
      if (data.success) {
        setQueries(queries.map(q => q._id === id ? { ...q, resolved: !currentResolved } : q));
        showToast(`Marked as ${!currentResolved ? 'resolved' : 'unresolved'}`, 'success');
      }
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleUpdateNote = async (id, sourceType) => {
    try {
      const res = await fetch('/api/admin/queries/resolve', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ id, sourceType, adminNote: adminNoteInput })
      });
      const data = await res.json();
      if (data.success) {
        setQueries(queries.map(q => q._id === id ? { ...q, adminNote: adminNoteInput } : q));
        showToast('Note updated', 'success');
      }
    } catch (err) {
      showToast('Failed to update note', 'error');
    }
  };

  const toggleExpand = (item) => {
    if (expandedId === item._id) {
      setExpandedId(null);
    } else {
      setExpandedId(item._id);
      setAdminNoteInput(item.adminNote || '');
    }
  };

  return (
    <AdminRoute>
      <AdminLayout>
        <Helmet><title>Query & Complaint Center — Admin</title></Helmet>
        
        <div style={s.header}>
          <h1 style={s.title}>Query & Complaint Center</h1>
        </div>

        <div style={s.filterBar}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', padding: '0.4rem 0.8rem', borderRadius: 8 }}>
            <Search size={18} color="#64748b" style={{ marginRight: 8 }} />
            <input 
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.9rem' }} 
              placeholder="Search user or content..." 
              value={filters.search}
              onChange={e => setFilters({...filters, search: e.target.value})}
            />
          </div>
          
          <select style={s.select} value={filters.type} onChange={e => setFilters({...filters, type: e.target.value})}>
            <option value="all">All Sources</option>
            <option value="contact">Contact Forms</option>
            <option value="chat">AI Chat Logs</option>
            <option value="review">Reviews</option>
          </select>

          <select style={s.select} value={filters.resolved} onChange={e => setFilters({...filters, resolved: e.target.value})}>
            <option value="all">All Statuses</option>
            <option value="false">Unresolved</option>
            <option value="true">Resolved</option>
          </select>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>Loading queries...</div>
        ) : queries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: 12, color: '#64748b' }}>
            No queries found matching the criteria.
          </div>
        ) : (
          <div>
            {queries.map(q => (
              <div key={q._id} style={s.card}>
                <div style={s.cardHeader} onClick={() => toggleExpand(q)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ 
                      ...s.badge, 
                      backgroundColor: s.sourceColor[q.sourceType].bg, 
                      color: s.sourceColor[q.sourceType].text 
                    }}>
                      {s.sourceIcon[q.sourceType]} {q.sourceType.toUpperCase()}
                    </span>
                    <div>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{q.user.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{new Date(q.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ ...s.badge, backgroundColor: q.resolved ? '#dcfce7' : '#fee2e2', color: q.resolved ? '#15803d' : '#991b1b' }}>
                      {q.resolved ? 'RESOLVED' : 'UNRESOLVED'}
                    </span>
                    {expandedId === q._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {expandedId === q._id && (
                  <div style={s.cardBody}>
                    <div style={{ marginBottom: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: 8, whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>
                      {q.content}
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.85rem' }}>Admin Note (Internal)</label>
                      <textarea 
                        style={s.textarea} 
                        placeholder="Add internal notes about how this was handled..."
                        value={adminNoteInput}
                        onChange={e => setAdminNoteInput(e.target.value)}
                      />
                    </div>

                    <div style={s.btnGroup}>
                      <button 
                        style={{ ...s.btn, backgroundColor: q.resolved ? '#f59e0b' : '#10b981', color: '#fff' }}
                        onClick={() => handleResolve(q._id, q.sourceType, q.resolved)}
                      >
                        {q.resolved ? 'Mark Unresolved' : 'Mark Resolved'}
                      </button>
                      <button 
                        style={{ ...s.btn, backgroundColor: '#e2e8f0', color: '#475569' }}
                        onClick={() => handleUpdateNote(q._id, q.sourceType)}
                      >
                        Save Note
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </AdminLayout>
    </AdminRoute>
  );
}
