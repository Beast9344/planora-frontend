/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { logoutAction } from '@/app/(commonLayout)/(auth)/logout/_action';
import { serverHttpClient } from '@/lib/axios/serverHttpClient';
import { ApiErrorResponse } from '@/types/api.types';
import {
  IResendVerificationOtpPayload,
  IVerifyEmailPayload,
  resendVerificationOtpZodSchema,
  verifyEmailZodSchema,
} from '@/zod/auth.validation';
import { redirect } from 'next/navigation';

interface VerifyEmailResponse {
  success: boolean;
  message: string;
}

interface ResendVerificationOtpResponse {
  success: boolean;
  message: string;
}

interface VerifyEmailApiPayload {
  user?: {
    role?: string;
  };
  accessToken?: string;
  refreshToken?: string;
}

export const verifyEmailAction = async (
  payload: IVerifyEmailPayload,
): Promise<VerifyEmailResponse | ApiErrorResponse> => {
  const parsedPayload = verifyEmailZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const firstError =
      parsedPayload.error.issues[0]?.message || 'Invalid input';
    return {
      success: false,
      message: firstError,
    };
  }

  try {
    await serverHttpClient.post<VerifyEmailApiPayload>(
      '/auth/verify-email',
      parsedPayload.data,
    );

    await logoutAction();
    redirect('/login?verified=1');
  } catch (error: any) {
    if (
      error &&
      typeof error === 'object' &&
      'digest' in error &&
      typeof error.digest === 'string' &&
      error.digest.startsWith('NEXT_REDIRECT')
    ) {
      throw error;
    }

    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.message ||
        'Email verification failed',
    };
  }
};

export const resendVerificationOtpAction = async (
  payload: IResendVerificationOtpPayload,
): Promise<ResendVerificationOtpResponse | ApiErrorResponse> => {
  const parsedPayload = resendVerificationOtpZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const firstError =
      parsedPayload.error.issues[0]?.message || 'Invalid input';
    return {
      success: false,
      message: firstError,
    };
  }

  try {
    await serverHttpClient.post<null>(
      '/auth/resend-verification-otp',
      parsedPayload.data,
    );

    return {
      success: true,
      message: 'Verification OTP sent. Please check your email.',
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.message ||
        'Failed to resend verification OTP',
    };
  }
};
