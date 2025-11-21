// app/(admin)/protected/layout.tsx
'use client';

import { AdminLayout } from '@/components/admin/layout/admin-layout';

export default function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}