import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminRoute from '../../components/admin/AdminRoute';
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart
} from 'recharts';

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState('30d'); // 7d, 30d, 90d, 1y

  // Mocked Analytics Data for visualization
  const revenueData = [
    { name: 'Jan', Basic: 4000, Pro: 2400, Elite: 2400 },
    { name: 'Feb', Basic: 3000, Pro: 1398, Elite: 2210 },
    { name: 'Mar', Basic: 2000, Pro: 9800, Elite: 2290 },
    { name: 'Apr', Basic: 2780, Pro: 3908, Elite: 2000 },
    { name: 'May', Basic: 1890, Pro: 4800, Elite: 2181 },
    { name: 'Jun', Basic: 2390, Pro: 3800, Elite: 2500 },
  ];

  const registrationData = [
    { name: 'Week 1', Lawyers: 12, Clients: 45 },
    { name: 'Week 2', Lawyers: 19, Clients: 60 },
    { name: 'Week 3', Lawyers: 15, Clients: 55 },
    { name: 'Week 4', Lawyers: 22, Clients: 80 },
  ];

  const geoData = [
    { name: 'Delhi NCR', value: 400 },
    { name: 'Maharashtra', value: 300 },
    { name: 'Karnataka', value: 300 },
    { name: 'Tamil Nadu', value: 200 },
    { name: 'Others', value: 278 },
  ];

  const bookingData = [
    { name: 'Mon', Consultations: 20, Litigation: 5 },
    { name: 'Tue', Consultations: 25, Litigation: 8 },
    { name: 'Wed', Consultations: 30, Litigation: 12 },
    { name: 'Thu', Consultations: 22, Litigation: 6 },
    { name: 'Fri', Consultations: 35, Litigation: 15 },
    { name: 'Sat', Consultations: 45, Litigation: 20 },
    { name: 'Sun', Consultations: 50, Litigation: 25 },
  ];

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#94a3b8'];

  return (
    <AdminRoute>
      <AdminLayout title="Deep Analytics">
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
          <select style={s.select} value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last Quarter</option>
            <option value="1y">Last Year</option>
          </select>
        </div>

        {/* ROW 1 */}
        <div style={s.grid2}>
          <div style={s.card}>
            <h3 style={s.cardTitle}>Revenue Growth (INR)</h3>
            <div style={{ height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorBasic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPro" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend />
                  <Area type="monotone" dataKey="Basic" stroke="#3b82f6" fillOpacity={1} fill="url(#colorBasic)" />
                  <Area type="monotone" dataKey="Pro" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorPro)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={s.card}>
            <h3 style={s.cardTitle}>User Acquisition</h3>
            <div style={{ height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={registrationData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend />
                  <Bar dataKey="Clients" barSize={20} fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey="Lawyers" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ROW 2 */}
        <div style={s.grid2}>
          <div style={s.card}>
            <h3 style={s.cardTitle}>Booking Volume by Service</h3>
            <div style={{ height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookingData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{fill: '#f1f5f9'}} />
                  <Legend />
                  <Bar dataKey="Consultations" stackId="a" fill="#3b82f6" />
                  <Bar dataKey="Litigation" stackId="a" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={s.card}>
            <h3 style={s.cardTitle}>Lawyer Geographic Distribution</h3>
            <div style={{ height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={geoData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={120} fill="#8884d8" dataKey="value">
                    {geoData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </AdminLayout>
    </AdminRoute>
  );
}

const s = {
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' },
  card: { backgroundColor: '#ffffff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)', border: '1px solid #f1f5f9' },
  cardTitle: { margin: '0 0 1.5rem 0', fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' },
  select: { padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none', cursor: 'pointer', backgroundColor: '#fff', fontWeight: 600, color: '#334155' }
};
