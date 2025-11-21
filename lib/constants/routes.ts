// lib/constants/routes.ts
export const ROUTES = {
  admin: {
    login: '/admin-login',
    dashboard: '/protected/admin-dashboard',     // UPDATED
    rooms: '/protected/admin-rooms',             // UPDATED
    bookings: '/protected/admin-bookings',       // UPDATED
    staff: '/protected/admin-staff',             // UPDATED
    settings: '/protected/admin-settings',       // UPDATED
    revenue: '/protected/admin-revenue',         // UPDATED
  },
  api: {
    adminLogin: '/api/auth/admin/login',
    adminLogout: '/api/auth/admin/logout',
    me: '/api/auth/me',
  },
} as const;