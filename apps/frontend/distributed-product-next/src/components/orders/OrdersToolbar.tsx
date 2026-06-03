import { OrderStatus } from "@/types/order.type";

interface OrdersToolbarProps {
  searchText: string;
  statusFilter: "" | OrderStatus;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: "" | OrderStatus) => void;
}

export default function OrdersToolbar({
  searchText,
  statusFilter,
  onSearchChange,
  onStatusChange,
}: OrdersToolbarProps) {
  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <div className="search-box">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>

          <input
            type="text"
            placeholder="ค้นหาคำสั่งซื้อ..."
            value={searchText}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>

        <select
          className="filter-select"
          value={statusFilter}
          onChange={(event) =>
            onStatusChange(event.target.value as "" | OrderStatus)
          }
        >
          <option value="">ทุกสถานะ</option>
          <option value="Completed">สำเร็จ</option>
          <option value="Processing">กำลังดำเนินการ</option>
          <option value="Shipped">จัดส่งแล้ว</option>
          <option value="Cancelled">ยกเลิก</option>
        </select>
      </div>
    </div>
  );
}