'use client';

import { useAuth } from '@/hooks/use-auth';

export function DebugAuth() {
  try {
    const auth = useAuth();
    return <div style={{background: 'green', color: 'white', padding: '10px'}}>
      ✅ Auth Context WORKS! User: {auth.user ? auth.user.email : 'null'}
    </div>;
  } catch (error) {
    return <div style={{background: 'red', color: 'white', padding: '10px'}}>
      ❌ Auth Context FAILED: {(error as Error).message}
    </div>;
  }
}