// data/mockUsers.ts
import { UserProfile } from '@/types/user.type';

export const mockUsers: UserProfile[] = [
  {
    id: 'usr-1',
    name: 'Admin User',
    email: 'admin@dpms.io',
    role: 'Admin',
    status: 'Active',
    createdAt: '01/01/2025',
    lastLogin: '12/05/2025 10:30',
    avatarColor: 'linear-gradient(135deg, #2563EB, #7C3AED)',
  },
  {
    id: 'usr-2',
    name: 'Jane Smith',
    email: 'jane@dpms.io',
    role: 'User',
    status: 'Active',
    createdAt: '05/01/2025',
    lastLogin: '12/05/2025 09:20',
    avatarColor: 'linear-gradient(135deg, #059669, #047857)',
  },
  {
    id: 'usr-3',
    name: 'John Doe',
    email: 'john@dpms.io',
    role: 'User',
    status: 'Active',
    createdAt: '10/01/2025',
    lastLogin: '11/05/2025 16:45',
    avatarColor: 'linear-gradient(135deg, #D97706, #B45309)',
  },
  {
    id: 'usr-4',
    name: 'Mike Johnson',
    email: 'mike@dpms.io',
    role: 'User',
    status: 'Inactive',
    createdAt: '15/01/2025',
    lastLogin: '01/04/2025 12:00',
    avatarColor: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
  },
];

// The currently logged-in user — change role to 'User' to test restricted views
export const currentUser = {
  id: 'usr-1',
  name: 'Admin User',
  email: 'admin@dpms.io',
  role: 'Admin' as const,
  initials: 'AU',
};
