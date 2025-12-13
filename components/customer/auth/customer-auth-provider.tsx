// components/customer/auth/customer-auth-provider.tsx
'use client';

import { createContext, ReactNode, useContext } from 'react';
import { useCustomerAuthPhone } from '@/hooks/use-customer-auth-phone';
import type { CustomerAuthContextType } from '@/hooks/use-customer-auth';

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

interface CustomerAuthProviderProps {
  children: ReactNode;
}

export function CustomerAuthProvider({ children }: CustomerAuthProviderProps) {
  const authLogic = useCustomerAuthPhone();
  
  return (
    <CustomerAuthContext.Provider value={authLogic}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuthContext() {
  const context = useContext(CustomerAuthContext);
  if (context === undefined) {
    throw new Error('useCustomerAuthContext must be used within a CustomerAuthProvider');
  }
  return context;
}