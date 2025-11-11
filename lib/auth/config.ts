// lib/auth/config.ts
export const authConfig = {
  jwtSecret: "test-secret-key-for-development-only",
  jwtExpiresIn: '24h',
  bcryptRounds: 12,
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
} as const;

if (!authConfig.jwtSecret) {
  throw new Error('JWT_SECRET environment variable is required');
}