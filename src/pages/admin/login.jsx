import { useNavigate, useLocation, useSearchParams, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { Eye, EyeOff, ShieldAlert, ShieldCheck } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in as admin
  useEffect(() => {
    const token = localStorage.getItem('jj_admin_token') || localStorage.getItem('jj_token');
    const userStr = localStorage.getItem('jj_admin_user') || localStorage.getItem('jj_user');
    if (token && userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u.role === 'admin') {
          navigate('/admin/dashboard');
        }
      } catch(e){}
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Admin authentication failed');
      }

      localStorage.setItem('jj_admin_token', data.token);
      localStorage.setItem('jj_token', data.token);
      localStorage.setItem('jj_admin_user', JSON.stringify(data.admin));
      localStorage.setItem('jj_user', JSON.stringify(data.admin));
      navigate('/admin/dashboard');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <Helmet>
        <title>Admin Portal Login — Justice Junction</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div style={s.card}>
        <div style={s.logoWrapper}>
          <ShieldCheck size={48} color="#7B1D2E" />
          <h1 style={s.title}>⚖ Justice Junction</h1>
          <p style={s.subtitle}>Super Admin Portal</p>
        </div>

        {error && <div style={s.errorBadge}>{error}</div>}

        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.inputGroup}>
            <label style={s.label}>Admin Email</label>
            <input 
              type="email" 
              required 
              style={s.input} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@justicejunction.in"
            />
          </div>

          <div style={s.inputGroup}>
            <label style={s.label}>Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                required 
                style={s.input} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={s.eyeButton}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} style={s.submitButton}>
            {loading ? 'Authenticating Admin...' : 'Secure Admin Login'}
          </button>
        </form>

        <div style={s.warningBox}>
          <ShieldAlert size={16} style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ margin: 0, fontSize: '.75rem', lineHeight: 1.4 }}>
            <strong>ADMIN AUTHORITY:</strong> Secure administrator portal with full operational & database authority over Justice Junction 24/7.
          </p>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', padding: '1rem', fontFamily: "'Inter', sans-serif" },
  card: { backgroundColor: '#ffffff', padding: '3rem 2rem', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', width: '100%', maxWidth: '420px' },
  logoWrapper: { textAlign: 'center', marginBottom: '2rem' },
  title: { fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '1rem 0 0.25rem 0' },
  subtitle: { fontSize: '0.85rem', color: '#7B1D2E', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', margin: 0 },
  errorBadge: { backgroundColor: '#fef2f2', border: '1px solid #f87171', color: '#b91c1c', padding: '0.75rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1.5rem', textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.2rem' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { fontSize: '0.875rem', fontWeight: 600, color: '#334155' },
  input: { width: '100%', padding: '0.875rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s', backgroundColor: '#f8fafc' },
  eyeButton: { position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' },
  submitButton: { width: '100%', padding: '1rem', backgroundColor: '#7B1D2E', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', transition: 'background-color 0.2s', marginTop: '0.5rem' },
  warningBox: { display: 'flex', gap: '0.75rem', backgroundColor: '#fffbeb', border: '1px solid #fcd34d', color: '#92400e', padding: '1rem', borderRadius: '8px', marginTop: '2rem', alignItems: 'flex-start' }
};
