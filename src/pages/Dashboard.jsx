import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API } from '../api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

function fmt(d) { return new Date(d).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) }
function initials(name) { return (name||'?').split(' ').slice(0,2).map(p=>p[0]).join('').toUpperCase() }

function StatusBadge({ status }) {
  const map = { pending:{bg:'rgba(201,148,58,0.12)',color:'#C9943A'}, confirmed:{bg:'rgba(45,122,79,0.1)',color:'#2D7A4F'}, completed:{bg:'rgba(123,29,46,0.08)',color:'#7B1D2E'}, cancelled:{bg:'#FEE2E2',color:'#B91C1C'} }
  const c = map[status] || map.pending
  return <span style={{padding:'0.2rem 0.7rem',borderRadius:50,fontSize:'0.7rem',fontWeight:700,textTransform:'uppercase',background:c.bg,color:c.color}}>{status}</span>
}

/* ─── CLIENT DASHBOARD ─── */
function ClientDash() {
  const [bookings, setBookings] = useState([])
  const [updates, setUpdates]   = useState([])
  const [tab, setTab]           = useState('bookings')
  const [loading, setLoading]   = useState(true)
  const { showToast }           = useToast()

  useEffect(() => {
    API.myBookings().then(d => { setBookings(d.bookings); setLoading(false) }).catch(e => showToast(e.message,'error'))
  }, [])

  useEffect(() => {
    if (tab === 'updates') API.myUpdates().then(d => setUpdates(d.updates)).catch(e => showToast(e.message,'error'))
  }, [tab])

  const stats = [
    [bookings.length, 'Total Bookings'],
    [bookings.filter(b=>b.status==='confirmed').length, 'Confirmed'],
    [bookings.filter(b=>b.status==='completed').length, 'Completed'],
    [`₹${bookings.reduce((a,b)=>a+b.fee,0).toLocaleString()}`, 'Total Invested']
  ]

  return (
    <div>
      <div style={s.statsRow}>
        {stats.map(([num,label]) => (
          <div key={label} style={s.statCard}><div style={s.statNum}>{num}</div><div style={s.statLabel}>{label}</div></div>
        ))}
      </div>

      <div style={s.tabs}>
        {[['bookings','📋 My Bookings'],['updates','📡 Case Updates']].map(([id,label]) => (
          <button key={id} onClick={() => setTab(id)} style={{...s.tab, ...(tab===id ? s.tabActive : {})}}>{label}</button>
        ))}
      </div>

      {tab === 'bookings' && (
        <div style={s.section}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.2rem'}}>
            <h3 style={{fontWeight:700}}>My Bookings</h3>
            <Link to="/search" className="btn-primary" style={{fontSize:'0.78rem',padding:'0.35rem 0.9rem'}}>+ New Booking</Link>
          </div>
          {loading ? <div className="spinner-wrap"><div className="spinner"></div></div> :
          bookings.length === 0 ? (
            <div style={s.empty}><div style={{fontSize:'2.5rem',marginBottom:12}}>📋</div><p>No bookings yet.</p><Link to="/search" className="btn-primary" style={{marginTop:12,display:'inline-block'}}>Find a Lawyer</Link></div>
          ) : bookings.map(b => (
            <div key={b._id} style={s.bookingItem}>
              <div style={s.biIcon}>⚖️</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:'0.9rem'}}>{b.lawyerName}</div>
                <div style={{fontSize:'0.78rem',color:'var(--text-muted)',marginTop:2}}>{b.caseType} · {fmt(b.scheduledDate)} at {b.scheduledTime}</div>
                <div style={{fontSize:'0.78rem',color:'var(--text-muted)',marginTop:2}}>Case # {b.caseNumber} · Fee: ₹{b.fee.toLocaleString()}</div>
                {b.meetingLink && <a href={b.meetingLink} target="_blank" rel="noreferrer" style={{fontSize:'0.78rem',color:'var(--burgundy)',fontWeight:600,marginTop:4,display:'inline-block'}}>📹 Join Video Call</a>}
              </div>
              <StatusBadge status={b.status} />
            </div>
          ))}
        </div>
      )}

      {tab === 'updates' && (
        <div style={s.section}>
          <h3 style={{fontWeight:700,marginBottom:'1.2rem'}}>Case Updates</h3>
          {updates.length === 0 ? (
            <div style={s.empty}><div style={{fontSize:'2.5rem',marginBottom:12}}>📡</div><p>No updates yet. Your lawyer will post updates here.</p></div>
          ) : (
            <div>
              {updates.map((u,i) => (
                <div key={u._id} style={s.updateItem}>
                  <div style={{...s.udot, background: u.status==='done'?'var(--green)':u.status==='active'?'var(--burgundy)':'var(--border)', color:'#fff', border:'none', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.6rem', fontWeight:700}}>
                    {u.status==='done'?'✓':u.status==='active'?'●':''}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:'0.9rem'}}>{u.title}</div>
                    <div style={{fontSize:'0.8rem',color:'var(--text-muted)',marginTop:2}}>{u.description}</div>
                    <div style={{fontSize:'0.72rem',color:'var(--text-light)',marginTop:2}}>Case #{u.caseNumber} · {fmt(u.createdAt)} · {u.stage}</div>
                    {u.nextHearing && <div style={{fontSize:'0.78rem',color:'var(--burgundy)',fontWeight:600,marginTop:2}}>📅 Next Hearing: {fmt(u.nextHearing)}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ─── LAWYER DASHBOARD ─── */
function LawyerDash() {
  const [bookings, setBookings]   = useState([])
  const [tab, setTab]             = useState('bookings')
  const [loading, setLoading]     = useState(true)
  const [upForm, setUpForm]       = useState({ bookingId:'', title:'', description:'', stage:'consultation', status:'active', nextHearing:'' })
  const { showToast }             = useToast()

  const load = () => {
    setLoading(true)
    API.myBookings().then(d => { setBookings(d.bookings); setLoading(false) }).catch(e => { showToast(e.message,'error'); setLoading(false) })
  }

  useEffect(() => { load() }, [])

  const updateStatus = async (id, status) => {
    try { await API.updateStatus(id, status); showToast(`Marked as ${status}`); load() }
    catch (err) { showToast(err.message,'error') }
  }

  const postUpdate = async () => {
    if (!upForm.bookingId||!upForm.title||!upForm.description) { showToast('Fill all required fields','error'); return }
    try {
      await API.postUpdate(upForm)
      showToast('Case update posted!')
      setUpForm({ bookingId:'', title:'', description:'', stage:'consultation', status:'active', nextHearing:'' })
    } catch (err) { showToast(err.message,'error') }
  }

  const stats = [
    [bookings.length,'Total Clients'],
    [bookings.filter(b=>b.status==='pending').length,'Pending'],
    [bookings.filter(b=>b.status==='confirmed').length,'Confirmed'],
    [`₹${bookings.filter(b=>b.status!=='cancelled').reduce((a,b)=>a+b.fee,0).toLocaleString()}`,'Total Earned']
  ]

  return (
    <div>
      <div style={s.statsRow}>
        {stats.map(([num,label]) => (
          <div key={label} style={s.statCard}><div style={s.statNum}>{num}</div><div style={s.statLabel}>{label}</div></div>
        ))}
      </div>

      <div style={s.tabs}>
        {[['bookings','📋 Client Bookings'],['post','✏️ Post Case Update']].map(([id,label]) => (
          <button key={id} onClick={() => setTab(id)} style={{...s.tab,...(tab===id?s.tabActive:{})}}>{label}</button>
        ))}
      </div>

      {tab === 'bookings' && (
        <div style={s.section}>
          <h3 style={{fontWeight:700,marginBottom:'1.2rem'}}>Client Bookings</h3>
          {loading ? <div className="spinner-wrap"><div className="spinner"></div></div> :
          bookings.length === 0 ? (
            <div style={s.empty}><div style={{fontSize:'2.5rem',marginBottom:12}}>📋</div><p>No client bookings yet. Your profile is live!</p></div>
          ) : bookings.map(b => (
            <div key={b._id} style={s.bookingItem}>
              <div style={s.biIcon}>👤</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:'0.9rem'}}>{b.clientName}</div>
                <div style={{fontSize:'0.78rem',color:'var(--text-muted)',marginTop:2}}>{b.caseType} · {fmt(b.scheduledDate)} at {b.scheduledTime}</div>
                <div style={{fontSize:'0.78rem',color:'var(--text-muted)',marginTop:2}}>Case # {b.caseNumber} · ₹{b.fee.toLocaleString()}</div>
                {b.description && <div style={{fontSize:'0.78rem',color:'var(--text-muted)',marginTop:4,fontStyle:'italic'}}>"{b.description.slice(0,80)}{b.description.length>80?'...':''}"</div>}
                {b.meetingLink && <a href={b.meetingLink} target="_blank" rel="noreferrer" style={{fontSize:'0.78rem',color:'var(--burgundy)',fontWeight:600,marginTop:4,display:'inline-block'}}>📹 Join Video Call</a>}
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:6,alignItems:'flex-end'}}>
                <StatusBadge status={b.status} />
                {b.status==='pending' && <button className="btn-primary" style={{fontSize:'0.72rem',padding:'0.3rem 0.7rem'}} onClick={() => updateStatus(b._id,'confirmed')}>Confirm</button>}
                {b.status==='confirmed' && <button className="btn-outline" style={{fontSize:'0.72rem',padding:'0.3rem 0.7rem'}} onClick={() => updateStatus(b._id,'completed')}>Mark Done</button>}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'post' && (
        <div style={s.section}>
          <h3 style={{fontWeight:700,marginBottom:'1.2rem'}}>Post Case Update</h3>
          <div style={{background:'var(--cream)',border:'1px solid var(--border)',borderRadius:12,padding:'1.5rem'}}>
            <div className="form-group">
              <label>Select Booking / Case</label>
              <select value={upForm.bookingId} onChange={e => setUpForm(f=>({...f,bookingId:e.target.value}))}>
                <option value="">— Select a booking —</option>
                {bookings.map(b => <option key={b._id} value={b._id}>{b.caseNumber} — {b.clientName} ({b.caseType})</option>)}
              </select>
            </div>
            <div className="form-group"><label>Update Title</label><input type="text" placeholder="e.g. Documents Filed with Court" value={upForm.title} onChange={e=>setUpForm(f=>({...f,title:e.target.value}))} /></div>
            <div className="form-group">
              <label>Details</label>
              <textarea rows="3" placeholder="Describe what happened in the case today..." value={upForm.description} onChange={e=>setUpForm(f=>({...f,description:e.target.value}))}
                style={{width:'100%',padding:'0.7rem 1rem',border:'1.5px solid var(--border)',borderRadius:8,fontSize:'0.92rem',color:'var(--text)',outline:'none',resize:'vertical',fontFamily:'Nunito,sans-serif'}} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Stage</label>
                <select value={upForm.stage} onChange={e=>setUpForm(f=>({...f,stage:e.target.value}))}>
                  {['consultation','filing','hearing','judgment','appeal','closed'].map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={upForm.status} onChange={e=>setUpForm(f=>({...f,status:e.target.value}))}>
                  <option value="done">Done</option>
                  <option value="active">Active / Current</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
            <div className="form-group"><label>Next Hearing Date (optional)</label><input type="date" value={upForm.nextHearing} onChange={e=>setUpForm(f=>({...f,nextHearing:e.target.value}))} /></div>
            <button className="btn-primary" onClick={postUpdate}>Post Update →</button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── MAIN DASHBOARD ─── */
export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div className="page-wrap" style={{paddingTop:70}}>
      <div className="grid-dashboard" style={s.wrap}>
        {/* Sidebar */}
        <div style={s.sidebar}>
          <div style={s.sbUser}>
            <div style={s.sbAvatar}>{initials(user?.name)}</div>
            <div style={{fontWeight:700,fontSize:'0.95rem'}}>{user?.name}</div>
            <div style={{fontSize:'0.75rem',color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.08em'}}>{user?.role==='lawyer'?'⚖ Advocate':'👤 Client'}</div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:4}}>
            <Link to="/search" style={s.sbLink}>🔍 Find Lawyers</Link>
            <Link to="/dashboard" style={s.sbLink}>📋 Dashboard</Link>
            <button onClick={handleLogout} style={{...s.sbLink,background:'none',border:'none',cursor:'pointer',textAlign:'left',color:'#B91C1C',fontFamily:'Nunito,sans-serif',fontSize:'0.88rem'}}>🚪 Logout</button>
          </div>
        </div>

        {/* Main Content */}
        <div style={s.main}>
          <div style={{marginBottom:'1.5rem'}}>
            <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.7rem',fontWeight:700}}>Welcome, {user?.name?.split(' ')[0]}! 👋</h1>
            <p style={{color:'var(--text-muted)',fontSize:'0.88rem'}}>
              {user?.role==='lawyer' ? 'Manage your clients and case updates below.' : "Here's what's happening with your account."}
            </p>
          </div>
          {user?.role === 'lawyer' ? <LawyerDash /> : <ClientDash />}
        </div>
      </div>
    </div>
  )
}

const s = {
  wrap: { display:'grid', gridTemplateColumns:'220px 1fr', minHeight:'calc(100vh - 70px)' },
  sidebar: { background:'#fff', borderRight:'1px solid var(--border)', padding:'2rem 1.2rem' },
  sbUser: { textAlign:'center', paddingBottom:'1.5rem', borderBottom:'1px solid var(--border)', marginBottom:'1.5rem' },
  sbAvatar: { width:56, height:56, borderRadius:'50%', background:'var(--burgundy)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Playfair Display',serif", fontSize:'1.3rem', fontWeight:700, margin:'0 auto 0.7rem' },
  sbLink: { display:'flex', alignItems:'center', gap:8, padding:'0.65rem 1rem', borderRadius:10, fontSize:'0.88rem', fontWeight:600, color:'var(--text-muted)', textDecoration:'none', transition:'background 0.2s' },
  main: { padding:'2.5rem', background:'var(--cream)' },
  statsRow: { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:12, marginBottom:'1.5rem' },
  statCard: { background:'#fff', border:'1px solid var(--border)', borderRadius:12, padding:'1.2rem' },
  statNum: { fontFamily:"'Playfair Display',serif", fontSize:'1.8rem', fontWeight:700, color:'var(--burgundy)', lineHeight:1 },
  statLabel: { fontSize:'0.75rem', color:'var(--text-muted)', marginTop:4, fontWeight:600 },
  tabs: { display:'flex', gap:8, marginBottom:'1.5rem' },
  tab: { padding:'0.55rem 1.2rem', border:'1.5px solid var(--border)', borderRadius:50, fontSize:'0.85rem', fontWeight:600, cursor:'pointer', background:'#fff', color:'var(--text-muted)', fontFamily:'Nunito,sans-serif', transition:'all 0.2s' },
  tabActive: { background:'var(--burgundy)', color:'#fff', borderColor:'var(--burgundy)' },
  section: { background:'#fff', border:'1px solid var(--border)', borderRadius:16, padding:'1.5rem' },
  bookingItem: { display:'flex', gap:12, alignItems:'flex-start', padding:'1rem 0', borderBottom:'1px solid var(--border)' },
  biIcon: { width:40, height:40, borderRadius:10, background:'rgba(123,29,46,0.08)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', flexShrink:0 },
  updateItem: { display:'flex', gap:12, padding:'0.9rem 0', borderBottom:'1px solid var(--border)' },
  udot: { width:22, height:22, borderRadius:'50%', flexShrink:0, marginTop:2, border:'2px solid var(--border)' },
  empty: { textAlign:'center', padding:'3rem', color:'var(--text-muted)' }
}
