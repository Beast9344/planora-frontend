import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Compass } from 'lucide-react';

const CommonLayoutNotFound = () => {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-background px-4 py-16">
      <section className="mx-auto w-full max-w-4xl rounded-3xl border border-border bg-card p-8 shadow-sm sm:p-12">
        <div className="grid items-center gap-10 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">
              Error 404
            </p>
            <h1 className="mt-3 text-4xl font-bold text-foreground sm:text-5xl">
              We couldn&apos;t find this page
            </h1>
            <p className="mt-4 max-w-xl text-muted-foreground">
              The link may be broken or the page might have been moved. Try
              navigating back to a known section of the site.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button
                asChild
                className="bg-primary text-white hover:bg-primary/90"
              >
                <Link href="/">
                  <ArrowLeft className="size-4" />
                  Return Home
                </Link>
              </Button>

              <Button asChild variant="outline">
                <Link href="/events">
                  <Compass className="size-4" />
                  Browse Events
                </Link>
              </Button>
            </div>
          </div>

          <div className="rounded-2xl bg-muted p-8 text-center">
            <p className="text-8xl font-black text-primary-foreground/80 dark:text-muted-foreground">404</p>
            <p className="mt-3 text-sm font-medium text-muted-foreground">
              Page not found
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CommonLayoutNotFound;
