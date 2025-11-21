'use client';

import { useEffect, useState } from 'react';
import { useAuth } from './use-auth';
import { useRouter } from 'next/navigation'; // ← ADD THIS
import { ROUTES } from '@/lib/constants/routes';


interface LoginState {
  isLoading: boolean;
  error: string | null;
  attempts: number;
}

export function useLogin() {
  const [state, setState] = useState<LoginState>({
    isLoading: false,
    error: null,
    attempts: 0,
  });
  
  const { login } = useAuth();
  const router = useRouter(); // ← ADD THIS
  const [isRouterReady, setIsRouterReady] = useState(false);

  useEffect(() => {
    setIsRouterReady(true);
  }, []);


  const handleLogin = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const success = await login(email, password);

      if (success) {
        setState(prev => ({ ...prev, error: null, attempts: 0 }));
        if (isRouterReady) {
          router.push(ROUTES.admin.dashboard); // ← NOW /admin-dashboard
        }
        return true;
      }

      setState(prev => ({
        ...prev,
        error: 'Invalid email or password',
        attempts: prev.attempts + 1,
      }));
      return false;
    } catch (error) {
      // ... error handling
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return { ...state, handleLogin };
}