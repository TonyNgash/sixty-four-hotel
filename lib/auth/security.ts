// lib/auth/security.ts
import { db } from '@/lib/database';
import { loginAttempts } from '@/lib/database/schema';

interface TrackAttemptParams {
  email: string;
  successful: boolean;
  failureReason?: string;
  ip: string;
  userAgent?: string;
  userId?: number;
}

export async function trackLoginAttempt(params: TrackAttemptParams) {
  await db.insert(loginAttempts).values({
    email: params.email,
    user_id: params.userId || null,
    ip_address: params.ip,
    user_agent: params.userAgent,
    attempt_type: 'login',
    successful: params.successful,
    failure_reason: params.failureReason,
    attempted_at: new Date(),
  });
}