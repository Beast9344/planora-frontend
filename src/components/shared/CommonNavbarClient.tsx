'use client';

import { logoutAction } from '@/app/(commonLayout)/(auth)/logout/_action';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Menu,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import ThemeToggle from './ThemeToggle';

interface CommonNavbarClientProps {
  isLoggedIn: boolean;
  dashboardHome: string;
  userName?: string;
  userImage?: string | null;
}

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Events', href: '/events' },
  { label: 'About', href: '/about-us' },
  { label: 'Contact', href: '/contact-us' },
];

const CommonNavbarClient = ({
  isLoggedIn,
  dashboardHome,
  userName,
  userImage,
}: CommonNavbarClientProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
      router.push('/login');
      router.refresh();
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-foreground">
          <span className="rounded-lg bg-linear-to-br from-amber-300 to-orange-500 p-2 text-foreground">
            <CalendarDays className="size-4" />
          </span>
          <span className="text-lg font-semibold tracking-wide">Planora</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map(link => {
            const isActive =
              pathname === link.href ||
              (link.href !== '/' && pathname.startsWith(link.href));

            return (
              <Button
                key={link.href}
                asChild
                variant="ghost"
                className={
                  isActive ? 'text-orange-600' : 'text-muted-foreground'
                }
              >
                <Link href={link.href}>{link.label}</Link>
              </Button>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 px-2">
                  <Avatar className="size-6">
                    {userImage ? (
                      <AvatarImage src={userImage} alt={userName || 'User'} />
                    ) : null}
                    <AvatarFallback className="bg-muted text-xs font-semibold text-muted-foreground">
                      {userName?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  {userName ? userName.split(' ')[0] : 'Profile'}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="truncate">
                  {userName || 'User Profile'}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link href={dashboardHome}>
                    <LayoutDashboard className="mr-2 size-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/my-profile">
                    <User className="mr-2 size-4" />
                    My Profile
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  onClick={handleLogout}
                  disabled={isPending}
                >
                  <LogOut className="mr-2 size-4" />
                  {isPending ? 'Logging out...' : 'Logout'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="outline">
                <Link href="/login">Login</Link>
              </Button>
              <Button
                asChild
                className="bg-primary text-white hover:bg-primary/90"
              >
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon" aria-label="Open navigation">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 sm:w-80">
            <div className="mt-8 flex flex-col gap-2">
              <div className="mb-2">
                <ThemeToggle />
              </div>

              {navLinks.map(link => (
                <Button
                  key={link.href}
                  asChild
                  variant="ghost"
                  className="justify-start"
                >
                  <Link href={link.href}>{link.label}</Link>
                </Button>
              ))}

              <div className="mt-4 grid grid-cols-2 gap-2">
                {isLoggedIn ? (
                  <>
                    <Button
                      asChild
                      className="col-span-2 bg-primary text-white hover:bg-primary/90"
                    >
                      <Link href={dashboardHome}>Go to Dashboard</Link>
                    </Button>
                    <Button asChild variant="outline" className="col-span-2">
                      <Link href="/my-profile">My Profile</Link>
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      className="col-span-2"
                      onClick={handleLogout}
                      disabled={isPending}
                    >
                      {isPending ? 'Logging out...' : 'Logout'}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="outline">
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button
                      asChild
                      className="bg-primary text-white hover:bg-primary/90"
                    >
                      <Link href="/register">Register</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default CommonNavbarClient;
