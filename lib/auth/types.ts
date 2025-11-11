// lib/auth/types.ts

export interface JWTPayload {
  userId: number;
  email: string;
  role: 'admin' | 'staff' | 'customer';
  iat?: number; // issued at
  exp?: number; // expiration
}

export interface User {
  id: number;
  email: string;
  role: 'admin' | 'staff' | 'customer';
  first_name: string | null;
  last_name: string | null;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}