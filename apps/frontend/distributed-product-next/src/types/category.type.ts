export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  isActive: boolean;

  productCount?: number;
  activeProductCount?: number;

  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface CreateCategoryRequest {
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

export interface UpdateCategoryRequest {
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}