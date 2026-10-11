import { useEffect, useState } from 'react';
import { createProduct, deleteProduct, getCategories, getProducts, updateProduct } from '../../services/productService';
import { errMsg, money } from '../../utils';

const blank = { name: '', category: '', price: '', stock: '', image: '', description: '' };

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(null); // null = hidden, object = add/edit
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const load = () => getProducts(search ? { search } : {}).then((r) => setProducts(r.data));
  useEffect(() => { getCategories().then((r) => setCategories(r.data)); }, []);
  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [search]);

  const openAdd = () => { setForm(blank); setEditId(null); setError(''); };
  const openEdit = (p) => {
    setForm({ name: p.name, category: p.category?._id || '', price: p.price, stock: p.stock, image: p.image || '', description: p.description || '' });
    setEditId(p._id); setError('');
  };
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('Product name is required');
    if (!form.category) return setError('Choose a category');
    if (!(Number(form.price) > 0)) return setError('Price must be a positive number');
    if (form.stock === '' || Number(form.stock) < 0) return setError('Stock must be zero or more');
    try {
      const body = { ...form, price: Number(form.price), stock: Number(form.stock) };
      if (editId) await updateProduct(editId, body); else await createProduct(body);
      setForm(null); load();
    } catch (err) { setError(errMsg(err)); }
  };

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    try { await deleteProduct(p._id); load(); } catch (err) { alert(errMsg(err)); }
  };

  return (
    <>
      <div className="row between wrap"><h1>Manage products</h1><button className="btn" onClick={openAdd}>+ Add product</button></div>

      {form && (
        <form className="card form" onSubmit={save} noValidate>
          <h3>{editId ? 'Edit product' : 'Add product'}</h3>
          {error && <div className="alert">{error}</div>}
          <div className="form-grid">
            <label>Product name<input value={form.name} onChange={set('name')} /></label>
            <label>Category
              <select value={form.category} onChange={set('category')}>
                <option value="">Select…</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </label>
            <label>Price<input type="number" step="0.01" min="0" value={form.price} onChange={set('price')} /></label>
            <label>Stock<input type="number" min="0" value={form.stock} onChange={set('stock')} /></label>
          </div>
          <label>Image URL<input value={form.image} onChange={set('image')} placeholder="https://…" /></label>
          <label>Description<textarea rows="3" value={form.description} onChange={set('description')} /></label>
          <div className="row"><button className="btn">Save</button><button type="button" className="btn ghost" onClick={() => setForm(null)}>Cancel</button></div>
        </form>
      )}

      <input className="search" placeholder="Search products" value={search} onChange={(e) => setSearch(e.target.value)} />
      <div className="table-wrap card">
        <table>
          <thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
          <tbody>
            {products.length === 0 && <tr><td colSpan="5" className="muted">No products found</td></tr>}
            {products.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td><td>{p.category?.name || '—'}</td><td>{money(p.price)}</td><td>{p.stock}</td>
                <td className="actions"><button className="link" onClick={() => openEdit(p)}>Edit</button><button className="link danger" onClick={() => remove(p)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
