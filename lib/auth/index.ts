// lib/auth/index.ts
export { authConfig } from './config';
export { hashPassword, verifyPassword, generateToken, verifyToken } from './utils';
export { trackLoginAttempt } from './security';
export type { User, AuthResponse, LoginCredentials } from './types';