export type OrderStatus =
  | "Completed"
  | "Processing"
  | "Shipped"
  | "Cancelled";

export interface MyOrderItem {
  id: number;
  name: string;
  emoji: string;
  qty: number;
  price: number;
}

export interface MyOrder {
  id: string;
  date: string;
  status: OrderStatus;
  items: MyOrderItem[];
}

export interface MyOrderWithTotal extends MyOrder {
  total: number;
}

export interface OrderStatusMeta {
  label: string;
  className: string;
}

export interface OrderTimelineStep {
  title: string;
  time: string;
  state: "done" | "active" | "pending";
}

export interface MyOrderStats {
  totalOrders: number;
  completedOrders: number;
  processingOrders: number;
  totalAmount: number;
}