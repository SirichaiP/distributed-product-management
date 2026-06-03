export interface User {
  id: number;
  fullName: string;
  email: string;
  role: "Admin" | "Customer";
  status: "Active" | "Inactive";
}

// types/auth.ts
export type Role = 'Admin' | 'User';


export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'Active' | 'Inactive';
  createdAt: string;
  lastLogin: string;
  avatarColor: string; // tailwind/css gradient key
}

