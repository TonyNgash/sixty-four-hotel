'use client';

import { useEffect, useState } from 'react';
import { useAuth } from './use-auth';
import { useRouter } from 'next/navigation'; // ← ADD THIS

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
    console.log('Login attempt started'); // ← DEBUG
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const success = await login(email, password);
      console.log('Login result:', success)

      // if (!success) {
      //   // ← DEBUG
      //   setState(prev => ({...prev,error: 'Invalid email or password',attempts: prev.attempts + 1,}));
        
      //   return false;
      // }
      if (success) {
        // ← DEBUG
        setState(prev => ({ ...prev, error: null, attempts: 0 }));
        if (success && isRouterReady) {
          router.push('/dashboard');
          return true;
        }
        
        return true;
      }
      setState(prev => ({...prev,error: 'Invalid email or password',attempts: prev.attempts + 1,}));
      return false;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Login failed. Please try again.',
        attempts: prev.attempts + 1,
      }));
      return false;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return {
    ...state,
    handleLogin,
  };
}