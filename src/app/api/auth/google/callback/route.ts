import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const accessToken = searchParams.get('accessToken');
  const refreshToken = searchParams.get('refreshToken');
  const sessionToken = searchParams.get('sessionToken');
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  if (!accessToken || !refreshToken) {
    return NextResponse.redirect(
      new URL('/login?error=oauth_failed', request.url),
    );
  }

  const isValidPath =
    redirectPath.startsWith('/') && !redirectPath.startsWith('//');
  const finalPath = isValidPath ? redirectPath : '/dashboard';

  const response = NextResponse.redirect(new URL(finalPath, request.url));

  response.cookies.set('accessToken', accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: 60 * 60 * 24,
  });

  response.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  if (sessionToken) {
    response.cookies.set('better-auth.session_token', sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 60 * 60 * 24,
    });
  }

  return response;
}
