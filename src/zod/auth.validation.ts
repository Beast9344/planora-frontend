import { z } from 'zod';

export const loginZodSchema = z.object({
  email: z.email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be at most 100 characters'),
  // .regex(
  //   /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/,
  //   'Password must contain at least one letter and one number',
  // ),
});

export type ILoginPayload = z.infer<typeof loginZodSchema>;

export const registerZodSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  email: z.email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be at most 100 characters'),
});

export type IRegisterPayload = z.infer<typeof registerZodSchema>;

export const verifyEmailZodSchema = z.object({
  email: z.email('Invalid email address'),
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'OTP must be exactly 6 digits'),
});

export type IVerifyEmailPayload = z.infer<typeof verifyEmailZodSchema>;

export const resendVerificationOtpZodSchema = z.object({
  email: z.email('Invalid email address'),
});

export type IResendVerificationOtpPayload = z.infer<
  typeof resendVerificationOtpZodSchema
>;

export const changePasswordZodSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, 'Current password must be at least 6 characters')
      .max(100, 'Current password must be at most 100 characters'),
    newPassword: z
      .string()
      .min(6, 'New password must be at least 6 characters')
      .max(100, 'New password must be at most 100 characters'),
    confirmPassword: z
      .string()
      .min(6, 'Confirm password must be at least 6 characters')
      .max(100, 'Confirm password must be at most 100 characters'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'New password and confirm password do not match',
    path: ['confirmPassword'],
  })
  .refine(data => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

export type IChangePasswordPayload = z.infer<typeof changePasswordZodSchema>;
