// app/(admin)/protected/layout.tsx
'use client';

import { AdminLayout } from '@/components/admin/layout/admin-layout';
import { ProtectedRoute } from '@/components/admin/auth/protected-route';

export default function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  );
}