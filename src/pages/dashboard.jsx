import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { API } from '../api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { ClipboardList, Activity, Scale, Video, User, Search, LayoutDashboard, LogOut, Edit3, Briefcase, FileText, Upload, Plus, Trash2 } from 'lucide-react'
import Head from 'next/head'

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
  const [trackerCases, setTrackerCases] = useState([])
  const [tab, setTab]           = useState('bookings')
  const [loading, setLoading]   = useState(true)
  const [showAddCase, setShowAddCase] = useState(false)
  const [newCase, setNewCase] = useState({ caseNumber: '', courtName: '', lawyerName: '', status: 'Active', nextHearing: '' })
  const { showToast }           = useToast()

  useEffect(() => {
    API.myBookings().then(d => { setBookings(d.bookings || []); setLoading(false) }).catch(e => showToast(e.message,'error'))
    const saved = localStorage.getItem('jj_case_tracker')
    if (saved) setTrackerCases(JSON.parse(saved))
  }, [])

  useEffect(() => {
    if (tab === 'updates') API.myUpdates().then(d => setUpdates(d.updates || [])).catch(e => showToast(e.message,'error'))
  }, [tab])

  useEffect(() => {
    localStorage.setItem('jj_case_tracker', JSON.stringify(trackerCases))
  }, [trackerCases])

  const addCase = () => {
    if (!newCase.caseNumber || !newCase.courtName) { showToast('Case number and court name required','error'); return }
    setTrackerCases([...trackerCases, { ...newCase, id: Date.now(), lastUpdate: new Date().toISOString() }])
    setNewCase({ caseNumber: '', courtName: '', lawyerName: '', status: 'Active', nextHearing: '' })
    setShowAddCase(false)
    showToast('Case added to tracker')
  }

  const deleteCase = (id) => {
    if (window.confirm("Remove case from tracker?")) {
      setTrackerCases(trackerCases.filter(c => c.id !== id))
    }
  }

  const stats = [
    [bookings.length, 'Total Bookings'],
    [trackerCases.length, 'Tracked Cases'],
    [bookings.filter(b=>b.status==='completed').length, 'Resolved'],
    [`₹${bookings.reduce((a,b)=>a+(b.fee||0),0).toLocaleString()}`, 'Spent']
  ]

  return (
    <div>
      <div style={s.statsRow}>
        {stats.map(([num,label]) => (
          <div key={label} style={s.statCard}><div style={s.statNum}>{num}</div><div style={s.statLabel}>{label}</div></div>
        ))}
      </div>

      <div style={s.tabs}>
        {[
          ['bookings',<ClipboardList size={16}/>,'My Bookings'],
          ['tracker',<Briefcase size={16}/>,'Case Tracker'],
          ['updates',<Activity size={16}/>,'Case Updates']
        ].map(([id,icon,label]) => (
          <button key={id} onClick={() => setTab(id)} style={{...s.tab, ...(tab===id ? s.tabActive : {})}}><span style={{display:'flex'}}>{icon}</span>{label}</button>
        ))}
      </div>

      {tab === 'bookings' && (
        <div style={s.section} className="dash-section-responsive">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.2rem'}}>
            <h3 style={{fontWeight:800}}>My Bookings</h3>
            <Link href="/search" className="btn btn-primary btn-sm">+ New Booking</Link>
          </div>
          {loading ? <div className="spinner-wrap"><div className="spinner"></div></div> :
          bookings.length === 0 ? (
            <div style={s.empty}><div style={{color:'var(--txt-3)',display:'flex',justifyContent:'center',marginBottom:12}}><ClipboardList size={40}/></div><p>No bookings yet.</p><Link href="/search" className="btn btn-primary" style={{marginTop:12,display:'inline-block'}}>Find a Lawyer</Link></div>
          ) : bookings.map(b => (
            <div key={b._id} style={s.bookingItem} className="case-card-premium">
              <div style={s.biIcon}><Scale size={20} color="var(--bur)" /></div>
              <div style={{flex:1}}>
                <div style={{fontWeight:800,fontSize:'.95rem'}}>{b.lawyerName}</div>
                <div style={{fontSize:'0.78rem',color:'var(--txt-3)',marginTop:2}}>{b.caseType} · {fmt(b.scheduledDate)} at {b.scheduledTime}</div>
                <div style={{fontSize:'0.78rem',color:'var(--txt-3)',marginTop:2}}>Case # {b.caseNumber} · Fee: ₹{(b.fee||0).toLocaleString()}</div>
                {b.meetingLink && <a href={b.meetingLink} target="_blank" rel="noreferrer" style={{fontSize:'0.8rem',color:'var(--bur)',fontWeight:800,marginTop:8,display:'inline-flex',alignItems:'center',gap:4, background: 'var(--cream-2)', padding: '.4rem .8rem', borderRadius: 8}}><Video size={14}/>Join Video Call</a>}
              </div>
              <StatusBadge status={b.status} />
            </div>
          ))}
        </div>
      )}

      {tab === 'tracker' && (
        <div style={s.section} className="dash-section-responsive">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
            <h3 style={{fontWeight:800}}>Personal Case Tracker</h3>
            <button className="btn btn-primary btn-sm" onClick={() => setShowAddCase(true)}><Plus size={16}/> Add Case</button>
          </div>

          {showAddCase && (
            <div style={s.addForm}>
              <div style={s.formGrid} className="dash-form-grid-responsive">
                <div className="form-group"><label>Case Number</label><input value={newCase.caseNumber} onChange={e=>setNewCase({...newCase, caseNumber:e.target.value})} placeholder="e.g. CNR: DLCT01-000..."/></div>
                <div className="form-group"><label>Court Name</label><input value={newCase.courtName} onChange={e=>setNewCase({...newCase, courtName:e.target.value})} placeholder="e.g. Saket District Court"/></div>
                <div className="form-group"><label>Opposite Party / Advocate</label><input value={newCase.lawyerName} onChange={e=>setNewCase({...newCase, lawyerName:e.target.value})} /></div>
                <div className="form-group"><label>Current Status</label><select value={newCase.status} onChange={e=>setNewCase({...newCase, status:e.target.value})}><option>Active</option><option>Hearing</option><option>Judgment Pending</option><option>Resolved</option></select></div>
                <div className="form-group"><label>Next Hearing / Reminder</label><input type="date" value={newCase.nextHearing} onChange={e=>setNewCase({...newCase, nextHearing:e.target.value})} /></div>
              </div>
              <div style={{display:'flex', gap:10, marginTop:'1.5rem'}}>
                <button className="btn btn-primary" onClick={addCase}>Save Case</button>
                <button className="btn btn-outline" onClick={() => setShowAddCase(false)}>Cancel</button>
              </div>
            </div>
          )}

          {trackerCases.length === 0 ? (
            <div style={s.empty}><Briefcase size={40} style={{marginBottom:12, opacity:0.3}}/><p>No manual cases added yet. Track your offline cases here.</p></div>
          ) : (
            <div style={{display:'flex', flexDirection:'column', gap:12}}>
              {trackerCases.map(c => (
                <div key={c.id} style={s.trackerItem}>
                  <div style={s.biIcon}><Briefcase size={20} color="var(--bur)" /></div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:800, fontSize:'.95rem'}}>{c.caseNumber}</div>
                    <div style={{fontSize:'.8rem', color:'var(--txt-3)'}}>{c.courtName} · {c.lawyerName || 'Advocate not specified'}</div>
                    {c.nextHearing && <div style={{fontSize:'.8rem', color:'var(--bur)', fontWeight:800, marginTop:4}}>📅 Next Hearing: {fmt(c.nextHearing)}</div>}
                    <div style={{display:'flex', gap:10, marginTop:10}}>
                      <button style={s.docBtn} onClick={() => showToast('Simulating document upload...')}>
                        <Upload size={14}/> Upload Documents
                      </button>
                    </div>
                  </div>
                  <div style={{textAlign:'right', display:'flex', flexDirection:'column', alignItems:'flex-end', gap:10}}>
                    <span style={{padding:'.2rem .8rem', background:'var(--bur-l)', color:'#fff', borderRadius:50, fontSize:'.7rem', fontWeight:800}}>{c.status}</span>
                    <button style={{background:'none', border:'none', color:'var(--red)', cursor:'pointer'}} onClick={() => deleteCase(c.id)}><Trash2 size={16}/></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'updates' && (
        <div style={s.section} className="dash-section-responsive">
          <h3 style={{fontWeight:800,marginBottom:'1.2rem'}}>Verified Case Updates</h3>
          {updates.length === 0 ? (
            <div style={s.empty}><div style={{color:'var(--txt-3)',display:'flex',justifyContent:'center',marginBottom:12}}><Activity size={40}/></div><p>No updates yet. Your lawyer will post updates here.</p></div>
          ) : (
            <div>
              {updates.map((u,i) => (
                <div key={u._id} style={s.updateItem}>
                  <div style={{...s.udot, background: u.status==='done'?'var(--green)':u.status==='active'?'var(--bur)':'var(--border)', color:'#fff', border:'none', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.6rem', fontWeight:700}}>
                    {u.status==='done'?'✓':u.status==='active'?'●':''}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:800,fontSize:'1rem'}}>{u.title}</div>
                    <div style={{fontSize:'0.9rem',color:'var(--txt-2)',marginTop:4, lineHeight:1.6}}>{u.description}</div>
                    <div style={{fontSize:'0.75rem',color:'var(--txt-3)',marginTop:6, fontWeight:600}}>Case #{u.caseNumber} · {fmt(u.createdAt)} · {u.stage}</div>
                    {u.nextHearing && <div style={{fontSize:'0.85rem',color:'var(--bur)',fontWeight:800,marginTop:8, display:'inline-flex', alignItems:'center', gap:4}}><Calendar size={14}/> Next Hearing: {fmt(u.nextHearing)}</div>}
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
    API.myBookings().then(d => { setBookings(d.bookings || []); setLoading(false) }).catch(e => { showToast(e.message,'error'); setLoading(false) })
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
    [`₹${bookings.filter(b=>b.status!=='cancelled').reduce((a,b)=>a+(b.fee||0),0).toLocaleString()}`,'Total Earned']
  ]

  return (
    <div>
      <div style={s.statsRow}>
        {stats.map(([num,label]) => (
          <div key={label} style={s.statCard}><div style={s.statNum}>{num}</div><div style={s.statLabel}>{label}</div></div>
        ))}
      </div>

      <div style={s.tabs}>
        {[
          ['bookings',<ClipboardList size={16}/>,'Client Bookings'],
          ['post',<Edit3 size={16}/>,'Post Case Update'],
          ['profile',<User size={16}/>,'Practice Settings']
        ].map(([id,icon,label]) => (
          <button key={id} onClick={() => setTab(id)} style={{...s.tab,...(tab===id?s.tabActive:{})}}><span style={{display:'flex'}}>{icon}</span>{label}</button>
        ))}
      </div>

      {tab === 'bookings' && (
        <div style={s.section} className="dash-section-responsive">
          <h3 style={{fontWeight:800,marginBottom:'1.2rem'}}>Client Bookings</h3>
          {loading ? <div className="spinner-wrap"><div className="spinner"></div></div> :
          bookings.length === 0 ? (
            <div style={s.empty}><div style={{color:'var(--txt-3)',display:'flex',justifyContent:'center',marginBottom:12}}><ClipboardList size={40}/></div><p>No client bookings yet. Your profile is live!</p></div>
          ) : bookings.map(b => (
            <div key={b._id} style={s.bookingItem} className="case-card-premium">
              <div style={s.biIcon}><User size={20} color="var(--bur)" /></div>
              <div style={{flex:1}}>
                <div style={{fontWeight:800,fontSize:'.95rem'}}>{b.clientName}</div>
                <div style={{fontSize:'0.78rem',color:'var(--txt-3)',marginTop:2}}>{b.caseType} · {fmt(b.scheduledDate)} at {b.scheduledTime}</div>
                <div style={{fontSize:'0.78rem',color:'var(--txt-3)',marginTop:2}}>Case # {b.caseNumber} · ₹{(b.fee||0).toLocaleString()}</div>
                {b.description && <div style={{fontSize:'0.82rem',color:'var(--txt-2)',marginTop:6,fontStyle:'italic', background:'var(--cream-2)', padding: '8px', borderRadius: 8}}>"{b.description.slice(0,120)}{b.description.length>120?'...':''}"</div>}
                {b.meetingLink && <a href={b.meetingLink} target="_blank" rel="noreferrer" style={{fontSize:'0.8rem',color:'var(--bur)',fontWeight:800,marginTop:12,display:'inline-flex',alignItems:'center',gap:4, background:'var(--cream-2)', padding:'.4rem .8rem', borderRadius: 8}}><Video size={14}/>Join Video Call</a>}
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:8,alignItems:'flex-end'}}>
                <StatusBadge status={b.status} />
                {b.status==='pending' && <button className="btn btn-primary btn-sm" style={{fontSize:'0.72rem'}} onClick={() => updateStatus(b._id,'confirmed')}>Confirm</button>}
                {b.status==='confirmed' && <button className="btn btn-outline btn-sm" style={{fontSize:'0.72rem'}} onClick={() => updateStatus(b._id,'completed')}>Mark Done</button>}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'post' && (
        <div style={s.section} className="dash-section-responsive">
          <h3 style={{fontWeight:800,marginBottom:'1.5rem'}}>Post Case Update</h3>
          <div style={{background:'var(--cream-2)',border:'1px solid var(--border)',borderRadius:16,padding:'2rem'}}>
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
              <textarea rows="4" placeholder="Describe what happened in the case today..." value={upForm.description} onChange={e=>setUpForm(f=>({...f,description:e.target.value}))}
                style={{width:'100%',padding:'0.8rem 1rem',border:'1.5px solid var(--border)',borderRadius:12,fontSize:'0.92rem',color:'var(--text)',outline:'none',resize:'vertical',fontFamily:'Plus Jakarta Sans,sans-serif'}} />
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem'}} className="dash-form-grid-responsive">
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
            <button className="btn btn-primary btn-lg" style={{width:'100%', marginTop:'1rem'}} onClick={postUpdate}>Post Update to Client →</button>
          </div>
        </div>
      )}

      {tab === 'profile' && (
        <div style={s.section} className="dash-section-responsive">
          <h3 style={{fontWeight:800,marginBottom:'1.2rem'}}>Practice Settings</h3>
          <p style={{color:'var(--txt-3)', marginBottom:'2rem'}}>Update your specialization, fee, and availability status.</p>
          <div style={{background:'var(--cream-2)', border:'1px solid var(--border)', borderRadius:16, padding:'2rem', textAlign:'center'}}>
            <User size={48} color="var(--bur)" style={{marginBottom:16}}/>
            <h4 style={{marginBottom:8}}>Profile Management</h4>
            <p style={{fontSize:'.9rem', color:'var(--txt-3)', marginBottom:'1.5rem'}}>Manage your public profile information, bar registration details, and practice areas.</p>
            <button className="btn btn-outline" onClick={() => showToast('Profile editor coming soon...')}>Edit Practice Details</button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── MAIN DASHBOARD ─── */
export default function Dashboard() {
  const { user, isLoggedIn, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (router.isReady && !isLoggedIn) {
      router.replace('/login')
    }
  }, [isLoggedIn, router.isReady])

  if (!isLoggedIn) return null

  const handleLogout = () => { logout(); router.push('/') }

  return (
    <div className="page-reveal" style={{ paddingTop: 95, background: '#F8F9FA', minHeight: '100vh' }}>
      <Head>
        <title>My Dashboard — Justice Junction 24/7</title>
      </Head>
      <div className="container" style={{ maxWidth: 1400 }}>
        
        {/* Personalized Welcome Banner */}
        <div className="section-bg-abstract parallax" style={{ borderRadius: 32, padding: '4rem 3rem', marginBottom: '3rem', color: '#fff', position: 'relative', overflow: 'hidden', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div className="tag" style={{ background: 'var(--gold)', color: '#000', border: 'none', marginBottom: '1rem' }}>Active Session</div>
            <h1 className="boutique-heading" style={{ fontSize: '3rem', color: '#fff', fontStyle: 'normal', marginBottom: 8 }}>Welcome, {user?.name?.split(' ')[0]}!</h1>
            <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
              {user?.role === 'lawyer' ? 'Your legal practice is flourishing. 4 new inquiries today.' : "Your legal matters are being handled. 2 updates pending review."}
            </p>
          </div>
          <div className="hide-mobile" style={{ textAlign: 'right', position: 'relative', zIndex: 2 }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'Sora, sans-serif' }}>{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
            <div style={{ fontSize: '.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, opacity: 0.8 }}>System Status: Operational</div>
          </div>
        </div>

        <div className="grid-dashboard" style={s.wrap}>
          {/* Sidebar */}
          <div style={{ ...s.sidebar, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.5)' }}>
            <div style={s.sbUser}>
              <div style={s.sbAvatar}>{initials(user?.name)}</div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: 2 }}>{user?.name}</div>
              <div style={s.sbRoleBadge}>
                {user?.role === 'lawyer' ? <><Scale size={12} /> Advocate</> : <><User size={12} /> Client</>}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Link href="/dashboard" style={{ ...s.sbLink, ...(router.pathname === '/dashboard' ? s.sbLinkActive : {}) }}><LayoutDashboard size={18} /> Dashboard</Link>
              <Link href="/search" style={s.sbLink}><Search size={18} /> Browse Lawyers</Link>
              <Link href="/knowledge-hub" style={s.sbLink}><FileText size={18} /> Knowledge Hub</Link>
              <div style={{ margin: '1.5rem 0', height: 1, background: 'var(--border)' }} />
              <button onClick={handleLogout} style={{ ...s.sbLink, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', color: '#B91C1C' }}><LogOut size={18} /> Logout</button>
            </div>
          </div>

          {/* Main Content */}
          <div style={s.main}>
            {user?.role === 'lawyer' ? <LawyerDash /> : <ClientDash />}
          </div>
        </div>
      </div>
    </div>
  )
}

const s = {
  wrap: { display:'grid', gridTemplateColumns:'260px 1fr', gap:'2rem', paddingBottom:'5rem' },
  sidebar: { background:'#fff', border:'1px solid var(--border)', borderRadius:'24px', padding:'2.5rem 1.5rem', height:'fit-content', position:'sticky', top:110, boxShadow:'0 10px 30px rgba(0,0,0,0.02)' },
  sbUser: { textAlign:'center', paddingBottom:'1.5rem', borderBottom:'1px solid var(--border)', marginBottom:'1.5rem' },
  sbAvatar: { width:64, height:64, borderRadius:'20px', background:'linear-gradient(135deg, var(--bur), var(--bur-d))', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Playfair Display',serif", fontSize:'1.5rem', fontWeight:800, margin:'0 auto 1rem' },
  sbRoleBadge: { fontSize:'0.7rem', color:'var(--txt-3)', textTransform:'uppercase', letterSpacing:'1px', fontWeight:800, display:'flex', justifyContent:'center', alignItems:'center', gap:4, background: 'var(--cream-2)', padding: '.3rem .6rem', borderRadius: 50, width: 'fit-content', margin: '0 auto' },
  sbLink: { display:'flex', alignItems:'center', gap:10, padding:'0.8rem 1.2rem', borderRadius:14, fontSize:'0.9rem', fontWeight:700, color:'var(--txt-2)', textDecoration:'none', transition:'all 0.2s' },
  sbLinkActive: { background:'var(--bur)', color:'#fff', boxShadow:'0 4px 15px rgba(123,29,46,0.2)' },
  
  main: { minWidth: 0 },
  hTitle: { fontFamily:"'Playfair Display',serif", fontSize:'2.2rem', fontWeight:800, lineHeight: 1 },
  statsRow: { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'1.2rem', marginBottom:'2rem' },
  statCard: { background:'#fff', border:'1px solid var(--border)', borderRadius:'20px', padding:'1.8rem', boxShadow:'0 10px 30px rgba(0,0,0,0.02)' },
  statNum: { fontFamily:"Sora, sans-serif", fontSize:'2.2rem', fontWeight:800, color:'var(--bur)', lineHeight:1 },
  statLabel: { fontSize:'0.8rem', color:'var(--txt-3)', marginTop:8, fontWeight:700, textTransform: 'uppercase', letterSpacing: '1px' },
  
  tabs: { display:'flex', gap:10, marginBottom:'2rem', flexWrap:'wrap' },
  tab: { display:'flex', alignItems:'center', gap:8, padding:'0.7rem 1.4rem', border:'1.5px solid var(--border)', borderRadius:50, fontSize:'.9rem', fontWeight:700, cursor:'pointer', background:'#fff', color:'var(--txt-2)', fontFamily:'inherit', transition:'all 0.2s' },
  tabActive: { background:'var(--bur)', color:'#fff', borderColor:'var(--bur)', boxShadow:'0 4px 12px rgba(123,29,46,0.15)' },
  
  section: { background:'#fff', border:'1px solid var(--border)', borderRadius:'28px', padding:'2.5rem', boxShadow:'0 10px 40px rgba(0,0,0,0.02)' },
  bookingItem: { display:'flex', gap:16, alignItems:'center', padding:'1.2rem 0', borderBottom:'1px solid var(--border)' },
  biIcon: { width:48, height:48, borderRadius:14, background:'var(--cream-2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
  trackerItem: { display:'flex', gap:16, alignItems:'center', padding:'1.5rem', background: 'var(--cream-2)', borderRadius: 20, border: '1px solid var(--border)' },
  docBtn: { display: 'flex', alignItems: 'center', gap: 6, fontSize: '.75rem', fontWeight: 800, padding: '.4rem .8rem', borderRadius: 8, border: '1px solid var(--border)', background: '#fff', cursor: 'pointer' },
  addForm: { background:'var(--cream-2)', padding:'2rem', borderRadius:20, marginBottom:'2rem', border:'1px solid var(--border)' },
  formGrid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.2rem' },
  
  updateItem: { display:'flex', gap:16, padding:'1.5rem 0', borderBottom:'1px solid var(--border)' },
  udot: { width:24, height:24, borderRadius:'50%', flexShrink:0, marginTop:4 },
  empty: { textAlign:'center', padding:'4rem 2rem', color:'var(--txt-3)' }
}
