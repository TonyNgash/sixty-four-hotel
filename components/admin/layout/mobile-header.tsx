'use client';

import { Bars3Icon } from '@heroicons/react/24/outline';

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm lg:hidden">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>
      <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
        Sixty Four Hotel Admin
      </div>
    </div>
  );
}