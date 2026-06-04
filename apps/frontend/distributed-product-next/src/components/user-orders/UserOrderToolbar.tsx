import { OrderStatus } from "@/types/order.type";

interface UserOrderToolbarProps {
  search: string;
  statusFilter: OrderStatus | "all";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: OrderStatus | "all") => void;
}

export default function UserOrderToolbar({
  search,
  statusFilter,
  onSearchChange,
  onStatusChange,
}: UserOrderToolbarProps) {
  return (
    <div className="user-orders-toolbar">
      <div className="user-orders-toolbar-left">
        <div className="user-orders-search-box">
          <span>🔍</span>
          <input
            type="text"
            placeholder="ค้นหาคำสั่งซื้อ..."
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>

        <select
          className="user-orders-filter-select"
          value={statusFilter}
          onChange={(event) =>
            onStatusChange(event.target.value as OrderStatus | "all")
          }
        >
          <option value="all">ทุกสถานะ</option>
          <option value="PENDING">รอดำเนินการ</option>
          <option value="CONFIRMED">ยืนยันแล้ว</option>
          <option value="COMPLETED">สำเร็จ</option>
          <option value="CANCELLED">ยกเลิก</option>
        </select>
      </div>
    </div>
  );
}