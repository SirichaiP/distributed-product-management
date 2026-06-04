import { apiClient } from "@/lib/api-client";

export interface CategoryResponse {
  id: string;
  name: string;
  slug?: string | null;
  description?: string | null;
  isActive?: boolean;
}

type CategoryApiResponse =
  | CategoryResponse[]
  | {
      items: CategoryResponse[];
    }
  | {
      data: CategoryResponse[];
    };

function normalizeCategories(response: CategoryApiResponse): CategoryResponse[] {
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
  }): Promise<CategoryResponse[]> {
    const endpoint = buildCategoryEndpoint(params);

    const response = await apiClient<CategoryApiResponse>(endpoint, {
      method: "GET",
    });

    return normalizeCategories(response);
  },

  async getAll(params?: {
    search?: string;
    isActive?: boolean;
  }): Promise<CategoryResponse[]> {
    return this.getCategories(params);
  },
};