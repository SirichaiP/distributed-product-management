import { apiClient } from "@/lib/api-client";
import {
  PlaceOrderRequest,
  PlaceOrderResponse,
  ShopProduct,
} from "@/types/shop.type";

type ProductApiResponse =
  | ShopProduct[]
  | {
      items: ShopProduct[];
    }
  | {
      data: ShopProduct[];
    };

function normalizeProducts(response: ProductApiResponse): ShopProduct[] {
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

function buildQuery(params?: {
  search?: string;
  categoryId?: string;
  isActive?: boolean;
}): string {
  const searchParams = new URLSearchParams();

  if (params?.search?.trim()) {
    searchParams.set("search", params.search.trim());
  }

  if (params?.categoryId?.trim() && params.categoryId !== "all") {
    searchParams.set("categoryId", params.categoryId.trim());
  }

  if (typeof params?.isActive === "boolean") {
    searchParams.set("isActive", String(params.isActive));
  }

  const queryString = searchParams.toString();

  return queryString ? `?${queryString}` : "";
}

export const shopService = {
  async getProducts(params?: {
    search?: string;
    categoryId?: string;
    isActive?: boolean;
  }): Promise<ShopProduct[]> {
    const query = buildQuery(params);

    const response = await apiClient<ProductApiResponse>(
      `/products${query}`
    );

    return normalizeProducts(response);
  },

  async placeOrder(
    payload: PlaceOrderRequest
  ): Promise<PlaceOrderResponse> {
    return apiClient<PlaceOrderResponse>("/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};