"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import OrderDetailModal from "@/components/orders/OrderDetailModal";
import OrderStats from "@/components/orders/OrderStats";
import OrdersTable from "@/components/orders/OrdersTable";
import OrdersToolbar from "@/components/orders/OrdersToolbar";
import {
  calculateOrderStats,
  mapOrdersWithTotal,
  mockMyOrders,
} from "@/lib/mock/mockMyOrders";
import {
  MyOrderWithTotal,
  OrderStatus,
} from "@/types/order.type";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<MyOrderWithTotal[]>(
    mapOrdersWithTotal(mockMyOrders)
  );

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | OrderStatus>("");
  const [selectedOrder, setSelectedOrder] =
    useState<MyOrderWithTotal | null>(null);

  const stats = useMemo(() => {
    return calculateOrderStats(orders);
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    return orders.filter((order) => {
      const matchKeyword =
        keyword.length === 0 ||
        order.id.toLowerCase().includes(keyword) ||
        order.items.some((item) =>
          item.name.toLowerCase().includes(keyword)
        );

      const matchStatus =
        statusFilter === "" || order.status === statusFilter;

      return matchKeyword && matchStatus;
    });
  }, [orders, searchText, statusFilter]);

  function handleCancelOrder(orderId: string) {
    const confirmed = window.confirm(
      `ยืนยันการยกเลิกคำสั่งซื้อ ${orderId}?`
    );

    if (!confirmed) return;

    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: "Cancelled",
            }
          : order
      )
    );

    setSelectedOrder((currentOrder) =>
      currentOrder?.id === orderId
        ? {
            ...currentOrder,
            status: "Cancelled",
          }
        : currentOrder
    );
  }

  return (
    <div className="my-orders-page">
      <div className="page-header">
        <h1 className="page-title">คำสั่งซื้อของฉัน</h1>

        <div className="page-header-actions">
 

          <Link href="/dashboard/shop" className="btn-primary">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            สั่งซื้อใหม่
          </Link>
        </div>
      </div>

      <OrderStats stats={stats} />

      <OrdersToolbar
        searchText={searchText}
        statusFilter={statusFilter}
        onSearchChange={setSearchText}
        onStatusChange={setStatusFilter}
      />

      <OrdersTable
        orders={filteredOrders}
        totalOrders={orders.length}
        onViewDetail={setSelectedOrder}
        onCancelOrder={handleCancelOrder}
      />

      <OrderDetailModal
        open={selectedOrder !== null}
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onCancelOrder={handleCancelOrder}
      />
    </div>
  );
}