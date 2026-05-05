import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { jwtDecode } from 'jwt-decode';

export default function AdminRoute({ children }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('jj_admin_token');

    if (!token) {
      router.replace('/admin/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime || decoded.type !== 'admin') {
        localStorage.removeItem('jj_admin_token');
        localStorage.removeItem('jj_admin_user');
        router.replace('/admin/login');
      } else {
        setIsAuthorized(true);
      }
    } catch (error) {
      localStorage.removeItem('jj_admin_token');
      localStorage.removeItem('jj_admin_user');
      router.replace('/admin/login');
    }
  }, [router]);

  if (!isAuthorized) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#fff' }}>Authorizing...</div>;
  }

  return <>{children}</>;
}
