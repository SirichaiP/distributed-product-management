import {
  MyOrder,
  MyOrderStats,
  MyOrderWithTotal,
  OrderStatus,
  OrderStatusMeta,
  OrderTimelineStep,
} from "@/types/order.type";

export const mockMyOrders: MyOrder[] = [
  {
    id: "ORD-202506-0008",
    date: "03/06/2026 09:15",
    status: "Processing",
    items: [
      {
        id: 1,
        name: "Smart Watch Series 9",
        emoji: "⌚",
        qty: 1,
        price: 899,
      },
      {
        id: 2,
        name: "USB-C Hub 7-in-1",
        emoji: "🔌",
        qty: 2,
        price: 120,
      },
    ],
  },
  {
    id: "ORD-202506-0007",
    date: "02/06/2026 14:30",
    status: "Shipped",
    items: [
      {
        id: 3,
        name: "Mechanical Keyboard",
        emoji: "⌨️",
        qty: 1,
        price: 299,
      },
      {
        id: 4,
        name: "Gaming Mouse RGB",
        emoji: "🖱️",
        qty: 1,
        price: 150,
      },
    ],
  },
  {
    id: "ORD-202506-0006",
    date: "01/06/2026 11:00",
    status: "Completed",
    items: [
      {
        id: 5,
        name: "Wireless Headphones Pro",
        emoji: "🎧",
        qty: 1,
        price: 499,
      },
    ],
  },
  {
    id: "ORD-202505-0005",
    date: "28/05/2026 16:20",
    status: "Completed",
    items: [
      {
        id: 6,
        name: "Portable Charger 20000mAh",
        emoji: "🔋",
        qty: 2,
        price: 159,
      },
      {
        id: 7,
        name: "Laptop Stand Adjustable",
        emoji: "💻",
        qty: 1,
        price: 89,
      },
    ],
  },
  {
    id: "ORD-202505-0004",
    date: "25/05/2026 10:45",
    status: "Completed",
    items: [
      {
        id: 8,
        name: "SSD External 1TB",
        emoji: "💾",
        qty: 1,
        price: 399,
      },
    ],
  },
  {
    id: "ORD-202505-0003",
    date: "20/05/2026 08:30",
    status: "Processing",
    items: [
      {
        id: 9,
        name: "Noise Cancelling Earbuds",
        emoji: "🎵",
        qty: 1,
        price: 279,
      },
      {
        id: 10,
        name: "Bluetooth Speaker Mini",
        emoji: "🔊",
        qty: 1,
        price: 199,
      },
    ],
  },
  {
    id: "ORD-202505-0002",
    date: "15/05/2026 13:00",
    status: "Completed",
    items: [
      {
        id: 11,
        name: "Webcam 4K Ultra",
        emoji: "📷",
        qty: 1,
        price: 349,
      },
    ],
  },
  {
    id: "ORD-202505-0001",
    date: "10/05/2026 09:00",
    status: "Cancelled",
    items: [
      {
        id: 12,
        name: "Smart Ring Health",
        emoji: "💍",
        qty: 1,
        price: 599,
      },
    ],
  },
];

export const orderStatusMap: Record<OrderStatus, OrderStatusMeta> = {
  Completed: {
    label: "สำเร็จ",
    className: "badge-green",
  },
  Processing: {
    label: "กำลังดำเนินการ",
    className: "badge-blue",
  },
  Shipped: {
    label: "จัดส่งแล้ว",
    className: "badge-yellow",
  },
  Cancelled: {
    label: "ยกเลิก",
    className: "badge-red",
  },
};

export function mapOrdersWithTotal(orders: MyOrder[]): MyOrderWithTotal[] {
  return orders.map((order) => ({
    ...order,
    total: order.items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    ),
  }));
}

export function calculateOrderStats(
  orders: MyOrderWithTotal[]
): MyOrderStats {
  return {
    totalOrders: orders.length,
    completedOrders: orders.filter((order) => order.status === "Completed")
      .length,
    processingOrders: orders.filter(
      (order) =>
        order.status === "Processing" || order.status === "Shipped"
    ).length,
    totalAmount: orders.reduce((sum, order) => sum + order.total, 0),
  };
}

export function getOrderTimeline(
  status: OrderStatus
): OrderTimelineStep[] {
  if (status === "Cancelled") {
    return [
      {
        title: "คำสั่งซื้อถูกยกเลิก",
        time: "คำสั่งซื้อนี้ถูกยกเลิกแล้ว",
        state: "pending",
      },
    ];
  }

  const steps = [
    {
      title: "รับคำสั่งซื้อแล้ว",
      time: "ระบบรับออร์เดอร์เรียบร้อย",
    },
    {
      title: "กำลังดำเนินการ",
      time: "กำลังเตรียมสินค้า",
    },
    {
      title: "จัดส่งสินค้าแล้ว",
      time: "สินค้าออกจากคลัง",
    },
    {
      title: "สำเร็จ",
      time: "ได้รับสินค้าแล้ว",
    },
  ];

  const stateMap: Record<OrderStatus, number[]> = {
    Processing: [1, 1, 0, 0],
    Shipped: [1, 1, 1, 0],
    Completed: [1, 1, 1, 1],
    Cancelled: [0, 0, 0, 0],
  };

  const states = stateMap[status];
  const activeIndex = states.lastIndexOf(1);

  return steps.map((step, index) => ({
    ...step,
    state:
      states[index] === 0
        ? "pending"
        : index === activeIndex
          ? "active"
          : "done",
  }));
}