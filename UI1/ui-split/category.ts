// types/category.ts
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: 'Active' | 'Inactive';
  totalProducts: number;
  activeProducts: number;
  iconColor: string; // CSS class for icon bg
  createdAt: string;
  updatedAt: string;
}
