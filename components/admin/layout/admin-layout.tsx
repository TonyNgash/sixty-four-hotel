'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './sidebar';
import { MobileHeader } from './mobile-header';
import { MobileDrawer } from './mobile-drawer';
import { useAuth } from '@/hooks/use-auth';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  // 🔐 LAYER 1: Client-side protection & navigation
  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!isLoading && !user) {
      console.log('AdminLayout: No user detected, redirecting to login');
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // 🚪 Enhanced logout with navigation
  const handleLogout = async () => {
    console.log('AdminLayout: Logout initiated');
    await logout();
    // Force navigation to login after logout
    router.push('/login');
  };

  // ⏳ Loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // 🛡️ Protection: Don't render layout if no user
  if (!user) {
    console.log('AdminLayout: No user, not rendering layout');
    return null; // Will redirect via useEffect above
  }

  // ✅ User is authenticated - render the admin layout
  return (
    <>
      <div>
        {/* Mobile drawer */}
        <MobileDrawer open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {/* Desktop sidebar */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <Sidebar />
        </div>

        {/* Mobile header */}
        <MobileHeader onMenuClick={() => setSidebarOpen(true)} />

        {/* Main content */}
        <main className="lg:pl-72">
          <div className="min-h-screen bg-gray-50">
            {/* Top bar with user info */}
            <div className="bg-white shadow-sm border-b">
              <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                  <p className="text-gray-600">
                    Welcome back, {user.first_name} {user.last_name}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Page content */}
            <div className="p-4 sm:p-6 lg:p-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}