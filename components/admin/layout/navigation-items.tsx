'use client';

import {
  HomeIcon,
  KeyIcon,
  CalendarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { ROUTES } from '@/lib/constants/routes';

export const navigation = [
  { name: 'Dashboard', href: ROUTES.admin.dashboard, icon: HomeIcon },
  { name: 'Rooms', href: ROUTES.admin.rooms, icon: KeyIcon },
  { name: 'Bookings', href: ROUTES.admin.bookings, icon: CalendarIcon },
  { name: 'Staff', href: ROUTES.admin.staff, icon: UsersIcon },
  { name: 'Revenue', href: ROUTES.admin.revenue, icon: CurrencyDollarIcon },
  { name: 'Settings', href: ROUTES.admin.settings, icon: Cog6ToothIcon },
] as const;