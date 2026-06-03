// src/types/stock.type.ts

export type StockStatus = "ok" | "warn" | "low";

export type StockFilter = "all" | StockStatus;

export type AdjustStockType = "add" | "subtract" | "set";

export type ProductActiveStatus = "Active" | "Inactive";

export interface StockProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: ProductActiveStatus;
}

export interface StockSummary {
  totalProducts: number;
  unitsInStock: number;
  lowStock: number;
  outOfStock: number;
}

export interface AdjustStockRequest {
  quantity: number;
  type: AdjustStockType;
}

export interface ReserveStockRequest {
  orderId: string;
  quantity: number;
  expiresAt: string;
}