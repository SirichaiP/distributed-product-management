// types/product.ts
export type ProductStatus = 'Active' | 'Inactive';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
  description: string;
  weight?: string;
  dimensions?: string;
  warranty?: string;
  createdAt: string;
  updatedAt: string;
}
