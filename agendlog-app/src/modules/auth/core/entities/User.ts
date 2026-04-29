// src/modules/auth/core/entities/User.ts
export type UserRole = 'ADMIN' | 'ANALYST' | 'CHECKER' | 'SUPPLIER';
export type UserStatus = 'ACTIVE' | 'INACTIVE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  companyId?: string | null;
  createdAt: string;
}
