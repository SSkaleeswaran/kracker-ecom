import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getWishlist } from '../services/shopService';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';

export default function Wishlist() {
  const { wish } = useShop();
  const [products, setProducts] = useState([]);

  // re-fetch whenever an item is removed so the page stays in sync
  useEffect(() => { getWishlist().then((r) => setProducts(r.data.products)).catch(() => {}); }, [wish]);

  if (products.length === 0) return <div className="empty"><h2>Your wishlist is empty</h2><Link className="btn" to="/products">Find something you like</Link></div>;
  return (
    <>
      <h1>Wishlist</h1>
      <div className="grid">{products.map((p) => <ProductCard key={p._id} product={p} />)}</div>
    </>
  );
}
