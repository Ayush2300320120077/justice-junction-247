import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminRoute from '../../components/admin/AdminRoute';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Scale, CreditCard, DollarSign, TrendingUp, TrendingDown, Clock, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/router';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('jj_admin_token');
        const res = await fetch('/api/admin/dashboard-stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setStats(await res.json());
        }
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <AdminLayout title="Dashboard">
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>Loading Dashboard...</div>
      </AdminLayout>
    );
  }

  // Mock data for charts
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
      <AdminLayout title="Dashboard Overview">
        
        {/* ROW 1: KPI Cards */}
        <div style={s.grid4}>
          <KpiCard title="Total Lawyers" value={stats.totalLawyers} delta="+12%" icon={<Scale size={24}/>} color="#3b82f6" />
          <KpiCard title="Total Clients" value={stats.totalClients} delta="+5%" icon={<Users size={24}/>} color="#10b981" />
          <KpiCard title="Total Revenue" value={`₹${stats.totalRevenueINR.toLocaleString()}`} delta="+22%" icon={<DollarSign size={24}/>} color="#f59e0b" />
          <KpiCard title="Active Subscriptions" value={stats.activeSubscriptions} delta="-2%" icon={<CreditCard size={24}/>} color="#8b5cf6" negative />
        </div>

        {/* ROW 2: Status Cards */}
        <div style={s.grid4}>
          <StatusCard title="Pending Verification" value={stats.pendingVerification} color="#f59e0b" onClick={() => router.push('/admin/lawyers')} />
          <StatusCard title="Suspended Lawyers" value={stats.suspendedLawyers} color="#ef4444" onClick={() => router.push('/admin/lawyers')} />
          <StatusCard title="Unread Messages" value={stats.unreadContacts} color="#3b82f6" onClick={() => router.push('/admin/contact-inbox')} />
          <StatusCard title="Open Complaints" value={stats.openComplaints} color="#ef4444" onClick={() => router.push('/admin/reports')} />
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

        {/* ROW 4: Activity Feed */}
        <div style={s.card}>
          <h3 style={s.cardTitle}>Recent Activity</h3>
          <div style={s.feed}>
            {stats.events?.map((evt, i) => (
              <div key={i} style={s.feedItem}>
                <div style={s.feedDot}></div>
                <div style={s.feedContent}>
                  <p style={s.feedText}>{evt.title}</p>
                  <span style={s.feedTime}>{new Date(evt.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </AdminLayout>
    </AdminRoute>
  );
}

function KpiCard({ title, value, delta, icon, color, negative }) {
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', fontSize: '0.875rem', fontWeight: 600, color: negative ? '#ef4444' : '#10b981' }}>
        {negative ? <TrendingDown size={16}/> : <TrendingUp size={16}/>}
        <span>{delta} this month</span>
      </div>
    </div>
  );
}

function StatusCard({ title, value, color, onClick }) {
  return (
    <div onClick={onClick} style={{...s.card, cursor: 'pointer', transition: 'transform 0.2s', ':hover': { transform: 'translateY(-2px)' }}}>
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
  grid4: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' },
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' },
  card: { backgroundColor: '#ffffff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)', border: '1px solid #f1f5f9' },
  kpiLabel: { margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' },
  kpiValue: { margin: 0, fontSize: '2rem', fontWeight: 800, color: '#0f172a' },
  cardTitle: { margin: '0 0 1.5rem 0', fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' },
  feed: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  feedItem: { display: 'flex', gap: '1rem', position: 'relative' },
  feedDot: { width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#3b82f6', marginTop: '6px', border: '2px solid #fff', boxShadow: '0 0 0 2px #bfdbfe', zIndex: 1 },
  feedContent: { flex: 1 },
  feedText: { margin: '0 0 0.25rem 0', fontSize: '0.95rem', fontWeight: 500, color: '#334155' },
  feedTime: { fontSize: '0.8rem', color: '#94a3b8' }
};
