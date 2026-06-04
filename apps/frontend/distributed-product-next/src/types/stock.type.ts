// src/types/stock.type.ts
export type StockStatus = "ok" | "warn" | "low";
export interface StockProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  reserved: number;
  available: number;
  price: number;
  status: string;
}

export interface StockSummary {
  totalProducts: number;
  unitsInStock: number;
  lowStock: number;
  outOfStock: number;
}

export interface AdjustStockRequest {
  quantity: number;
  type?: string;
}

export interface ReserveStockRequest {
  orderId: string;
  quantity: number;
  expiresAt: string;
}

export interface ProductApiResponse {
  id: string;
  name: string;
  sku?: string | null;

  price?: number | null;
  unitPrice?: number | null;

  stock?: number | null;
  stockQuantity?: number | null;

  reserved?: number | null;
  reservedQuantity?: number | null;

  available?: number | null;
  availableQuantity?: number | null;

  isActive?: boolean;

  category?:
    | string
    | {
        id?: string;
        name?: string;
      }
    | null;

  categoryName?: string | null;
}