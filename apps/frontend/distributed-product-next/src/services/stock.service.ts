// src/services/stock.service.ts

import { apiClient } from "@/lib/api-client";
import type {
  AdjustStockRequest,
  ReserveStockRequest,
  StockProduct,
} from "@/types/stock.type";

type StockApiResponse =
  | StockProduct[]
  | {
      items: StockProduct[];
    }
  | {
      data: StockProduct[];
    };

function normalizeProducts(response: StockApiResponse): StockProduct[] {
  if (Array.isArray(response)) {
    return response;
  }

  if ("items" in response && Array.isArray(response.items)) {
    return response.items;
  }

  if ("data" in response && Array.isArray(response.data)) {
    return response.data;
  }

  return [];
}

export const stockService = {
  async getProducts(): Promise<StockProduct[]> {
    const response = await apiClient<StockApiResponse>(
      "/products?isActive=true",
      {
        method: "GET",
      }
    );

    return normalizeProducts(response);
  },

  async adjustStock(
    productId: string,
    request: AdjustStockRequest
  ): Promise<void> {
    await apiClient<void>(`/products/${productId}/adjust-stock`, {
      method: "POST",
      body: JSON.stringify(request),
    });
  },

  async reserveStock(
    productId: string,
    request: ReserveStockRequest
  ): Promise<void> {
    await apiClient<void>(`/products/${productId}/reserve-stock`, {
      method: "POST",
      body: JSON.stringify(request),
    });
  },
};