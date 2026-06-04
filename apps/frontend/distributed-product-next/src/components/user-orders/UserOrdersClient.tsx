"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { orderService } from "@/services/order.service";
import {
  OrderResponse,
  OrderStatus,
  UpdateOrderStatusRequest,
} from "@/types/order.type";

import UserOrderStats from "./UserOrderStats";
import UserOrderToolbar from "./UserOrderToolbar";
import UserOrderTable from "./UserOrderTable";
import UserOrderDetailModal from "./UserOrderDetailModal";

function getCurrentUserId(): string | null {
  if (typeof window === "undefined") return null;

  const userId =
    localStorage.getItem("userId") ||
    localStorage.getItem("currentUserId");

  if (userId) return userId;

  const userJson =
    localStorage.getItem("user") ||
    localStorage.getItem("currentUser") ||
    localStorage.getItem("authUser");

  if (userJson) {
    try {
      const user = JSON.parse(userJson);
      return user?.id || user?.userId || null;
    } catch {
      return null;
    }
  }

  return "550e8400-e29b-41d4-a716-446655440000";
}

export default function UserOrdersClient() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const applyUserFilter = useCallback((data: OrderResponse[]) => {
    const userId = getCurrentUserId();

    if (!userId) return data;

    return data.filter(
      (order) => order.userId?.toLowerCase() === userId.toLowerCase()
    );
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await orderService.getOrders();
      const userOrders = applyUserFilter(data);

      setOrders(userOrders);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "โหลดข้อมูลคำสั่งซื้อไม่สำเร็จ"
      );
    } finally {
      setLoading(false);
    }
  }, [applyUserFilter]);

  useEffect(() => {
    let ignore = false;

    async function loadInitialOrders() {
      try {
        setLoading(true);
        setError(null);

        const data = await orderService.getOrders();

        if (ignore) return;

        const userOrders = applyUserFilter(data);
        setOrders(userOrders);
      } catch (err) {
        if (ignore) return;

        setError(
          err instanceof Error ? err.message : "โหลดข้อมูลคำสั่งซื้อไม่สำเร็จ"
        );
      } finally {
        if (ignore) return;

        setLoading(false);
      }
    }
queueMicrotask(() => {
  void loadInitialOrders();
});

    return () => {
      ignore = true;
    };
  }, [applyUserFilter]);

  const filteredOrders = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchSearch =
        !keyword ||
        order.id.toLowerCase().includes(keyword) ||
        order.items.some((item) =>
          item.productName.toLowerCase().includes(keyword)
        );

      const matchStatus =
        statusFilter === "all" || order.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [orders, search, statusFilter]);

  const summary = useMemo(() => {
    return {
      totalOrders: orders.length,
      completedOrders: orders.filter((order) => order.status === "COMPLETED")
        .length,
      processingOrders: orders.filter((order) =>
        ["PENDING", "CONFIRMED"].includes(order.status)
      ).length,
      totalAmount: orders.reduce(
        (sum, order) => sum + (order.totalAmount ?? 0),
        0
      ),
    };
  }, [orders]);

  async function handleCancelOrder(orderId: string) {
    const confirmed = window.confirm("ยืนยันการยกเลิกคำสั่งซื้อนี้?");

    if (!confirmed) return;

    try {
      await orderService.cancelOrder(orderId);
      await fetchOrders();

      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "ยกเลิกคำสั่งซื้อไม่สำเร็จ");
    }
  }

  async function handleCompleteOrder(orderId: string) {
    const confirmed = window.confirm("ยืนยันการปิดคำสั่งซื้อนี้?");

    if (!confirmed) return;

    try {
      const payload: UpdateOrderStatusRequest = {
        status: "COMPLETED",
        changedBy: getCurrentUserId() ?? "system",
        note: "Completed by user",
      };

      await orderService.updateOrderStatus(orderId, payload);
      await fetchOrders();

      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "อัปเดตสถานะไม่สำเร็จ");
    }
  }

  return (
    <main className="my-orders-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">คำสั่งซื้อของฉัน</h1>

          <div className="page-breadcrumb">
            <Link href="/dashboard">Home</Link>
            <span>/</span>
            <span>คำสั่งซื้อ</span>
          </div>
        </div>

        <div className="page-header-actions">
          <Link href="/dashboard/shop" className="btn-primary">
            <span>+</span>
            สั่งซื้อใหม่
          </Link>
        </div>
      </div>

      <UserOrderStats summary={summary} />

      <UserOrderToolbar
        search={search}
        statusFilter={statusFilter}
        onSearchChange={setSearch}
        onStatusChange={setStatusFilter}
      />

      {error ? (
        <div className="category-error-box">
          <span>{error}</span>

          <button
            type="button"
            className="btn-danger-outline"
            onClick={fetchOrders}
          >
            โหลดใหม่
          </button>
        </div>
      ) : null}

      <UserOrderTable
        orders={filteredOrders}
        loading={loading}
        onViewDetail={setSelectedOrder}
        onCancelOrder={handleCancelOrder}
        onCompleteOrder={handleCompleteOrder}
      />

      <UserOrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onCancelOrder={handleCancelOrder}
        onCompleteOrder={handleCompleteOrder}
      />
    </main>
  );
}