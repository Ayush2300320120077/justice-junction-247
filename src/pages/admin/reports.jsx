import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminRoute from '../../components/admin/AdminRoute';
import { AlertTriangle, ShieldCheck, XCircle, Search, FileText } from 'lucide-react';

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  
  const [selectedReport, setSelectedReport] = useState(null);
  const [resolutionInput, setResolutionInput] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/admin/reports', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('jj_admin_token')}` }
      });
      if (res.ok) setReports(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status, resolution = null) => {
    try {
      const body = { status };
      if (resolution !== null) body.adminResolution = resolution;

      const res = await fetch(`/api/admin/reports/${id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('jj_admin_token')}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(body)
      });
      
      if (res.ok) {
        const data = await res.json();
        setReports(prev => prev.map(r => r._id === id ? data.report : r));
        if (selectedReport?._id === id) setSelectedReport(data.report);
      }
    } catch (err) {
      console.error('Update failed', err);
    }
  };

  const filteredReports = reports.filter(r => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return r.reporterName?.toLowerCase().includes(q) || r.reason?.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <AdminRoute>
      <AdminLayout title="Reports & Complaints">
        
        <div style={s.layout}>
          {/* List Panel */}
          <div style={s.listPanel}>
            <div style={s.listHeader}>
              <div style={s.searchBox}>
                <Search size={16} color="#94a3b8" />
                <input type="text" placeholder="Search reports..." style={s.searchInput} value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div style={s.tabs}>
                {['pending', 'investigating', 'resolved', 'dismissed', 'all'].map(tab => (
                  <button key={tab} style={{...s.tabBtn, ...(statusFilter === tab ? s.activeTabBtn : {})}} onClick={() => setStatusFilter(tab)}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div style={s.msgList}>
              {loading ? (
                <div style={s.emptyState}>Loading...</div>
              ) : filteredReports.length === 0 ? (
                <div style={s.emptyState}>No reports found.</div>
              ) : (
                filteredReports.map(rep => (
                  <div key={rep._id} onClick={() => setSelectedReport(rep)} style={{...s.msgItem, ...(selectedReport?._id === rep._id ? s.msgItemActive : {})}}>
                    <div style={s.msgItemHeader}>
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>{rep.reason}</span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{new Date(rep.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#334155', marginBottom: '0.25rem' }}>Reported: <strong>{rep.reportedEntity}</strong></div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>By: {rep.reporterName}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Details Panel */}
          <div style={s.readPanel}>
            {selectedReport ? (
              <div style={s.detailsContent}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div>
                    <h2 style={{ margin: '0 0 0.5rem 0', color: '#ef4444', display: 'flex', alignItems: 'center', gap: 8 }}><AlertTriangle size={24}/> {selectedReport.reason}</h2>
                    <div style={{ color: '#475569', fontSize: '0.9rem' }}>Reported against: <strong>{selectedReport.reportedEntity.toUpperCase()}</strong> (ID: {selectedReport.reportedId || 'N/A'})</div>
                  </div>
                  <span style={{...s.statusBadge, 
                    backgroundColor: selectedReport.status === 'resolved' ? '#dcfce7' : selectedReport.status === 'dismissed' ? '#f1f5f9' : selectedReport.status === 'investigating' ? '#fef9c3' : '#fee2e2',
                    color: selectedReport.status === 'resolved' ? '#16a34a' : selectedReport.status === 'dismissed' ? '#64748b' : selectedReport.status === 'investigating' ? '#a16207' : '#b91c1c'
                  }}>
                    {selectedReport.status.toUpperCase()}
                  </span>
                </div>

                <div style={s.infoCard}>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase' }}>Reporter Details</h4>
                  <div><strong>{selectedReport.reporterName}</strong> &lt;{selectedReport.reporterEmail}&gt;</div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: 4 }}>Date: {new Date(selectedReport.createdAt).toLocaleString()}</div>
                </div>

                <div style={{ margin: '1.5rem 0' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', color: '#0f172a' }}>Description</h4>
                  <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#334155', lineHeight: 1.6 }}>
                    {selectedReport.description}
                  </div>
                </div>

                <div style={{ marginTop: 'auto', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', color: '#0f172a' }}>Resolution & Actions</h4>
                  
                  {selectedReport.status === 'resolved' || selectedReport.status === 'dismissed' ? (
                    <div style={{ padding: '1rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px' }}>
                      <strong>Resolution Note:</strong> {selectedReport.adminResolution || 'No note provided.'}
                    </div>
                  ) : (
                    <>
                      <textarea 
                        style={s.textarea} 
                        placeholder="Add resolution note before resolving or dismissing..." 
                        value={resolutionInput} 
                        onChange={e => setResolutionInput(e.target.value)}
                      />
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button onClick={() => updateStatus(selectedReport._id, 'investigating')} style={{...s.btn, backgroundColor: '#eab308', color: '#fff'}}><Search size={16}/> Mark Investigating</button>
                        <button onClick={() => updateStatus(selectedReport._id, 'resolved', resolutionInput)} style={{...s.btn, backgroundColor: '#10b981', color: '#fff'}} disabled={!resolutionInput}><ShieldCheck size={16}/> Resolve</button>
                        <button onClick={() => updateStatus(selectedReport._id, 'dismissed', resolutionInput)} style={{...s.btn, backgroundColor: '#64748b', color: '#fff'}} disabled={!resolutionInput}><XCircle size={16}/> Dismiss</button>
                      </div>
                    </>
                  )}
                </div>

              </div>
            ) : (
              <div style={s.emptyState}>Select a report to view details</div>
            )}
          </div>
        </div>

      </AdminLayout>
    </AdminRoute>
  );
}

const s = {
  layout: { display: 'flex', gap: '1px', backgroundColor: '#e2e8f0', height: 'calc(100vh - 120px)', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' },
  listPanel: { width: '350px', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', flexShrink: 0 },
  readPanel: { flex: 1, backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', minWidth: 0 },
  
  listHeader: { padding: '1rem', borderBottom: '1px solid #e2e8f0', backgroundColor: '#fff' },
  searchBox: { display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#f1f5f9', padding: '0.5rem 0.75rem', borderRadius: '8px', marginBottom: '1rem' },
  searchInput: { flex: 1, border: 'none', outline: 'none', backgroundColor: 'transparent', fontSize: '0.85rem' },
  tabs: { display: 'flex', gap: '0.25rem', overflowX: 'auto', paddingBottom: '0.25rem' },
  tabBtn: { padding: '0.4rem 0.8rem', fontSize: '0.75rem', fontWeight: 600, border: 'none', background: 'transparent', color: '#64748b', cursor: 'pointer', borderRadius: '6px' },
  activeTabBtn: { backgroundColor: '#e2e8f0', color: '#0f172a' },
  
  msgList: { flex: 1, overflowY: 'auto' },
  msgItem: { padding: '1rem', borderBottom: '1px solid #e2e8f0', cursor: 'pointer', transition: 'background-color 0.2s', backgroundColor: '#fff' },
  msgItemActive: { backgroundColor: '#fee2e2', borderLeft: '3px solid #ef4444' },
  msgItemHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' },
  
  detailsContent: { padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' },
  statusBadge: { padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' },
  infoCard: { padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' },
  textarea: { width: '100%', minHeight: '100px', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none', resize: 'vertical' },
  btn: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', border: 'none', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', opacity: 1, transition: 'opacity 0.2s' },
  
  emptyState: { padding: '3rem 1rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }
};
