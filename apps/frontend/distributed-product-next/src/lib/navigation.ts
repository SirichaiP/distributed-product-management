// src/data/navigation.ts
// หรือ src/lib/navigation.ts

import { Role } from "@/types/user.type";

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  allowedRoles: Role[];
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const navigationSections: NavSection[] = [
  {
    label: "Main",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: "dashboard",
        allowedRoles: ["Admin"],
      },
    ],
  },

  {
    label: "Shop",
    items: [
      {
        label: "Shop",
        href: "/dashboard/shop",
        icon: "shop",
        allowedRoles: ["User"],
      },
      {
        label: "My Orders",
        href: "/dashboard/orders",
        icon: "orders",
        allowedRoles: ["User"],
      },
    ],
  },

  {
    label: "Catalog",
    items: [
      {
        label: "Categories",
        href: "/dashboard/categories",
        icon: "categories",
        allowedRoles: ["Admin"],
      },
      {
        label: "Products",
        href: "/dashboard/products",
        icon: "products",
        allowedRoles: ["Admin"],
      },
      {
  label: "Stock Management",
  href: "/dashboard/stock-management",
  icon: "stock",
  allowedRoles: ["Admin"],
},
    ],
  },

  // {
  //   label: "Order Management",
  //   items: [
  //     {
  //       label: "Orders",
  //       href: "/dashboard/orders",
  //       icon: "orders",
  //       allowedRoles: ["Admin"],
  //     },
  //     {
  //       label: "Order Items",
  //       href: "/dashboard/order-items",
  //       icon: "orderItems",
  //       allowedRoles: ["Admin"],
  //     },
  //   ],
  // },

  // {
  //   label: "Admin",
  //   items: [
  //     {
  //       label: "Users",
  //       href: "/dashboard/users",
  //       icon: "users",
  //       allowedRoles: ["Admin"],
  //     },
  //     {
  //       label: "Roles",
  //       href: "/dashboard/roles",
  //       icon: "roles",
  //       allowedRoles: ["Admin"],
  //     },
  //   ],
  // },
];