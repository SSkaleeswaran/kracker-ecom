import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { money } from '../utils';

export default function ProductCard({ product }) {
  const { wish, toggleWish, addToCart } = useShop();
  const liked = wish.includes(product._id);
  const out = product.stock < 1;

  return (
    <article className="card product">
      <Link to={`/products/${product._id}`} className="thumb">
        <img src={product.image || 'https://placehold.co/600x450?text=No+image'} alt={product.name} loading="lazy" />
      </Link>
      <button className={`heart ${liked ? 'on' : ''}`} onClick={() => toggleWish(product._id)}
        aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}>{liked ? '♥' : '♡'}</button>
      <div className="body">
        <small className="muted">{product.category?.name || 'Uncategorised'}</small>
        <Link to={`/products/${product._id}`}><h3>{product.name}</h3></Link>
        <div className="row between">
          <strong>{money(product.price)}</strong>
          <small className={out ? 'danger' : 'muted'}>{out ? 'Out of stock' : `${product.stock} left`}</small>
        </div>
        <button className="btn full" disabled={out} onClick={() => addToCart(product._id)}>
          {out ? 'Out of stock' : 'Add to cart'}
        </button>
      </div>
    </article>
  );
}
