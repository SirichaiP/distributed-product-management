// data/mockDashboard.ts

export interface StatCard {
  label: string;
  value: string;
  colorClass: string;
  icon: string;
  href: string;
}

export interface RecentOrder {
  id: string;
  customer: string;
  status: 'Completed' | 'Processing' | 'Shipped' | 'Cancelled';
  total: string;
  date: string;
}

export interface TopProduct {
  rank: number;
  name: string;
  sold: number;
  revenue: string;
}

export const statCards: StatCard[] = [
  { label: 'Total Products', value: '128', colorClass: 'stat-card-blue', icon: 'products', href: '/dashboard/products' },
  { label: 'Total Categories', value: '12', colorClass: 'stat-card-green', icon: 'categories', href: '/dashboard/categories' },
  { label: 'Total Orders', value: '356', colorClass: 'stat-card-purple', icon: 'orders', href: '/dashboard/orders' },
  { label: 'Total Revenue', value: '฿245,620', colorClass: 'stat-card-orange', icon: 'revenue', href: '#' },
];

export const recentOrders: RecentOrder[] = [
  { id: 'ORD-202505-0005', customer: 'John Doe', status: 'Completed', total: '฿2,150.00', date: '12/05/2025 10:30' },
  { id: 'ORD-202505-0004', customer: 'Jane Smith', status: 'Processing', total: '฿1,890.00', date: '12/05/2025 09:20' },
  { id: 'ORD-202505-0003', customer: 'John Doe', status: 'Shipped', total: '฿3,250.00', date: '11/05/2025 16:45' },
  { id: 'ORD-202505-0002', customer: 'Mike Johnson', status: 'Completed', total: '฿1,420.00', date: '11/05/2025 14:10' },
  { id: 'ORD-202505-0001', customer: 'Jane Smith', status: 'Cancelled', total: '฿950.00', date: '10/05/2025 11:05' },
];

export const topProducts: TopProduct[] = [
  { rank: 1, name: 'Wireless Headphones', sold: 120, revenue: '฿59,880' },
  { rank: 2, name: 'Smart Watch Series 8', sold: 95, revenue: '฿85,500' },
  { rank: 3, name: 'Bluetooth Speaker', sold: 88, revenue: '฿17,600' },
  { rank: 4, name: 'Gaming Mouse', sold: 75, revenue: '฿11,250' },
  { rank: 5, name: 'Mechanical Keyboard', sold: 60, revenue: '฿18,000' },
];
