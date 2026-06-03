import { MyOrderWithTotal } from "@/types/order.type";
import OrderStatusBadge from "./OrderStatusBadge";

interface OrdersTableProps {
  orders: MyOrderWithTotal[];
  totalOrders: number;
  onViewDetail: (order: MyOrderWithTotal) => void;
  onCancelOrder: (orderId: string) => void;
}

export default function OrdersTable({
  orders,
  totalOrders,
  onViewDetail,
  onCancelOrder,
}: OrdersTableProps) {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">รายการคำสั่งซื้อ</span>
        <span className="result-count">{orders.length} รายการ</span>
      </div>

      <div className="table-wrap">
        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <div className="empty-state-title">ไม่พบคำสั่งซื้อ</div>
            <div className="empty-state-text">
              ลองปรับเงื่อนไขการค้นหาใหม่
            </div>
          </div>
        ) : (
          <table>
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
                const canCancel = order.status === "Processing";

                return (
                  <tr key={order.id}>
                    <td>
                      <span className="order-id">{order.id}</span>
                    </td>

                    <td>
                      <span className="order-date">{order.date}</span>
                    </td>

                    <td>
                      <div className="items-preview">
                        {order.items.slice(0, 2).map((item) => (
                          <span className="item-chip" key={item.id}>
                            {item.emoji} {item.name}
                          </span>
                        ))}

                        {order.items.length > 2 ? (
                          <span className="item-chip">
                            +{order.items.length - 2}
                          </span>
                        ) : null}
                      </div>
                    </td>

                    <td>
                      <OrderStatusBadge status={order.status} />
                    </td>

                    <td>
                      <span className="order-total">
                        ฿{order.total.toLocaleString()}
                      </span>
                    </td>

                    <td>
                      <div className="table-actions">
                        <button
                          type="button"
                          className="action-btn"
                          onClick={() => onViewDetail(order)}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="11" cy="11" r="8" />
                            <line
                              x1="21"
                              y1="21"
                              x2="16.65"
                              y2="16.65"
                            />
                          </svg>
                          รายละเอียด
                        </button>

                        {canCancel ? (
                          <button
                            type="button"
                            className="action-btn danger"
                            onClick={() => onCancelOrder(order.id)}
                          >
                            ยกเลิก
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="pagination">
        <div className="page-info">
          แสดง {orders.length === 0 ? 0 : 1}–{orders.length} จาก{" "}
          {totalOrders} รายการ
        </div>

        <div className="page-btns">
          <button type="button" className="page-btn">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <button type="button" className="page-btn active">
            1
          </button>

          <button type="button" className="page-btn">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}