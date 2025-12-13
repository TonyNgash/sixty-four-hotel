//components/shared/page-loader.tsx
'use client'; 

import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function LuxuryLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // When route changes, start showing loader
    setShowLoader(true);
    setIsLoading(true);

    // Wait a tiny bit before hiding (makes it feel intentional)
    const timer = setTimeout(() => {
      setShowLoader(false);
      
      // Remove from DOM after fade out animation completes
      const removeTimer = setTimeout(() => {
        setIsLoading(false);
      }, 300); // Match this with CSS transition duration
      
      return () => clearTimeout(removeTimer);
    }, 800); // Show for at least 800ms (feels premium)

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  // Don't render anything if not loading
  if (!isLoading) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ease-out ${
        showLoader ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Blurred/dimmed overlay - 50% opacity */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />
      
      {/* Animated hotel monogram/logo */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Main animated logo/monogram - using your pink-500 */}
        <div className="relative">
          {/* Outer ring animation */}
          <div className="absolute -inset-4 border-2 border-pink-300/50 rounded-full animate-ping" />
          
          {/* Main logo circle */}
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
            {/* Hotel initial/logo - replace with your actual logo */}
            <span className="text-white text-2xl font-serif font-bold">H</span>
          </div>
          
          {/* Rotating accent dots */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-pink-300 rounded-full animate-bounce" />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-pink-200 rounded-full animate-pulse" />
        </div>
        
        {/* Optional subtle text */}
        <p className="mt-6 text-pink-600/70 text-sm font-light tracking-widest uppercase">
          Loading your experience
        </p>
      </div>
    </div>
  );
}