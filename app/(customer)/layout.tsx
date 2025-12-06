// app/(customer)/layout.tsx
import { CustomerAuthProvider } from '@/components/customer/auth/customer-auth-provider';
import { CustomerHeader } from '@/components/customer/layout/customer-header';
import Header from '@/components/layout/header';
import type { Metadata } from 'next';
import ProgressBar from '@/components/shared/progress-bar';
import LuxuryLoader from '@/components/shared/page-loader';

export const metadata: Metadata = {
  title: 'Hotel Booking - Customer Portal',
  description: 'Manage your hotel bookings and reservations',
};

interface CustomerLayoutProps {
  children: React.ReactNode;
}

export default function CustomerLayout({ children }: CustomerLayoutProps) {
  return (
    <CustomerAuthProvider>
      <div className="min-h-screen bg-gray-50">
        <CustomerHeader />
          <ProgressBar />
          <LuxuryLoader  />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </CustomerAuthProvider>
  );
}