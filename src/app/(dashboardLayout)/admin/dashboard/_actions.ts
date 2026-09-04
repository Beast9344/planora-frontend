'use server';

import { revalidatePath } from 'next/cache';
import { serverHttpClient } from '@/lib/axios/serverHttpClient';

export type AdminActionResult = {
  success: boolean;
  message: string;
};

export type AdminUpdateUserPayload = {
  role?: 'ADMIN' | 'USER';
  status?: 'ACTIVE' | 'BLOCKED' | 'DELETED';
  name?: string;
  image?: string;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (!error || typeof error !== 'object') {
    return fallback;
  }

  const errorRecord = error as {
    response?: {
      data?: {
        message?: string;
        errorSources?: Array<{
          message?: string;
        }>;
      };
    };
  };

  return (
    errorRecord.response?.data?.errorSources?.[0]?.message ||
    errorRecord.response?.data?.message ||
    fallback
  );
};

export const blockUserByAdminAction = async (
  userId: string,
): Promise<AdminActionResult> => {
  try {
    await serverHttpClient.patch(`/admin/users/${userId}/block`, {});

    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/dashboard/users');
    revalidatePath('/admin/dashboard/reports');

    return {
      success: true,
      message: 'User blocked successfully.',
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, 'Failed to block user.'),
    };
  }
};

export const updateUserByAdminAction = async (
  userId: string,
  payload: AdminUpdateUserPayload,
): Promise<AdminActionResult> => {
  try {
    await serverHttpClient.patch(`/admin/users/${userId}`, payload);

    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/dashboard/users');
    revalidatePath(`/admin/dashboard/users/${userId}`);
    revalidatePath('/admin/dashboard/reports');

    return {
      success: true,
      message: 'User updated successfully.',
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, 'Failed to update user.'),
    };
  }
};

export const unblockUserByAdminAction = async (
  userId: string,
): Promise<AdminActionResult> => {
  try {
    await serverHttpClient.patch(`/admin/users/${userId}/unblock`, {});

    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/dashboard/users');
    revalidatePath('/admin/dashboard/reports');

    return {
      success: true,
      message: 'User unblocked successfully.',
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, 'Failed to unblock user.'),
    };
  }
};

export const deleteUserByAdminAction = async (
  userId: string,
): Promise<AdminActionResult> => {
  try {
    await serverHttpClient.delete(`/admin/users/${userId}`);

    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/dashboard/users');
    revalidatePath('/admin/dashboard/reports');

    return {
      success: true,
      message: 'User deleted successfully.',
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, 'Failed to delete user.'),
    };
  }
};

export const deleteEventByAdminAction = async (
  eventId: string,
): Promise<AdminActionResult> => {
  try {
    await serverHttpClient.delete(`/admin/events/${eventId}`);

    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/dashboard/events');
    revalidatePath('/admin/dashboard/reports');

    return {
      success: true,
      message: 'Event deleted successfully.',
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, 'Failed to delete event.'),
    };
  }
};
