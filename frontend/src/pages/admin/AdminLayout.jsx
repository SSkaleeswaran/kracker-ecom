import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="admin">
      <aside>
        <div className="brand">Kracker admin</div>
        <NavLink to="/admin" end>Dashboard</NavLink>
        <NavLink to="/admin/products">Products</NavLink>
        <NavLink to="/admin/categories">Categories</NavLink>
        <NavLink to="/admin/orders">Orders</NavLink>
        <NavLink to="/">View store</NavLink>
        <button onClick={() => { logout(); navigate('/admin/login'); }}>Log out</button>
      </aside>
      <section className="admin-main"><Outlet /></section>
    </div>
  );
}
