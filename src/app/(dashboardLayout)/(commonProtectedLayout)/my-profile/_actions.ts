'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { serverHttpClient } from '@/lib/axios/serverHttpClient';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type UpdateProfilePayload = {
  name?: string;
  image?: string;
};

export type UpdateProfileActionResult = {
  success: boolean;
  message: string;
};

const getErrorMessage = (error: unknown): string => {
  if (!error || typeof error !== 'object') {
    return 'Unable to update profile right now. Please try again.';
  }

  const errorRecord = error as {
    response?: {
      data?: {
        message?: string;
      };
    };
  };

  return (
    errorRecord.response?.data?.message ||
    'Unable to update profile right now. Please try again.'
  );
};

export type UploadAvatarActionResult = {
  success: boolean;
  message: string;
  imageUrl?: string;
};

export const uploadAvatarAction = async (
  formData: FormData,
): Promise<UploadAvatarActionResult> => {
  const file = formData.get('image');
  if (!file || !(file instanceof File)) {
    return { success: false, message: 'No image file provided.' };
  }

  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(c => `${c.name}=${c.value}`)
    .join('; ');

  try {
    const body = new FormData();
    body.append('image', file);

    const res = await fetch(`${API_BASE_URL}/users/me/avatar`, {
      method: 'POST',
      headers: { Cookie: cookieHeader },
      body,
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return {
        success: false,
        message: (errData as { message?: string })?.message || 'Upload failed',
      };
    }

    const data = await res.json();
    const imageUrl: string =
      (data as { data?: { imageUrl?: string } })?.data?.imageUrl ?? '';
    revalidatePath('/my-profile');
    return { success: true, message: 'Profile image updated.', imageUrl };
  } catch {
    return {
      success: false,
      message: 'Image upload failed. Please try again.',
    };
  }
};

export const updateMyProfileAction = async (
  payload: UpdateProfilePayload,
): Promise<UpdateProfileActionResult> => {
  const body: UpdateProfilePayload = {};

  if (typeof payload.name === 'string' && payload.name.trim()) {
    body.name = payload.name.trim();
  }

  if (typeof payload.image === 'string' && payload.image.trim()) {
    body.image = payload.image.trim();
  }

  if (Object.keys(body).length === 0) {
    return {
      success: false,
      message: 'Please provide at least one value to update.',
    };
  }

  try {
    await serverHttpClient.patch('/users/me', body);
    revalidatePath('/my-profile');

    return {
      success: true,
      message: 'Profile updated successfully.',
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};
