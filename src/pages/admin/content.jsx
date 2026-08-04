import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminRoute from '../../components/admin/AdminRoute';
import { Plus, Trash2, Edit3, Check, X, Megaphone, HelpCircle, Briefcase } from 'lucide-react';

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState('faq'); // faq, announcements, practiceAreas
  const [data, setData] = useState({ faqs: [], announcements: [], practiceAreas: [] });
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/admin/content', {
        credentials: 'include'
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item = null) => {
    setEditingItem(item);
    if (item) setFormData(item);
    else setFormData({ isActive: true });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const method = editingItem ? 'PUT' : 'POST';
      const url = editingItem 
        ? `/api/admin/content/${activeTab}/${editingItem._id}` 
        : `/api/admin/content`;
        
      const body = editingItem ? formData : { type: activeTab, payload: formData };

      const res = await fetch(url, {
        credentials: 'include',
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      
      if (res.ok) {
        fetchContent();
        closeModal();
      }
    } catch (err) {
      console.error('Save failed', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item permanently?')) return;
    try {
      const res = await fetch(`/api/admin/content/${activeTab}/${id}`, {
        credentials: 'include',
        method: 'DELETE'
      });
      if (res.ok) fetchContent();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (
    <AdminRoute>
      <AdminLayout title="Content Manager">
        
        {/* Tabs */}
        <div style={s.tabsContainer}>
          <button style={{...s.tab, ...(activeTab === 'faq' ? s.activeTab : {})}} onClick={() => setActiveTab('faq')}>
            <HelpCircle size={18} /> FAQs
          </button>
          <button style={{...s.tab, ...(activeTab === 'announcements' ? s.activeTab : {})}} onClick={() => setActiveTab('announcements')}>
            <Megaphone size={18} /> Announcements
          </button>
          <button style={{...s.tab, ...(activeTab === 'practiceArea' ? s.activeTab : {})}} onClick={() => setActiveTab('practiceArea')}>
            <Briefcase size={18} /> Practice Areas
          </button>
        </div>

        {/* Content Area */}
        <div style={s.contentCard}>
          <div style={s.cardHeader}>
            <h2 style={s.cardTitle}>
              {activeTab === 'faq' && 'Manage FAQs'}
              {activeTab === 'announcements' && 'Platform Announcements'}
              {activeTab === 'practiceArea' && 'Legal Practice Areas'}
            </h2>
            <button onClick={() => openModal()} style={s.addBtn}>
              <Plus size={16} /> Add New
            </button>
          </div>

          <div style={s.listContainer}>
            {loading ? <div style={s.emptyState}>Loading...</div> : 
             activeTab === 'faq' ? (
               data.faqs.length === 0 ? <div style={s.emptyState}>No FAQs found.</div> :
               data.faqs.map(item => (
                 <div key={item._id} style={s.listItem}>
                   <div style={s.listMain}>
                     <h3 style={s.itemTitle}>{item.question}</h3>
                     <p style={s.itemDesc}>{item.answer}</p>
                     <div style={s.itemMeta}>Category: {item.category} | Order: {item.order}</div>
                   </div>
                   <div style={s.listActions}>
                     <span style={{...s.status, color: item.isActive ? '#10b981' : '#ef4444'}}>{item.isActive ? 'Active' : 'Inactive'}</span>
                     <button onClick={() => openModal(item)} style={s.iconBtn}><Edit3 size={16} color="#3b82f6" /></button>
                     <button onClick={() => handleDelete(item._id)} style={s.iconBtn}><Trash2 size={16} color="#ef4444" /></button>
                   </div>
                 </div>
               ))
             ) : activeTab === 'announcements' ? (
               data.announcements.length === 0 ? <div style={s.emptyState}>No Announcements found.</div> :
               data.announcements.map(item => (
                 <div key={item._id} style={s.listItem}>
                   <div style={s.listMain}>
                     <h3 style={s.itemTitle}>{item.title}</h3>
                     <p style={s.itemDesc}>{item.message}</p>
                     <div style={s.itemMeta}>Type: {item.type} | Audience: {item.targetAudience}</div>
                   </div>
                   <div style={s.listActions}>
                     <span style={{...s.status, color: item.isActive ? '#10b981' : '#ef4444'}}>{item.isActive ? 'Active' : 'Inactive'}</span>
                     <button onClick={() => openModal(item)} style={s.iconBtn}><Edit3 size={16} color="#3b82f6" /></button>
                     <button onClick={() => handleDelete(item._id)} style={s.iconBtn}><Trash2 size={16} color="#ef4444" /></button>
                   </div>
                 </div>
               ))
             ) : (
               data.practiceAreas?.length === 0 ? <div style={s.emptyState}>No Practice Areas found.</div> :
               data.practiceAreas?.map(item => (
                 <div key={item._id} style={s.listItem}>
                   <div style={s.listMain}>
                     <h3 style={s.itemTitle}>{item.name}</h3>
                     <p style={s.itemDesc}>{item.description || 'No description'}</p>
                   </div>
                   <div style={s.listActions}>
                     <span style={{...s.status, color: item.isActive ? '#10b981' : '#ef4444'}}>{item.isActive ? 'Active' : 'Inactive'}</span>
                     <button onClick={() => openModal(item)} style={s.iconBtn}><Edit3 size={16} color="#3b82f6" /></button>
                     <button onClick={() => handleDelete(item._id)} style={s.iconBtn}><Trash2 size={16} color="#ef4444" /></button>
                   </div>
                 </div>
               ))
             )}
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div style={s.modalOverlay}>
            <div style={s.modal}>
              <div style={s.modalHeader}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a' }}>{editingItem ? 'Edit Item' : 'Add New Item'}</h3>
                <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color="#64748b" /></button>
              </div>
              <form onSubmit={handleSave} style={s.form}>
                
                {activeTab === 'faq' && (
                  <>
                    <input required placeholder="Question" value={formData.question || ''} onChange={e => setFormData({...formData, question: e.target.value})} style={s.input} />
                    <textarea required placeholder="Answer" value={formData.answer || ''} onChange={e => setFormData({...formData, answer: e.target.value})} style={{...s.input, minHeight: '100px'}} />
                    <input required placeholder="Category" value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} style={s.input} />
                    <input type="number" placeholder="Order (0 = first)" value={formData.order || 0} onChange={e => setFormData({...formData, order: Number(e.target.value)})} style={s.input} />
                  </>
                )}

                {activeTab === 'announcements' && (
                  <>
                    <input required placeholder="Title" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} style={s.input} />
                    <textarea required placeholder="Message" value={formData.message || ''} onChange={e => setFormData({...formData, message: e.target.value})} style={{...s.input, minHeight: '100px'}} />
                    <select value={formData.type || 'info'} onChange={e => setFormData({...formData, type: e.target.value})} style={s.input}>
                      <option value="info">Info</option><option value="warning">Warning</option><option value="success">Success</option>
                    </select>
                    <select value={formData.targetAudience || 'all'} onChange={e => setFormData({...formData, targetAudience: e.target.value})} style={s.input}>
                      <option value="all">All</option><option value="lawyers">Lawyers</option><option value="clients">Clients</option>
                    </select>
                  </>
                )}

                {activeTab === 'practiceArea' && (
                  <>
                    <input required placeholder="Practice Area Name" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} style={s.input} />
                    <textarea placeholder="Description" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} style={{...s.input, minHeight: '80px'}} />
                  </>
                )}

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.isActive !== false} onChange={e => setFormData({...formData, isActive: e.target.checked})} />
                  <span style={{ fontSize: '0.9rem', color: '#334155', fontWeight: 600 }}>Active / Visible</span>
                </label>

                <div style={s.modalActions}>
                  <button type="button" onClick={closeModal} style={s.cancelBtn}>Cancel</button>
                  <button type="submit" style={s.saveBtn}>Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </AdminLayout>
    </AdminRoute>
  );
}

const s = {
  tabsContainer: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #cbd5e1' },
  tab: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', border: 'none', background: 'none', fontSize: '0.95rem', fontWeight: 600, color: '#64748b', cursor: 'pointer', borderBottom: '2px solid transparent', marginBottom: '-1px' },
  activeTab: { color: '#4f46e5', borderBottomColor: '#4f46e5' },
  
  contentCard: { backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' },
  cardHeader: { padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { margin: 0, fontSize: '1.1rem', color: '#0f172a' },
  addBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' },
  
  listContainer: { display: 'flex', flexDirection: 'column' },
  listItem: { padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' },
  listMain: { flex: 1 },
  itemTitle: { margin: '0 0 0.5rem 0', fontSize: '1rem', color: '#0f172a' },
  itemDesc: { margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#475569', lineHeight: 1.5 },
  itemMeta: { fontSize: '0.8rem', color: '#94a3b8', fontFamily: 'monospace' },
  listActions: { display: 'flex', alignItems: 'center', gap: '1rem' },
  status: { fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' },
  iconBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', opacity: 0.8, ':hover': { opacity: 1 } },
  emptyState: { padding: '3rem', textAlign: 'center', color: '#94a3b8' },
  
  modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modal: { backgroundColor: '#fff', width: '100%', maxWidth: '500px', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', overflow: 'hidden' },
  modalHeader: { padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  form: { padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' },
  input: { width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' },
  cancelBtn: { padding: '0.75rem 1.5rem', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' },
  saveBtn: { padding: '0.75rem 1.5rem', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }
};
