import { useNavigate, useLocation, useSearchParams, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminRoute from '../../components/admin/AdminRoute';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  Users, Scale, CreditCard, DollarSign, TrendingUp, TrendingDown, 
  ShieldAlert, UserCheck, ShieldCheck, LayoutDashboard, ChevronLeft, 
  ChevronRight, CheckCircle, XCircle, AlertTriangle, RefreshCw
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function AdminDashboard() {
  const navigate = useNavigate(); const location = useLocation(); const [searchParams] = useSearchParams(); const params = useParams();;
  const { showToast } = useToast();

  const currentTab = searchParams.get('tab') || 'overview';


  // Overview stats state
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // User Management state
  const [users, setUsers] = useState([]);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [userPage, setUserPage] = useState(1);
  const [userTotalPages, setUserTotalPages] = useState(1);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userSearch, setUserSearch] = useState('');

  // Verification Queue state
  const [pendingLawyers, setPendingLawyers] = useState([]);
  const [pendingClients, setPendingClients] = useState([]);
  const [queueLoading, setQueueLoading] = useState(false);
  const [queueSubTab, setQueueSubTab] = useState('lawyers');

  // Confirmation Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null); // { actionType, item, targetName, targetId }
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionInProgress, setActionInProgress] = useState(false);

  // Current admin user info
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('jj_admin_user');
    if (userStr) {
      try { setAdminUser(JSON.parse(userStr)); } catch (e) {}
    }
  }, []);

  // Fetch overview stats
  useEffect(() => {
    if (currentTab === 'overview') {
      fetchStats();
    } else if (currentTab === 'users') {
      fetchUsers(userPage);
    } else if (currentTab === 'verification') {
      fetchPendingVerifications();
    }
  }, [currentTab, userPage]);

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const token = localStorage.getItem('jj_admin_token');
      const res = await fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setStats(await res.json());
      }
    } catch (err) {
      console.error('Failed to fetch stats', err);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchUsers = async (page = 1) => {
    setUsersLoading(true);
    try {
      const token = localStorage.getItem('jj_admin_token');
      const res = await fetch(`/api/admin/users?page=${page}&limit=20`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setTotalUsersCount(data.totalUsers || 0);
        setUserTotalPages(data.totalPages || 1);
        setUserPage(data.currentPage || page);
      }
    } catch (err) {
      console.error('Failed to fetch users', err);
      showToast('Failed to load users', 'error');
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchPendingVerifications = async () => {
    setQueueLoading(true);
    try {
      const token = localStorage.getItem('jj_admin_token');
      const res = await fetch('/api/admin/pending-verifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPendingLawyers(data.lawyers || []);
        setPendingClients(data.clients || []);
      }
    } catch (err) {
      console.error('Failed to fetch pending verifications', err);
      showToast('Failed to load verification queue', 'error');
    } finally {
      setQueueLoading(false);
    }
  };

  const handleTabChange = (tabName) => {
    navigate(`/admin/dashboard${tabName === 'overview' ? '' : `?tab=${tabName}`}`);
  };

  // Open confirmation modal for admin operations
  const openConfirmModal = (actionType, item) => {
    let targetName = item.email || item.name || 'this item';
    setModalData({ actionType, item, targetName, targetId: item._id });
    setRejectionReason('');
    setModalOpen(true);
  };

  // Handle modal action execution
  const executeModalAction = async () => {
    if (!modalData) return;
    setActionInProgress(true);
    const token = localStorage.getItem('jj_admin_token');
    const { actionType, targetId, targetName } = modalData;

    try {
      let res;
      if (actionType === 'promote') {
        res = await fetch('/api/admin/promote', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: targetId })
        });
      } else if (actionType === 'demote') {
        res = await fetch('/api/admin/demote', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: targetId })
        });
      } else if (actionType === 'verify-lawyer-approve') {
        res = await fetch('/api/admin/verify-lawyer', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ lawyerId: targetId, approved: true })
        });
      } else if (actionType === 'verify-lawyer-reject') {
        res = await fetch('/api/admin/verify-lawyer', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ lawyerId: targetId, approved: false, reason: rejectionReason })
        });
      } else if (actionType === 'verify-client-approve') {
        res = await fetch('/api/admin/verify-client', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ clientId: targetId, approved: true })
        });
      } else if (actionType === 'verify-client-reject') {
        res = await fetch('/api/admin/verify-client', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ clientId: targetId, approved: false, reason: rejectionReason })
        });
      }

      const result = await res.json();

      if (res.ok && (result.success || result.user || result.lawyer || result.client)) {
        showToast(`Action successful for ${targetName}`, 'success');
        setModalOpen(false);
        if (currentTab === 'users') fetchUsers(userPage);
        if (currentTab === 'verification') fetchPendingVerifications();
      } else {
        showToast(result.error || 'Action failed', 'error');
      }
    } catch (err) {
      console.error('Modal action failed', err);
      showToast('An unexpected error occurred', 'error');
    } finally {
      setActionInProgress(false);
    }
  };

  // Courtesy check: total admins in current user list
  const totalAdminsInView = users.filter(u => u.role === 'admin').length;

  // Filtered users for User Management search/role filter
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.email?.toLowerCase().includes(userSearch.toLowerCase()) || 
                          u.name?.toLowerCase().includes(userSearch.toLowerCase());
    if (!matchesSearch) return false;
    if (userRoleFilter === 'all') return true;
    return u.role === userRoleFilter;
  });

  // Chart Mock data
  const lineData = [
    { name: 'Week 1', Lawyers: 12, Clients: 45 },
    { name: 'Week 2', Lawyers: 19, Clients: 60 },
    { name: 'Week 3', Lawyers: 15, Clients: 55 },
    { name: 'Week 4', Lawyers: 22, Clients: 80 },
  ];

  const pieData = [
    { name: 'Basic', value: 400 },
    { name: 'Pro', value: 300 },
    { name: 'Elite', value: 150 },
    { name: 'Free', value: 800 },
  ];
  const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#94a3b8'];

  return (
    <AdminRoute>
      <AdminLayout title="Admin Control Center">
        
        {/* TAB BAR NAVIGATION */}
        <div style={s.tabBar}>
          <button 
            style={{...s.tabBtn, ...(currentTab === 'overview' ? s.activeTabBtn : {})}} 
            onClick={() => handleTabChange('overview')}
          >
            <LayoutDashboard size={18} />
            Overview
          </button>
          <button 
            style={{...s.tabBtn, ...(currentTab === 'users' ? s.activeTabBtn : {})}} 
            onClick={() => handleTabChange('users')}
          >
            <UserCheck size={18} />
            User Management
          </button>
          <button 
            style={{...s.tabBtn, ...(currentTab === 'verification' ? s.activeTabBtn : {})}} 
            onClick={() => handleTabChange('verification')}
          >
            <ShieldCheck size={18} />
            Verification Queue
            {(pendingLawyers.length + pendingClients.length) > 0 && (
              <span style={s.tabBadge}>{pendingLawyers.length + pendingClients.length}</span>
            )}
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {currentTab === 'overview' && (
          <>
            {statsLoading || !stats ? (
              <div style={s.loadingContainer}><RefreshCw size={24} className="spin" /> Loading stats...</div>
            ) : (
              <>
                {/* ROW 1: KPI Cards */}
                <div style={s.grid4}>
                  <KpiCard title="Total Lawyers" value={stats.totalLawyers || 0} delta="+12%" icon={<Scale size={24}/>} color="#3b82f6" />
                  <KpiCard title="Total Users" value={stats.totalUsers || 0} delta="+8%" icon={<Users size={24}/>} color="#10b981" />
                  <KpiCard title="Pending Verifications" value={stats.pendingVerifications || 0} delta="+3" icon={<ShieldAlert size={24}/>} color="#f59e0b" />
                  <KpiCard title="Total Bookings" value={stats.totalBookings || 0} delta="+15%" icon={<CreditCard size={24}/>} color="#8b5cf6" />
                </div>

                {/* ROW 2: Status Cards */}
                <div style={s.grid4}>
                  <StatusCard title="Pending Verification Queue" value={pendingLawyers.length + pendingClients.length} color="#f59e0b" onClick={() => handleTabChange('verification')} />
                  <StatusCard title="Lawyers Directory" value={stats.totalLawyers || 0} color="#3b82f6" onClick={() => navigate('/admin/lawyers')} />
                  <StatusCard title="User Accounts" value={stats.totalUsers || 0} color="#10b981" onClick={() => handleTabChange('users')} />
                  <StatusCard title="System Reports" value={0} color="#ef4444" onClick={() => navigate('/admin/reports')} />
                </div>

                {/* ROW 3: Charts */}
                <div style={s.grid2}>
                  <div style={s.card}>
                    <h3 style={s.cardTitle}>New Registrations (Last 30 Days)</h3>
                    <div style={{ height: 300, width: '100%' }}>
                      <ResponsiveContainer>
                        <LineChart data={lineData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} />
                          <YAxis axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                          <Legend />
                          <Line type="monotone" dataKey="Lawyers" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                          <Line type="monotone" dataKey="Clients" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div style={s.card}>
                    <h3 style={s.cardTitle}>Subscription Breakdown</h3>
                    <div style={{ height: 300, width: '100%' }}>
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie data={pieData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value">
                            {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                          </Pie>
                          <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                          <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* TAB 2: USER MANAGEMENT */}
        {currentTab === 'users' && (
          <div style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a', fontWeight: 700 }}>User Management</h2>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.875rem' }}>Total registered users: {totalUsersCount}</p>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <input 
                  type="text" 
                  placeholder="Search by email or name..." 
                  value={userSearch} 
                  onChange={e => setUserSearch(e.target.value)} 
                  style={s.searchInput}
                />
                <select value={userRoleFilter} onChange={e => setUserRoleFilter(e.target.value)} style={s.select}>
                  <option value="all">All Roles</option>
                  <option value="admin">Admins</option>
                  <option value="lawyer">Lawyers</option>
                  <option value="client">Clients</option>
                </select>
              </div>
            </div>

            {usersLoading ? (
              <div style={s.loadingContainer}><RefreshCw size={24} className="spin" /> Loading users list...</div>
            ) : (
              <>
                <div style={s.tableContainer}>
                  <table style={s.table}>
                    <thead style={s.thead}>
                      <tr>
                        <th style={s.th}>User</th>
                        <th style={s.th}>Role</th>
                        <th style={s.th}>Verification</th>
                        <th style={s.th}>Joined Date</th>
                        <th style={s.th}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length === 0 ? (
                        <tr><td colSpan="5" style={s.tdCenter}>No users found.</td></tr>
                      ) : (
                        filteredUsers.map(u => {
                          const isAdmin = u.role === 'admin';
                          const isSelf = adminUser?.email === u.email || adminUser?.id === u._id;
                          const isLastAdmin = isAdmin && isSelf && totalAdminsInView <= 1 && totalUsersCount <= 1;

                          return (
                            <tr key={u._id} style={s.tr}>
                              <td style={s.td}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                  <div style={{...s.avatar, backgroundColor: isAdmin ? '#fef3c7' : '#e0e7ff', color: isAdmin ? '#b45309' : '#4f46e5'}}>
                                    {(u.name || u.email).charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{u.name || 'User'}</div>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{u.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td style={s.td}>
                                <span style={{
                                  ...s.badge,
                                  backgroundColor: u.role === 'admin' ? '#fef3c7' : u.role === 'lawyer' ? '#e0e7ff' : '#f1f5f9',
                                  color: u.role === 'admin' ? '#b45309' : u.role === 'lawyer' ? '#3730a3' : '#475569'
                                }}>
                                  {u.role?.toUpperCase()}
                                </span>
                              </td>
                              <td style={s.td}>
                                <span style={{
                                  ...s.badge,
                                  backgroundColor: u.verificationStatus === 'verified' ? '#dcfce7' : u.verificationStatus === 'rejected' ? '#fee2e2' : '#fef9c3',
                                  color: u.verificationStatus === 'verified' ? '#15803d' : u.verificationStatus === 'rejected' ? '#b91c1c' : '#a16207'
                                }}>
                                  {(u.verificationStatus || 'pending').toUpperCase()}
                                </span>
                              </td>
                              <td style={s.td}>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                              <td style={s.td}>
                                {isAdmin ? (
                                  isLastAdmin ? (
                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>Sole Admin (Protected)</span>
                                  ) : (
                                    <button 
                                      onClick={() => openConfirmModal('demote', u)} 
                                      style={{...s.btn, backgroundColor: '#fee2e2', color: '#b91c1c'}}
                                    >
                                      Demote to User
                                    </button>
                                  )
                                ) : (
                                  <button 
                                    onClick={() => openConfirmModal('promote', u)} 
                                    style={{...s.btn, backgroundColor: '#dcfce7', color: '#15803d'}}
                                  >
                                    Promote to Admin
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* PAGINATION CONTROLS */}
                <div style={s.pagination}>
                  <button 
                    disabled={userPage <= 1} 
                    onClick={() => setUserPage(p => Math.max(1, p - 1))}
                    style={{...s.pageBtn, opacity: userPage <= 1 ? 0.5 : 1}}
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569' }}>
                    Page {userPage} of {userTotalPages}
                  </span>
                  <button 
                    disabled={userPage >= userTotalPages} 
                    onClick={() => setUserPage(p => Math.min(userTotalPages, p + 1))}
                    style={{...s.pageBtn, opacity: userPage >= userTotalPages ? 0.5 : 1}}
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 3: VERIFICATION QUEUE */}
        {currentTab === 'verification' && (
          <div style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a', fontWeight: 700 }}>Verification Queue</h2>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.875rem' }}>Review pending registration and document verification applications</p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  style={{...s.subTabBtn, ...(queueSubTab === 'lawyers' ? s.activeSubTabBtn : {})}}
                  onClick={() => setQueueSubTab('lawyers')}
                >
                  Pending Lawyers ({pendingLawyers.length})
                </button>
                <button 
                  style={{...s.subTabBtn, ...(queueSubTab === 'clients' ? s.activeSubTabBtn : {})}}
                  onClick={() => setQueueSubTab('clients')}
                >
                  Pending Clients ({pendingClients.length})
                </button>
              </div>
            </div>

            {queueLoading ? (
              <div style={s.loadingContainer}><RefreshCw size={24} className="spin" /> Loading verification queue...</div>
            ) : queueSubTab === 'lawyers' ? (
              pendingLawyers.length === 0 ? (
                <div style={s.emptyBox}>No pending lawyer verifications at this time.</div>
              ) : (
                <div style={s.queueGrid}>
                  {pendingLawyers.map(l => (
                    <div key={l._id} style={s.queueCard}>
                      <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>{l.name}</h3>
                          <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: '#64748b' }}>{l.email}</p>
                        </div>
                        <span style={{...s.badge, backgroundColor: '#fef9c3', color: '#a16207'}}>PENDING</span>
                      </div>

                      <div style={s.queueDetails}>
                        <div><strong>Bar Reg No:</strong> {l.barRegistrationNumber}</div>
                        <div><strong>City/State:</strong> {l.city}, {l.state}</div>
                        <div><strong>Experience:</strong> {l.experience} Years</div>
                        <div><strong>Specializations:</strong> {l.specializations?.join(', ') || 'N/A'}</div>
                        {l.bio && <div><strong>Bio:</strong> {l.bio}</div>}
                      </div>

                      <div style={s.queueActions}>
                        <button 
                          onClick={() => openConfirmModal('verify-lawyer-approve', l)} 
                          style={{...s.btn, backgroundColor: '#10b981', color: '#fff', flex: 1, justifyContent: 'center'}}
                        >
                          <CheckCircle size={16} /> Approve
                        </button>
                        <button 
                          onClick={() => openConfirmModal('verify-lawyer-reject', l)} 
                          style={{...s.btn, backgroundColor: '#fee2e2', color: '#b91c1c', flex: 1, justifyContent: 'center'}}
                        >
                          <XCircle size={16} /> Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              pendingClients.length === 0 ? (
                <div style={s.emptyBox}>No pending client verifications at this time.</div>
              ) : (
                <div style={s.queueGrid}>
                  {pendingClients.map(c => (
                    <div key={c._id} style={s.queueCard}>
                      <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>{c.name || 'Client Account'}</h3>
                          <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: '#64748b' }}>{c.email}</p>
                        </div>
                        <span style={{...s.badge, backgroundColor: '#fef9c3', color: '#a16207'}}>PENDING</span>
                      </div>

                      <div style={s.queueDetails}>
                        <div><strong>Phone:</strong> {c.phone || 'N/A'}</div>
                        <div><strong>City/State:</strong> {c.city || 'N/A'}, {c.state || 'N/A'}</div>
                        <div><strong>Joined:</strong> {new Date(c.createdAt).toLocaleDateString('en-IN')}</div>
                      </div>

                      <div style={s.queueActions}>
                        <button 
                          onClick={() => openConfirmModal('verify-client-approve', c)} 
                          style={{...s.btn, backgroundColor: '#10b981', color: '#fff', flex: 1, justifyContent: 'center'}}
                        >
                          <CheckCircle size={16} /> Approve Identity
                        </button>
                        <button 
                          onClick={() => openConfirmModal('verify-client-reject', c)} 
                          style={{...s.btn, backgroundColor: '#fee2e2', color: '#b91c1c', flex: 1, justifyContent: 'center'}}
                        >
                          <XCircle size={16} /> Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        )}

        {/* CONFIRMATION MODAL */}
        {modalOpen && modalData && (
          <div style={s.modalOverlay}>
            <div style={s.modalContent}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#b45309' }}>
                <AlertTriangle size={24} />
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a', fontWeight: 700 }}>Confirm Action</h3>
              </div>

              <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                {modalData.actionType === 'promote' && `Are you sure you want to promote ${modalData.targetName} to Admin role?`}
                {modalData.actionType === 'demote' && `Are you sure you want to remove admin access from ${modalData.targetName}?`}
                {modalData.actionType?.includes('approve') && `Are you sure you want to approve verification for ${modalData.targetName}?`}
                {modalData.actionType?.includes('reject') && `Are you sure you want to reject verification for ${modalData.targetName}?`}
              </p>

              {modalData.actionType?.includes('reject') && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>
                    Rejection Reason (Optional):
                  </label>
                  <textarea 
                    rows={3} 
                    value={rejectionReason} 
                    onChange={e => setRejectionReason(e.target.value)} 
                    placeholder="Provide details on why this application was rejected..." 
                    style={s.textarea}
                  />
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button 
                  disabled={actionInProgress}
                  onClick={() => setModalOpen(false)} 
                  style={{...s.btn, backgroundColor: '#f1f5f9', color: '#475569'}}
                >
                  Cancel
                </button>
                <button 
                  disabled={actionInProgress}
                  onClick={executeModalAction} 
                  style={{
                    ...s.btn, 
                    backgroundColor: modalData.actionType?.includes('reject') || modalData.actionType === 'demote' ? '#ef4444' : '#10b981', 
                    color: '#fff'
                  }}
                >
                  {actionInProgress ? 'Processing...' : 'Confirm Action'}
                </button>
              </div>
            </div>
          </div>
        )}

      </AdminLayout>
    </AdminRoute>
  );
}

function KpiCard({ title, value, delta, icon, color }) {
  return (
    <div style={{...s.card, borderLeft: `4px solid ${color}`}}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={s.kpiLabel}>{title}</p>
          <h2 style={s.kpiValue}>{value}</h2>
        </div>
        <div style={{ padding: '12px', backgroundColor: `${color}15`, borderRadius: '12px', color: color }}>
          {icon}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', fontSize: '0.875rem', fontWeight: 600, color: '#10b981' }}>
        <TrendingUp size={16}/>
        <span>{delta} this month</span>
      </div>
    </div>
  );
}

function StatusCard({ title, value, color, onClick }) {
  return (
    <div onClick={onClick} style={{...s.card, cursor: 'pointer', transition: 'transform 0.2s'}}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ margin: 0, fontWeight: 600, color: '#475569', fontSize: '0.95rem' }}>{title}</p>
        <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: `${color}15`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 800 }}>
          {value}
        </div>
      </div>
    </div>
  );
}

const s = {
  tabBar: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' },
  tabBtn: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', border: 'none', background: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 600, color: '#64748b', cursor: 'pointer', transition: 'all 0.2s' },
  activeTabBtn: { backgroundColor: '#1A0D10', color: '#F9EEE4', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  tabBadge: { backgroundColor: '#f59e0b', color: '#fff', fontSize: '0.75rem', fontWeight: 800, padding: '0.1rem 0.5rem', borderRadius: '9999px', marginLeft: '0.25rem' },
  
  grid4: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' },
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' },
  card: { backgroundColor: '#ffffff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)', border: '1px solid #f1f5f9' },
  kpiLabel: { margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' },
  kpiValue: { margin: 0, fontSize: '2rem', fontWeight: 800, color: '#0f172a' },
  cardTitle: { margin: '0 0 1.5rem 0', fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' },
  
  searchInput: { padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.9rem', width: '260px' },
  select: { padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.9rem', backgroundColor: '#fff', cursor: 'pointer' },
  
  tableContainer: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  thead: { backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
  th: { padding: '0.875rem 1rem', fontSize: '0.8rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '0.875rem 1rem', fontSize: '0.95rem', color: '#334155', verticalAlign: 'middle' },
  tdCenter: { padding: '3rem', textAlign: 'center', color: '#64748b' },
  
  avatar: { width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.95rem' },
  badge: { padding: '0.25rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, display: 'inline-block' },
  btn: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.45rem 0.9rem', border: 'none', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.2s' },
  
  pagination: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' },
  pageBtn: { display: 'inline-flex', alignItems: 'center', gap: 4, padding: '0.5rem 1rem', border: '1px solid #cbd5e1', backgroundColor: '#fff', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' },
  
  subTabBtn: { padding: '0.5rem 1rem', border: '1px solid #cbd5e1', background: '#fff', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#475569', cursor: 'pointer' },
  activeSubTabBtn: { backgroundColor: '#3b82f6', color: '#fff', borderColor: '#3b82f6' },
  
  queueGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' },
  queueCard: { backgroundColor: '#f8fafc', borderRadius: '10px', padding: '1.25rem', border: '1px solid #e2e8f0' },
  queueDetails: { fontSize: '0.9rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.25rem' },
  queueActions: { display: 'flex', gap: '0.75rem' },
  
  emptyBox: { padding: '3rem', textAlign: 'center', color: '#64748b', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' },
  loadingContainer: { padding: '3rem', textAlign: 'center', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' },
  
  modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' },
  modalContent: { backgroundColor: '#fff', borderRadius: '12px', padding: '1.75rem', width: '100%', maxWidth: 480, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' },
  textarea: { width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.9rem', resize: 'vertical' }
};
