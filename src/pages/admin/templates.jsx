import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Plus, Edit, Trash2, FileText } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function AdminTemplates() {
  const { user, isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoggedIn || user?.role !== 'admin') { navigate('/admin/login'); return }
    fetch('/api/documents/templates', { headers: { Authorization: `Bearer ${localStorage.getItem('jj_token')}` } })
      .then(r => r.json())
      .then(data => { setTemplates(data.templates || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const deleteTemplate = async (id) => {
    if (!confirm('Delete this template?')) return
    await fetch(`/api/documents/templates/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('jj_token')}` } })
    setTemplates(ts => ts.filter(t => t._id !== id))
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f4f0', padding: '2rem' }}>
      <Helmet><title>Document Templates — Admin | Justice Junction</title></Helmet>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontWeight: 900, fontSize: '1.8rem', color: '#1A0A0D' }}>Document Templates</h1>
            <p style={{ color: '#888' }}>Manage legal document templates for users</p>
          </div>
          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plus size={18} /> Add Template
          </button>
        </div>
        {loading ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center' }}><div className="spinner" /></div>
        ) : templates.length === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
            <FileText size={48} color="#ddd" style={{ marginBottom: '1rem' }} />
            <p style={{ color: '#888' }}>No templates found. Create your first document template.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {templates.map(t => (
              <div key={t._id} className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(123,29,46,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={20} color="#7B1D2E" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#1A0A0D' }}>{t.title}</div>
                    <div style={{ color: '#888', fontSize: '.85rem' }}>{t.category} · {t.fields?.length || 0} fields</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-sm btn-outline"><Edit size={14} /></button>
                  <button className="btn btn-sm" style={{ background: '#fee2e2', color: '#dc2626', border: 'none' }} onClick={() => deleteTemplate(t._id)}><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
