import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { API } from '../api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function AdminDashboard() {
  const { user, isLoggedIn } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [lawyers, setLawyers] = useState([])
  const [users, setUsers] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [promoteEmail, setPromoteEmail] = useState('')

  useEffect(() => {
    if (!isLoggedIn || user?.role !== 'admin') {
      navigate('/')
      return
    }
    fetchData()
  }, [user, isLoggedIn, navigate])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [s, l, u, b] = await Promise.all([
        API.getAdminStats(),
        API.getAdminLawyers(),
        API.getAdminUsers(),
        API.getAdminBookings()
      ])
      setStats(s)
      setLawyers(l)
      setUsers(u)
      setBookings(b)
    } catch (err) {
      showToast('Failed to load admin data: ' + err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (id, currentStatus) => {
    try {
      await API.verifyLawyer(id, !currentStatus)
      showToast(`Lawyer ${!currentStatus ? 'verified' : 'unverified'} successfully!`, 'success')
      setLawyers(lawyers.map(l => l._id === id ? { ...l, isVerified: !currentStatus } : l))
      setStats(prev => ({
        ...prev,
        pendingVerifications: prev.pendingVerifications + (currentStatus ? 1 : -1)
      }))
    } catch (err) {
      showToast('Failed to update verification: ' + err.message, 'error')
    }
  }

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to permanently delete this ${type}? This action cannot be undone.`)) return;
    try {
      if (type === 'user') {
        await API.deleteUser(id)
        setUsers(users.filter(u => u._id !== id))
        setLawyers(lawyers.filter(l => (l.user?._id || l.user) !== id))
        setBookings(bookings.filter(b => b.client?._id !== id && b.lawyer?._id !== id))
      } else if (type === 'lawyer') {
        await API.deleteLawyer(id)
        setLawyers(lawyers.filter(l => l._id !== id))
      } else if (type === 'booking') {
        await API.deleteBooking(id)
        setBookings(bookings.filter(b => b._id !== id))
      }
      showToast(`${type} deleted successfully!`, 'success')
      const s = await API.getAdminStats()
      setStats(s)
    } catch (err) {
      showToast(`Failed to delete ${type}: ` + err.message, 'error')
    }
  }

  const handlePromote = async (e) => {
    e.preventDefault()
    if (!promoteEmail) return
    try {
      const res = await API.promoteAdmin(promoteEmail)
      showToast(res.message, 'success')
      setPromoteEmail('')
      const u = await API.getAdminUsers()
      setUsers(u)
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const handleDemote = async (id) => {
    if (!window.confirm("Are you sure you want to revoke Admin access for this user?")) return;
    try {
      const res = await API.demoteAdmin(id)
      showToast(res.message, 'success')
      setUsers(users.map(u => u._id === id ? { ...u, role: 'client' } : u))
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  if (loading) return <div style={s.page}><div style={s.inner}>Loading admin data...</div></div>

  return (
    <div style={s.page}>
      
      {/* Premium Header Background */}
      <div style={s.headerBg}></div>

      <div style={s.inner}>
        <div style={s.header}>
          <div>
            <h1 style={s.title}>Admin Control Center</h1>
            <p style={s.subtitle}>Manage platform analytics, verify lawyers, and handle access control.</p>
          </div>
        </div>

        <div className="grid-dashboard" style={s.layout}>
          {/* SIDEBAR */}
          <div style={s.sidebar}>
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'lawyers', label: 'Lawyers', icon: '⚖️' },
              { id: 'users', label: 'Users & Access', icon: '👥' },
              { id: 'bookings', label: 'Bookings', icon: '📅' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{...s.tabBtn, ...(activeTab === tab.id ? s.tabActive : {})}}
              >
                <span style={{marginRight: 10}}>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>

          {/* MAIN CONTENT */}
          <div style={s.content}>
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && stats && (
              <div style={s.tabSection}>
                <h2 style={s.sectionTitle}>Platform Overview</h2>
                <div style={s.statsGrid}>
                  <StatCard label="Total Users" value={stats.totalUsers} icon="👥" />
                  <StatCard label="Total Lawyers" value={stats.totalLawyers} icon="⚖️" />
                  <StatCard label="Pending Verification" value={stats.pendingVerifications} highlight={stats.pendingVerifications > 0} icon="⚠️" />
                  <StatCard label="Total Bookings" value={stats.totalBookings} icon="📅" />
                </div>
              </div>
            )}

            {/* LAWYERS TAB */}
            {activeTab === 'lawyers' && (
              <div style={s.tabSection}>
                <h2 style={s.sectionTitle}>Manage Lawyers</h2>
                <div style={s.tableWrap}>
                  <table style={s.table}>
                    <thead>
                      <tr>
                        <th style={s.th}>Name</th>
                        <th style={s.th}>Email</th>
                        <th style={s.th}>Bar Reg.</th>
                        <th style={s.th}>City</th>
                        <th style={s.th}>Status</th>
                        <th style={s.th}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lawyers.map(l => (
                        <tr key={l._id} style={s.tr}>
                          <td style={s.td}><b>{l.name}</b></td>
                          <td style={s.td}>{l.email}</td>
                          <td style={s.td}><span style={s.mono}>{l.barRegistrationNumber}</span></td>
                          <td style={s.td}>{l.city}</td>
                          <td style={s.td}>
                            {l.isVerified 
                              ? <span style={s.badgeOk}>Verified</span>
                              : <span style={s.badgeWarn}>Pending</span>}
                          </td>
                          <td style={s.td}>
                            <div style={{display:'flex',gap:8,alignItems:'center'}}>
                              <button 
                                onClick={() => handleVerify(l._id, l.isVerified)}
                                className={`btn btn-sm ${l.isVerified ? 'btn-outline' : 'btn-primary'}`}
                                style={{padding:'.4rem .8rem', fontSize:'.75rem'}}
                              >
                                {l.isVerified ? 'Revoke' : 'Approve'}
                              </button>
                              <button 
                                onClick={() => handleDelete('lawyer', l._id)}
                                style={s.delBtn}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {lawyers.length === 0 && <p style={s.empty}>No lawyers found.</p>}
                </div>
              </div>
            )}

            {/* USERS & ACCESS TAB */}
            {activeTab === 'users' && (
              <div style={s.tabSection}>
                <h2 style={s.sectionTitle}>Users & Access Control</h2>
                
                {/* Promote Admin Form */}
                <div style={s.promoteBox}>
                  <div>
                    <h3 style={{fontSize:'1.1rem', color:'var(--bur)', marginBottom:4}}>Promote User to Admin</h3>
                    <p style={{fontSize:'.85rem', color:'var(--txt-2)'}}>Grant full administrator privileges to an existing user by email.</p>
                  </div>
                  <form onSubmit={handlePromote} style={{display:'flex', gap:10, flex:1, maxWidth: 400}}>
                    <input 
                      type="email" 
                      placeholder="user@example.com" 
                      required 
                      value={promoteEmail}
                      onChange={e => setPromoteEmail(e.target.value)}
                      style={s.input}
                    />
                    <button type="submit" className="btn btn-primary" style={{padding:'0 1.2rem', whiteSpace:'nowrap'}}>Make Admin</button>
                  </form>
                </div>

                <div style={s.tableWrap}>
                  <table style={s.table}>
                    <thead>
                      <tr>
                        <th style={s.th}>Name</th>
                        <th style={s.th}>Email</th>
                        <th style={s.th}>Role</th>
                        <th style={s.th}>Joined</th>
                        <th style={s.th}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u._id} style={{...s.tr, ...(u.role==='admin' ? {background:'rgba(232,181,90,.05)'} : {})}}>
                          <td style={s.td}><b>{u.name}</b></td>
                          <td style={s.td}>{u.email}</td>
                          <td style={s.td}>
                            {u.role === 'admin' && <span style={s.badgeAdmin}>👑 Admin</span>}
                            {u.role === 'lawyer' && <span style={s.badgeLawyer}>Lawyer</span>}
                            {u.role === 'client' && <span style={s.badgeClient}>Client</span>}
                          </td>
                          <td style={s.td}>{new Date(u.createdAt).toLocaleDateString()}</td>
                          <td style={s.td}>
                            <div style={{display:'flex',gap:8,alignItems:'center'}}>
                              {u.role === 'admin' && u._id !== user.id && (
                                <button 
                                  onClick={() => handleDemote(u._id)}
                                  className="btn btn-outline btn-sm"
                                  style={{padding:'.4rem .8rem', fontSize:'.75rem', borderColor:'#ca8a04', color:'#ca8a04'}}
                                >
                                  Revoke Admin
                                </button>
                              )}
                              {u._id !== user.id && (
                                <button 
                                  onClick={() => handleDelete('user', u._id)}
                                  style={s.delBtn}
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* BOOKINGS TAB */}
            {activeTab === 'bookings' && (
              <div style={s.tabSection}>
                <h2 style={s.sectionTitle}>Global Bookings</h2>
                <div style={s.tableWrap}>
                  <table style={s.table}>
                    <thead>
                      <tr>
                        <th style={s.th}>Booking ID</th>
                        <th style={s.th}>Client</th>
                        <th style={s.th}>Lawyer</th>
                        <th style={s.th}>Status</th>
                        <th style={s.th}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map(b => (
                        <tr key={b._id} style={s.tr}>
                          <td style={s.td}><span style={s.mono}>{b.caseNumber}</span></td>
                          <td style={s.td}>{b.client?.name || b.clientName}</td>
                          <td style={s.td}>{b.lawyer?.name || b.lawyerName}</td>
                          <td style={s.td}>
                            <span style={b.status === 'completed' ? s.badgeOk : b.status === 'pending' ? s.badgeWarn : s.badgeClient}>
                              {b.status}
                            </span>
                          </td>
                          <td style={s.td}>
                            <button 
                              onClick={() => handleDelete('booking', b._id)}
                              style={s.delBtn}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {bookings.length === 0 && <p style={s.empty}>No bookings found.</p>}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, highlight, icon }) {
  return (
    <div style={{...s.statCard, ...(highlight ? {borderColor:'rgba(239,68,68,.3)', background:'rgba(239,68,68,.04)'} : {})}}>
      <div style={s.statHeader}>
        <div style={{fontSize:'.85rem', fontWeight:800, color:'var(--txt-3)', textTransform:'uppercase', letterSpacing:'1px'}}>{label}</div>
        <div style={{fontSize:'1.2rem', opacity:0.8}}>{icon}</div>
      </div>
      <div style={{fontSize:'2.8rem', fontWeight:800, color: highlight ? 'var(--red)' : 'var(--bur)', marginTop: 10, lineHeight: 1}}>{value}</div>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', background: '#F8F9FA', paddingBottom: '5rem', position: 'relative' },
  headerBg: { position: 'absolute', top: 0, left: 0, right: 0, height: 320, background: 'linear-gradient(135deg, #2A1620 0%, var(--bur) 100%)', zIndex: 0 },
  inner: { maxWidth: 1200, margin: '0 auto', padding: '0 5vw', position: 'relative', zIndex: 1, paddingTop: 120 },
  header: { marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', color: '#fff' },
  title: { fontFamily: "'Playfair Display',serif", fontSize: '2.8rem', fontWeight: 800, marginBottom: '.5rem', textShadow: '0 2px 10px rgba(0,0,0,0.2)' },
  subtitle: { color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' },
  
  layout: { display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2.5rem', alignItems: 'start' },
  
  sidebar: { display: 'flex', flexDirection: 'column', gap: 8, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', padding: '1.5rem', borderRadius: 'var(--r-lg)', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: '1px solid rgba(255,255,255,0.2)' },
  tabBtn: { padding: '1rem 1.2rem', background: 'none', border: 'none', textAlign: 'left', fontSize: '1rem', fontWeight: 700, color: 'var(--txt-2)', borderRadius: 'var(--r-md)', cursor: 'pointer', transition: 'all .2s ease', display: 'flex', alignItems: 'center' },
  tabActive: { background: 'var(--bur)', color: '#fff', boxShadow: '0 4px 15px rgba(123,29,46,.2)' },
  
  content: { background: '#fff', borderRadius: 'var(--r-lg)', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', padding: '2.5rem', minHeight: 600, border: '1px solid rgba(0,0,0,0.03)' },
  tabSection: { animation: 'fadeIn .3s ease' },
  sectionTitle: { fontSize: '1.6rem', color: 'var(--bur)', marginBottom: '2rem', fontFamily: "'Playfair Display',serif", fontWeight: 800, borderBottom: '2px solid rgba(123,29,46,.1)', paddingBottom: '1rem' },
  
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' },
  statCard: { border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '1.8rem', background: '#fff', transition: 'transform .2s, box-shadow .2s', cursor: 'default' },
  statHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  
  promoteBox: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', background: 'rgba(232,181,90,.1)', border: '1px solid rgba(232,181,90,.3)', padding: '1.5rem', borderRadius: 'var(--r-md)', marginBottom: '2rem' },
  input: { flex: 1, padding: '.8rem 1rem', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 'var(--r-sm)', fontSize: '.95rem', outline: 'none' },
  
  tableWrap: { overflowX: 'auto', background: '#fff', borderRadius: 'var(--r-md)', border: '1px solid var(--border)' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { padding: '1.2rem 1rem', borderBottom: '2px solid var(--border)', fontSize: '.75rem', fontWeight: 800, color: 'var(--txt-3)', textTransform: 'uppercase', letterSpacing: '1px', background: '#FAFAFA' },
  tr: { transition: 'background .2s', borderBottom: '1px solid var(--border)' },
  td: { padding: '1.2rem 1rem', fontSize: '.95rem', color: 'var(--txt-2)' },
  
  badgeAdmin: { background: 'linear-gradient(135deg, #E8B55A, #D49B38)', color: '#fff', padding: '.3rem .8rem', borderRadius: 20, fontSize: '.7rem', fontWeight: 800, textTransform: 'uppercase', boxShadow: '0 2px 8px rgba(232,181,90,.4)' },
  badgeLawyer: { background: 'rgba(123,29,46,.1)', color: 'var(--bur)', padding: '.3rem .8rem', borderRadius: 20, fontSize: '.7rem', fontWeight: 800, textTransform: 'uppercase' },
  badgeClient: { background: '#F1F5F9', color: '#64748B', padding: '.3rem .8rem', borderRadius: 20, fontSize: '.7rem', fontWeight: 800, textTransform: 'uppercase' },
  badgeOk: { background: 'rgba(74,222,128,.15)', color: '#16a34a', padding: '.3rem .8rem', borderRadius: 20, fontSize: '.7rem', fontWeight: 800, textTransform: 'uppercase' },
  badgeWarn: { background: 'rgba(234,179,8,.15)', color: '#ca8a04', padding: '.3rem .8rem', borderRadius: 20, fontSize: '.7rem', fontWeight: 800, textTransform: 'uppercase' },
  
  delBtn: { padding: '.4rem .8rem', fontSize: '.75rem', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: 'var(--r-sm)', cursor: 'pointer', fontWeight: 700, transition: 'background .2s' },
  mono: { fontFamily: 'monospace', background: '#F1F5F9', padding: '.2rem .4rem', borderRadius: 4, fontSize: '.85rem' },
  empty: { padding: '2rem', textAlign: 'center', color: 'var(--txt-3)', fontStyle: 'italic' }
}
