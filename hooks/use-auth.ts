'use client';

import { useState, useEffect, useContext, createContext } from 'react';
import { User } from '@/lib/auth/types';
import { AuthContext } from '@/lib/auth/context';
import { ROUTES } from '@/lib/constants/routes';

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// This hook contains the authentication logic (NO JSX)

export function useAuthLogic() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(ROUTES.api.adminLogin, { // ← DYNAMIC
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch(ROUTES.api.adminLogout, { method: 'POST' }); // ← DYNAMIC
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
    }
  };

  return {
    user,
    isLoading,
    login,
    logout,
  };
}

// This hook consumes the auth context
export function useAuth() {
  console.log('useAuthLogic called'); // ← Debug log
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}