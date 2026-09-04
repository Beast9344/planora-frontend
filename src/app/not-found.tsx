import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Compass, House } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <section className="w-full max-w-2xl text-center">
        {/* Large 404 */}
        <p className="text-[120px] font-black leading-none text-white/5 sm:text-[180px]">
          404
        </p>

        <div className="-mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-400">
            Page Not Found
          </p>
          <h1 className="mt-3 text-3xl font-bold text-white sm:text-5xl">
            Looks like you&apos;re lost
          </h1>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved. Head back home or explore upcoming events.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            asChild
            className="bg-orange-500 text-white hover:bg-orange-400"
          >
            <Link href="/">
              <House className="size-4" />
              Back to Home
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="border-border bg-transparent text-primary-foreground/80 dark:text-muted-foreground hover:bg-primary/80"
          >
            <Link href="/events">
              <Compass className="size-4" />
              Browse Events
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
