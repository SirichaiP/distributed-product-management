// types/auth.ts
export type Role = 'Admin' | 'User';

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  initials: string;
}
