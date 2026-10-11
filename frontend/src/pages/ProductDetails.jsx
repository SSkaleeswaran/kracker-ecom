import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProductById } from '../services/productService';
import { useShop } from '../context/ShopContext';
import { money } from '../utils';

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart, wish, toggleWish } = useShop();
  const [p, setP] = useState(null);
  const [qty, setQty] = useState(1);
  const [missing, setMissing] = useState(false);

  useEffect(() => { getProductById(id).then((r) => setP(r.data)).catch(() => setMissing(true)); }, [id]);

  if (missing) return <div className="empty"><h2>Product not found</h2><Link to="/products">Back to products</Link></div>;
  if (!p) return <p className="muted">Loading…</p>;
  const out = p.stock < 1;

  return (
    <div className="details card">
      <img src={p.image || 'https://placehold.co/600x450?text=No+image'} alt={p.name} />
      <div>
        <small className="muted">{p.category?.name || 'Uncategorised'}</small>
        <h1>{p.name}</h1>
        <h2>{money(p.price)}</h2>
        <p>{p.description || 'No description available.'}</p>
        <p className={out ? 'danger' : 'muted'}>{out ? 'Out of stock' : `${p.stock} in stock`}</p>
        {!out && (
          <label className="inline">Quantity
            <input type="number" min="1" max={p.stock} value={qty} onChange={(e) => setQty(Math.max(1, Math.min(p.stock, Number(e.target.value) || 1)))} />
          </label>
        )}
        <div className="row">
          <button className="btn" disabled={out} onClick={() => addToCart(p._id, qty)}>Add to cart</button>
          <button className="btn ghost" onClick={() => toggleWish(p._id)}>{wish.includes(p._id) ? '♥ Saved' : '♡ Save to wishlist'}</button>
          <Link to="/products" className="btn ghost">Back</Link>
        </div>
      </div>
    </div>
  );
}
