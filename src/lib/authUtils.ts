export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'USER';

export const authRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
];

export const isAuthRoute = (pathname: string) => {
  return authRoutes.some((router: string) => router === pathname);
};

export type RouteConfig = {
  exact: string[];
  pattern: RegExp[];
};

export const commonProtectedRoutes: RouteConfig = {
  exact: ['/my-profile', '/change-password', '/events'],
  pattern: [/^\/events\/.+/],
};

export const adminProtectedRoutes: RouteConfig = {
  pattern: [/^\/admin\/dashboard/],
  exact: [],
};

export const userProtectedRoutes: RouteConfig = {
  pattern: [/^\/dashboard/],
  exact: [],
};

export const isRouteMatches = (pathname: string, routes: RouteConfig) => {
  if (routes.exact.includes(pathname)) {
    return true;
  }
  return routes.pattern.some((pattern: RegExp) => pattern.test(pathname));
};

export const getRouteOwner = (
  pathname: string,
): 'ADMIN' | 'USER' | 'COMMON' | null => {
  if (isRouteMatches(pathname, adminProtectedRoutes)) {
    return 'ADMIN';
  }

  if (isRouteMatches(pathname, userProtectedRoutes)) {
    return 'USER';
  }

  if (isRouteMatches(pathname, commonProtectedRoutes)) {
    return 'COMMON';
  }

  return null;
};

export const getDefaultDashboardRoute = (role: UserRole) => {
  if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
    return '/admin/dashboard';
  }

  if (role === 'USER') {
    return '/dashboard';
  }

  return '/';
};

export const isValidRedirectForRole = (
  redirectPath: string,
  role: UserRole,
) => {
  const routeOwner = getRouteOwner(redirectPath);

  if (routeOwner === null || routeOwner === 'COMMON') {
    return true;
  }

  if (routeOwner === role) {
    return true;
  }

  if (routeOwner === 'ADMIN' && role === 'SUPER_ADMIN') {
    return true;
  }

  return false;
};
