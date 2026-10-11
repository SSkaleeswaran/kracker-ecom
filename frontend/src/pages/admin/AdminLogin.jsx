import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { errMsg } from '../../utils';

export default function AdminLogin() {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const u = await login(form.email, form.password);
      if (u.role !== 'admin') { logout(); return setError('This account does not have admin access'); }
      navigate('/admin');
    } catch (err) { setError(errMsg(err)); }
  };

  return (
    <div className="admin-login">
      <form className="card form narrow" onSubmit={submit}>
        <h2>Admin log in</h2>
        {error && <div className="alert">{error}</div>}
        <label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label>Password<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
        <button className="btn full">Log in</button>
        <p className="muted center small-text">Demo: admin@shop.com / admin123</p>
      </form>
    </div>
  );
}
