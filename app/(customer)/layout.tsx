// app/(customer)/layout.tsx
'use client';

import { usePathname } from 'next/navigation';
import { CustomerAuthProvider } from '@/components/customer/auth/customer-auth-provider';
import { CustomerHeader } from '@/components/customer/layout/customer-header';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ProgressBar from '@/components/shared/progress-bar';
import LuxuryLoader from '@/components/shared/page-loader';

interface CustomerLayoutProps {
  children: React.ReactNode;
}

export default function CustomerLayout({ children }: CustomerLayoutProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    // This layout's only job is to provide the context and render the structure.
    // It does not need to know about the user's auth state itself.
    <CustomerAuthProvider>
      {isLoginPage ? (
        // For the login page, use the main site layout components
        <>
          <Header />
          <ProgressBar />
          <LuxuryLoader />
          <main className="flex-1 min-h-0">
            {children}
          </main>
          <Footer />
        </>
      ) : (
        // For all other (protected) pages, use the customer-specific layout
        <div className="min-h-screen bg-gray-50">
          <CustomerHeader />
          <ProgressBar />
          <LuxuryLoader />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      )}
    </CustomerAuthProvider>
  );
}