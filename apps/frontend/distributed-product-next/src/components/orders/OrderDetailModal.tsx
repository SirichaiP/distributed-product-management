import {
  getOrderTimeline,
  orderStatusMap,
} from "@/lib/mock/mockMyOrders";
import { MyOrderWithTotal } from "@/types/order.type";
import OrderStatusBadge from "./OrderStatusBadge";

interface OrderDetailModalProps {
  open: boolean;
  order: MyOrderWithTotal | null;
  onClose: () => void;
  onCancelOrder: (orderId: string) => void;
}

export default function OrderDetailModal({
  open,
  order,
  onClose,
  onCancelOrder,
}: OrderDetailModalProps) {
  if (!open || !order) return null;

  const timeline = getOrderTimeline(order.status);
  const canCancel = order.status === "Processing";
  const statusMeta = orderStatusMap[order.status];

  return (
    <div
      className="modal-overlay open"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="modal">
        <div className="modal-header">
          <div>
            <div className="modal-title">
              {order.id}{" "}
              <OrderStatusBadge status={order.status} />
            </div>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            title="ปิด"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="detail-section">
            <div className="detail-label">ข้อมูลคำสั่งซื้อ</div>

            <div className="detail-row">
              <span className="detail-row-key">วันที่สั่งซื้อ</span>
              <span className="detail-row-val">{order.date}</span>
            </div>

            <div className="detail-row">
              <span className="detail-row-key">สถานะ</span>
              <span className="detail-row-val">{statusMeta.label}</span>
            </div>

            <div className="detail-row">
              <span className="detail-row-key">จำนวนรายการ</span>
              <span className="detail-row-val">
                {order.items.length} รายการ
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-row-key">ยอดรวม</span>
              <span className="detail-row-val highlight">
                ฿{order.total.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="detail-section">
            <div className="detail-label">สถานะการดำเนินการ</div>

            <div className="timeline">
              {timeline.map((step, index) => (
                <div className="timeline-step" key={step.title}>
                  <div className="timeline-dot-wrap">
                    <div className={`timeline-dot ${step.state}`}>
                      {step.state === "done"
                        ? "✓"
                        : step.state === "active"
                          ? "◉"
                          : "○"}
                    </div>

                    {index < timeline.length - 1 ? (
                      <div
                        className={
                          step.state === "done"
                            ? "timeline-line done"
                            : "timeline-line"
                        }
                      />
                    ) : null}
                  </div>

                  <div className="timeline-content">
                    <div className="timeline-title">{step.title}</div>
                    <div className="timeline-time">{step.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="detail-section">
            <div className="detail-label">รายการสินค้า</div>

            <div className="order-items-list">
              {order.items.map((item) => (
                <div className="order-item-row" key={item.id}>
                  <div className="order-item-emoji">{item.emoji}</div>

                  <div className="order-item-info">
                    <div className="order-item-name">{item.name}</div>
                    <div className="order-item-qty">
                      จำนวน {item.qty} ชิ้น × ฿
                      {item.price.toLocaleString()}
                    </div>
                  </div>

                  <div className="order-item-price">
                    ฿{(item.price * item.qty).toLocaleString()}
                  </div>
                </div>
              ))}

              <div className="total-row">
                <span>ยอดรวม</span>
                <span>฿{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            ปิด
          </button>

          {canCancel ? (
            <button
              type="button"
              className="btn-danger"
              onClick={() => {
                onCancelOrder(order.id);
                onClose();
              }}
            >
              ยกเลิกคำสั่งซื้อ
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}