import { useEffect, useState } from 'react';
import { getStats } from '../../services/shopService';
import { fmtDate, money } from '../../utils';

export default function AdminDashboard() {
  const [s, setS] = useState(null);
  useEffect(() => { getStats().then((r) => setS(r.data)).catch(() => {}); }, []);
  if (!s) return <p className="muted">Loading…</p>;

  const tiles = [
    ['Total orders', s.totalOrders], ['Pending orders', s.pendingOrders], ['Products', s.totalProducts],
    ['Categories', s.totalCategories], ['Customers', s.totalUsers], ['Revenue', money(s.totalRevenue)],
  ];
  return (
    <>
      <h1>Dashboard</h1>
      <div className="stats">{tiles.map(([label, v]) => <div className="card stat" key={label}><strong>{v}</strong><span className="muted">{label}</span></div>)}</div>
      <h2>Recent orders</h2>
      <div className="table-wrap card">
        <table>
          <thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th></tr></thead>
          <tbody>
            {s.recentOrders.length === 0 && <tr><td colSpan="5" className="muted">No orders yet</td></tr>}
            {s.recentOrders.map((o) => (
              <tr key={o._id}><td>#{o._id.slice(-6).toUpperCase()}</td><td>{o.user?.name || '—'}</td><td>{fmtDate(o.createdAt)}</td><td>{money(o.totalAmount)}</td><td><span className={`status ${o.status}`}>{o.status}</span></td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
