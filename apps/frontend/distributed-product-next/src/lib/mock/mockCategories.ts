// data/mockCategories.ts
import { Category } from '@/types/category.type';

export const mockCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Electronic devices and gadgets',
    status: 'Active',
    totalProducts: 86,
    activeProducts: 82,
    iconColor: 'icon-blue',
    createdAt: '01/01/2025',
    updatedAt: '10/05/2025',
  },
  {
    id: 'cat-2',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Gadget and device accessories',
    status: 'Active',
    totalProducts: 24,
    activeProducts: 20,
    iconColor: 'icon-green',
    createdAt: '01/01/2025',
    updatedAt: '08/05/2025',
  },
  {
    id: 'cat-3',
    name: 'Home Appliances',
    slug: 'home-appliances',
    description: 'Kitchen and home appliances',
    status: 'Active',
    totalProducts: 12,
    activeProducts: 10,
    iconColor: 'icon-yellow',
    createdAt: '15/01/2025',
    updatedAt: '05/05/2025',
  },
  {
    id: 'cat-4',
    name: 'Lifestyle',
    slug: 'lifestyle',
    description: 'Lifestyle products',
    status: 'Inactive',
    totalProducts: 6,
    activeProducts: 0,
    iconColor: 'icon-red',
    createdAt: '20/01/2025',
    updatedAt: '01/04/2025',
  },
];

export interface CategoryStat {
  label: string;
  value: string | number;
  iconClass: string;
  icon: string;
}

export const categoryStats: CategoryStat[] = [
  { label: 'Total Categories', value: 4, iconClass: 'icon-blue', icon: 'categories' },
  { label: 'Active', value: 3, iconClass: 'icon-green', icon: 'check' },
  { label: 'Total Products', value: 128, iconClass: 'icon-yellow', icon: 'products' },
  { label: 'Inactive', value: 1, iconClass: 'icon-red', icon: 'warning' },
];
