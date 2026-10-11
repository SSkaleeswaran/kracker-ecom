import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, admin = false }) {
  const { user } = useAuth();
  if (!user) return <Navigate to={admin ? '/admin/login' : '/login'} replace />;
  if (admin && user.role !== 'admin') return <Navigate to="/" replace />;
  if (!admin && user.role === 'admin') return <Navigate to="/admin" replace />;
  return children;
}
