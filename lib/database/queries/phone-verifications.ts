// lib/database/queries/phone-verifications.ts
import { db } from '@/lib/database';
import { phoneVerifications } from '@/lib/database/schema';
import { eq, and, gt, desc } from 'drizzle-orm';

export interface PhoneVerificationCreateData {
  user_id: number;
  code: string;
  expires_at: Date;
}

/**
 * Create a phone verification record
 */
export async function createPhoneVerification(verificationData: PhoneVerificationCreateData) {
  const [verification] = await db.insert(phoneVerifications).values({
    user_id: verificationData.user_id,
    code: verificationData.code,
    expires_at: Math.floor(verificationData.expires_at.getTime() / 1000),
    attempts: 0,
  }).returning();

  return verification;
}

/**
 * Find valid OTP for user (not expired, not attempted)
 */
export async function findValidOtp(userId: number, code: string) {
  const now = Math.floor(Date.now() / 1000);
  
  const [verification] = await db.select()
    .from(phoneVerifications)
    .where(
      and(
        eq(phoneVerifications.user_id, userId),
        eq(phoneVerifications.code, code),
        gt(phoneVerifications.expires_at, now),
        eq(phoneVerifications.attempts, 0)
      )
    )
    .orderBy(desc(phoneVerifications.created_at))
    .limit(1);

  return verification || null;
}

/**
 * Get recent OTP requests for a user (for rate limiting)
 */
export async function getRecentOtpRequests(userId: number, withinSeconds: number = 60) {
  const since = Math.floor(Date.now() / 1000) - withinSeconds;
  
  const requests = await db.select()
    .from(phoneVerifications)
    .where(
      and(
        eq(phoneVerifications.user_id, userId),
        gt(phoneVerifications.created_at, since)
      )
    )
    .orderBy(desc(phoneVerifications.created_at));

  return requests;
}

/**
 * Increment OTP attempt count
 */
export async function incrementOtpAttempts(verificationId: number) {
  const [verification] = await db.update(phoneVerifications)
    .set({
      attempts: sql`${phoneVerifications.attempts} + 1`,
    })
    .where(eq(phoneVerifications.id, verificationId))
    .returning();

  return verification || null;
}

/**
 * Clean up expired OTPs (optional maintenance function)
 */
export async function cleanupExpiredOtps() {
  const now = Math.floor(Date.now() / 1000);
  
  const result = await db.delete(phoneVerifications)
    .where(gt(phoneVerifications.expires_at, now));
    
  return result;
}