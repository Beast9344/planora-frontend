/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import {
  getDefaultDashboardRoute,
  isValidRedirectForRole,
  UserRole,
} from '@/lib/authUtils';
import { serverHttpClient } from '@/lib/axios/serverHttpClient';
import { setTokenInCookies } from '@/lib/tokenUtils';
import { ApiErrorResponse } from '@/types/api.types';
import { ILoginResponse } from '@/types/auth.types';
import { IRegisterPayload, registerZodSchema } from '@/zod/auth.validation';
import { redirect } from 'next/navigation';

export const registerAction = async (
  payload: IRegisterPayload,
  redirectPath?: string,
): Promise<ILoginResponse | ApiErrorResponse> => {
  const parsedPayload = registerZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0].message || 'Invalid input';
    return {
      success: false,
      message: firstError,
    };
  }

  try {
    const response = await serverHttpClient.post<ILoginResponse>(
      '/auth/register',
      parsedPayload.data,
    );

    const { accessToken, refreshToken, token, user } = response.data;
    const { role, emailVerified } = user;

    if (accessToken) await setTokenInCookies('accessToken', accessToken);
    if (refreshToken) await setTokenInCookies('refreshToken', refreshToken);
    if (token) await setTokenInCookies('better-auth.session_token', token, 24 * 60 * 60);

    if (!emailVerified) {
      redirect(`/verify-email?email=${encodeURIComponent(user.email)}`);
    }

    const targetPath =
      redirectPath && isValidRedirectForRole(redirectPath, role as UserRole)
        ? redirectPath
        : getDefaultDashboardRoute(role as UserRole);

    redirect(targetPath);
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

    console.error('Registration server action failed:', error?.response?.data || error?.message || error);

    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.message ||
        'Registration failed',
    };
  }
};
