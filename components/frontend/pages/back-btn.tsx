// components/BackButton.tsx (Client Component)
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeftIcon } from 'lucide-react';

export default function BackButton() {
  const pathname = usePathname();
  const router = useRouter();
  
  const parentPath = pathname.substring(0, pathname.lastIndexOf('/')) || '/';
  
  const handleBack = () => {
    router.back(); // Or router.push(parentPath);
  };

  return (
          <button 
          onClick={handleBack}
          className='flex gap-4 text-md cursor-pointer'>
            <ArrowLeftIcon className="w-5 h-5" /> Back
          </button>
  );
}