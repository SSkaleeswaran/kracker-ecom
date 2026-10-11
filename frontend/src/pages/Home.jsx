import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories, getProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getProducts({ page: 1, limit: 4 }).then((r) => setProducts(r.data)).catch(() => {});
    getCategories().then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  return (
    <>
      <section className="hero">
        <h1>Everyday things, delivered to your door.</h1>
        <p>Browse the catalogue, save what you like, and check out in a few taps.</p>
        <Link to="/products" className="btn light">Shop all products</Link>
      </section>
      {categories.length > 0 && (
        <section>
          <h2>Shop by category</h2>
          <div className="chips">
            {categories.map((c) => <Link key={c._id} className="chip" to={`/products?category=${c._id}`}>{c.name}</Link>)}
          </div>
        </section>
      )}
      <section>
        <h2>New arrivals</h2>
        {products.length === 0 ? <p className="muted">No products yet. Run <code>npm run seed</code> in the backend folder.</p> : (
          <div className="grid">{products.map((p) => <ProductCard key={p._id} product={p} />)}</div>
        )}
      </section>
    </>
  );
}
