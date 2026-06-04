import { apiClient } from "@/lib/api-client";
import {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/types/category.type";

type CategoryApiResponse =
  | Category[]
  | {
      items: Category[];
    }
  | {
      data: Category[];
    };

function normalizeCategories(response: CategoryApiResponse): Category[] {
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

function buildCategoryEndpoint(params?: {
  search?: string;
  isActive?: boolean;
}): string {
  const searchParams = new URLSearchParams();

  if (params?.search?.trim()) {
    searchParams.set("search", params.search.trim());
  }

  if (typeof params?.isActive === "boolean") {
    searchParams.set("isActive", String(params.isActive));
  }

  const query = searchParams.toString();

  return query ? `/categories?${query}` : "/categories";
}

export const categoryService = {
  async getCategories(params?: {
    search?: string;
    isActive?: boolean;
  }): Promise<Category[]> {
    const endpoint = buildCategoryEndpoint(params);

    const response = await apiClient<CategoryApiResponse>(endpoint, {
      method: "GET",
    });

    return normalizeCategories(response);
  },

  async getAll(params?: {
    search?: string;
    isActive?: boolean;
  }): Promise<Category[]> {
    return this.getCategories(params);
  },

  async getById(id: string): Promise<Category> {
    return apiClient<Category>(`/categories/${id}`, {
      method: "GET",
    });
  },

  async create(payload: CreateCategoryRequest): Promise<Category> {
    return apiClient<Category>("/categories", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async update(
    id: string,
    payload: UpdateCategoryRequest
  ): Promise<Category> {
    return apiClient<Category>(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  async remove(id: string): Promise<void> {
    const categoryId = String(id ?? "").trim();

    if (!categoryId) {
      throw new Error("Category id is required");
    }

    return apiClient<void>(`/categories/${categoryId}`, {
      method: "DELETE",
    });
  },

  async delete(id: string): Promise<void> {
    return this.remove(id);
  },
};