import { useNavigate, useLocation, useSearchParams, useParams } from 'react-router-dom';
import { useEffect } from 'react';

export default function AdminIndex() {
  const navigate = useNavigate(); const location = useLocation(); const [searchParams] = useSearchParams(); const params = useParams();;

  useEffect(() => {
    navigate('/admin/dashboard');
  }, [router]);

  return null;
}
