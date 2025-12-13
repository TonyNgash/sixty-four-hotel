// app/(customer)/(protected)/dashboard/page.tsx
'use client';

import { useCustomerAuthContext } from '@/components/customer/auth/customer-auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ROUTES } from '@/lib/constants/routes';
import { useCustomerBookings } from '@/hooks/use-bookings';
import { BookingCard } from '@/components/customer/shared/booking-card';
import LuxuryLoader from '@/components/shared/page-loader';

export default function CustomerDashboardPage() {
  const { user, isLoading: authLoading } = useCustomerAuthContext();
  const router = useRouter();
  const { bookings, isLoading: bookingsLoading, error } = useCustomerBookings();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(ROUTES.customer.login);
    }
  }, [user, authLoading, router]);

  if (authLoading || bookingsLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center items-center min-h-[400px]">
          <LuxuryLoader />
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

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Your Bookings
        </h2>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {bookings.length === 0 && !error ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              You haven&apos;t made any bookings yet.
            </p>
            <button 
              onClick={() => router.push('/accommodation')}
              className="bg-amber-600 text-white px-6 py-2 rounded-md hover:bg-amber-700"
            >
              Browse Rooms
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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