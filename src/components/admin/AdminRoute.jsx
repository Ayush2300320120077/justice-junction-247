import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AdminRoute({ children }) {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (user && user.role === 'admin') {
      setIsAuthorized(true);
    } else {
      navigate('/admin/login');
    }
  }, [user, loading, navigate]);

  if (loading || !isAuthorized) {
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
