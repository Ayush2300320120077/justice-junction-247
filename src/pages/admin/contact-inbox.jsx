import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminRoute from '../../components/admin/AdminRoute';
import { Mail, MailOpen, Reply, Archive, Trash2, Edit3, MessageSquare, Search } from 'lucide-react';

export default function AdminContactInbox() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [noteInput, setNoteInput] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/admin/contacts', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('jj_admin_token')}` }
      });
      if (res.ok) setMessages(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action, payload = null) => {
    if (action === 'delete' && !window.confirm('Delete this message permanently?')) return;
    
    try {
      const method = action === 'delete' ? 'DELETE' : 'PUT';
      const body = action === 'delete' ? null : JSON.stringify({ action, payload });
      
      const res = await fetch(`/api/admin/contacts/${id}`, {
        method,
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('jj_admin_token')}`,
          'Content-Type': 'application/json' 
        },
        body
      });
      
      if (res.ok) {
        if (action === 'delete') {
          setMessages(prev => prev.filter(m => m._id !== id));
          if (selectedMsg?._id === id) setSelectedMsg(null);
        } else {
          const data = await res.json();
          setMessages(prev => prev.map(m => m._id === id ? data.message : m));
          if (selectedMsg?._id === id) setSelectedMsg(data.message);
          if (action === 'add_note') setNoteInput('');
        }
      }
    } catch (err) {
      console.error('Action failed', err);
    }
  };

  const selectMessage = (msg) => {
    setSelectedMsg(msg);
    if (msg.status === 'unread') {
      handleAction(msg._id, 'mark_read');
    }
  };

  const filteredMessages = messages.filter(m => {
    if (activeTab === 'unread') { if (m.status !== 'unread') return false; }
    else if (activeTab === 'archived') { if (m.status !== 'archived') return false; }
    else if (activeTab === 'replied') { if (m.status !== 'replied') return false; }
    else if (activeTab === 'all') { if (m.status === 'archived') return false; }

    if (search) {
      const q = search.toLowerCase();
      return (m.name?.toLowerCase().includes(q) || m.email?.toLowerCase().includes(q) || m.subject?.toLowerCase().includes(q));
    }
    return true;
  });

  return (
    <AdminRoute>
      <AdminLayout title="Contact Inbox">
        
        <div style={s.layout}>
          {/* Inbox List Area */}
          <div style={s.listPanel}>
            <div style={s.listHeader}>
              <div style={s.searchBox}>
                <Search size={16} color="#94a3b8" />
                <input 
                  type="text" 
                  placeholder="Search messages..." 
                  style={s.searchInput}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div style={s.tabs}>
                {['all', 'unread', 'replied', 'archived'].map(tab => (
                  <button 
                    key={tab} 
                    style={{...s.tabBtn, ...(activeTab === tab ? s.activeTabBtn : {})}}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div style={s.msgList}>
              {loading ? (
                <div style={s.emptyState}>Loading...</div>
              ) : filteredMessages.length === 0 ? (
                <div style={s.emptyState}>No messages found.</div>
              ) : (
                filteredMessages.map(msg => (
                  <div 
                    key={msg._id} 
                    onClick={() => selectMessage(msg)}
                    style={{...s.msgItem, ...(selectedMsg?._id === msg._id ? s.msgItemActive : {}), ...(msg.status === 'unread' ? s.msgItemUnread : {})}}
                  >
                    <div style={s.msgItemHeader}>
                      <span style={{ fontWeight: msg.status === 'unread' ? 800 : 600, color: '#0f172a' }}>{msg.name}</span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: msg.status === 'unread' ? 600 : 500, color: '#334155', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                      {msg.status === 'unread' && <div style={s.unreadDot}></div>}
                      {msg.subject || 'No Subject'}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {msg.message}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Reading Pane */}
          <div style={s.readPanel}>
            {selectedMsg ? (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Read Header */}
                <div style={s.readHeader}>
                  <div>
                    <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', color: '#0f172a' }}>{selectedMsg.subject || 'No Subject'}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#475569' }}>
                      <strong>{selectedMsg.name}</strong> 
                      <span>&lt;{selectedMsg.email}&gt;</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                      {new Date(selectedMsg.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleAction(selectedMsg._id, 'mark_replied')} style={s.iconBtn} title="Mark as Replied">
                      <Reply size={18} color={selectedMsg.status === 'replied' ? '#10b981' : '#64748b'} />
                    </button>
                    <button onClick={() => handleAction(selectedMsg._id, 'archive')} style={s.iconBtn} title="Archive">
                      <Archive size={18} color={selectedMsg.status === 'archived' ? '#f59e0b' : '#64748b'} />
                    </button>
                    <button onClick={() => handleAction(selectedMsg._id, 'delete')} style={s.iconBtn} title="Delete">
                      <Trash2 size={18} color="#ef4444" />
                    </button>
                  </div>
                </div>

                {/* Status Badge */}
                <div style={{ padding: '0 1.5rem' }}>
                  <span style={{...s.statusBadge, 
                    backgroundColor: selectedMsg.status === 'replied' ? '#dcfce7' : selectedMsg.status === 'unread' ? '#dbeafe' : '#f1f5f9',
                    color: selectedMsg.status === 'replied' ? '#16a34a' : selectedMsg.status === 'unread' ? '#2563eb' : '#475569'
                  }}>
                    {selectedMsg.status.toUpperCase()}
                  </span>
                </div>

                {/* Message Body */}
                <div style={s.readBody}>
                  {selectedMsg.message.split('\\n').map((para, idx) => (
                    <p key={idx} style={{ margin: '0 0 1rem 0', lineHeight: 1.6, color: '#334155' }}>{para}</p>
                  ))}
                </div>

                {/* Admin Note Section */}
                <div style={s.noteSection}>
                  <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MessageSquare size={16} /> Internal Admin Note
                  </h4>
                  {selectedMsg.adminNote ? (
                    <div style={s.existingNote}>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: '#b45309' }}>{selectedMsg.adminNote}</p>
                      <button onClick={() => setNoteInput(selectedMsg.adminNote)} style={s.editNoteBtn}><Edit3 size={14}/></button>
                    </div>
                  ) : null}
                  
                  {(!selectedMsg.adminNote || noteInput !== '') && (
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <input 
                        type="text" 
                        style={s.noteInput} 
                        placeholder="Add private note..." 
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && noteInput) handleAction(selectedMsg._id, 'add_note', noteInput);
                        }}
                      />
                      <button 
                        onClick={() => handleAction(selectedMsg._id, 'add_note', noteInput)} 
                        style={s.saveNoteBtn}
                        disabled={!noteInput}
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>

                {/* Reply Button Footer */}
                <div style={s.readFooter}>
                  <a 
                    href={`mailto:${selectedMsg.email}?subject=Re: ${encodeURIComponent(selectedMsg.subject || 'Your Message to Justice Junction')}`}
                    onClick={() => handleAction(selectedMsg._id, 'mark_replied')}
                    style={s.replyLink}
                  >
                    <Reply size={16} /> Reply via Email Client
                  </a>
                </div>

              </div>
            ) : (
              <div style={s.emptyState}>Select a message to read</div>
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
  msgItemActive: { backgroundColor: '#e0e7ff', borderLeft: '3px solid #6366f1' },
  msgItemUnread: { backgroundColor: '#f8fafc' },
  msgItemHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' },
  unreadDot: { width: 8, height: 8, borderRadius: '50%', backgroundColor: '#3b82f6' },
  
  readHeader: { padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  iconBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', borderRadius: '6px', transition: 'background-color 0.2s', ':hover': { backgroundColor: '#f1f5f9' } },
  statusBadge: { padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em' },
  readBody: { padding: '1.5rem', flex: 1, overflowY: 'auto' },
  
  noteSection: { margin: '0 1.5rem', padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '8px', border: '1px solid #fde68a' },
  existingNote: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  editNoteBtn: { background: 'none', border: 'none', color: '#b45309', cursor: 'pointer', opacity: 0.7 },
  noteInput: { flex: 1, padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #fcd34d', fontSize: '0.85rem', outline: 'none' },
  saveNoteBtn: { padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', backgroundColor: '#b45309', color: '#fff', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' },
  
  readFooter: { padding: '1.5rem', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc' },
  replyLink: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', backgroundColor: '#3b82f6', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 600, transition: 'background-color 0.2s' },
  
  emptyState: { padding: '3rem 1rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }
};
