import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { errMsg } from '../utils';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '',});
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (Object.values(form).some((v) => !v.trim())) return setError('All fields are required');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError('Enter a valid email address');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    try { await register(form); navigate('/products'); } catch (err) { setError(errMsg(err)); }
  };

  return (
    <form className="card form narrow" onSubmit={submit} noValidate>
      <h2>Create your account</h2>
      {error && <div className="alert">{error}</div>}
      <label>Full name<input value={form.name} onChange={set('name')} /></label>
      <label>Email<input type="email" value={form.email} onChange={set('email')} /></label>
      <label>Password<input type="password" value={form.password} onChange={set('password')} /></label>
      {/* <label>Shipping address<textarea rows="3" value={form.address} onChange={set('address')} /></label> */}
      <button className="btn full">Register</button>
      <p className="muted center">Already have an account? <Link to="/login">Log in</Link></p>
    </form>
  );
}
