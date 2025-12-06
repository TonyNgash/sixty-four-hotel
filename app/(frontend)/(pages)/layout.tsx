// app/(frontend)/(pages)/layout.tsx
import type { ReactNode } from 'react';
import ProgressBar from '@/components/shared/progress-bar';
import LuxuryLoader from '@/components/shared/page-loader';

export default function PagesLayout({ children }: { children: ReactNode }) {
  return (
    <>
    <ProgressBar />
    <LuxuryLoader  />
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
    </>
    
  );
}