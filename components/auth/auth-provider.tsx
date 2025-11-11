'use client';

import { createContext, ReactNode } from 'react';
import { useAuthLogic } from '@/hooks/use-auth';
import type { AuthContextType } from '@/hooks/use-auth';
import { AuthContext } from '@/lib/auth/context';


// const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  console.log('AuthProvider rendering'); 
  const authLogic = useAuthLogic();
  
  return (
    <AuthContext.Provider value={authLogic}>
      {children}
    </AuthContext.Provider>
  );
}