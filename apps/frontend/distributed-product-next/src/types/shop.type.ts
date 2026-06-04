export type ShopCategory = string;

export interface ShopCategoryOption {
  label: string;
  value: string;
}

export interface ShopProduct {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  currency: string;

  stockQuantity: number;
  availableQuantity: number;

  sku: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string | null;
  images?: unknown[];
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
  quantity: number;
}

export interface PlaceOrderRequest {
  userId: string;
  items: PlaceOrderItemRequest[];
}

export interface PlaceOrderResponse {
  id: string;
  userId: string;
  status: string;
  totalAmount: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}