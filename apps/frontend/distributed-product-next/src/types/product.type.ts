// src/types/product.type.ts

export interface ProductResponse {
  id: string;
  categoryId: string;
  categoryName?: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  currency: string;
  stockQuantity: number;
  sku: string;
  isActive: boolean;
  imageUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductRequest {
  categoryId: string;
  name: string;
  imageUrl?: string;
  slug: string;
  description?: string;
  price: number;
  currency: string;
  stockQuantity: number;
  sku: string;
}

export interface UpdateProductRequest {
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  currency: string;
  stockQuantity: number;
  sku: string;
  isActive: boolean;
}

export interface AddProductImageRequest {
  url: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface AdjustStockRequest {
  quantity: number;
  type: string;
}

export interface ReserveStockRequest {
  orderId: string;
  quantity: number;
  expiresAt: string;
}

export interface CategoryOption {
  id: string;
  name: string;
}

export interface UploadImageResponse {
  url: string;
}