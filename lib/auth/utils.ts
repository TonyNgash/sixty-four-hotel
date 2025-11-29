// lib/auth/utils.ts
import { SignJWT, jwtVerify } from 'jose';
import { hash, compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authConfig } from './config';
import type { JWTPayload, User } from './types';

// Password utilities
export async function hashPassword(password: string): Promise<string> {
  return hash(password, authConfig.bcryptRounds);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword);
}


    export async function generateToken(user: User): Promise<string> {
      const secret = new TextEncoder().encode(authConfig.jwtSecret);
      
      const token = await new SignJWT({
        userId: user.id,
        email: user.email,
        role: user.role,
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(authConfig.jwtExpiresIn)
        .sign(secret);

      return token;
    }


export async function verifyToken(token: string): Promise<JWTPayload> {
  try {
    const secret = new TextEncoder().encode(authConfig.jwtSecret);
    const { payload } = await jwtVerify(token, secret);
    
    return {
      userId: payload.userId as number,
      email: payload.email as string,
      role: payload.role as 'admin' | 'staff' | 'customer',
    };
  } catch (error) {
    console.error('JWT Verification FAILED:', error);
    throw error;
  }
}