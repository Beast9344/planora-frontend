'use server';

import { platformServerServices } from '@/services/platform.server.services';

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Request failed';
};

export async function fetchAdminUsersAction(params?: Record<string, unknown>) {
  try {
    const response = await platformServerServices.getAdminUsers(params);
    return { success: true, data: response?.data, meta: response?.meta };
  } catch (error: unknown) {
    console.error('fetchAdminUsersAction error:', error);
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function fetchAdminStatsAction() {
  try {
    const response = await platformServerServices.getAdminStats();
    return { success: true, data: response?.data };
  } catch (error: unknown) {
    console.error('fetchAdminStatsAction error:', error);
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function fetchCurrentUserAction() {
  try {
    const response = await platformServerServices.getMyProfile();
    return { success: true, data: response?.data };
  } catch (error: unknown) {
    console.error('fetchCurrentUserAction error:', error);
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function updateAdminUserAction(
  userId: string,
  payload: {
    role?: 'SUPER_ADMIN' | 'ADMIN' | 'USER';
    status?: 'ACTIVE' | 'BLOCKED' | 'DELETED';
  },
) {
  try {
    const response = await platformServerServices.updateAdminUser(
      userId,
      payload,
    );
    return { success: true, data: response?.data };
  } catch (error: unknown) {
    console.error('updateAdminUserAction error:', error);
    return { success: false, error: getErrorMessage(error) };
  }
}
