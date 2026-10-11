import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getCategories, getProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [params] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [f, setF] = useState({ search: '', category: params.get('category') || '', minPrice: '', maxPrice: '' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  useEffect(() => { getCategories().then((r) => setCategories(r.data)).catch(() => {}); }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      const q = Object.fromEntries(Object.entries(f).filter(([, v]) => v !== ''));
      setLoading(true);
      getProducts(q).then((r) => setProducts(r.data)).catch(() => setProducts([])).finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(t);
  }, [f]);

  return (
    <>
      <h1>Products</h1>
      <div className="filters card">
        <input placeholder="Search products" value={f.search} onChange={set('search')} />
        <select value={f.category} onChange={set('category')}>
          <option value="">All categories</option>
          {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <input type="number" min="0" placeholder="Min price" value={f.minPrice} onChange={set('minPrice')} />
        <input type="number" min="0" placeholder="Max price" value={f.maxPrice} onChange={set('maxPrice')} />
        <button className="btn ghost" onClick={() => setF({ search: '', category: '', minPrice: '', maxPrice: '' })}>Clear</button>
      </div>
      {loading ? <p className="muted">Loading…</p> : products.length === 0 ? (
        <div className="empty"><h3>No products match your filters</h3><p className="muted">Try a different search or clear the filters.</p></div>
      ) : <div className="grid">{products.map((p) => <ProductCard key={p._id} product={p} />)}</div>}
    </>
  );
}
