import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { 
  LayoutDashboard, Scale, Users, CreditCard, 
  Inbox, FileText, AlertTriangle, BarChart3, 
  Settings, LogOut, Menu, X, UserCheck, ShieldCheck
} from 'lucide-react';

const ADMIN_NAV = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/dashboard?tab=users', label: 'User Management', icon: UserCheck },
  { path: '/admin/dashboard?tab=verification', label: 'Verification Queue', icon: ShieldCheck },
  { path: '/admin/lawyers', label: 'Lawyers', icon: Scale },
  { path: '/admin/clients', label: 'Clients', icon: Users },
  { path: '/admin/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { path: '/admin/contact-inbox', label: 'Contact Inbox', icon: Inbox },
  { path: '/admin/content', label: 'Content Manager', icon: FileText },
  { path: '/admin/reports', label: 'Reports', icon: AlertTriangle },
  { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children, title = 'Dashboard' }) {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [time, setTime] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('jj_admin_user');
    if (userStr) {
      try { setAdminUser(JSON.parse(userStr)); } catch(e){}
    }
    
    // Real-time clock update
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jj_admin_token');
    localStorage.removeItem('jj_admin_user');
    router.push('/admin/login');
  };

  return (
    <div style={s.layout}>
      <Head>
        <title>{title} — JJ Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      {/* Sidebar Overlay (Mobile) */}
      {mobileOpen && (
        <div style={s.overlay} onClick={() => setMobileOpen(false)} />
      )}

      {/* Left Sidebar */}
      <aside style={{ ...s.sidebar, transform: mobileOpen ? 'translateX(0)' : undefined }} className="admin-sidebar">
        <div style={s.sidebarHeader}>
          <div style={s.logo}>
            <Scale size={24} color="#F5C4B3" />
            <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#F9EEE4' }}>JJ Admin</span>
          </div>
          {adminUser && (
            <div style={s.adminBadge}>
              <div style={s.adminInitials}>{adminUser.name?.charAt(0) || 'A'}</div>
              <div>
                <div style={s.adminName}>{adminUser.name}</div>
                <div style={s.adminRole}>{adminUser.role}</div>
              </div>
            </div>
          )}
        </div>

        <nav style={s.nav}>
          {ADMIN_NAV.map(item => {
            const Icon = item.icon;
            const active = router.asPath === item.path || (item.path === '/admin/dashboard' && router.pathname === '/admin/dashboard' && !router.query.tab);
            return (
              <button 
                key={item.path}
                onClick={() => { router.push(item.path); setMobileOpen(false); }}
                style={{ ...s.navItem, ...(active ? s.navItemActive : {}) }}
              >
                <Icon size={18} style={{ opacity: active ? 1 : 0.7 }} />
                {item.label}
              </button>
            );
          })}
          
          <button onClick={handleLogout} style={{ ...s.navItem, marginTop: 'auto', color: '#ef4444' }}>
            <LogOut size={18} />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div style={s.mainWrapper} className="admin-main-wrapper">
        <header style={s.topbar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="admin-menu-btn" style={s.menuBtn} onClick={() => setMobileOpen(true)}>
              <Menu size={24} color="#0f172a" />
            </button>
            <h1 style={s.pageTitle}>{title}</h1>
          </div>
          
          <div style={s.topbarRight}>
            <div style={s.clock}>{time} IST</div>
            <button onClick={handleLogout} style={s.logoutBtnDesk}>Logout</button>
          </div>
        </header>

        <main style={s.mainContent}>
          {children}
        </main>
      </div>

      <style jsx global>{`
        body { margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
        .admin-sidebar { transition: transform 0.3s ease; }
        .admin-main-wrapper { transition: margin-left 0.3s ease; }
        .admin-menu-btn { display: none; background: none; border: none; cursor: pointer; padding: 0; }
        @media (max-width: 1024px) {
          .admin-sidebar { transform: translateX(-100%); }
          .admin-main-wrapper { margin-left: 0 !important; }
          .admin-menu-btn { display: block; }
        }
      `}</style>
    </div>
  );
}

const s = {
  layout: { display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' },
  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 90 },
  sidebar: { position: 'fixed', top: 0, left: 0, bottom: 0, width: '260px', backgroundColor: '#1A0D10', color: '#F9EEE4', display: 'flex', flexDirection: 'column', zIndex: 100 },
  sidebarHeader: { padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' },
  logo: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' },
  adminBadge: { display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '8px' },
  adminInitials: { width: '32px', height: '32px', backgroundColor: '#7B1D2E', color: '#F9EEE4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem' },
  adminName: { fontSize: '0.85rem', fontWeight: 700, color: '#F9EEE4' },
  adminRole: { fontSize: '0.7rem', color: '#F5C4B3', textTransform: 'uppercase', letterSpacing: '1px' },
  nav: { display: 'flex', flexDirection: 'column', padding: '1rem', gap: '0.25rem', flex: 1, overflowY: 'auto' },
  navItem: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'none', border: 'none', color: '#F9EEE4', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', borderRadius: '8px', transition: 'all 0.2s', textAlign: 'left' },
  navItemActive: { backgroundColor: '#7B1D2E', color: '#F9EEE4', borderLeft: '3px solid #F5C4B3', borderTopLeftRadius: 0, borderBottomLeftRadius: 0 },
  mainWrapper: { marginLeft: '260px', flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: '100vh' },
  topbar: { height: '70px', backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem' },
  pageTitle: { fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 },
  topbarRight: { display: 'flex', alignItems: 'center', gap: '1.5rem' },
  clock: { fontSize: '0.85rem', fontWeight: 600, color: '#64748b', backgroundColor: '#f1f5f9', padding: '0.4rem 0.8rem', borderRadius: '20px' },
  logoutBtnDesk: { background: 'none', border: 'none', color: '#ef4444', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' },
  mainContent: { flex: 1, padding: '2rem', overflowY: 'auto' }
};
