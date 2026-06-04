import { apiClient } from "@/lib/api-client";
import {
  OrderResponse,
  PlaceOrderRequest,
  PlaceOrderResponse,
  UpdateOrderStatusRequest,
} from "@/types/order.type";

export const orderService = {
  getOrders() {
    return apiClient<OrderResponse[]>("/orders", {
      method: "GET",
    });
  },

  getOrderById(orderId: string) {
    return apiClient<OrderResponse>(`/orders/${orderId}`, {
      method: "GET",
    });
  },

  placeOrder(payload: PlaceOrderRequest) {
    return apiClient<PlaceOrderResponse>("/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  updateOrderStatus(orderId: string, payload: UpdateOrderStatusRequest) {
    return apiClient<OrderResponse>(`/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  cancelOrder(orderId: string) {
    return apiClient<OrderResponse>(`/orders/${orderId}/cancel`, {
      method: "PATCH",
    });
  },
};