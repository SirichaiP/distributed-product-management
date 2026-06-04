import { apiClient } from "@/lib/api-client";
import { ProductResponse } from "@/types/product.type";
import { CategoryOption } from "@/types/product.type";
import { OrderResponse } from "@/types/order.type";
import {
  DashboardRecentOrder,
  DashboardResponse,
  DashboardTopSellingProduct,
} from "@/types/dashboard.type";

type ProductApiResponse =
  | ProductResponse[]
  | { items: ProductResponse[] }
  | { data: ProductResponse[] };

type CategoryApiResponse =
  | CategoryOption[]
  | { items: CategoryOption[] }
  | { data: CategoryOption[] };

type OrderApiResponse =
  | OrderResponse[]
  | { items: OrderResponse[] }
  | { data: OrderResponse[] };

interface DashboardOrderItem {
  productId?: string;
  productName?: string;
  name?: string;
  quantity?: number;
  unitPrice?: number;
  price?: number;
  product?: {
    id?: string;
  };
}

interface DashboardOrderExtra {
  id?: string;
  orderNo?: string;
  orderNumber?: string;

  totalAmount?: number;
  total?: number;
  grandTotal?: number;

  customerName?: string;
  userName?: string;
  customer?: {
    name?: string;
  };
  user?: {
    name?: string;
  };

  createdAt?: string;
  orderDate?: string;
  date?: string;

  status?: string;

  items?: DashboardOrderItem[];
  orderItems?: DashboardOrderItem[];
}

type DashboardOrder = OrderResponse & DashboardOrderExtra;

function normalizeArray<T>(
  response: T[] | { items?: T[]; data?: T[] }
): T[] {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.items)) return response.items;
  if (Array.isArray(response.data)) return response.data;

  return [];
}

function getOrderTotal(order: DashboardOrder): number {
  return Number(order.totalAmount ?? order.total ?? order.grandTotal ?? 0);
}

function getOrderCustomerName(order: DashboardOrder): string {
  return (
    order.customerName ??
    order.userName ??
    order.customer?.name ??
    order.user?.name ??
    "Customer"
  );
}

function getOrderCreatedAt(order: DashboardOrder): string {
  return (
    order.createdAt ??
    order.orderDate ??
    order.date ??
    new Date().toISOString()
  );
}

function getOrderNo(order: DashboardOrder): string {
  return (
    order.orderNo ??
    order.orderNumber ??
    `ORD-${String(order.id ?? "").slice(0, 8)}`
  );
}

function getOrderItems(order: DashboardOrder): DashboardOrderItem[] {
  return order.items ?? order.orderItems ?? [];
}

function buildTopSellingProducts(
  orders: DashboardOrder[],
  products: ProductResponse[]
): DashboardTopSellingProduct[] {
  const productMap = new Map<string, ProductResponse>();

  products.forEach((product: ProductResponse) => {
    productMap.set(product.id.toLowerCase(), product);
  });

  const result = new Map<string, DashboardTopSellingProduct>();

  orders.forEach((order: DashboardOrder) => {
    const items = getOrderItems(order);

    items.forEach((item: DashboardOrderItem) => {
      const productId = String(
        item.productId ?? item.product?.id ?? ""
      ).toLowerCase();

      if (!productId) return;

      const product = productMap.get(productId);
      const quantity = Number(item.quantity ?? 0);
      const unitPrice = Number(
        item.unitPrice ?? item.price ?? product?.price ?? 0
      );

      const current = result.get(productId);

      if (current) {
        current.soldQuantity += quantity;
        current.totalAmount += quantity * unitPrice;
      } else {
        result.set(productId, {
          id: productId,
          name:
            item.productName ??
            item.name ??
            product?.name ??
            "Unknown Product",
          soldQuantity: quantity,
          totalAmount: quantity * unitPrice,
        });
      }
    });
  });

  return Array.from(result.values())
    .sort(
      (
        a: DashboardTopSellingProduct,
        b: DashboardTopSellingProduct
      ) => b.soldQuantity - a.soldQuantity
    )
    .slice(0, 5);
}

export const dashboardService = {
  async getDashboard(): Promise<DashboardResponse> {
    const [productsResponse, categoriesResponse, ordersResponse] =
      await Promise.all([
        apiClient<ProductApiResponse>("/products"),
        apiClient<CategoryApiResponse>("/categories"),
        apiClient<OrderApiResponse>("/orders"),
      ]);

    const products = normalizeArray<ProductResponse>(productsResponse);
    const categories = normalizeArray<CategoryOption>(categoriesResponse);

    const orders = normalizeArray<OrderResponse>(
      ordersResponse
    ) as DashboardOrder[];

    const totalRevenue = orders.reduce(
      (sum: number, order: DashboardOrder) => {
        const status = String(order.status ?? "").toLowerCase();

        if (status === "cancelled" || status === "canceled") {
          return sum;
        }

        return sum + getOrderTotal(order);
      },
      0
    );

    const recentOrders: DashboardRecentOrder[] = orders
      .map((order: DashboardOrder) => ({
        id: String(order.id ?? ""),
        orderNo: getOrderNo(order),
        customerName: getOrderCustomerName(order),
        status: String(order.status ?? "Pending"),
        totalAmount: getOrderTotal(order),
        createdAt: getOrderCreatedAt(order),
      }))
      .sort(
        (a: DashboardRecentOrder, b: DashboardRecentOrder) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      )
      .slice(0, 5);

    return {
      summary: {
        totalProducts: products.length,
        totalCategories: categories.length,
        totalOrders: orders.length,
        totalRevenue,
      },
      recentOrders,
      topSellingProducts: buildTopSellingProducts(orders, products),
    };
  },
};