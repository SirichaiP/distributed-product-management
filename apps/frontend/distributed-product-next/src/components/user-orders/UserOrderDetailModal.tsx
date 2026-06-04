import { OrderResponse, OrderStatus } from "@/types/order.type";

interface UserOrderDetailModalProps {
  order: OrderResponse | null;
  onClose: () => void;
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

function getTimeline(status: OrderStatus) {
  if (status === "CANCELLED") {
    return [
      {
        title: "คำสั่งซื้อถูกยกเลิก",
        time: "คำสั่งซื้อนี้ถูกยกเลิกแล้ว",
        state: "pending",
      },
    ];
  }

  const steps = [
    {
      title: "รับคำสั่งซื้อแล้ว",
      time: "ระบบรับคำสั่งซื้อเรียบร้อย",
    },
    {
      title: "ยืนยันคำสั่งซื้อ",
      time: "ระบบยืนยันคำสั่งซื้อและเตรียมสินค้า",
    },
    {
      title: "สำเร็จ",
      time: "ปิดคำสั่งซื้อเรียบร้อย",
    },
  ];

  const stateMap: Record<OrderStatus, number[]> = {
    PENDING: [1, 0, 0],
    CONFIRMED: [1, 1, 0],
    COMPLETED: [1, 1, 1],
    CANCELLED: [0, 0, 0],
  };

  const states = stateMap[status];
  const activeIndex = states.lastIndexOf(1);

  return steps.map((step, index) => ({
    ...step,
    state:
      states[index] === 0
        ? "pending"
        : index === activeIndex
          ? "active"
          : "done",
  }));
}

export default function UserOrderDetailModal({
  order,
  onClose,
  onCancelOrder,
  onCompleteOrder,
}: UserOrderDetailModalProps) {
  if (!order) return null;

  const status = statusMap[order.status];
  const timeline = getTimeline(order.status);

  return (
    <div className="user-orders-modal-overlay open" onClick={onClose}>
      <div
        className="user-orders-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="user-orders-modal-header">
          <div className="user-orders-modal-title">
            {order.id.slice(0, 8).toUpperCase()}
            <span className={`user-orders-badge ${status.className}`}>
              {status.label}
            </span>
          </div>

          <button
            type="button"
            className="user-orders-modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="user-orders-modal-body">
          <div className="user-orders-detail-section">
            <div className="user-orders-detail-label">ข้อมูลคำสั่งซื้อ</div>

            <div className="user-orders-detail-row">
              <span>Order ID</span>
              <strong>{order.id}</strong>
            </div>

            <div className="user-orders-detail-row">
              <span>วันที่สั่งซื้อ</span>
              <strong>{formatDate(order.createdAt)}</strong>
            </div>

            <div className="user-orders-detail-row">
              <span>จำนวนรายการ</span>
              <strong>{order.items.length} รายการ</strong>
            </div>

            <div className="user-orders-detail-row">
              <span>ยอดรวม</span>
              <strong className="user-orders-primary-text">
                {order.currency} {order.totalAmount.toLocaleString("th-TH")}
              </strong>
            </div>

            {order.cancelledAt && (
              <div className="user-orders-detail-row">
                <span>วันที่ยกเลิก</span>
                <strong>{formatDate(order.cancelledAt)}</strong>
              </div>
            )}

            {order.completedAt && (
              <div className="user-orders-detail-row">
                <span>วันที่สำเร็จ</span>
                <strong>{formatDate(order.completedAt)}</strong>
              </div>
            )}
          </div>

          <div className="user-orders-detail-section">
            <div className="user-orders-detail-label">สถานะการดำเนินการ</div>

            <div className="user-orders-timeline">
              {timeline.map((step, index) => (
                <div
                  key={`${step.title}-${index}`}
                  className="user-orders-timeline-step"
                >
                  <div className="user-orders-timeline-dot-wrap">
                    <div className={`user-orders-timeline-dot ${step.state}`}>
                      {step.state === "done"
                        ? "✓"
                        : step.state === "active"
                          ? "◉"
                          : "○"}
                    </div>

                    {index < timeline.length - 1 && (
                      <div
                        className={`user-orders-timeline-line ${
                          step.state === "done" ? "done" : ""
                        }`}
                      />
                    )}
                  </div>

                  <div className="user-orders-timeline-content">
                    <div className="user-orders-timeline-title">
                      {step.title}
                    </div>
                    <div className="user-orders-timeline-time">
                      {step.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="user-orders-detail-section">
            <div className="user-orders-detail-label">รายการสินค้า</div>

            {order.items.map((item) => (
              <div key={item.id} className="user-orders-order-item-row">
                <div className="user-orders-order-item-emoji">📦</div>

                <div className="user-orders-order-item-info">
                  <div className="user-orders-order-item-name">
                    {item.productName}
                  </div>
                  <div className="user-orders-order-item-qty">
                    จำนวน {item.quantity} ชิ้น × {order.currency}{" "}
                    {item.unitPrice.toLocaleString("th-TH")}
                  </div>
                </div>

                <div className="user-orders-order-item-price">
                  {order.currency} {item.lineTotal.toLocaleString("th-TH")}
                </div>
              </div>
            ))}

            <div className="user-orders-total-row">
              <span>ยอดรวม</span>
              <span>
                {order.currency} {order.totalAmount.toLocaleString("th-TH")}
              </span>
            </div>
          </div>

          {order.histories.length > 0 && (
            <div className="user-orders-detail-section">
              <div className="user-orders-detail-label">ประวัติสถานะ</div>

              {order.histories.map((history) => (
                <div key={history.id} className="user-orders-detail-row">
                  <span>
                    {history.fromStatus ?? "-"} → {history.toStatus}
                  </span>
                  <strong>{formatDate(history.createdAt)}</strong>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="user-orders-modal-footer">
          <button
            type="button"
            className="user-orders-btn-secondary"
            onClick={onClose}
          >
            ปิด
          </button>

          {canComplete(order.status) && (
            <button
              type="button"
              className="user-orders-btn-secondary"
              onClick={() => onCompleteOrder(order.id)}
            >
              ทำรายการสำเร็จ
            </button>
          )}

          {canCancel(order.status) && (
            <button
              type="button"
              className="user-orders-btn-danger"
              onClick={() => onCancelOrder(order.id)}
            >
              ยกเลิกคำสั่งซื้อ
            </button>
          )}
        </div>
      </div>
    </div>
  );
}