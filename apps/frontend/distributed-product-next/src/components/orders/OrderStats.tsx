import { MyOrderStats } from "@/types/order.type";

interface OrderStatsProps {
  stats: MyOrderStats;
}

export default function OrderStats({ stats }: OrderStatsProps) {
  return (
    <div className="stats-row">
      <div className="stat-mini">
        <div className="stat-mini-icon blue">📦</div>
        <div className="stat-mini-info">
          <div className="stat-mini-label">คำสั่งซื้อทั้งหมด</div>
          <div className="stat-mini-value primary">
            {stats.totalOrders}
          </div>
        </div>
      </div>

      <div className="stat-mini">
        <div className="stat-mini-icon green">✅</div>
        <div className="stat-mini-info">
          <div className="stat-mini-label">สำเร็จแล้ว</div>
          <div className="stat-mini-value success">
            {stats.completedOrders}
          </div>
        </div>
      </div>

      <div className="stat-mini">
        <div className="stat-mini-icon yellow">🚚</div>
        <div className="stat-mini-info">
          <div className="stat-mini-label">กำลังดำเนินการ</div>
          <div className="stat-mini-value warning">
            {stats.processingOrders}
          </div>
        </div>
      </div>

      <div className="stat-mini">
        <div className="stat-mini-icon red">💸</div>
        <div className="stat-mini-info">
          <div className="stat-mini-label">ยอดรวมทั้งหมด</div>
          <div className="stat-mini-value total-amount">
            ฿{stats.totalAmount.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}