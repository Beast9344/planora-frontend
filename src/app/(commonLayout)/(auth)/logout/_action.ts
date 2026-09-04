/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { cookies } from 'next/headers';

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined');
}

export const logoutAction = async (): Promise<{ success: boolean }> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;
  const sessionToken =
    cookieStore.get('better-auth.session_token')?.value ||
    cookieStore.get('better-auth.session-token')?.value;

  try {
    await fetch(`${BASE_API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `accessToken=${accessToken || ''}; refreshToken=${refreshToken || ''}; better-auth.session_token=${sessionToken || ''}`,
      },
    });
  } catch (error: any) {
    console.error('Logout request failed:', error?.message || error);
  }

  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
  cookieStore.delete('better-auth.session_token');
  cookieStore.delete('better-auth.session-token');

  return { success: true };
};
