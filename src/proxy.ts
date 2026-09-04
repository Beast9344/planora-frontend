import { NextRequest, NextResponse } from 'next/server';
import {
  getDefaultDashboardRoute,
  getRouteOwner,
  isAuthRoute,
  UserRole,
} from './lib/authUtils';
import { isTokenExpiringSoon } from './lib/tokenUtils';
import {
  getNewTokensWithRefreshToken,
  getUserInfo,
} from './services/auth.services';
import { jwtUtils } from './lib/jwtUtils';

async function refreshTokenMiddleware(refreshToken: string): Promise<boolean> {
  try {
    const refresh = await getNewTokensWithRefreshToken(refreshToken);
    return !!refresh;
  } catch (error) {
    console.error('Error refreshing token in middleware:', error);
    return false;
  }
}

export async function proxy(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;

    // Decode access token
    const decodedAccessToken = accessToken
      ? jwtUtils.verifyToken(
          accessToken,
          process.env.JWT_ACCESS_SECRET as string,
        ).data
      : null;

    const isValidAccessToken = accessToken
      ? jwtUtils.verifyToken(
          accessToken,
          process.env.JWT_ACCESS_SECRET as string,
        ).success
      : false;

    let userRole: UserRole | null = null;
    if (decodedAccessToken) {
      userRole = decodedAccessToken.role as UserRole;
    }

    const isEmailVerifiedFromToken = Boolean(decodedAccessToken?.emailVerified);
    const userEmailFromToken =
      typeof decodedAccessToken?.email === 'string'
        ? decodedAccessToken.email
        : '';

    const routerOwner = getRouteOwner(pathname);
    const isAuth = isAuthRoute(pathname);

    // Proactively refresh token if access token is about to expire
    if (
      isValidAccessToken &&
      refreshToken &&
      (await isTokenExpiringSoon(accessToken!))
    ) {
      const requestHeaders = new Headers(request.headers);
      const response = NextResponse.next({
        request: { headers: requestHeaders },
      });

      try {
        const refreshed = await refreshTokenMiddleware(refreshToken);
        if (refreshed) {
          requestHeaders.set('x-token-refreshed', '1');
        }
        return NextResponse.next({
          request: { headers: requestHeaders },
          headers: response.headers,
        });
      } catch (error) {
        console.error('Error refreshing token:', error);
      }
      return response;
    }

    if (isAuth && isValidAccessToken) {
      if (!isEmailVerifiedFromToken) {
        if (pathname === '/verify-email') {
          return NextResponse.next();
        }

        const verifyEmailUrl = new URL('/verify-email', request.url);
        if (userEmailFromToken) {
          verifyEmailUrl.searchParams.set('email', userEmailFromToken);
        }
        return NextResponse.redirect(verifyEmailUrl);
      }

      return NextResponse.redirect(
        new URL(getDefaultDashboardRoute(userRole as UserRole), request.url),
      );
    }

    // Rule 2: Reset password page handling
    if (pathname === '/reset-password') {
      const email = request.nextUrl.searchParams.get('email');

      if (accessToken && email) {
        const userInfo = await getUserInfo();
        if (userInfo.needPasswordChange) {
          return NextResponse.next();
        } else {
          return NextResponse.redirect(
            new URL(
              getDefaultDashboardRoute(userRole as UserRole),
              request.url,
            ),
          );
        }
      }

      if (email) {
        return NextResponse.next();
      }

      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Rule 3: Public route -> allow
    if (routerOwner === null) {
      return NextResponse.next();
    }

    // Rule 4: Not logged-in user trying to access protected route -> redirect to login
    if (!accessToken || !isValidAccessToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Rule 5: Enforce email verification and password change
    if (accessToken) {
      const userInfo = await getUserInfo();
      if (userInfo) {
        // Email verification
        if (!userInfo.emailVerified) {
          if (pathname !== '/verify-email') {
            const verifyEmailUrl = new URL('/verify-email', request.url);
            verifyEmailUrl.searchParams.set('email', userInfo.email);
            return NextResponse.redirect(verifyEmailUrl);
          }
          return NextResponse.next();
        }
        if (userInfo.emailVerified && pathname === '/verify-email') {
          return NextResponse.redirect(
            new URL(
              getDefaultDashboardRoute(userRole as UserRole),
              request.url,
            ),
          );
        }
      }
    }

    // Rule 6: Common protected route -> allow
    if (routerOwner === 'COMMON') {
      return NextResponse.next();
    }

    // Rule 7: Role-based route protection
    if (routerOwner === 'ADMIN' || routerOwner === 'USER') {
      const hasAccess =
        routerOwner === userRole ||
        (routerOwner === 'ADMIN' && userRole === 'SUPER_ADMIN');

      if (!hasAccess) {
        return NextResponse.redirect(
          new URL(getDefaultDashboardRoute(userRole as UserRole), request.url),
        );
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Error in proxy middleware:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)',
  ],
};
