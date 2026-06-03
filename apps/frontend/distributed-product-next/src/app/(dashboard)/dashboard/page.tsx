// src/app/(dashboard)/dashboard/page.tsx

import Link from "next/link";
import { recentOrders, statCards, topProducts } from "@/lib/mock/mockDashboard";

const orderStatusBadge: Record<string, string> = {
  Completed: "badge-green",
  Processing: "badge-blue",
  Shipped: "badge-yellow",
  Cancelled: "badge-red",
};

const rankClass: Record<number, string> = {
  1: "rank-1",
  2: "rank-2",
  3: "rank-3",
};

export default function DashboardPage() {
  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
      
      </div>

      <div className="stats-grid">
        {statCards.map((card) => (
          <div key={card.label} className={`stat-card ${card.colorClass}`}>
            <div className="stat-label">{card.label}</div>
            <div className="stat-value">{card.value}</div>

            <div className="stat-footer">
              <Link href={card.href} className="stat-link">
                View details →
              </Link>

              <div className="stat-icon">{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bottom-grid">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Recent Orders</span>
            <Link href="/dashboard/orders" className="card-link">
              View all orders
            </Link>
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
                    <td>
                      <span className="order-id">{order.id}</span>
                    </td>
                    <td>{order.customer}</td>
                    <td>
                      <span
                        className={`badge ${
                          orderStatusBadge[order.status] ?? "badge-blue"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>{order.total}</td>
                    <td className="text-muted-small">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Top Selling Products</span>
            <Link href="/dashboard/products" className="card-link">
              View all
            </Link>
          </div>

          <div className="product-list">
            {topProducts.map((product, index) => {
              const rank = index + 1;

              return (
                <div key={product.name} className="product-item">
                  <div
                    className={`product-rank ${
                      rankClass[rank] ?? "rank-other"
                    }`}
                  >
                    {rank}
                  </div>

                  <div className="product-info">
                    <div className="product-name">{product.name}</div>
                    <div className="product-sold">{product.sold} sold</div>
                  </div>

                  <div className="product-revenue">{product.revenue}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}