import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { API } from '../api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { BarChart2, Scale, Users, Calendar, AlertTriangle, ShieldCheck } from 'lucide-react'
import Head from 'next/head'

export default function AdminDashboard() {
  const { user, isLoggedIn } = useAuth()
  const { showToast } = useToast()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [lawyers, setLawyers] = useState([])
  const [users, setUsers] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [promoteEmail, setPromoteEmail] = useState('')
  const [editingLawyer, setEditingLawyer] = useState(null)

  // Search and Filter States
  const [lawyerSearch, setLawyerSearch] = useState('')
  const [userSearch, setUserSearch] = useState('')
  const [userRoleFilter, setUserRoleFilter] = useState('all')

  useEffect(() => {
    if (!isLoggedIn || user?.role !== 'admin') {
      router.replace('/')
      return
    }
    fetchData()
  }, [user, isLoggedIn, router])

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
      setLawyers(l || [])
      setUsers(u || [])
      setBookings(b || [])
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

  const handleBlock = async (id, currentStatus) => {
    const actionStr = !currentStatus ? 'block' : 'unblock';
    if (!window.confirm(`Are you sure you want to ${actionStr} this lawyer?`)) return;
    try {
      await API.blockLawyer(id, !currentStatus)
      showToast(`Lawyer ${actionStr}ed successfully!`, 'success')
      setLawyers(lawyers.map(l => l._id === id ? { ...l, isBlocked: !currentStatus } : l))
    } catch (err) {
      showToast('Failed to block lawyer: ' + err.message, 'error')
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
      setUsers(u || [])
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

  const handleUserBlock = async (id, currentStatus) => {
    const actionStr = !currentStatus ? 'block' : 'unblock';
    if (!window.confirm(`Are you sure you want to ${actionStr} this user?`)) return;
    try {
      await API.blockUser(id, !currentStatus)
      showToast(`User ${actionStr}ed successfully!`, 'success')
      setUsers(users.map(u => u._id === id ? { ...u, isBlocked: !currentStatus } : u))
    } catch (err) {
      showToast('Failed to block user: ' + err.message, 'error')
    }
  }

  const handleCancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await API.cancelBooking(id)
      showToast("Booking cancelled successfully!", 'success')
      setBookings(bookings.map(b => b._id === id ? { ...b, status: 'cancelled' } : b))
    } catch (err) {
      showToast('Failed to cancel booking: ' + err.message, 'error')
    }
  }

  const handleSubscriptionChange = async (id, sub) => {
    try {
      await API.updateLawyerSubscription(id, sub)
      showToast("Subscription updated!", 'success')
      setLawyers(lawyers.map(l => l._id === id ? { ...l, subscription: sub } : l))
    } catch (err) {
      showToast('Failed to update subscription: ' + err.message, 'error')
    }
  }

  const handleSaveLawyer = async (e) => {
    e.preventDefault()
    try {
      const { _id, ...data } = editingLawyer;
      const res = await API.updateLawyerProfile(_id, data);
      showToast(res.message, 'success');
      setLawyers(lawyers.map(l => l._id === _id ? { ...l, ...data } : l));
      setEditingLawyer(null);
    } catch (err) {
      showToast('Failed to update profile: ' + err.message, 'error');
    }
  }

  // Filter Data
  const filteredLawyers = lawyers.filter(l => 
    l.name?.toLowerCase().includes(lawyerSearch.toLowerCase()) || 
    l.email?.toLowerCase().includes(lawyerSearch.toLowerCase()) ||
    l.city?.toLowerCase().includes(lawyerSearch.toLowerCase())
  )

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name?.toLowerCase().includes(userSearch.toLowerCase()) || u.email?.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  })

  if (!isLoggedIn || user?.role !== 'admin') return null
  if (loading) return <div style={s.page}><div style={s.inner}>Loading admin data...</div></div>

  return (
    <div style={s.page}>
      <Head>
        <title>Admin Control Center — Justice Junction 24/7</title>
      </Head>
      
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
              { id: 'overview', label: 'Overview', icon: <BarChart2 size={18}/> },
              { id: 'lawyers', label: 'Lawyers', icon: <Scale size={18}/> },
              { id: 'users', label: 'Users & Access', icon: <Users size={18}/> },
              { id: 'bookings', label: 'Bookings', icon: <Calendar size={18}/> }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{...s.tabBtn, ...(activeTab === tab.id ? s.tabActive : {})}}
              >
                <span style={{marginRight: 10, display:'flex'}}>{tab.icon}</span> {tab.label}
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
                  <StatCard label="Total Users" value={stats.totalUsers} icon={<Users size={24}/>} />
                  <StatCard label="Total Lawyers" value={stats.totalLawyers} icon={<Scale size={24}/>} />
                  <StatCard label="Pending Verification" value={stats.pendingVerifications} highlight={stats.pendingVerifications > 0} icon={<AlertTriangle size={24}/>} />
                  <StatCard label="Total Bookings" value={stats.totalBookings} icon={<Calendar size={24}/>} />
                </div>
              </div>
            )}

            {/* LAWYERS TAB */}
            {activeTab === 'lawyers' && (
              <div style={s.tabSection}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem', marginBottom:'2rem', borderBottom: '2px solid rgba(123,29,46,.1)', paddingBottom: '1rem'}}>
                  <h2 style={{fontSize: '1.6rem', color: 'var(--bur)', fontFamily: "'Playfair Display',serif", fontWeight: 800}}>Manage Lawyers</h2>
                  <input 
                    type="text" 
                    placeholder="Search by name, email, or city..." 
                    value={lawyerSearch}
                    onChange={e => setLawyerSearch(e.target.value)}
                    style={{...s.input, maxWidth: 300}}
                  />
                </div>
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
                      {filteredLawyers.map(l => (
                        <tr key={l._id} style={s.tr}>
                          <td style={s.td}><b>{l.name}</b></td>
                          <td style={s.td}>{l.email}</td>
                          <td style={s.td}><span style={s.mono}>{l.barRegistrationNumber}</span></td>
                          <td style={s.td}>{l.city}</td>
                          <td style={s.td}>
                            <div style={{display:'flex',gap:4,flexDirection:'column'}}>
                              {l.isVerified 
                                ? <span style={s.badgeOk}>Verified</span>
                                : <span style={s.badgeWarn}>Pending</span>}
                              {l.isBlocked && <span style={{...s.badgeWarn, background:'rgba(239,68,68,.1)', color:'#ef4444'}}>Blocked</span>}
                              <select 
                                value={l.subscription || 'free'} 
                                onChange={(e) => handleSubscriptionChange(l._id, e.target.value)}
                                style={{marginTop: 4, padding: '2px 4px', fontSize: '.7rem', borderRadius: 4, border: '1px solid var(--border)'}}
                              >
                                <option value="free">Free</option>
                                <option value="basic">Basic</option>
                                <option value="pro">Pro</option>
                                <option value="elite">Elite</option>
                              </select>
                            </div>
                          </td>
                          <td style={s.td}>
                            <div style={{display:'flex',gap:8,alignItems:'center',justifyContent:'center',flexWrap:'wrap', margin:'0 auto'}}>
                              <button 
                                onClick={() => setEditingLawyer(l)}
                                className={`btn btn-sm btn-outline`}
                                style={{padding:'.4rem .8rem', fontSize:'.75rem', width: 75}}
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleVerify(l._id, l.isVerified)}
                                className={`btn btn-sm ${l.isVerified ? 'btn-outline' : 'btn-primary'}`}
                                style={{padding:'.4rem .8rem', fontSize:'.75rem', width: 75}}
                              >
                                {l.isVerified ? 'Revoke' : 'Approve'}
                              </button>
                              <button 
                                onClick={() => handleBlock(l._id, l.isBlocked)}
                                className={`btn btn-sm btn-outline`}
                                style={{padding:'.4rem .8rem', fontSize:'.75rem', width: 75, borderColor: l.isBlocked ? '#10b981' : '#ef4444', color: l.isBlocked ? '#10b981' : '#ef4444'}}
                              >
                                {l.isBlocked ? 'Unblock' : 'Block'}
                              </button>
                              <button 
                                onClick={() => handleDelete('lawyer', l._id)}
                                style={{...s.delBtn, width: 75}}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredLawyers.length === 0 && <p style={s.empty}>No lawyers found.</p>}
                </div>
              </div>
            )}

            {/* USERS & ACCESS TAB */}
            {activeTab === 'users' && (
              <div style={s.tabSection}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem', marginBottom:'2rem', borderBottom: '2px solid rgba(123,29,46,.1)', paddingBottom: '1rem'}}>
                  <h2 style={{fontSize: '1.6rem', color: 'var(--bur)', fontFamily: "'Playfair Display',serif", fontWeight: 800}}>Users & Access Control</h2>
                  
                  <div style={{display:'flex', gap:'.5rem', flexWrap:'wrap'}}>
                    <select 
                      value={userRoleFilter} 
                      onChange={e => setUserRoleFilter(e.target.value)}
                      style={{...s.input, width: 'auto'}}
                    >
                      <option value="all">All Roles</option>
                      <option value="client">Clients Only</option>
                      <option value="lawyer">Lawyers Only</option>
                      <option value="admin">Admins Only</option>
                    </select>
                    <input 
                      type="text" 
                      placeholder="Search users..." 
                      value={userSearch}
                      onChange={e => setUserSearch(e.target.value)}
                      style={{...s.input, maxWidth: 200}}
                    />
                  </div>
                </div>
                
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
                      {filteredUsers.map(u => (
                        <tr key={u._id} style={{...s.tr, ...(u.role==='admin' ? {background:'rgba(232,181,90,.05)'} : {})}}>
                          <td style={s.td}><b>{u.name}</b></td>
                          <td style={s.td}>{u.email}</td>
                          <td style={s.td}>
                            <div style={{display:'flex',gap:4,flexDirection:'column'}}>
                              {u.role === 'admin' && <span style={{...s.badgeAdmin, display:'inline-flex', alignItems:'center', gap:4}}><ShieldCheck size={12}/> Admin</span>}
                              {u.role === 'lawyer' && <span style={s.badgeLawyer}>Lawyer</span>}
                              {u.role === 'client' && <span style={s.badgeClient}>Client</span>}
                              {u.isBlocked && <span style={{...s.badgeWarn, background:'rgba(239,68,68,.1)', color:'#ef4444'}}>Blocked</span>}
                            </div>
                          </td>
                          <td style={s.td}>{new Date(u.createdAt).toLocaleDateString()}</td>
                          <td style={s.td}>
                            <div style={{display:'flex',gap:8,alignItems:'center',justifyContent:'center'}}>
                              {u.role === 'admin' && u._id !== user.id && (
                                <button 
                                  onClick={() => handleDemote(u._id)}
                                  className="btn btn-outline btn-sm"
                                  style={{padding:'.4rem .8rem', fontSize:'.75rem', borderColor:'#ca8a04', color:'#ca8a04'}}
                                >
                                  Revoke Admin
                                </button>
                              )}
                              {u._id !== user.id && u.role !== 'admin' && (
                                <button 
                                  onClick={() => handleUserBlock(u._id, u.isBlocked)}
                                  className={`btn btn-sm btn-outline`}
                                  style={{padding:'.4rem .8rem', fontSize:'.75rem', borderColor: u.isBlocked ? '#10b981' : '#ef4444', color: u.isBlocked ? '#10b981' : '#ef4444'}}
                                >
                                  {u.isBlocked ? 'Unblock' : 'Block'}
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
                            <span style={b.status === 'completed' ? s.badgeOk : b.status === 'cancelled' ? {...s.badgeWarn, color:'#ef4444', background:'rgba(239,68,68,.1)'} : b.status === 'pending' ? s.badgeWarn : s.badgeClient}>
                              {b.status}
                            </span>
                          </td>
                          <td style={s.td}>
                            <div style={{display:'flex',gap:8,alignItems:'center',justifyContent:'center'}}>
                              {b.status !== 'cancelled' && b.status !== 'completed' && (
                                <button 
                                  onClick={() => handleCancelBooking(b._id)}
                                  className={`btn btn-sm btn-outline`}
                                  style={{padding:'.4rem .8rem', fontSize:'.75rem', borderColor: '#ef4444', color: '#ef4444'}}
                                >
                                  Cancel
                                </button>
                              )}
                              <button 
                                onClick={() => handleDelete('booking', b._id)}
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
                  {bookings.length === 0 && <p style={s.empty}>No bookings found.</p>}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* EDIT LAWYER MODAL */}
      {editingLawyer && (
        <div style={s.modalOverlay}>
          <div style={s.modalContent}>
            <h2 style={{fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--bur)'}}>Edit Lawyer Profile</h2>
            <form onSubmit={handleSaveLawyer} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div>
                <label style={s.modalLabel}>Name</label>
                <input required type="text" style={s.input} value={editingLawyer.name} onChange={e => setEditingLawyer({...editingLawyer, name: e.target.value})} />
              </div>
              <div style={{display: 'flex', gap: '1rem'}}>
                <div style={{flex: 1}}>
                  <label style={s.modalLabel}>Consultation Fee (₹)</label>
                  <input required type="number" style={s.input} value={editingLawyer.consultationFee} onChange={e => setEditingLawyer({...editingLawyer, consultationFee: e.target.value})} />
                </div>
                <div style={{flex: 1}}>
                  <label style={s.modalLabel}>Experience (Years)</label>
                  <input required type="number" style={s.input} value={editingLawyer.experience} onChange={e => setEditingLawyer({...editingLawyer, experience: e.target.value})} />
                </div>
              </div>
              <div>
                <label style={s.modalLabel}>Specializations (Comma separated)</label>
                <input required type="text" style={s.input} value={Array.isArray(editingLawyer.specializations) ? editingLawyer.specializations.join(', ') : editingLawyer.specializations} onChange={e => setEditingLawyer({...editingLawyer, specializations: e.target.value})} />
              </div>
              <div>
                <label style={s.modalLabel}>Bio</label>
                <textarea required rows={4} style={{...s.input, resize: 'vertical'}} value={editingLawyer.bio} onChange={e => setEditingLawyer({...editingLawyer, bio: e.target.value})} />
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem'}}>
                <button type="button" onClick={() => setEditingLawyer(null)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

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
  headerBg: { position: 'absolute', top: 0, left: 0, right: 0, height: 320, background: `linear-gradient(rgba(42,22,32,.9), rgba(123,29,46,.9)), url('/justice-bg.png')`, backgroundSize:'cover', backgroundPosition:'center', zIndex: 0 },
  inner: { width: '100%', maxWidth: 1800, margin: '0 auto', padding: '0 2vw', position: 'relative', zIndex: 1, paddingTop: 120 },
  header: { marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', color: '#fff' },
  title: { fontFamily: "'Playfair Display',serif", fontSize: '2.8rem', fontWeight: 800, marginBottom: '.5rem', textShadow: '0 2px 10px rgba(0,0,0,0.2)' },
  subtitle: { color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' },
  
  layout: { display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2.5rem', alignItems: 'start' },
  
  sidebar: { display: 'flex', flexDirection: 'column', gap: 8, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', padding: '1.5rem', borderRadius: 'var(--r-lg)', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: '1px solid rgba(255,255,255,0.2)' },
  tabBtn: { padding: '1rem 1.2rem', background: 'none', border: 'none', textAlign: 'left', fontSize: '1rem', fontWeight: 700, color: 'var(--txt-2)', borderRadius: 'var(--r-md)', cursor: 'pointer', transition: 'all .2s ease', display: 'flex', alignItems: 'center' },
  tabActive: { background: 'var(--bur)', color: '#fff', boxShadow: '0 4px 15px rgba(123,29,46,.2)' },
  
  content: { background: '#fff', borderRadius: 'var(--r-lg)', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', padding: '2.5rem', minHeight: 600, border: '1px solid rgba(0,0,0,0.03)', minWidth: 0 },
  tabSection: { animation: 'fadeIn .3s ease' },
  sectionTitle: { fontSize: '1.6rem', color: 'var(--bur)', marginBottom: '2rem', fontFamily: "'Playfair Display',serif", fontWeight: 800, borderBottom: '2px solid rgba(123,29,46,.1)', paddingBottom: '1rem' },
  
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' },
  statCard: { border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '1.8rem', background: '#fff', transition: 'transform .2s, box-shadow .2s', cursor: 'default' },
  statHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  
  promoteBox: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', background: 'rgba(232,181,90,.1)', border: '1px solid rgba(232,181,90,.3)', padding: '1.5rem', borderRadius: 'var(--r-md)', marginBottom: '2rem' },
  input: { flex: 1, padding: '.8rem 1rem', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 'var(--r-sm)', fontSize: '.95rem', outline: 'none' },
  
  tableWrap: { overflowX: 'auto', background: '#fff', borderRadius: 'var(--r-md)', border: '1px solid var(--border)' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'center' },
  th: { padding: '1.2rem 1rem', borderBottom: '2px solid var(--border)', fontSize: '.75rem', fontWeight: 800, color: 'var(--txt-3)', textTransform: 'uppercase', letterSpacing: '1px', background: '#FAFAFA', textAlign: 'center' },
  tr: { transition: 'background .2s', borderBottom: '1px solid var(--border)' },
  td: { padding: '1.2rem 1rem', fontSize: '.95rem', color: 'var(--txt-2)', verticalAlign: 'middle' },
  
  badgeAdmin: { background: 'linear-gradient(135deg, #E8B55A, #D49B38)', color: '#fff', padding: '.3rem .8rem', borderRadius: 20, fontSize: '.7rem', fontWeight: 800, textTransform: 'uppercase', boxShadow: '0 2px 8px rgba(232,181,90,.4)' },
  badgeLawyer: { background: 'rgba(123,29,46,.1)', color: 'var(--bur)', padding: '.3rem .8rem', borderRadius: 20, fontSize: '.7rem', fontWeight: 800, textTransform: 'uppercase' },
  badgeClient: { background: '#F1F5F9', color: '#64748B', padding: '.3rem .8rem', borderRadius: 20, fontSize: '.7rem', fontWeight: 800, textTransform: 'uppercase' },
  badgeOk: { background: 'rgba(74,222,128,.15)', color: '#16a34a', padding: '.3rem .8rem', borderRadius: 20, fontSize: '.7rem', fontWeight: 800, textTransform: 'uppercase' },
  badgeWarn: { background: 'rgba(234,179,8,.15)', color: '#ca8a04', padding: '.3rem .8rem', borderRadius: 20, fontSize: '.7rem', fontWeight: 800, textTransform: 'uppercase' },
  
  delBtn: { padding: '.4rem .8rem', fontSize: '.75rem', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: 'var(--r-sm)', cursor: 'pointer', fontWeight: 700, transition: 'background .2s' },
  mono: { fontFamily: 'monospace', background: '#F1F5F9', padding: '.2rem .4rem', borderRadius: 4, fontSize: '.85rem' },
  empty: { padding: '2rem', textAlign: 'center', color: 'var(--txt-3)', fontStyle: 'italic' },
  
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' },
  modalContent: { background: '#fff', padding: '2rem', borderRadius: 'var(--r-lg)', width: '100%', maxWidth: 500, boxShadow: '0 20px 50px rgba(0,0,0,0.2)' },
  modalLabel: { display: 'block', fontSize: '.85rem', fontWeight: 700, color: 'var(--txt-2)', marginBottom: '.3rem', textTransform: 'uppercase' },
}
