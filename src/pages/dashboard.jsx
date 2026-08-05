import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate, useLocation } from 'react-router-dom'
import { API } from '../api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { ClipboardList, Activity, Scale, Video, User, Search, LayoutDashboard, LogOut, Edit3, Briefcase, FileText, Upload, Plus, Trash2, BarChart2, CheckCircle, XCircle, MinusCircle, Calendar } from 'lucide-react'
import { Helmet } from 'react-helmet-async'

function fmt(d) { return new Date(d).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) }
function initials(name) { return (name||'?').split(' ').slice(0,2).map(p=>p[0]).join('').toUpperCase() }

const CASE_TYPES = ['Criminal Defence','Family Law','Property Law','Corporate Law','Consumer Rights','Labour Law','Civil Disputes','Divorce','Taxation','Intellectual Property','Cyber Law','Bail & FIR']

function StatusBadge({ status }) {
  const map = { pending:{bg:'rgba(201,148,58,0.15)',color:'#C9943A'}, confirmed:{bg:'rgba(22, 163, 74, 0.15)',color:'#16A34A'}, completed:{bg:'rgba(123,29,46,0.15)',color:'#7B1D2E'}, cancelled:{bg:'#FEE2E2',color:'#B91C1C'} }
  const c = map[status] || map.pending
  return <span style={{padding:'0.3rem 0.8rem',borderRadius:50,fontSize:'0.75rem',fontWeight:800,textTransform:'uppercase',background:c.bg,color:c.color, letterSpacing: '0.5px'}}>{status}</span>
}

/* ─── CLIENT DASHBOARD ─── */
function ClientDash() {
  const [bookings, setBookings] = useState([])
  const [updates, setUpdates]   = useState([])
  const [trackerCases, setTrackerCases] = useState([])
  const [cases, setCases]       = useState([])
  const [docs, setDocs]         = useState([])
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
      <style>{`
        .stat-card-premium {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 2.2rem;
          box-shadow: 0 15px 35px rgba(0,0,0,0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .stat-card-premium:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 45px rgba(0, 0, 0, 0.5);
          border-color: rgba(255, 255, 255, 0.2);
        }
        .case-card-premium {
          display: flex;
          gap: 24px;
          align-items: center;
          padding: 1.8rem;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.08);
          margin-bottom: 1.2rem;
          box-shadow: 0 8px 25px rgba(0,0,0,0.2);
          transition: all 0.3s ease;
        }
        .case-card-premium:hover {
          box-shadow: 0 15px 35px rgba(0,0,0,0.4);
          border-color: rgba(255,255,255,0.15);
          transform: scale(1.01);
        }
        .doc-btn-premium {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          font-weight: 800;
          padding: 0.6rem 1.2rem;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.05);
          color: #F5E6D3;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .doc-btn-premium:hover {
          background: rgba(255,255,255,0.15);
          color: #fff;
          border-color: rgba(255,255,255,0.3);
        }
        .dash-tabs-container {
          display: flex;
          gap: 8px;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
          background: rgba(255, 255, 255, 0.05);
          padding: 0.5rem;
          border-radius: 50px;
          width: fit-content;
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .dash-tab-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0.8rem 1.8rem;
          border: none;
          border-radius: 50px;
          font-size: 0.95rem;
          font-weight: 800;
          cursor: pointer;
          background: transparent;
          color: #E5D0E3;
          font-family: inherit;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .dash-tab-btn.active {
          background: var(--gold);
          color: #1A0A0D;
          box-shadow: 0 8px 25px rgba(201,148,58,0.3);
        }
        .dash-tab-btn:not(.active):hover {
          background: rgba(255,255,255,0.1);
          color: #fff;
        }
        .form-input-premium {
          width: 100%;
          padding: 1rem 1.2rem;
          border: 1.5px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          font-size: 0.95rem;
          font-family: inherit;
          background: rgba(255,255,255,0.05);
          transition: all 0.2s ease;
          color: #fff;
        }
        .form-input-premium:focus {
          border-color: var(--gold);
          box-shadow: 0 0 0 4px rgba(201,148,58,0.15);
          outline: none;
          background: rgba(255,255,255,0.1);
        }
        .video-join-btn {
          font-size: 0.85rem;
          color: #1A0A0D !important;
          font-weight: 800;
          margin-top: 12px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--gold);
          padding: 0.7rem 1.4rem;
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 6px 20px rgba(201,148,58,0.25);
        }
        .video-join-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(201,148,58,0.4);
        }
        .update-timeline-node {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          color: #1A0A0D;
          font-weight: 800;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          position: relative;
          z-index: 2;
        }
      `}</style>
      
      <div style={s.statsRow}>
        {stats.map(([num,label]) => (
          <div key={label} className="stat-card-premium">
            <div style={s.statNum}>{num}</div>
            <div style={s.statLabel}>{label}</div>
          </div>
        ))}
      </div>

      <div className="dash-tabs-container">
        {[
          ['bookings',<ClipboardList size={18}/>,'My Bookings'],
          ['tracker',<Briefcase size={18}/>,'Case Tracker'],
          ['cases',<FileText size={18}/>,'My Cases'],
          ['documents',<FileText size={18}/>,'Documents'],
          ['updates',<Activity size={18}/>,'Case Updates'],
          ['settings',<User size={18}/>,'Settings']
        ].map(([id,icon,label]) => (
          <button key={id} onClick={() => setTab(id)} className={`dash-tab-btn ${tab === id ? 'active' : ''}`}>
            {icon}{label}
          </button>
        ))}
      </div>

      {tab === 'bookings' && (
        <div style={s.section} className="dash-section-responsive">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'2rem'}}>
            <h3 style={s.hTitle}>My Bookings</h3>
            <Link to="/search" className="btn btn-primary">+ New Booking</Link>
          </div>
          {loading ? <div className="spinner-wrap"><div className="spinner" style={{borderColor: '#7B1D2E', borderTopColor: 'transparent'}}></div></div> :
          bookings.length === 0 ? (
            <div style={s.empty}><div style={{color:'#C9943A',display:'flex',justifyContent:'center',marginBottom:16}}><ClipboardList size={56} style={{opacity:0.5}}/></div><p style={{fontSize:'1.1rem', fontWeight:600}}>No bookings yet.</p><Link to="/search" className="btn btn-primary" style={{marginTop:16,display:'inline-block'}}>Find a Lawyer</Link></div>
          ) : bookings.map(b => (
            <div key={b._id} className="case-card-premium">
              <div style={s.biIcon}><Scale size={24} color="#7B1D2E" /></div>
              <div style={{flex:1}}>
                <div style={{fontWeight:800,fontSize:'1.1rem', color:'#1A0A0D', marginBottom:4}}>{b.lawyerName}</div>
                <div style={{fontSize:'0.85rem',color:'#5A3A42', fontWeight:600}}>{b.caseType} &nbsp;&bull;&nbsp; {fmt(b.scheduledDate)} at {b.scheduledTime}</div>
                <div style={{fontSize:'0.85rem',color:'#5A3A42', fontWeight:600, marginTop:4}}>Case # {b.caseNumber} &nbsp;&bull;&nbsp; Fee: ₹{(b.fee||0).toLocaleString()}</div>
                {b.meetingLink && <a href={b.meetingLink} target="_blank" rel="noreferrer" style={{fontSize:'0.85rem',color:'#fff',fontWeight:800,marginTop:16,display:'inline-flex',alignItems:'center',gap:8, background:'#7B1D2E', padding:'.7rem 1.4rem', borderRadius: 12, textDecoration:'none', boxShadow:'0 6px 20px rgba(123, 29, 46, 0.25)'}}><Video size={16}/> Join Video Consultation</a>}
              </div>
              <StatusBadge status={b.status} />
            </div>
          ))}
        </div>
      )}

      {tab === 'tracker' && (
        <div style={s.section} className="dash-section-responsive">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'2rem'}}>
            <h3 style={s.hTitle}>Personal Case Tracker</h3>
            <button className="btn btn-primary" onClick={() => setShowAddCase(true)}><Plus size={18}/> Add Case</button>
          </div>

          {showAddCase && (
            <div style={s.addForm}>
              <h4 style={{marginBottom:'1.5rem', fontWeight:800}}>Track a New Case</h4>
              <div style={s.formGrid} className="dash-form-grid-responsive">
                <div className="form-group"><label>Case Number</label><input className="form-input-premium" value={newCase.caseNumber} onChange={e=>setNewCase({...newCase, caseNumber:e.target.value})} placeholder="e.g. CNR: DLCT01-000..."/></div>
                <div className="form-group"><label>Court Name</label><input className="form-input-premium" value={newCase.courtName} onChange={e=>setNewCase({...newCase, courtName:e.target.value})} placeholder="e.g. Saket District Court"/></div>
                <div className="form-group"><label>Opposite Party / Advocate</label><input className="form-input-premium" value={newCase.lawyerName} onChange={e=>setNewCase({...newCase, lawyerName:e.target.value})} placeholder="Name..."/></div>
                <div className="form-group"><label>Current Status</label><select className="form-input-premium" value={newCase.status} onChange={e=>setNewCase({...newCase, status:e.target.value})}><option>Active</option><option>Hearing</option><option>Judgment Pending</option><option>Resolved</option></select></div>
                <div className="form-group"><label>Next Hearing / Reminder</label><input className="form-input-premium" type="date" value={newCase.nextHearing} onChange={e=>setNewCase({...newCase, nextHearing:e.target.value})} /></div>
              </div>
              <div style={{display:'flex', gap:12, marginTop:'2rem'}}>
                <button className="btn btn-primary" onClick={addCase}>Save Case</button>
                <button className="btn btn-outline" onClick={() => setShowAddCase(false)}>Cancel</button>
              </div>
            </div>
          )}

          {trackerCases.length === 0 ? (
            <div style={s.empty}><Briefcase size={56} style={{marginBottom:16, opacity:0.3}}/><p style={{fontSize:'1.1rem', fontWeight:600}}>No manual cases added yet.<br/>Track your offline cases here.</p></div>
          ) : (
            <div style={{display:'flex', flexDirection:'column', gap:16}}>
              {trackerCases.map(c => (
                <div key={c.id} className="case-card-premium">
                  <div style={s.biIcon}><Briefcase size={24} color="#7B1D2E" /></div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:800, fontSize:'1.1rem', marginBottom:4, color:'#1A0A0D'}}>{c.caseNumber}</div>
                    <div style={{fontSize:'.85rem', color:'#5A3A42', fontWeight:600}}>{c.courtName} &nbsp;&bull;&nbsp; {c.lawyerName || 'Advocate not specified'}</div>
                    {c.nextHearing && <div style={{fontSize:'.85rem', color:'#7B1D2E', fontWeight:800, marginTop:8, display:'inline-flex', alignItems:'center', gap:6, background: 'rgba(123, 29, 46, 0.05)', padding: '0.4rem 0.8rem', borderRadius: 8}}><Calendar size={14}/> Next Hearing: {fmt(c.nextHearing)}</div>}
                    <div style={{display:'flex', gap:10, marginTop:16}}>
                      <button className="btn btn-outline" onClick={() => showToast('Simulating document upload...')}>
                        <Upload size={16}/> Upload Documents
                      </button>
                    </div>
                  </div>
                  <div style={{textAlign:'right', display:'flex', flexDirection:'column', alignItems:'flex-end', gap:12}}>
                    <span style={{padding:'.3rem 1rem', background:'rgba(123, 29, 46, 0.05)', color:'#7B1D2E', borderRadius:50, fontSize:'.75rem', fontWeight:800}}>{c.status}</span>
                    <button style={{background:'none', border:'none', color:'#DC2626', cursor:'pointer', padding: 8, background: 'rgba(220,38,38,0.1)', borderRadius: 12}} onClick={() => deleteCase(c.id)}><Trash2 size={18}/></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'cases' && (
        <div style={s.section} className="dash-section-responsive">
          <h3 style={{...s.hTitle, marginBottom:'2rem'}}>My Case Tracker</h3>
          {loading ? <div className="spinner-wrap"><div className="spinner" style={{borderColor: '#7B1D2E', borderTopColor: 'transparent'}}></div></div> : 
          cases.length === 0 ? (
            <div style={s.empty}>
              <div style={{color:'#C9943A', display:'flex', justifyContent:'center', marginBottom:16}}><FileText size={56} style={{opacity:0.5}}/></div>
              <p style={{fontSize:'1.1rem', fontWeight:600}}>You have no active cases.<br/>Book a lawyer to get started.</p>
            </div>
          ) : cases.map(c => (
            <div key={c._id} className="case-card-premium">
              <div style={s.biIcon}><Scale size={24} color="#7B1D2E" /></div>
              <div style={{flex: 1}}>
                <div style={{fontWeight:800, fontSize:'1.1rem', color:'#1A0A0D', marginBottom:4}}>{c.caseType}</div>
                <div style={{fontSize:'0.85rem', color:'#5A3A42', fontWeight:600}}>Lawyer: {c.lawyerName}</div>
                <div style={{fontSize:'0.85rem', color:'#5A3A42', fontWeight:600, marginTop:4}}>Case # {c.caseNumber} &nbsp;&bull;&nbsp; {fmt(c.scheduledDate)}</div>
                
                {c.meetingLink && (
                  <a href={c.meetingLink} target="_blank" rel="noreferrer" style={{fontSize:'0.85rem', color:'#fff', fontWeight:800, marginTop:16, display:'inline-flex', alignItems:'center', gap:8, background:'#7B1D2E', padding:'.7rem 1.4rem', borderRadius: 12, textDecoration:'none', boxShadow:'0 6px 20px rgba(123, 29, 46, 0.25)'}}>
                    <Video size={16}/> Join Consultation Call
                  </a>
                )}
                
                {c.updates?.length > 0 && (
                  <div style={{marginTop: 16, background: '#FDF6EE', padding: '16px', borderRadius: 12, border: '1px solid rgba(123, 29, 46, 0.05)'}}>
                    <div style={{fontSize:'.75rem', textTransform:'uppercase', fontWeight:800, color:'#C9943A', marginBottom:8}}>Latest Update</div>
                    <div style={{fontWeight:700, fontSize:'.9rem', color:'#1A0A0D'}}>{c.updates[c.updates.length-1].title}</div>
                    <div style={{fontSize:'.85rem', color:'#5A3A42', marginTop:4}}>{c.updates[c.updates.length-1].description}</div>
                  </div>
                )}
              </div>
              <div style={{display:'flex', flexDirection:'column', gap:12, alignItems:'flex-end'}}>
                <StatusBadge status={c.status} />
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'documents' && (
        <div style={s.section} className="dash-section-responsive">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem'}}>
            <h3 style={s.hTitle}>My Documents</h3>
            <button className="btn btn-primary" onClick={() => navigate('/document-generator')}>
              <Plus size={18}/> Generate Legal Document
            </button>
          </div>
          {loading ? <div className="spinner-wrap"><div className="spinner" style={{borderColor: '#7B1D2E', borderTopColor: 'transparent'}}></div></div> :
          docs.length === 0 ? (
            <div style={s.empty}>
              <div style={{color:'#C9943A', display:'flex', justifyContent:'center', marginBottom:16}}><FileText size={56} style={{opacity:0.5}}/></div>
              <p style={{fontSize:'1.1rem', fontWeight:600}}>No documents generated yet.</p>
            </div>
          ) : docs.map(d => (
            <div key={d._id} className="case-card-premium">
              <div style={s.biIcon}><FileText size={24} color="#7B1D2E" /></div>
              <div style={{flex: 1}}>
                <div style={{fontWeight:800, fontSize:'1.1rem', color:'#1A0A0D', marginBottom:4}}>{d.title}</div>
                <div style={{fontSize:'0.85rem', color:'#5A3A42', fontWeight:600}}>Created {fmt(d.createdAt)}</div>
              </div>
              <div style={{display:'flex', gap:12}}>
                <button className="btn btn-outline" style={{padding: '0.6rem 1.2rem'}} onClick={() => window.open(d.fileUrl, '_blank')}><Download size={16}/> Download</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'updates' && (
        <div style={s.section} className="dash-section-responsive">
          <h3 style={{...s.hTitle, marginBottom:'2rem'}}>Verified Case Updates</h3>
          {updates.length === 0 ? (
            <div style={s.empty}><div style={{color:'#C9943A',display:'flex',justifyContent:'center',marginBottom:16}}><Activity size={56} style={{opacity:0.5}}/></div><p style={{fontSize:'1.1rem', fontWeight:600}}>No updates yet.<br/>Your lawyer will post updates here.</p></div>
          ) : (
            <div style={{position: 'relative', paddingLeft: 20}}>
              <div style={{position: 'absolute', left: 35, top: 20, bottom: 20, width: 2, background: 'rgba(123,29,46,0.1)', zIndex: 0}} />
              {updates.map((u,i) => (
                <div key={u._id} className="case-card-premium" style={{position: 'relative', zIndex: 1, gap: 24}}>
                  <div style={{width: 32, height: 32, borderRadius: '50%', background: u.status==='done'?'#7B1D2E':'#fff', color: u.status==='done'?'#fff':'#7B1D2E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, border: '2px solid #7B1D2E', zIndex: 2}}>
                    {u.status==='done'?'✓':'●'}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:800,fontSize:'1.1rem', color: '#1A0A0D', marginBottom: 6}}>{u.title}</div>
                    <div style={{fontSize:'0.95rem',color:'#5A3A42', lineHeight:1.6}}>{u.description}</div>
                    <div style={{fontSize:'0.8rem',color:'#5A3A42',marginTop:12, fontWeight:700, textTransform: 'uppercase', letterSpacing: '0.5px'}}>
                      Case #{u.caseNumber} &nbsp;&bull;&nbsp; {fmt(u.createdAt)} &nbsp;&bull;&nbsp; Stage: {u.stage}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'settings' && (
        <div style={s.section} className="dash-section-responsive">
          <h3 style={{...s.hTitle, marginBottom:'1.5rem'}}>Account Settings</h3>
          <div style={{background:'#FDF6EE', border:'1px solid rgba(123, 29, 46, 0.05)', borderRadius:24, padding:'3rem', boxShadow: '0 10px 30px rgba(123, 29, 46, 0.05)'}}>
            <div className="form-group" style={{marginBottom: '1.5rem'}}>
              <label style={{color: '#5A3A42'}}>Full Name</label>
              <input className="form-input-premium" type="text" value={user?.name||''} readOnly style={{opacity: 0.8}} />
            </div>
            <div className="form-group" style={{marginBottom: '1.5rem'}}>
              <label style={{color: '#5A3A42'}}>Email Address</label>
              <input className="form-input-premium" type="email" value={user?.email||''} readOnly style={{opacity: 0.8}} />
            </div>
            <div className="form-group" style={{marginBottom: '2rem'}}>
              <label style={{color: '#5A3A42'}}>Phone Number</label>
              <input className="form-input-premium" type="text" placeholder="Update your phone number" />
            </div>
            <button className="btn btn-primary" style={{padding: '0.8rem 2rem'}}>Save Changes</button>
          </div>
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
  const [outcomeForm, setOutcomeForm] = useState({ caseType:'', outcome:'won', durationDays:'', dateClosed:'' })
  const [submittingOutcome, setSubmittingOutcome] = useState(false)
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

  const logOutcome = async () => {
    if (!outcomeForm.caseType || !outcomeForm.outcome || !outcomeForm.durationDays || !outcomeForm.dateClosed) {
      showToast('Please fill all fields','error'); return
    }
    setSubmittingOutcome(true)
    try {
      const token = localStorage.getItem('jj_token')
      const res = await fetch('/api/ai/log-outcome', { credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseType:    outcomeForm.caseType,
          outcome:     outcomeForm.outcome,
          durationDays: parseInt(outcomeForm.durationDays),
          dateClosed:  outcomeForm.dateClosed
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to log outcome')
      showToast('Case outcome logged successfully!')
      setOutcomeForm({ caseType:'', outcome:'won', durationDays:'', dateClosed:'' })
    } catch (err) { showToast(err.message,'error') }
    finally { setSubmittingOutcome(false) }
  }

  const stats = [
    [bookings.length,'Total Clients'],
    [bookings.filter(b=>b.status==='pending').length,'Pending'],
    [bookings.filter(b=>b.status==='confirmed').length,'Confirmed'],
    [`₹${bookings.filter(b=>b.status!=='cancelled').reduce((a,b)=>a+(b.fee||0),0).toLocaleString()}`,'Total Earned']
  ]

  return (
    <div>
      <style>{`
        .dash-tabs-container {
          display: flex;
          gap: 8px;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
          background: rgba(255, 255, 255, 0.05);
          padding: 0.5rem;
          border-radius: 50px;
          width: fit-content;
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .dash-tab-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0.8rem 1.8rem;
          border: none;
          border-radius: 50px;
          font-size: 0.95rem;
          font-weight: 800;
          cursor: pointer;
          background: transparent;
          color: #E5D0E3;
          font-family: inherit;
          transition: all 0.3s ease;
        }
        .dash-tab-btn.active {
          background: #C9943A;
          color: #1A0A0D;
          box-shadow: 0 8px 25px rgba(201,148,58,0.3);
        }
        .dash-tab-btn:not(.active):hover {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }
        .stat-card-premium {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 2.2rem;
          transition: all 0.3s ease;
        }
        .stat-card-premium:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.4);
          border-color: rgba(255, 255, 255, 0.2);
        }
        .case-card-premium {
          display: flex;
          gap: 24px;
          align-items: center;
          padding: 1.8rem;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          margin-bottom: 1.2rem;
          transition: all 0.3s ease;
        }
        .case-card-premium:hover {
          box-shadow: 0 12px 30px rgba(0,0,0,0.3);
          border-color: rgba(255, 255, 255, 0.15);
          transform: scale(1.01);
        }
        .form-input-premium {
          width: 100%;
          padding: 1rem 1.2rem;
          border: 1.5px solid rgba(123, 29, 46, 0.1);
          border-radius: 16px;
          font-size: 0.95rem;
          font-family: inherit;
          background: #FDF6EE;
          color: #1A0A0D;
          transition: all 0.2s ease;
        }
        .form-input-premium:focus {
          border-color: #7B1D2E;
          box-shadow: 0 0 0 4px rgba(123, 29, 46, 0.1);
          outline: none;
          background: #fff;
        }
      `}</style>
      <div style={s.statsRow}>
        {stats.map(([num,label]) => (
          <div key={label} className="stat-card-premium"><div style={s.statNum}>{num}</div><div style={s.statLabel}>{label}</div></div>
        ))}
      </div>

      <div className="dash-tabs-container">
        {[
          ['bookings',<ClipboardList size={18}/>,'Client Bookings'],
          ['post',<Edit3 size={18}/>,'Post Case Update'],
          ['outcome',<BarChart2 size={18}/>,'Log Outcome'],
          ['profile',<User size={18}/>,'Practice Settings']
        ].map(([id,icon,label]) => (
          <button key={id} onClick={() => setTab(id)} className={`dash-tab-btn ${tab === id ? 'active' : ''}`}>{icon}{label}</button>
        ))}
      </div>

      {tab === 'bookings' && (
        <div style={s.section} className="dash-section-responsive">
          <h3 style={{...s.hTitle, marginBottom:'2rem'}}>Client Bookings</h3>
          {loading ? <div className="spinner-wrap"><div className="spinner" style={{borderColor: '#7B1D2E', borderTopColor: 'transparent'}}></div></div> :
          bookings.length === 0 ? (
            <div style={s.empty}><div style={{color:'#C9943A',display:'flex',justifyContent:'center',marginBottom:16}}><ClipboardList size={56} style={{opacity:0.5}}/></div><p style={{fontSize:'1.1rem', fontWeight:600}}>No client bookings yet.<br/>Your profile is live!</p></div>
          ) : bookings.map(b => (
            <div key={b._id} className="case-card-premium">
              <div style={s.biIcon}><User size={24} color="#7B1D2E" /></div>
              <div style={{flex:1}}>
                <div style={{fontWeight:800,fontSize:'1.1rem', color:'#1A0A0D', marginBottom:4}}>{b.clientName}</div>
                <div style={{fontSize:'0.85rem',color:'#5A3A42', fontWeight:600}}>{b.caseType} &nbsp;&bull;&nbsp; {fmt(b.scheduledDate)} at {b.scheduledTime}</div>
                <div style={{fontSize:'0.85rem',color:'#5A3A42', fontWeight:600, marginTop:4}}>Case # {b.caseNumber} &nbsp;&bull;&nbsp; ₹{(b.fee||0).toLocaleString()}</div>
                {b.description && <div style={{fontSize:'0.9rem',color:'#5A3A42', marginTop:12,fontStyle:'italic', background:'#FDF6EE', padding: '12px 16px', borderRadius: 12, borderLeft: '4px solid #7B1D2E'}}>"{b.description.slice(0,120)}{b.description.length>120?'...':''}"</div>}
                {b.meetingLink && <a href={b.meetingLink} target="_blank" rel="noreferrer" style={{fontSize:'0.85rem',color:'#fff',fontWeight:800,marginTop:16,display:'inline-flex',alignItems:'center',gap:8, background:'#7B1D2E', padding:'.7rem 1.4rem', borderRadius: 12, textDecoration:'none', boxShadow:'0 6px 20px rgba(123, 29, 46, 0.25)'}}><Video size={16}/>Join Video Call</a>}
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:12,alignItems:'flex-end'}}>
                <StatusBadge status={b.status} />
                {b.status==='pending' && <button className="btn btn-primary" style={{padding: '0.6rem 1.2rem'}} onClick={() => updateStatus(b._id,'confirmed')}>Confirm</button>}
                {b.status==='confirmed' && <button className="btn btn-outline" style={{padding: '0.6rem 1.2rem'}} onClick={() => updateStatus(b._id,'completed')}>Mark Done</button>}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'post' && (
        <div style={s.section} className="dash-section-responsive">
          <h3 style={{...s.hTitle, marginBottom:'2rem'}}>Post Case Update</h3>
          <div style={{background:'#FDF6EE', border:'1px solid rgba(123, 29, 46, 0.05)', borderRadius:24, padding:'3rem', boxShadow: '0 10px 30px rgba(123, 29, 46, 0.05)'}}>
            <div className="form-group">
              <label style={{color: '#5A3A42'}}>Select Booking / Case</label>
              <select className="form-input-premium" value={upForm.bookingId} onChange={e => setUpForm(f=>({...f,bookingId:e.target.value}))}>
                <option value="">— Select a booking —</option>
                {bookings.map(b => <option key={b._id} value={b._id}>{b.caseNumber} — {b.clientName} ({b.caseType})</option>)}
              </select>
            </div>
            <div className="form-group" style={{marginTop:'1.5rem'}}><label style={{color: '#5A3A42'}}>Update Title</label><input className="form-input-premium" type="text" placeholder="e.g. Documents Filed with Court" value={upForm.title} onChange={e=>setUpForm(f=>({...f,title:e.target.value}))} /></div>
            <div className="form-group" style={{marginTop:'1.5rem'}}>
              <label style={{color: '#5A3A42'}}>Details</label>
              <textarea rows="4" placeholder="Describe what happened in the case today..." value={upForm.description} onChange={e=>setUpForm(f=>({...f,description:e.target.value}))}
                className="form-input-premium" style={{resize:'vertical'}} />
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem', marginTop:'1.5rem'}} className="dash-form-grid-responsive">
              <div className="form-group">
                <label style={{color: '#5A3A42'}}>Stage</label>
                <select className="form-input-premium" value={upForm.stage} onChange={e=>setUpForm(f=>({...f,stage:e.target.value}))}>
                  {['consultation','filing','hearing','judgment','appeal','closed'].map(st=><option key={st}>{st}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label style={{color: '#5A3A42'}}>Status</label>
                <select className="form-input-premium" value={upForm.status} onChange={e=>setUpForm(f=>({...f,status:e.target.value}))}>
                  <option value="done">Done</option>
                  <option value="active">Active / Current</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
            <div className="form-group" style={{marginTop:'1.5rem'}}><label style={{color: '#5A3A42'}}>Next Hearing Date (optional)</label><input className="form-input-premium" type="date" value={upForm.nextHearing} onChange={e=>setUpForm(f=>({...f,nextHearing:e.target.value}))} /></div>
            <button className="btn btn-primary btn-lg" style={{width:'100%', marginTop:'2.5rem', padding:'1.2rem', fontSize:'1.1rem'}} onClick={postUpdate}>Post Update to Client →</button>
          </div>
        </div>
      )}

      {tab === 'outcome' && (
        <div style={s.section} className="dash-section-responsive">
          <h3 style={{...s.hTitle, marginBottom:'0.5rem'}}>Log Closed Case Outcome</h3>
          <p style={{color:'#5A3A42', fontSize:'.95rem',marginBottom:'2rem', fontWeight:600}}>Record outcomes of closed cases to help build platform-wide statistics for clients.</p>
          <div style={{background:'#FDF6EE', border:'1px solid rgba(123, 29, 46, 0.05)', borderRadius:24, padding:'3rem', boxShadow: '0 10px 30px rgba(123, 29, 46, 0.05)'}}>

            <div className="form-group">
              <label style={{color: '#5A3A42'}}>Case Type / Practice Area</label>
              <select className="form-input-premium" value={outcomeForm.caseType} onChange={e=>setOutcomeForm(f=>({...f,caseType:e.target.value}))}>
                <option value="">— Select case type —</option>
                {CASE_TYPES.map(ct=><option key={ct} value={ct}>{ct}</option>)}
              </select>
            </div>

            <div className="form-group" style={{marginTop:'1.5rem'}}>
              <label style={{color: '#5A3A42'}}>Outcome</label>
              <div style={{display:'flex',gap:16,flexWrap:'wrap',marginTop:8}}>
                {[['won','Won',<CheckCircle size={18}/>,'#22C55E','#F0FDF4'],['lost','Lost',<XCircle size={18}/>,'#EF4444','#FEF2F2'],['settled','Settled',<MinusCircle size={18}/>,'#F59E0B','#FFFBEB']].map(
                  ([val,label,icon,color,bg])=>(
                    <label key={val} style={{display:'flex',alignItems:'center',gap:10,padding:'.8rem 1.6rem',borderRadius:50,border:`2px solid ${outcomeForm.outcome===val?color:'rgba(123, 29, 46, 0.1)'}`,background:outcomeForm.outcome===val?bg:'#fff',cursor:'pointer',fontWeight:800,fontSize:'.95rem',color:outcomeForm.outcome===val?color:'#5A3A42',transition:'all .2s', boxShadow: outcomeForm.outcome===val?'0 4px 15px rgba(0,0,0,0.05)':'none'}}>
                      <input type="radio" name="outcome" value={val} checked={outcomeForm.outcome===val} onChange={()=>setOutcomeForm(f=>({...f,outcome:val}))} style={{display:'none'}}/>
                      {icon}{label}
                    </label>
                  )
                )}
              </div>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem', marginTop:'1.5rem'}} className="dash-form-grid-responsive">
              <div className="form-group">
                <label style={{color: '#5A3A42'}}>Duration (days the case ran)</label>
                <input className="form-input-premium" type="number" min="0" placeholder="e.g. 180" value={outcomeForm.durationDays} onChange={e=>setOutcomeForm(f=>({...f,durationDays:e.target.value}))}/>
              </div>
              <div className="form-group">
                <label style={{color: '#5A3A42'}}>Date Closed</label>
                <input className="form-input-premium" type="date" value={outcomeForm.dateClosed} onChange={e=>setOutcomeForm(f=>({...f,dateClosed:e.target.value}))}/>
              </div>
            </div>

            <button className="btn btn-primary btn-lg" style={{width:'100%',marginTop:'2.5rem',display:'flex',alignItems:'center',justifyContent:'center',gap:10, padding:'1.2rem', fontSize:'1.1rem'}} onClick={logOutcome} disabled={submittingOutcome}>
              {submittingOutcome ? <><span className="spinner" style={{width:20,height:20,borderWidth:3}}/> Logging...</> : <><BarChart2 size={20}/> Submit Outcome</>}
            </button>
          </div>
        </div>
      )}

      {tab === 'profile' && (
        <div style={s.section} className="dash-section-responsive">
          <h3 style={{...s.hTitle, marginBottom:'1rem'}}>Practice Settings</h3>
          <p style={{color:'#5A3A42', fontSize:'.95rem', marginBottom:'2.5rem', fontWeight:600}}>Update your specialization, fee, and availability status.</p>
          <div style={{background:'#FDF6EE', border:'1px solid rgba(123, 29, 46, 0.05)', borderRadius:24, padding:'4rem 2rem', textAlign:'center', boxShadow:'0 10px 30px rgba(123, 29, 46, 0.05)'}}>
            <div style={{width: 80, height: 80, borderRadius: '24px', background: 'rgba(123, 29, 46, 0.05)', border: '1px solid rgba(123, 29, 46, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem'}}>
              <User size={40} color="#7B1D2E" />
            </div>
            <h4 style={{marginBottom:12, fontSize:'1.5rem', fontWeight:800, color:'#1A0A0D'}}>Profile Management</h4>
            <p style={{fontSize:'1rem', color:'#5A3A42', marginBottom:'2rem', maxWidth: 400, margin: '0 auto 2rem', lineHeight: 1.6}}>Manage your public profile information, bar registration details, and practice areas.</p>
            <button className="btn btn-outline" style={{padding: '0.8rem 1.6rem'}} onClick={() => showToast('Profile editor coming soon...')}>Edit Practice Details</button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── MAIN DASHBOARD ─── */
export default function Dashboard() {
  const { user, isLoggedIn, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { replace: true })
    }
  }, [isLoggedIn])

  if (!isLoggedIn) return null

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div className="page-reveal" style={{ 
      paddingTop: 100, 
      background: 'url(https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2000&auto=format&fit=crop) center/cover no-repeat fixed', 
      minHeight: '100vh', 
      paddingBottom: '6rem',
      position: 'relative'
    }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(253, 246, 238, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%)', zIndex: 0 }} />
      <Helmet>
        <title>My Dashboard — Justice Junction 24/7</title>
      </Helmet>
      
      <div className="container" style={{ maxWidth: 1360, position: 'relative', zIndex: 1 }}>
        
        {/* Soothing Welcome Banner */}
        <div style={{ 
          borderRadius: 36, 
          padding: '4.5rem 4rem', 
          marginBottom: '3.5rem', 
          color: '#1A0A0D', 
          position: 'relative', 
          overflow: 'hidden', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: '#fff',
          border: '1px solid rgba(123, 29, 46, 0.1)',
          boxShadow: '0 25px 60px rgba(123, 29, 46, 0.05)'
        }}>
          {/* Subtle inner gradient */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at top right, rgba(201,148,58,0.05), transparent 50%)', zIndex: 0 }} />
          
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'inline-block', background: 'rgba(123, 29, 46, 0.05)', color: '#7B1D2E', padding: '0.4rem 1.2rem', borderRadius: 50, fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: '1.5rem' }}>
              Session Active
            </div>
            <h1 style={{ fontSize: '3.6rem', color: '#1A0A0D', fontFamily: "'Playfair Display', serif", fontWeight: 700, marginBottom: 16, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              Welcome, {user?.name ? user.name.split(' ')[0] : 'User'}.
            </h1>
            <p style={{ fontSize: '1.15rem', color: '#5A3A42', maxWidth: 650, lineHeight: 1.7, fontWeight: 500 }}>
              {user?.role === 'lawyer' ? 'Your legal practice is flourishing. Manage your clients and log case updates securely.' : "Find peace of mind. Your legal matters are organized securely. Access your case tracker and updates below."}
            </p>
          </div>
          
          <div className="hide-mobile" style={{ textAlign: 'right', position: 'relative', zIndex: 2, background: '#FDF6EE', padding: '2rem 2.5rem', borderRadius: 28, border: '1px solid rgba(123, 29, 46, 0.05)', boxShadow: '0 10px 30px rgba(123, 29, 46, 0.03)' }}>
            <div style={{ fontSize: '2.8rem', fontWeight: 700, fontFamily: 'Sora, sans-serif', color: '#1A0A0D', lineHeight: 1, letterSpacing: '-0.03em' }}>
              {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </div>
            <div style={{ fontSize: '.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: '#C9943A', marginTop: 12 }}>
              Everything Operational
            </div>
          </div>
        </div>
        <div className="grid-dashboard" style={s.wrap}>
          {/* Sidebar */}
          <div style={s.sidebar}>
            <div style={s.sbUser}>
              <div style={s.sbAvatar}>{initials(user?.name)}</div>
              <div style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: 6, color: '#1A0A0D', letterSpacing: '-0.01em' }}>{user?.name}</div>
              <div style={s.sbRoleBadge}>
                {user?.role === 'lawyer' ? <><Scale size={14} /> Advocate</> : <><User size={14} /> Client</>}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Link to="/dashboard" style={{ ...s.sbLink, ...(location.pathname === '/dashboard' ? s.sbLinkActive : {}) }}><LayoutDashboard size={18} /> Dashboard</Link>
              <Link to="/search" style={s.sbLink}><Search size={18} /> Browse Lawyers</Link>
              <Link to="/knowledge-hub" style={s.sbLink}><FileText size={18} /> Knowledge Hub</Link>
              <div style={{ margin: '1.5rem 0', height: 1, background: 'rgba(123, 29, 46, 0.05)' }} />
              <button onClick={handleLogout} style={{ ...s.sbLink, color: '#DC2626', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 700 }}><LogOut size={18} /> Logout</button>
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
  wrap: { display:'grid', gridTemplateColumns:'280px 1fr', gap:'2.5rem' },
  sidebar: { background:'#fff', border:'1px solid rgba(123, 29, 46, 0.1)', borderRadius:'32px', padding:'3rem 2rem', height:'fit-content', position:'sticky', top:120, boxShadow:'0 25px 60px rgba(123, 29, 46, 0.05)' },
  sbUser: { textAlign:'center', paddingBottom:'2.5rem', borderBottom:'1px solid rgba(123, 29, 46, 0.05)', marginBottom:'2rem' },
  sbAvatar: { width:96, height:96, borderRadius:'32px', background:'linear-gradient(145deg, #FDF6EE, #fff)', color:'#7B1D2E', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Playfair Display',serif", fontSize:'2.5rem', fontWeight:600, margin:'0 auto 1.5rem', boxShadow: '0 12px 25px rgba(123, 29, 46, 0.08)', border: '1px solid rgba(123, 29, 46, 0.05)' },
  sbRoleBadge: { fontSize:'0.75rem', color:'#7B1D2E', textTransform:'uppercase', letterSpacing:'1.5px', fontWeight:700, display:'flex', justifyContent:'center', alignItems:'center', gap:6, background: '#FDF6EE', padding: '.4rem 1rem', borderRadius: 50, width: 'fit-content', margin: '0 auto' },
  sbLink: { display:'flex', alignItems:'center', gap:14, padding:'1rem 1.4rem', borderRadius:'20px', fontSize:'0.92rem', fontWeight:600, color:'#5A3A42', textDecoration:'none', transition:'all 0.3s ease' },
  sbLinkActive: { background:'#7B1D2E', color:'#fff', boxShadow: '0 8px 20px rgba(123, 29, 46, 0.2)' },
  
  main: { minWidth: 0 },
  hTitle: { fontFamily:"'Playfair Display',serif", fontSize:'2.2rem', fontWeight:700, lineHeight: 1.2, color: '#1A0A0D', letterSpacing: '-0.02em' },
  statsRow: { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'1.5rem', marginBottom:'3rem' },
  statNum: { fontFamily:"Sora, sans-serif", fontSize:'clamp(1.8rem, 2.5vw, 2.8rem)', fontWeight:700, color: '#7B1D2E', lineHeight:1, overflowWrap: 'break-word', wordWrap: 'break-word', hyphens: 'auto', letterSpacing: '-0.03em' },
  statLabel: { fontSize:'0.8rem', color:'#5A3A42', marginTop:12, fontWeight:700, textTransform: 'uppercase', letterSpacing: '1.2px' },
  
  section: { background:'#fff', border:'1px solid rgba(123, 29, 46, 0.1)', borderRadius:'36px', padding:'3.5rem', boxShadow:'0 25px 60px rgba(123, 29, 46, 0.05)' },
  biIcon: { width:56, height:56, borderRadius:20, background:'rgba(123, 29, 46, 0.05)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
  addForm: { background:'#FDF6EE', padding:'3rem', borderRadius:28, marginBottom:'2.5rem', border:'1px solid rgba(123, 29, 46, 0.05)' },
  formGrid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.8rem' },
  
  empty: { textAlign:'center', padding:'6rem 2rem', color:'#5A3A42', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#FDF6EE', borderRadius: 28, border: '1px dashed rgba(123, 29, 46, 0.1)' }
}
