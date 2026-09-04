import Link from 'next/link';
import { CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Events', href: '/events' },
  { label: 'Login / Signup', href: '/login' },
  { label: 'Dashboard', href: '/dashboard' },
];

const HomeNavbar = () => {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-white">
          <span className="rounded-lg bg-linear-to-br from-amber-300 to-orange-500 p-2 text-[#0f172a]">
            <CalendarDays className="size-4" />
          </span>
          <span className="text-lg font-semibold tracking-wide">Planora</span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map(link => (
            <Button
              key={link.href}
              asChild
              variant="ghost"
              className="text-primary-foreground/80 dark:text-muted-foreground hover:text-white"
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </nav>

        <Button
          asChild
          className="bg-orange-500 text-white hover:bg-orange-400"
        >
          <Link href="/events">Explore Events</Link>
        </Button>
      </div>
    </header>
  );
};

export default HomeNavbar;
