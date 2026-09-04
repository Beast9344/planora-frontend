'use client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { SheetTitle } from '@/components/ui/sheet';
import { getIconComponent } from '@/lib/iconMapper';
import { cn } from '@/lib/utils';
import { NavSection } from '@/types/dashboard.types';
import { UserInfo } from '@/types/user.types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SidebarUserDropdown from './SidebarUserDropdown';

interface DashboardMobileSidebarProps {
  userInfo: UserInfo;
  navItems: NavSection[];
  dashboardHome: string;
}

const DashboardMobileSidebar = ({
  dashboardHome,
  navItems,
  userInfo,
}: DashboardMobileSidebarProps) => {
  const pathname = usePathname();
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Logo / Brand */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href={dashboardHome}>
          <span className="text-xl font-bold text-primary">Planora</span>
        </Link>
      </div>

      <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

      {/* Navigation Area  */}

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((section, sectionId) => (
            <div key={sectionId}>
              {section.title && (
                <h4 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase">
                  {section.title}
                </h4>
              )}

              <div className="space-y-1">
                {section.items.map((item, id) => {
                  const isActive = pathname === item.href;
                  const Icon = getIconComponent(item.icon);

                  return (
                    <Link
                      href={item.href}
                      key={id}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="flex-1">{item.title}</span>
                    </Link>
                  );
                })}
              </div>

              {sectionId < navItems.length - 1 && (
                <Separator className="my-4" />
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* User Info */}
      <div className="border-t p-4">
        <SidebarUserDropdown userInfo={userInfo} />
      </div>
    </div>
  );
};

export default DashboardMobileSidebar;
