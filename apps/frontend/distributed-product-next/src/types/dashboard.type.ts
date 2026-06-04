export interface DashboardSummary {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalRevenue: number;
}

export interface DashboardRecentOrder {
  id: string;
  orderNo: string;
  customerName: string;
  status: string;
  totalAmount: number;
  createdAt: string;
}

export interface DashboardTopSellingProduct {
  id: string;
  name: string;
  soldQuantity: number;
  totalAmount: number;
}

export interface DashboardResponse {
  summary: DashboardSummary;
  recentOrders: DashboardRecentOrder[];
  topSellingProducts: DashboardTopSellingProduct[];
}