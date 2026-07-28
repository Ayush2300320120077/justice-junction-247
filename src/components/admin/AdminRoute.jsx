import { useNavigate, useLocation, useSearchParams, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export default function AdminRoute({ children }) {
  const navigate = useNavigate(); const location = useLocation(); const [searchParams] = useSearchParams(); const params = useParams();;
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('jj_admin_token');

    if (!token) {
      navigate('/admin/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime || decoded.type !== 'admin') {
        localStorage.removeItem('jj_admin_token');
        localStorage.removeItem('jj_admin_user');
        navigate('/admin/login');
      } else {
        setIsAuthorized(true);
      }
    } catch (error) {
      localStorage.removeItem('jj_admin_token');
      localStorage.removeItem('jj_admin_user');
      navigate('/admin/login');
    }
  }, [router]);

  if (!isAuthorized) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#fff' }}>Authorizing...</div>;
  }

  return <>{children}</>;
}
