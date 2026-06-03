export type ShopCategory = string;

export interface ShopCategoryOption {
  label: string;
  value: string;
}

export interface ShopProduct {
  id: string;
  name: string;
  description?: string | null;
  categoryId?: string | null;
  categoryName: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string | null;
  isActive?: boolean;
}

export interface CartItem {
  productId: string;
  productName: string;
  categoryName: string;
  unitPrice: number;
  quantity: number;
  stockQuantity: number;
  imageUrl?: string | null;
}

export type CartMap = Record<string, CartItem>;

export interface PlaceOrderItemRequest {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
}

export interface PlaceOrderRequest {
  userId: string;
  currency: string;
  items: PlaceOrderItemRequest[];
}

export interface PlaceOrderResponse {
  id: string;
  userId: string;
  currency: string;
  status?: string;
  totalAmount?: number;
  createdAt?: string;
  updatedAt?: string;
}