'use client';

import { usePathname } from 'next/navigation';
import { navigation } from './navigation-items';
import { cn } from '@/lib/utils/cn';

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      <div className="flex h-16 shrink-0 items-center px-6 border-b">
        <h1 className="text-xl font-bold text-gray-900">Sixty Four Hotel Admin</h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <a
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center gap-x-3 rounded-md p-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-gray-50 text-blue-600'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              )}
            >
              <item.icon
                className={cn(
                  'h-6 w-6 shrink-0',
                  isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'
                )}
                aria-hidden="true"
              />
              {item.name}
            </a>
          );
        })}
      </nav>
    </div>
  );
}