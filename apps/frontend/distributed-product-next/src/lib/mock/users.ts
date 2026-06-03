import { User } from "@/types/user.type";

export const users: User[] = [
  {
    id: 1,
    fullName: "Admin User",
    email: "admin@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: 2,
    fullName: "John Doe",
    email: "john@example.com",
    role: "Customer",
    status: "Active",
  },
];