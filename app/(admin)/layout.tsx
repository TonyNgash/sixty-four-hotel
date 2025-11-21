'use client';

import { AuthProvider } from '@/components/auth/auth-provider';

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}