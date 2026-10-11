import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { placeOrder } from '../services/shopService';
import { errMsg, money } from '../utils';

export default function Checkout() {
  const { user } = useAuth();
  const { cart, setCart, notify } = useShop();
  const navigate = useNavigate();
  const [address, setAddress] = useState(user.address || '');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const total = cart.reduce((s, i) => s + i.qty * i.product.price, 0);

  if (cart.length === 0) return <div className="empty"><h2>Your cart is empty</h2><Link className="btn" to="/products">Browse products</Link></div>;

  const submit = async (e) => {
    e.preventDefault();
    if (!address.trim()) return setError('Enter a shipping address');
    setBusy(true);
    try {
      await placeOrder({ address });
      setCart([]);
      notify('Order placed! Thank you.');
      navigate('/orders');
    } catch (err) { setError(errMsg(err)); setBusy(false); }
  };

  return (
    <>
      <h1>Checkout</h1>
      <div className="two-col">
        <form className="card form" onSubmit={submit}>
          <h3>Shipping address</h3>
          {error && <div className="alert">{error}</div>}
          <textarea rows="4" value={address} onChange={(e) => setAddress(e.target.value)} />
          <button className="btn full" disabled={busy}>{busy ? 'Placing order…' : `Place order · ${money(total)}`}</button>
        </form>
        <div className="card">
          <h3>Order summary</h3>
          {cart.map(({ product: p, qty }) => (
            <div className="row between" key={p._id}><span>{p.name} × {qty}</span><span>{money(p.price * qty)}</span></div>
          ))}
          <hr /><div className="row between"><strong>Total</strong><strong>{money(total)}</strong></div>
        </div>
      </div>
    </>
  );
}
