import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { errMsg } from '../utils';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) return setError('Enter your email and password');
    try {
      const u = await login(form.email, form.password);
      navigate(u.role === 'admin' ? '/admin' : '/products');
    } catch (err) { setError(errMsg(err)); }
  };

  return (
    <form className="card form narrow" onSubmit={submit} noValidate>
      <h2>Log in</h2>
      {error && <div className="alert">{error}</div>}
      <label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
      <label>Password<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
      <button className="btn full">Log in</button>
      <p className="muted center">New here? <Link to="/register">Create an account</Link></p>
      <p className="muted center small-text">Demo: user@shop.com / user123</p>
    </form>
  );
}
