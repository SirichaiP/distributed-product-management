interface UserOrderStatsProps {
  summary: {
    totalOrders: number;
    completedOrders: number;
    processingOrders: number;
    totalAmount: number;
  };
}

export default function UserOrderStats({ summary }: UserOrderStatsProps) {
  return (
    <div className="user-orders-stats-row">
      <div className="user-orders-stat-mini">
        <div className="user-orders-stat-icon blue">📦</div>
        <div>
          <div className="user-orders-stat-label">คำสั่งซื้อทั้งหมด</div>
          <div className="user-orders-stat-value primary">
            {summary.totalOrders}
          </div>
        </div>
      </div>

      <div className="user-orders-stat-mini">
        <div className="user-orders-stat-icon green">✅</div>
        <div>
          <div className="user-orders-stat-label">สำเร็จแล้ว</div>
          <div className="user-orders-stat-value success">
            {summary.completedOrders}
          </div>
        </div>
      </div>

      <div className="user-orders-stat-mini">
        <div className="user-orders-stat-icon yellow">🚚</div>
        <div>
          <div className="user-orders-stat-label">กำลังดำเนินการ</div>
          <div className="user-orders-stat-value warning">
            {summary.processingOrders}
          </div>
        </div>
      </div>

      <div className="user-orders-stat-mini">
        <div className="user-orders-stat-icon red">💸</div>
        <div>
          <div className="user-orders-stat-label">ยอดรวมทั้งหมด</div>
          <div className="user-orders-stat-value amount">
            ฿{summary.totalAmount.toLocaleString("th-TH")}
          </div>
        </div>
      </div>
    </div>
  );
}