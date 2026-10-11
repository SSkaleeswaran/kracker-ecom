import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../services/shopService';
import { fmtDate, money } from '../utils';

export default function MyOrders() {
  const [orders, setOrders] = useState(null);
  useEffect(() => { getMyOrders().then((r) => setOrders(r.data)).catch(() => setOrders([])); }, []);

  if (!orders) return <p className="muted">Loading…</p>;
  if (orders.length === 0) return <div className="empty"><h2>No orders yet</h2><Link className="btn" to="/products">Start shopping</Link></div>;

  return (
    <>
      <h1>My orders</h1>
      {orders.map((o) => (
        <div className="card order" key={o._id}>
          <div className="row between wrap">
            <div><strong>Order #{o._id.slice(-6).toUpperCase()}</strong><div className="muted">{fmtDate(o.createdAt)}</div></div>
            <span className={`status ${o.status}`}>{o.status}</span>
          </div>
          <ul>{o.items.map((i, k) => <li key={k}>{i.name} × {i.qty} — {money(i.price * i.qty)}</li>)}</ul>
          <div className="row between wrap"><span className="muted">Ship to: {o.address}</span><strong>{money(o.totalAmount)}</strong></div>
        </div>
      ))}
    </>
  );
}
