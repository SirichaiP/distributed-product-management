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

export const categoryService = {
  async getCategories(params?: {
    search?: string;
    isActive?: boolean;
  }): Promise<CategoryResponse[]> {
    const searchParams = new URLSearchParams();

    if (params?.search?.trim()) {
      searchParams.set("search", params.search.trim());
    }

    if (params?.isActive !== undefined) {
      searchParams.set("isActive", String(params.isActive));
    }

    const query = searchParams.toString();
    const endpoint = query ? `/categories?${query}` : "/categories";

    const response = await apiClient<CategoryApiResponse>(endpoint, {
      method: "GET",
    });

    return normalizeCategories(response);
  },
};