// src/mocks/stock.mock.ts

import type { StockProduct } from "@/types/stock.type";

export const mockStockProducts: StockProduct[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    name: 'MacBook Pro 14"',
    sku: "ELEC-MB-001",
    category: "Electronics",
    price: 59900,
    stock: 42,
    status: "Active",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "iPhone 15 Pro",
    sku: "ELEC-IP-002",
    category: "Electronics",
    price: 44900,
    stock: 3,
    status: "Active",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    name: "Sony WH-1000XM5",
    sku: "ELEC-HP-003",
    category: "Electronics",
    price: 12900,
    stock: 0,
    status: "Active",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    name: "Gaming Mouse Pro",
    sku: "ACC-GM-004",
    category: "Accessories",
    price: 890,
    stock: 8,
    status: "Active",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    name: "Mechanical Keyboard",
    sku: "ACC-MK-005",
    category: "Accessories",
    price: 2990,
    stock: 55,
    status: "Inactive",
  },
];