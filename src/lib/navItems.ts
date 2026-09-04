import { NavSection } from '@/types/dashboard.types';
import { getDefaultDashboardRoute, UserRole } from './authUtils';

export const getCommonNavItems = (role: UserRole): NavSection[] => {
  const defaultDashboard = getDefaultDashboardRoute(role);
  return [
    {
      // title : "Dashboard",
      items: [
        {
          title: 'Home',
          href: '/',
          icon: 'Home',
        },
        {
          title: 'Dashboard',
          href: defaultDashboard,
          icon: 'LayoutDashboard',
        },
        {
          title: 'My Profile',
          href: `/my-profile`,
          icon: 'User',
        },
      ],
    },
    {
      title: 'Settings',
      items: [
        {
          title: 'Change Password',
          href: '/change-password',
          icon: 'Settings',
        },
      ],
    },
  ];
};

export const adminNavItems: NavSection[] = [
  {
    title: 'Administration',
    items: [
      {
        title: 'User Management',
        href: '/admin/dashboard/users',
        icon: 'Users',
      },
      {
        title: 'Reports',
        href: '/admin/dashboard/reports',
        icon: 'ChartColumn',
      },
    ],
  },
  {
    title: 'Event Moderation',
    items: [
      {
        title: 'Events',
        href: '/admin/dashboard/events',
        icon: 'Calendar',
      },
    ],
  },
];

export const userNavItems: NavSection[] = [
  {
    title: 'Event Workspace',
    items: [
      {
        title: 'My Events',
        href: '/dashboard/my-events',
        icon: 'CalendarDays',
      },
      {
        title: 'Invitations',
        href: '/dashboard/invitations',
        icon: 'Mail',
      },
      {
        title: 'Pending Invitations',
        href: '/dashboard/pending-invitations',
        icon: 'Clock3',
      },
      {
        title: 'Joined Events',
        href: '/dashboard/joined-events',
        icon: 'CalendarDays',
      },
      {
        title: 'My Reviews',
        href: '/dashboard/my-reviews',
        icon: 'Star',
      },
      {
        title: 'My Payments',
        href: '/dashboard/my-payments',
        icon: 'CreditCard',
      },
      {
        title: 'AI Recommendations',
        href: '/dashboard/recommendations',
        icon: 'Sparkles',
      },
    ],
  },
];

export const getNavItemsByRole = (role: UserRole): NavSection[] => {
  const commonNavItems = getCommonNavItems(role);

  switch (role) {
    case 'SUPER_ADMIN':
    case 'ADMIN':
      return [...commonNavItems, ...adminNavItems];

    case 'USER':
      return [...commonNavItems, ...userNavItems];

    default:
      return [...commonNavItems];
  }
};
