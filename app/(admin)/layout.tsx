'use client'; // ← ADD THIS if missing

import { AuthProvider } from '@/components/auth/auth-provider';
import { DebugAuth } from '@/components/auth/debug-auth';


export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
   
  console.log('AdminLayout rendering'); // ← Add this for debugging

  return (
    <AuthProvider>
      {/* <DebugAuth /> */}
        {children}
    </AuthProvider>
  );
}