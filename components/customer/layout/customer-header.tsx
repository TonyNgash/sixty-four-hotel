// components/customer/layout/customer-header.tsx
'use client';

import { useCustomerAuthContext } from '@/components/customer/auth/customer-auth-provider';
import { ROUTES } from '@/lib/constants/routes';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export function CustomerHeader() {
  const { user, logout, isLoading } = useCustomerAuthContext();
  const router = useRouter();

  const handleLogout = async (): Promise<void> => {
    await logout();
    router.push(ROUTES.customer.login);
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link 
            href="/" 
            className="text-2xl font-bold text-amber-600 hover:text-amber-700"
          >
            <Image 
              src="/images/frontend/sixty_four_logo-_no_bg_cropped.png" 
              alt="SixtyFour Hotel" 
              className="h-10 w-auto"
              width={160}
              height={40}
            />
          </Link>

          <nav className="flex items-center space-x-6">
            {isLoading ? (
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  Welcome, {user.first_name || user.email}
                </span>
                <Link
                  href={ROUTES.customer.dashboard}
                  className="text-amber-600 hover:text-amber-700 font-medium"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-gray-700 font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href={ROUTES.customer.login}
                className="text-amber-600 hover:text-amber-700 font-medium"
              >
                Customer Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}