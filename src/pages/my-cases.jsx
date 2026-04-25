import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'
import { useToast } from '../context/ToastContext'
import { PlusCircle, Briefcase, Calendar, Trash2, FileText, Bell, ChevronDown, ChevronUp, Edit3, X, Check } from 'lucide-react'

const STATUS_COLORS = { active:'var(--green)', pending:'var(--gold)', closed:'var(--txt-3)' }

export default function MyCases() {
  const { isLoggedIn, token } = useAuth()
  const router = useRouter()
  const { showToast } = useToast()
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ title:'', courtName:'', caseNumber:'', nextHearingDate:'', notes:'' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { if (!isLoggedIn) router.push('/login') }, [isLoggedIn])

  useEffect(() => {
    if (!isLoggedIn) return
    fetchCases()
  }, [isLoggedIn])

  const fetchCases = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/my-cases', { headers:{ Authorization:`Bearer ${token}` } })
      const data = await res.json()
      setCases(data.cases || [])
    } catch { showToast('Failed to load cases', 'error') }
    finally { setLoading(false) }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.title.trim()) { showToast('Case title is required', 'error'); return }
    setSubmitting(true)
    try {
      const res = await fetch('/api/my-cases', {
        method: editingId ? 'PUT' : 'POST',
        headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
        body: JSON.stringify(editingId ? { id:editingId, ...form } : form)
      })
      const data = await res.json()
      if (!res.ok) { showToast(data.error || 'Error saving case', 'error'); return }
      showToast(editingId ? 'Case updated!' : 'Case added!', 'success')
      setShowForm(false); setEditingId(null)
      setForm({ title:'', courtName:'', caseNumber:'', nextHearingDate:'', notes:'' })
      fetchCases()
    } catch { showToast('Something went wrong', 'error') }
    finally { setSubmitting(false) }
  }

  const handleDelete = async id => {
    if (!confirm('Delete this case?')) return
    try {
      await fetch(`/api/my-cases?id=${id}`, { method:'DELETE', headers:{ Authorization:`Bearer ${token}` } })
      showToast('Case deleted', 'success')
      setCases(prev => prev.filter(c => c._id !== id))
    } catch { showToast('Failed to delete', 'error') }
  }

  const startEdit = c => {
    setEditingId(c._id)
    setForm({ title:c.title, courtName:c.courtName||'', caseNumber:c.caseNumber||'', nextHearingDate:c.nextHearingDate ? c.nextHearingDate.split('T')[0] : '', notes:c.notes||'' })
    setShowForm(true)
  }

  const getDaysUntil = dateStr => {
    if (!dateStr) return null
    const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000*60*60*24))
    return diff
  }

  if (!isLoggedIn) return null

  return (
    <div className="page-wrap" style={{background:'#F8F9FA'}}>
      <Head>
        <title>My Cases — Case Tracker — Justice Junction 24/7</title>
        <meta name="description" content="Track your legal cases, court dates, and hearing schedules on Justice Junction 24/7." />
      </Head>

      <div className="container" style={{padding:'2.5rem 5vw'}}>
        <div style={s.pageHeader}>
          <div>
            <h1 style={s.h1}>My Cases</h1>
            <p style={{color:'var(--txt-3)', fontSize:'.9rem', margin:0}}>Track your legal matters and court hearing schedules</p>
          </div>
          <button className="btn btn-primary btn-lg" onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ title:'', courtName:'', caseNumber:'', nextHearingDate:'', notes:'' }) }}>
            <PlusCircle size={18}/> {showForm && !editingId ? 'Cancel' : 'Add Case'}
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div style={s.formCard}>
            <h3 style={{fontFamily:"'Playfair Display',serif", fontSize:'1.3rem', marginBottom:'1.5rem'}}>
              {editingId ? 'Edit Case' : 'Add New Case'}
            </h3>
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className="form-group"><label>Case Title *</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. Property dispute vs. ABC Builders" required/></div>
                <div className="form-group"><label>Court Name</label><input value={form.courtName} onChange={e=>setForm({...form,courtName:e.target.value})} placeholder="e.g. Delhi High Court"/></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Case Number</label><input value={form.caseNumber} onChange={e=>setForm({...form,caseNumber:e.target.value})} placeholder="e.g. CS/1234/2025"/></div>
                <div className="form-group"><label>Next Hearing Date</label><input type="date" value={form.nextHearingDate} onChange={e=>setForm({...form,nextHearingDate:e.target.value})}/></div>
              </div>
              <div className="form-group"><label>Notes</label><textarea rows={3} value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Any additional notes about the case..."/></div>
              <div style={{display:'flex', gap:10}}>
                <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}><Check size={18}/>{submitting ? 'Saving...' : editingId ? 'Update Case' : 'Add Case'}</button>
                <button type="button" className="btn btn-ghost btn-lg" onClick={() => { setShowForm(false); setEditingId(null) }}><X size={18}/> Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Cases List */}
        {loading ? (
          <div style={{textAlign:'center', padding:'4rem', color:'var(--txt-3)'}}>Loading your cases...</div>
        ) : cases.length === 0 ? (
          <div style={s.emptyState}>
            <Briefcase size={56} color="var(--border-2)" strokeWidth={1}/>
            <h3 style={{marginTop:'1.5rem', marginBottom:8}}>No cases yet</h3>
            <p style={{color:'var(--txt-3)', marginBottom:'2rem'}}>Add your first case to start tracking hearings and deadlines.</p>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}><PlusCircle size={16}/> Add Your First Case</button>
          </div>
        ) : (
          <div style={{display:'flex', flexDirection:'column', gap:'1.2rem'}}>
            {cases.map(c => {
              const daysUntil = getDaysUntil(c.nextHearingDate)
              const isUrgent = daysUntil !== null && daysUntil <= 2 && daysUntil >= 0
              return (
                <div key={c._id} style={{...s.caseCard, borderColor: isUrgent ? 'var(--red)' : 'var(--border)'}}>
                  <div style={s.caseHeader}>
                    <div style={{flex:1}}>
                      <div style={{display:'flex', alignItems:'center', gap:10, flexWrap:'wrap'}}>
                        <h3 style={{fontSize:'1.1rem', fontWeight:800, margin:0}}>{c.title}</h3>
                        <span style={{...s.statusBadge, background:STATUS_COLORS[c.status]}}>{c.status}</span>
                        {isUrgent && <span style={s.urgentBadge}><Bell size={12}/> Hearing in {daysUntil} day{daysUntil!==1?'s':''}</span>}
                      </div>
                      <div style={{display:'flex', gap:'1.5rem', marginTop:8, flexWrap:'wrap'}}>
                        {c.courtName && <span style={s.metaChip}><Briefcase size={13}/>{c.courtName}</span>}
                        {c.caseNumber && <span style={s.metaChip}><FileText size={13}/>{c.caseNumber}</span>}
                        {c.nextHearingDate && (
                          <span style={{...s.metaChip, color: isUrgent ? 'var(--red)' : 'var(--txt-3)'}}>
                            <Calendar size={13}/>
                            Next hearing: {new Date(c.nextHearingDate).toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric'})}
                            {daysUntil !== null && ` (${daysUntil > 0 ? `in ${daysUntil} days` : daysUntil === 0 ? 'TODAY' : 'passed'})`}
                          </span>
                        )}
                      </div>
                      {c.notes && <p style={{fontSize:'.85rem', color:'var(--txt-3)', marginTop:8, marginBottom:0}}>{c.notes}</p>}
                    </div>
                    <div style={{display:'flex', gap:8}}>
                      <button onClick={() => startEdit(c)} style={s.actionBtn} title="Edit"><Edit3 size={16}/></button>
                      <button onClick={() => handleDelete(c._id)} style={{...s.actionBtn, color:'var(--red)'}} title="Delete"><Trash2 size={16}/></button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Tip Card */}
        {cases.length > 0 && (
          <div style={s.tipCard}>
            <Bell size={18} color="var(--gold)"/>
            <div>
              <div style={{fontWeight:700, fontSize:'.9rem', marginBottom:4}}>Hearing Reminders</div>
              <p style={{fontSize:'.8rem', color:'var(--txt-3)', margin:0}}>Cases with hearing dates within 2 days are highlighted in red. Enable browser notifications to get automatic reminders.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const s = {
  pageHeader: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'2rem', gap:'1rem', flexWrap:'wrap' },
  h1: { fontFamily:"'Playfair Display',serif", fontSize:'2.2rem', fontWeight:800, margin:0, marginBottom:4 },
  formCard: { background:'#fff', padding:'2.5rem', borderRadius:'24px', border:'1px solid var(--border)', marginBottom:'2rem', boxShadow:'0 8px 30px rgba(0,0,0,0.06)' },
  caseCard: { background:'#fff', padding:'1.8rem', borderRadius:'16px', border:'1.5px solid', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' },
  caseHeader: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'1rem' },
  statusBadge: { padding:'.2rem .7rem', borderRadius:'50px', fontSize:'.68rem', fontWeight:800, color:'#fff', textTransform:'uppercase', letterSpacing:'.05em' },
  urgentBadge: { display:'inline-flex', alignItems:'center', gap:4, background:'var(--red-l)', color:'var(--red)', padding:'.25rem .7rem', borderRadius:'50px', fontSize:'.7rem', fontWeight:800 },
  metaChip: { display:'inline-flex', alignItems:'center', gap:5, fontSize:'.8rem', color:'var(--txt-3)', fontWeight:600 },
  actionBtn: { width:36, height:36, borderRadius:'10px', border:'1px solid var(--border)', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--txt-3)', transition:'all .2s' },
  emptyState: { background:'#fff', border:'2px dashed var(--border)', borderRadius:'24px', padding:'5rem 2rem', textAlign:'center' },
  tipCard: { marginTop:'2rem', background:'var(--gold-p)', border:'1px solid var(--gold)', borderRadius:'16px', padding:'1.2rem 1.5rem', display:'flex', gap:'1rem', alignItems:'flex-start' },
}
