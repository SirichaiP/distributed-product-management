// app/dashboard/page.tsx
// Server Component — no client state needed here.
// Reads mock data and renders sub-components.

import Link from 'next/link';
import { statCards, recentOrders, topProducts } from '@/data/mockDashboard';

const orderStatusBadge: Record<string, string> = {
  Completed: 'badge-green',
  Processing: 'badge-blue',
  Shipped: 'badge-yellow',
  Cancelled: 'badge-red',
};

const rankClass: Record<number, string> = {
  1: 'rank-1',
  2: 'rank-2',
  3: 'rank-3',
};

const StatIcons: Record<string, React.ReactNode> = {
  products: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
  categories: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  orders: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  ),
  revenue: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
};

export default function DashboardPage() {
  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <div className="page-breadcrumb">
          <Link href="/dashboard">Home</Link>
          <span>/</span>Dashboard
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {statCards.map((card) => (
          <div key={card.label} className={`stat-card ${card.colorClass}`}>
            <div className="stat-label">{card.label}</div>
            <div className="stat-value">{card.value}</div>
            <div className="stat-footer">
              <Link href={card.href} className="stat-link">View details →</Link>
              <div className="stat-icon">{StatIcons[card.icon]}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Grid */}
      <div className="bottom-grid">
        {/* Recent Orders */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Recent Orders</span>
            <Link href="/dashboard/orders" className="card-link">View all orders</Link>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td><span className="order-id">{order.id}</span></td>
                    <td>{order.customer}</td>
                    <td>
                      <span className={`badge ${orderStatusBadge[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{order.total}</td>
                    <td style={{ color: 'var(--muted)', fontSize: '12.5px' }}>{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Selling */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Top Selling Products</span>
            <Link href="/dashboard/products" className="card-link">View all</Link>
          </div>
          <div className="product-list">
            {topProducts.map((product) => (
              <div key={product.rank} className="product-item">
                <div className={`product-rank ${rankClass[product.rank] ?? 'rank-other'}`}>
                  {product.rank}
                </div>
                <div className="product-info">
                  <div className="product-name">{product.name}</div>
                  <div className="product-sold">{product.sold} sold</div>
                </div>
                <div className="product-revenue">{product.revenue}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
