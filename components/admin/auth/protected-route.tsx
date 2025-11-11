'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'staff';
}

export function ProtectedRoute({ children, requiredRole = 'admin' }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('ProtectedRoute useEffect - User:', user, 'Loading:', isLoading); 
    if (!isLoading && (!user || user.role !== requiredRole)) {
      console.log("we are at protected-route... are you going back to login?");
      router.push('/login');
    }
  }, [user, isLoading, requiredRole, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!user || user.role !== requiredRole) {
    console.log('ProtectedRoute - No user, not rendering children');
    return null;
  }
  console.log('ProtectedRoute - Rendering children');
  return <>{children}</>;
}