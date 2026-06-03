// src/services/dashboard.service.ts
import {
  statCards,
  recentOrders,
  topProducts,
} from "@/lib/mock/mockDashboard";

export const dashboardService = {
  getStats: async () => statCards,
  getRecentOrders: async () => recentOrders,
  getTopProducts: async () => topProducts,
};