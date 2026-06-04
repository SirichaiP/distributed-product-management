import { OrderResponse, OrderStatus } from "@/types/order.type";

interface UserOrderTableProps {
  orders: OrderResponse[];
  loading: boolean;
  onViewDetail: (order: OrderResponse) => void;
  onCancelOrder: (orderId: string) => void;
  onCompleteOrder: (orderId: string) => void;
}

const statusMap: Record<
  OrderStatus,
  {
    label: string;
    className: string;
  }
> = {
  PENDING: {
    label: "รอดำเนินการ",
    className: "gray",
  },
  CONFIRMED: {
    label: "ยืนยันแล้ว",
    className: "blue",
  },
  COMPLETED: {
    label: "สำเร็จ",
    className: "green",
  },
  CANCELLED: {
    label: "ยกเลิก",
    className: "red",
  },
};

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("th-TH", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function canCancel(status: OrderStatus): boolean {
  return ["PENDING", "CONFIRMED"].includes(status);
}

function canComplete(status: OrderStatus): boolean {
  return status === "CONFIRMED";
}

export default function UserOrderTable({
  orders,
  loading,
  onViewDetail,
  onCancelOrder,
  onCompleteOrder,
}: UserOrderTableProps) {
  if (loading) {
    return (
      <div className="user-orders-card">
        <div className="user-orders-empty-state">
          <div className="user-orders-empty-icon">⏳</div>
          <div className="user-orders-empty-title">กำลังโหลดคำสั่งซื้อ...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-orders-card">
      <div className="user-orders-card-header">
        <span className="user-orders-card-title">รายการคำสั่งซื้อ</span>
        <span className="user-orders-result-count">
          {orders.length} รายการ
        </span>
      </div>

      <div className="user-orders-table-wrap">
        <table className="user-orders-table">
          <thead>
            <tr>
              <th>หมายเลขคำสั่งซื้อ</th>
              <th>วันที่สั่ง</th>
              <th>รายการสินค้า</th>
              <th>สถานะ</th>
              <th>ยอดรวม</th>
              <th>จัดการ</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => {
              const status = statusMap[order.status];

              return (
                <tr key={order.id}>
                  <td>
                    <span className="user-orders-order-id">
                      {order.id.slice(0, 8).toUpperCase()}
                    </span>
                  </td>

                  <td className="user-orders-muted">
                    {formatDate(order.createdAt)}
                  </td>

                  <td>
                    <div className="user-orders-items-preview">
                      {order.items.slice(0, 2).map((item) => (
                        <span
                          key={item.id}
                          className="user-orders-item-chip"
                        >
                          📦 {item.productName}
                        </span>
                      ))}

                      {order.items.length > 2 && (
                        <span className="user-orders-item-chip">
                          +{order.items.length - 2}
                        </span>
                      )}
                    </div>
                  </td>

                  <td>
                    <span className={`user-orders-badge ${status.className}`}>
                      {status.label}
                    </span>
                  </td>

                  <td>
                    <strong>
                      {order.currency}{" "}
                      {order.totalAmount.toLocaleString("th-TH")}
                    </strong>
                  </td>

                  <td>
                    <div className="user-orders-actions">
                      <button
                        type="button"
                        className="user-orders-action-btn"
                        onClick={() => onViewDetail(order)}
                      >
                        รายละเอียด
                      </button>

                      {canComplete(order.status) && (
                        <button
                          type="button"
                          className="user-orders-action-btn"
                          onClick={() => onCompleteOrder(order.id)}
                        >
                          สำเร็จ
                        </button>
                      )}

                      {canCancel(order.status) && (
                        <button
                          type="button"
                          className="user-orders-action-btn danger"
                          onClick={() => onCancelOrder(order.id)}
                        >
                          ยกเลิก
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="user-orders-empty-state">
            <div className="user-orders-empty-icon">🔍</div>
            <div className="user-orders-empty-title">ไม่พบคำสั่งซื้อ</div>
            <div className="user-orders-empty-text">
              ลองปรับเงื่อนไขการค้นหาใหม่
            </div>
          </div>
        )}
      </div>

      <div className="user-orders-pagination">
        <div className="user-orders-page-info">
          แสดง {orders.length === 0 ? 0 : 1}–{orders.length} จาก{" "}
          {orders.length} รายการ
        </div>

        <div className="user-orders-page-btns">
          <button type="button" className="user-orders-page-btn">
            ‹
          </button>
          <button type="button" className="user-orders-page-btn active">
            1
          </button>
          <button type="button" className="user-orders-page-btn">
            ›
          </button>
        </div>
      </div>
    </div>
  );
}