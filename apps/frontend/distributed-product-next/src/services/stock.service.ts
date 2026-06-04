// src/services/stock.service.ts

import { apiClient } from "@/lib/api-client";
import type {
  AdjustStockRequest,
  ProductApiResponse,
  ReserveStockRequest,
  StockProduct,
} from "@/types/stock.type";

type ProductListApiResponse =
  | ProductApiResponse[]
  | {
      items?: ProductApiResponse[];
      data?: ProductApiResponse[];
    };

function getCategoryName(product: ProductApiResponse): string {
  if (product.categoryName?.trim()) {
    return product.categoryName;
  }

  if (typeof product.category === "string" && product.category.trim()) {
    return product.category;
  }

  if (product.category && typeof product.category === "object") {
    return product.category.name?.trim() || "Uncategorized";
  }

  return "Uncategorized";
}

function normalizeProduct(product: ProductApiResponse): StockProduct {
  const stock = Number(product.stockQuantity ?? product.stock ?? 0);
  const reserved = Number(product.reservedQuantity ?? product.reserved ?? 0);

  const available = Number(
    product.availableQuantity ??
      product.available ??
      Math.max(stock - reserved, 0)
  );

  const price = Number(product.price ?? product.unitPrice ?? 0);

  return {
    id: product.id,
    name: product.name,
    sku: product.sku?.trim() || "-",
    category: getCategoryName(product),
    stock,
    reserved,
    available,
    price,
    status: product.isActive === false ? "Inactive" : "Active",
  };
}

function normalizeProducts(response: ProductListApiResponse): StockProduct[] {
  if (Array.isArray(response)) {
    return response.map(normalizeProduct);
  }

  if (Array.isArray(response.items)) {
    return response.items.map(normalizeProduct);
  }

  if (Array.isArray(response.data)) {
    return response.data.map(normalizeProduct);
  }

  return [];
}

export const stockService = {
  async getProducts(): Promise<StockProduct[]> {
    const response = await apiClient<ProductListApiResponse>("/products");

    return normalizeProducts(response);
  },

  async adjustStock(
    productId: string,
    payload: AdjustStockRequest
  ): Promise<void> {
    await apiClient(`/products/${productId}/adjust-stock`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async reserveStock(
    productId: string,
    payload: ReserveStockRequest
  ): Promise<void> {
    await apiClient(`/products/${productId}/reserve-stock`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};