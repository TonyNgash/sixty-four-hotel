'use client';

import { useState } from 'react';
import { Sidebar } from './sidebar';
import { MobileHeader } from './mobile-header';
import { MobileDrawer } from './mobile-drawer';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants/routes';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  // FIXED: Default to false — drawer closed on load
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.replace(ROUTES.admin.login);
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.replace(ROUTES.admin.login);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* MOBILE DRAWER — only visible on <lg */}
      <MobileDrawer open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* DESKTOP SIDEBAR — fixed, always visible on lg+ */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-72">
          <Sidebar />
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        {/* MOBILE HEADER — only on <lg */}
        <MobileHeader onMenuClick={() => setSidebarOpen(true)} />

        {/* PAGE CONTENT */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* User Greeting + Logout */}
              <div className="flex justify-between items-center mb-6">
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

              {/* Page Children */}
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}