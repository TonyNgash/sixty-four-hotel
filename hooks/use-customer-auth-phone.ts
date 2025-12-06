// hooks/use-customer-auth.ts
'use client';

import { useState, useEffect } from 'react';

interface CustomerUser {
  id: number;
  email: string;
  role: 'customer';
  first_name: string | null;
  last_name: string | null;
  phone: string;
}

export interface CustomerAuthContextType {
  user: CustomerUser | null;
  isLoading: boolean;
  requestOtp: (phone: string) => Promise<{ success: boolean; error?: string, otp?: string }>;
  verifyOtp: (phone: string, code: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

export function useCustomerAuthPhone(): CustomerAuthContextType {
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async (): Promise<void> => {
    try {
      const response = await fetch('/api/auth/customer/me');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setUser(data.user);
        }
      }
    } catch (error) {
      console.error('Customer auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const requestOtp = async (phone: string): Promise<{ success: boolean; error?: string; otp?: string }> => {
    try {
      const response = await fetch('/api/auth/customer/request-otp-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();
      console.log('Received OTP (for testing purposes):', data.otp);
      return data;
    } catch (error) {
      console.error('OTP request failed:', error);
      return { success: false, error: 'Failed to request OTP' };
    }
  };

  const verifyOtp = async (phone: string, code: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/customer/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code }),
      });

      const data = await response.json();
      
      if (data.success && data.user) {
        setUser(data.user);
      }
      
      return data;
    } catch (error) {
      console.error('OTP verification failed:', error);
      return { success: false, error: 'Failed to verify OTP' };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch('/api/auth/customer/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
    }
  };

  return {
    user,
    isLoading,
    requestOtp,
    verifyOtp,
    logout,
  };
}