import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { removeCartItem, updateCartItem } from '../services/shopService';
import { errMsg, money } from '../utils';

export default function Cart() {
  const { cart, setCart, notify } = useShop();
  const navigate = useNavigate();
  const total = cart.reduce((s, i) => s + i.qty * i.product.price, 0);

  const change = async (id, qty) => {
    try { setCart((await updateCartItem(id, qty)).data.items); } catch (e) { notify(errMsg(e)); }
  };
  const remove = async (id) => {
    try { setCart((await removeCartItem(id)).data.items); } catch (e) { notify(errMsg(e)); }
  };

  if (cart.length === 0) return <div className="empty"><h2>Your cart is empty</h2><Link className="btn" to="/products">Browse products</Link></div>;

  return (
    <>
      <h1>Your cart</h1>
      <div className="card list">
        {cart.map(({ product: p, qty }) => (
          <div className="line" key={p._id}>
            <img src={p.image} alt="" />
            <div className="grow"><Link to={`/products/${p._id}`}><strong>{p.name}</strong></Link><div className="muted">{money(p.price)} each</div></div>
            <div className="row">
              <button className="btn ghost small" disabled={qty <= 1} onClick={() => change(p._id, qty - 1)}>−</button>
              <span>{qty}</span>
              <button className="btn ghost small" disabled={qty >= p.stock} onClick={() => change(p._id, qty + 1)}>+</button>
            </div>
            <strong className="amount">{money(p.price * qty)}</strong>
            <button className="btn ghost small" onClick={() => remove(p._id)}>Remove</button>
          </div>
        ))}
        <div className="line total"><span className="grow">Total</span><strong>{money(total)}</strong></div>
      </div>
      <button className="btn" onClick={() => navigate('/checkout')}>Proceed to checkout</button>
    </>
  );
}
