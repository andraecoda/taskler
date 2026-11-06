import { apiRequest } from '@/lib/api-client';
import type { User } from './types';

/**
 * These calls go straight to the backend (no cookie involved), unlike login/refresh/logout
 * which are proxied through /api/auth/* route handlers to manage the httpOnly cookie.
 */

export function registerUser(input: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  referralCode?: string;
}): Promise<User> {
  return apiRequest<User>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function verifyEmail(token: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>('/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
}

export function resendVerification(email: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>('/auth/resend-verification', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export function requestPasswordReset(email: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export function resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword }),
  });
}
