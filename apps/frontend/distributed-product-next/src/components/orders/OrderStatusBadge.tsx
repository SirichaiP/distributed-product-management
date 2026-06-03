import { orderStatusMap } from "@/lib/mock/mockMyOrders";
import { OrderStatus } from "@/types/order.type";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export default function OrderStatusBadge({
  status,
}: OrderStatusBadgeProps) {
  const meta = orderStatusMap[status];

  return (
    <span className={`badge ${meta.className}`}>
      {meta.label}
    </span>
  );
}