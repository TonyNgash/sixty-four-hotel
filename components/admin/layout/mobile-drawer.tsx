'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import { navigation } from './navigation-items';
import { cn } from '@/lib/utils/cn';

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const pathname = usePathname();

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50 lg:hidden" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/80" />
        </Transition.Child>

        {/* Panel */}
        <div className="fixed inset-0 flex">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
              <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b">
                <h1 className="text-xl font-bold text-gray-900">Hotel Admin</h1>
                <button
                  type="button"
                  className="-m-2.5 p-2.5 text-gray-700"
                  onClick={onClose}
                >
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <nav className="flex-1 px-4 py-4 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={onClose}
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
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}