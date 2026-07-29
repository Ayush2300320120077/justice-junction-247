import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export default function AdminRoute({ children }) {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('jj_admin_token') || localStorage.getItem('jj_token');
    const userStr = localStorage.getItem('jj_admin_user') || localStorage.getItem('jj_user');

    if (!token && !userStr) {
      navigate('/admin/login');
      return;
    }

    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u.role === 'admin') {
          setIsAuthorized(true);
          return;
        }
      } catch (e) {}
    }

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp && decoded.exp < currentTime) {
          localStorage.removeItem('jj_admin_token');
          localStorage.removeItem('jj_admin_user');
          navigate('/admin/login');
        } else {
          setIsAuthorized(true);
        }
      } catch (error) {
        setIsAuthorized(true); // Fallback to allow logged in admin user
      }
    } else {
      navigate('/admin/login');
    }
  }, [navigate]);

  if (!isAuthorized) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#fff', fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem', width: 32, height: 32, border: '3px solid rgba(255,255,255,0.2)', borderTopColor: '#7B1D2E', borderRadius: '50%' }} />
          <div style={{ fontWeight: 700, fontSize: '1rem' }}>Authorizing Admin Portal...</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
