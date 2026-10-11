import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount, wish } = useShop();
  const navigate = useNavigate();
  const isCustomer = user && user.role === 'user';

  return (
    <header className="navbar">
      <Link to="/" className="brand">Kracker</Link>
      <nav>
        <NavLink to="/products">Products</NavLink>
        {isCustomer && <NavLink to="/wishlist">Wishlist{wish.length > 0 && <span className="badge">{wish.length}</span>}</NavLink>}
        {isCustomer && <NavLink to="/cart">Cart{cartCount > 0 && <span className="badge">{cartCount}</span>}</NavLink>}
        {isCustomer && <NavLink to="/orders">My orders</NavLink>}
        {isCustomer && <NavLink to="/profile">Profile</NavLink>}
        {user?.role === 'admin' && <NavLink to="/admin">Admin panel</NavLink>}
        {!user && <NavLink to="/login">Log in</NavLink>}
        {!user && <NavLink to="/register" className="btn small">Sign up</NavLink>}
        {user && <button className="btn ghost small" onClick={() => { logout(); navigate('/'); }}>Log out</button>}
      </nav>
    </header>
  );
}
