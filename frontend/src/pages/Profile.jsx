import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { updateProfile } from '../services/shopService';
import { errMsg } from '../utils';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { notify } = useShop();
  const [form, setForm] = useState({ name: user.name, address: user.address || '' });
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('Name is required');
    try { updateUser((await updateProfile(form)).data); setError(''); notify('Profile saved'); } catch (err) { setError(errMsg(err)); }
  };

  return (
    <form className="card form narrow" onSubmit={submit}>
      <h2>Your profile</h2>
      {error && <div className="alert">{error}</div>}
      <label>Email<input value={user.email} disabled /></label>
      <label>Full name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
      <label>Shipping address<textarea rows="3" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></label>
      <button className="btn full">Save changes</button>
    </form>
  );
}
