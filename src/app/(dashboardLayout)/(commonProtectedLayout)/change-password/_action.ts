/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { serverHttpClient } from '@/lib/axios/serverHttpClient';
import {
  changePasswordZodSchema,
  IChangePasswordPayload,
} from '@/zod/auth.validation';

export type ChangePasswordActionResult = {
  success: boolean;
  message: string;
};

export const changePasswordAction = async (
  payload: IChangePasswordPayload,
): Promise<ChangePasswordActionResult> => {
  const parsedPayload = changePasswordZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return {
      success: false,
      message: parsedPayload.error.issues[0]?.message || 'Invalid input',
    };
  }

  try {
    await serverHttpClient.post('/auth/change-password', {
      currentPassword: parsedPayload.data.currentPassword,
      newPassword: parsedPayload.data.newPassword,
    });

    return {
      success: true,
      message: 'Password changed successfully.',
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.message ||
        'Failed to change password. Please try again.',
    };
  }
};
