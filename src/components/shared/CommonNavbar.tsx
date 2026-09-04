import { getDefaultDashboardRoute, UserRole } from '@/lib/authUtils';
import { getUserInfo } from '@/services/auth.services';
import CommonNavbarClient from './CommonNavbarClient';

const CommonNavbar = async () => {
  const userInfo = await getUserInfo();
  const isLoggedIn = Boolean(userInfo?.id);

  const dashboardHome = isLoggedIn
    ? getDefaultDashboardRoute(userInfo!.role as UserRole)
    : '/dashboard';

  return (
    <CommonNavbarClient
      isLoggedIn={isLoggedIn}
      dashboardHome={dashboardHome}
      userName={userInfo?.name}
      userImage={userInfo?.image}
    />
  );
};

export default CommonNavbar;
