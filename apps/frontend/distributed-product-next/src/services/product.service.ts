import { apiClient } from "@/lib/api-client";
import {
  AdjustStockRequest,
  CreateProductRequest,
  ProductResponse,
  ReserveStockRequest,
  UpdateProductRequest,
} from "@/types/product.type";

type ProductApiResponse =
  | ProductResponse[]
  | {
      items: ProductResponse[];
    }
  | {
      data: ProductResponse[];
    };

function normalizeProducts(response: ProductApiResponse): ProductResponse[] {
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

  if (params?.categoryId?.trim()) {
    searchParams.set("categoryId", params.categoryId.trim());
  }

  if (typeof params?.isActive === "boolean") {
    searchParams.set("isActive", String(params.isActive));
  }

  const queryString = searchParams.toString();

  return queryString ? `?${queryString}` : "";
}

export const productService = {
  async getProducts(params?: {
    search?: string;
    categoryId?: string;
    isActive?: boolean;
  }): Promise<ProductResponse[]> {
    const query = buildQuery(params);

    const response = await apiClient<ProductApiResponse>(
      `/products${query}`,
      {
        method: "GET",
      }
    );

    return normalizeProducts(response);
  },

  async getProductById(id: string): Promise<ProductResponse> {
    return apiClient<ProductResponse>(`/products/${id}`, {
      method: "GET",
    });
  },

  async createProduct(
    payload: CreateProductRequest
  ): Promise<ProductResponse> {
    return apiClient<ProductResponse>("/products", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async updateProduct(
    id: string,
    payload: UpdateProductRequest
  ): Promise<ProductResponse> {
    return apiClient<ProductResponse>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  async deleteProduct(id: string): Promise<void> {
    await apiClient<void>(`/products/${id}`, {
      method: "DELETE",
    });
  },

  async adjustStock(
    id: string,
    payload: AdjustStockRequest
  ): Promise<ProductResponse> {
    return apiClient<ProductResponse>(
      `/products/${id}/adjust-stock`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  },

  async reserveStock(
    id: string,
    payload: ReserveStockRequest
  ): Promise<boolean> {
    return apiClient<boolean>(`/products/${id}/reserve-stock`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};