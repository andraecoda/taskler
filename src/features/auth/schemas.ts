import { z } from 'zod';

// Mirrors backend/src/modules/auth/dto/*.ts (class-validator rules) so the client rejects
// obviously-invalid input before round-tripping to the server, which re-validates
// everything independently regardless.
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password must be at most 72 characters')
  .regex(
    /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  );

const phoneSchema = z
  .string()
  .regex(/^\+[1-9]\d{7,14}$/, 'Enter a phone number in international format, e.g. +2348012345678');

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name is too short').max(120),
  email: z.string().email('Enter a valid email address').max(255),
  phone: phoneSchema,
  password: passwordSchema,
  referralCode: z.string().max(20).optional().or(z.literal('')),
});
export type RegisterFormValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email('Enter a valid email address'),
});
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  newPassword: passwordSchema,
});
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const updateProfileSchema = z.object({
  avatarUrl: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  dateOfBirth: z.string().optional().or(z.literal('')),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional().or(z.literal('')),
  addressLine1: z.string().max(255).optional().or(z.literal('')),
  city: z.string().max(100).optional().or(z.literal('')),
  state: z.string().max(100).optional().or(z.literal('')),
  country: z.string().max(100).optional().or(z.literal('')),
});
export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
