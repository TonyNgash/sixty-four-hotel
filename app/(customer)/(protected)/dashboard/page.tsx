// app/(customer)/dashboard/page.tsx
'use client';

import { useCustomerAuthContext } from '@/components/customer/auth/customer-auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ROUTES } from '@/lib/constants/routes';

export default function CustomerDashboardPage() {
  const { user, isLoading } = useCustomerAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(ROUTES.customer.login);
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Redirect will happen in useEffect
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back{user.first_name ? `, ${user.first_name}` : ''}!
        </h1>
        <p className="text-gray-600">
          Manage your bookings and view your reservation history.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Your Bookings
        </h2>
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            Your bookings will appear here once you make a reservation.
          </p>
          <p className="text-sm text-gray-400">
            This dashboard will show both current and past bookings.
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Account Information
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            {user.first_name && (
              <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Need Help?
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Contact our customer service for assistance with your bookings.
          </p>
          <button className="bg-amber-600 text-white px-4 py-2 rounded-md text-sm hover:bg-amber-700">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}