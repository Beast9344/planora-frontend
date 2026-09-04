'use server';

import { UserRole } from '@/lib/authUtils';
import { jwtUtils } from '@/lib/jwtUtils';
import { cookies } from 'next/headers';

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined');
}

export async function getNewTokensWithRefreshToken(
  refreshToken: string,
): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const sessionToken =
      cookieStore.get('better-auth.session_token')?.value ||
      cookieStore.get('better-auth.session-token')?.value;

    const res = await fetch(`${BASE_API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `refreshToken=${refreshToken}; better-auth.session_token=${sessionToken || ''}`,
      },
    });

    if (!res.ok) {
      return false;
    }

    // Intentionally avoid cookie mutation here.
    // This utility can run from middleware/server rendering contexts where
    // Next.js disallows cookies().set; callers should treat this as a soft refresh signal.
    await res.json();

    return true;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return false;
  }
}

export async function getUserInfo() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const sessionToken =
      cookieStore.get('better-auth.session_token')?.value ||
      cookieStore.get('better-auth.session-token')?.value;
    if (!accessToken) {
      return null;
    }

    const res = await fetch(`${BASE_API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    });
    if (!res.ok) {
      console.error('Failed to fetch user info:', res.status, res.statusText);
      const decoded = accessToken ? jwtUtils.decodedToken(accessToken) : null;

      if (decoded?.userId && decoded?.role && decoded?.email) {
        return {
          id: String(decoded.userId),
          name: String(decoded.name || ''),
          email: String(decoded.email),
          role: decoded.role as UserRole,
          emailVerified: Boolean(decoded.emailVerified),
        };
      }

      return null;
    }

    const { data } = await res.json();

    return data;
  } catch (error) {
    console.error('Error fetching user info:', error);

    try {
      const cookieStore = await cookies();
      const accessToken = cookieStore.get('accessToken')?.value;
      const decoded = accessToken ? jwtUtils.decodedToken(accessToken) : null;

      if (decoded?.userId && decoded?.role && decoded?.email) {
        return {
          id: String(decoded.userId),
          name: String(decoded.name || ''),
          email: String(decoded.email),
          role: decoded.role as UserRole,
          emailVerified: Boolean(decoded.emailVerified),
        };
      }
    } catch {
      // Ignore fallback parsing errors and return null below.
    }

    return null;
  }
}
