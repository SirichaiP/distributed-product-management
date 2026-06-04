export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

export interface OrderItemResponse {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface OrderHistoryResponse {
  id: string;
  orderId: string;
  fromStatus: OrderStatus | null;
  toStatus: OrderStatus;
  changedBy: string;
  note: string;
  createdAt: string;
}

export interface OrderResponse {
  id: string;
  userId: string;
  status: OrderStatus;
  totalAmount: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  cancelledAt: string | null;
  completedAt: string | null;
  items: OrderItemResponse[];
  histories: OrderHistoryResponse[];
}

export interface PlaceOrderItem {
  productId: string;
  quantity: number;
}

export interface PlaceOrderRequest {
  userId: string;
  items: PlaceOrderItem[];
}

export type PlaceOrderResponse = OrderResponse;

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  changedBy: string;
  note?: string;
}