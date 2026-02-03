export interface UserFilters {
  role?: string;
  isActive?: boolean;
  search?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  emailVerified: boolean;
}