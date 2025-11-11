// Navigation configuration - shared between sidebar and mobile
import { 
  HomeIcon, 
  BuildingOfficeIcon, 
  UsersIcon, 
  CalendarIcon, 
  CurrencyDollarIcon,
  Cog6ToothIcon 
} from '@heroicons/react/24/outline';

export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  current: boolean;
}

export const navigation: NavItem[] = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: HomeIcon, 
    current: true 
  },
  { 
    name: 'Rooms', 
    href: '/rooms', 
    icon: BuildingOfficeIcon, 
    current: false 
  },
  { 
    name: 'Staff', 
    href: '/staff', 
    icon: UsersIcon, 
    current: false 
  },
  { 
    name: 'Bookings', 
    href: '/bookings', 
    icon: CalendarIcon, 
    current: false 
  },
  { 
    name: 'Revenue', 
    href: '/revenue', 
    icon: CurrencyDollarIcon, 
    current: false 
  },
  { 
    name: 'Settings', 
    href: '/settings', 
    icon: Cog6ToothIcon, 
    current: false 
  },
];