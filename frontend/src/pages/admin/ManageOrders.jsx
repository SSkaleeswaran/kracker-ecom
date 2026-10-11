import { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus } from '../../services/shopService';
import { errMsg, fmtDate, money } from '../../utils';

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => { getAllOrders().then((r) => setOrders(r.data)); }, []);

  const change = async (id, status) => {
    try {
      const res = await updateOrderStatus(id, status);
      setOrders(orders.map((o) => (o._id === id ? { ...o, status: res.data.status } : o)));
      setError('');
    } catch (e) { setError(errMsg(e)); }
  };

  return (
    <>
      <h1>Manage orders</h1>
      {error && <div className="alert">{error}</div>}
      <div className="table-wrap card">
        <table>
          <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Date</th><th>Status</th></tr></thead>
          <tbody>
            {orders.length === 0 && <tr><td colSpan="6" className="muted">No orders yet</td></tr>}
            {orders.map((o) => (
              <tr key={o._id}>
                <td>#{o._id.slice(-6).toUpperCase()}</td>
                <td>{o.user?.name || '—'}<div className="muted small-text">{o.address}</div></td>
                <td>{o.items.map((i, k) => <div key={k}>{i.name} × {i.qty}</div>)}</td>
                <td>{money(o.totalAmount)}</td><td>{fmtDate(o.createdAt)}</td>
                <td><select value={o.status} onChange={(e) => change(o._id, e.target.value)}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
