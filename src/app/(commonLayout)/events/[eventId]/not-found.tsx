import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CalendarX2, Compass } from 'lucide-react';

export default function EventDetailsNotFound() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-background px-4 py-16">
      <section className="mx-auto w-full max-w-3xl rounded-3xl border border-border bg-card p-8 text-center shadow-sm sm:p-12">
        <div className="flex justify-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-orange-50">
            <CalendarX2 className="size-8 text-orange-400" />
          </span>
        </div>

        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">
          Event Not Found
        </p>
        <h1 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
          This event doesn&apos;t exist
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          The event you&apos;re looking for may have been removed, is no longer
          active, or the link is incorrect.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            asChild
            className="bg-primary text-white hover:bg-primary/90"
          >
            <Link href="/events">
              <ArrowLeft className="size-4" />
              Back to Events
            </Link>
          </Button>

          <Button asChild variant="outline">
            <Link href="/">
              <Compass className="size-4" />
              Go to Homepage
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
