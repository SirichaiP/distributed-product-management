"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { dashboardService } from "@/services/dashboard.service";
import {
  DashboardRecentOrder,
  DashboardResponse,
  DashboardTopSellingProduct,
} from "@/types/dashboard.type";

const emptyDashboard: DashboardResponse = {
  summary: {
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalRevenue: 0,
  },
  recentOrders: [],
  topSellingProducts: [],
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string): string {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("th-TH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getStatusClass(status: string): string {
  const value = status.toLowerCase();

  if (value.includes("complete")) return "completed";
  if (value.includes("process")) return "processing";
  if (value.includes("ship")) return "shipped";
  if (value.includes("cancel")) return "cancelled";

  return "processing";
}

export default function DashboardPage() {
  const [dashboard, setDashboard] =
    useState<DashboardResponse>(emptyDashboard);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const handleRefresh = useCallback(() => {
    setRefreshKey((current) => current + 1);
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadDashboard(): Promise<void> {
      try {
        setLoading(true);
        setError(null);

        const data = await dashboardService.getDashboard();

        if (!ignore) {
          setDashboard(data);
        }
      } catch (err) {
        if (!ignore) {
          setError(
            err instanceof Error
              ? err.message
              : "ไม่สามารถโหลดข้อมูล Dashboard ได้"
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    queueMicrotask(() => {
      void loadDashboard();
    });

    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of products, categories, orders and revenue</p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleRefresh}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card blue">
          <div>
            <span>Total Products</span>
            <h2>{dashboard.summary.totalProducts.toLocaleString("th-TH")}</h2>
            <Link href="/dashboard/products">View details →</Link>
          </div>
          <p>products</p>
        </div>

        <div className="stat-card green">
          <div>
            <span>Total Categories</span>
            <h2>
              {dashboard.summary.totalCategories.toLocaleString("th-TH")}
            </h2>
            <Link href="/dashboard/categories">View details →</Link>
          </div>
          <p>categories</p>
        </div>

        <div className="stat-card purple">
          <div>
            <span>Total Orders</span>
            <h2>{dashboard.summary.totalOrders.toLocaleString("th-TH")}</h2>
            <Link href="/dashboard/orders">View details →</Link>
          </div>
          <p>orders</p>
        </div>

        <div className="stat-card orange">
          <div>
            <span>Total Revenue</span>
            <h2>{formatCurrency(dashboard.summary.totalRevenue)}</h2>
            <Link href="/dashboard/orders">View details →</Link>
          </div>
          <p>revenue</p>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-panel recent-orders">
          <div className="panel-header">
            <h3>Recent Orders</h3>
            <Link href="/dashboard/orders">View all orders</Link>
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
                {loading ? (
                  <tr>
                    <td colSpan={5}>Loading orders...</td>
                  </tr>
                ) : dashboard.recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5}>No orders found</td>
                  </tr>
                ) : (
                  dashboard.recentOrders.map(
                    (order: DashboardRecentOrder) => (
                      <tr key={order.id}>
                        <td>
                          <Link href="/dashboard/orders">
                            {order.orderNo || order.id}
                          </Link>
                        </td>

                        <td>{order.customerName || "-"}</td>

                        <td>
                          <span
                            className={`status-badge ${getStatusClass(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>

                        <td>{formatCurrency(order.totalAmount)}</td>
                        <td>{formatDate(order.createdAt)}</td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="dashboard-panel top-products">
          <div className="panel-header">
            <h3>Top Selling Products</h3>
            <Link href="/dashboard/products">View all</Link>
          </div>

          <div className="top-product-list">
            {loading ? (
              <div className="empty-box">Loading products...</div>
            ) : dashboard.topSellingProducts.length === 0 ? (
              <div className="empty-box">No selling data found</div>
            ) : (
              dashboard.topSellingProducts.map(
                (
                  product: DashboardTopSellingProduct,
                  index: number
                ) => (
                  <div className="top-product-item" key={product.id}>
                    <div className={`rank rank-${index + 1}`}>
                      {index + 1}
                    </div>

                    <div className="top-product-info">
                      <strong>{product.name}</strong>
                      <span>
                        {product.soldQuantity.toLocaleString("th-TH")} sold
                      </span>
                    </div>

                    <div className="top-product-price">
                      {formatCurrency(product.totalAmount)}
                    </div>
                  </div>
                )
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}