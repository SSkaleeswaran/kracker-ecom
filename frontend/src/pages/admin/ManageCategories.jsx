import { useEffect, useState } from 'react';
import { createCategory, deleteCategory, getCategories, updateCategory } from '../../services/productService';
import { errMsg } from '../../utils';

export default function ManageCategories() {
  const [cats, setCats] = useState([]);
  const [name, setName] = useState('');
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const load = () => getCategories().then((r) => setCats(r.data));
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setError('Category name is required');
    try {
      if (editId) await updateCategory(editId, { name }); else await createCategory({ name });
      setName(''); setEditId(null); setError(''); load();
    } catch (err) { setError(errMsg(err)); }
  };

  const remove = async (c) => {
    if (!window.confirm(`Delete category "${c.name}"?`)) return;
    try { await deleteCategory(c._id); load(); } catch (err) { setError(errMsg(err)); }
  };

  return (
    <>
      <h1>Manage categories</h1>
      <form className="card row form-inline" onSubmit={save}>
        <input placeholder="Category name" value={name} onChange={(e) => setName(e.target.value)} />
        <button className="btn">{editId ? 'Update' : 'Add category'}</button>
        {editId && <button type="button" className="btn ghost" onClick={() => { setEditId(null); setName(''); }}>Cancel</button>}
      </form>
      {error && <div className="alert">{error}</div>}
      <div className="table-wrap card">
        <table>
          <thead><tr><th>Name</th><th>Actions</th></tr></thead>
          <tbody>
            {cats.length === 0 && <tr><td colSpan="2" className="muted">No categories yet</td></tr>}
            {cats.map((c) => (
              <tr key={c._id}><td>{c.name}</td>
                <td className="actions"><button className="link" onClick={() => { setEditId(c._id); setName(c.name); }}>Edit</button><button className="link danger" onClick={() => remove(c)}>Delete</button></td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
