import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CalendarDays, CalendarX2, Clock3, MapPin, UserRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/motion';
import { HomeEvent } from './home-data';

type HomeUpcomingEventsSectionProps = {
  events?: HomeEvent[];
};

const HomeUpcomingEventsSection = ({
  events = [],
}: HomeUpcomingEventsSectionProps) => {
  return (
    <section className="bg-muted/40 dark:bg-background relative isolate overflow-hidden py-20 sm:py-24">
      <div
        aria-hidden="true"
        className="glow-2 animate-orb absolute top-1/3 -left-40 -z-10 size-[26rem] rounded-full blur-3xl"
      />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h2 className="text-ink-strong text-3xl font-bold tracking-tight sm:text-4xl">
              Upcoming <span className="text-brand-gradient">Public Events</span>
            </h2>
            <p className="text-ink-soft mt-3 text-base leading-relaxed">
              Discover handpicked upcoming experiences across communities.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="text-ink border-border bg-card hover:bg-muted group rounded-full"
          >
            <Link href="/events">
              See All Events
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </Reveal>

        {events.length === 0 ? (
          <Reveal>
            <div className="border-border bg-card/60 rounded-3xl border border-dashed p-14 text-center">
              <CalendarX2 className="text-ink-faint mx-auto mb-4 size-9" aria-hidden="true" />
              <p className="text-ink-soft">
                No upcoming events at the moment. Check back soon!
              </p>
            </div>
          </Reveal>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event, index) => (
              <Reveal
                as="li"
                key={event.id}
                delay={(index % 3) * 90}
                className="list-none"
              >
                <article className="lift group border-border bg-card hover:border-brand-1/40 flex h-full flex-col rounded-2xl border p-5 shadow-sm hover:shadow-xl">
                  {event.image ? (
                    <div className="border-border mb-4 overflow-hidden rounded-xl border">
                      <Image
                        src={event.image}
                        alt={event.title}
                        width={640}
                        height={320}
                        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                        className="h-40 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  ) : null}

                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <Badge
                      className={
                        event.visibility === 'Private'
                          ? 'bg-violet-100 text-violet-800 dark:bg-violet-400/15 dark:text-violet-200'
                          : 'bg-sky-100 text-sky-800 dark:bg-sky-400/15 dark:text-sky-200'
                      }
                    >
                      {event.visibility}
                    </Badge>
                    <Badge
                      className={
                        event.feeType === 'Free'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-200'
                          : 'bg-amber-100 text-amber-900 dark:bg-amber-400/15 dark:text-amber-100'
                      }
                    >
                      {event.feeType}
                    </Badge>
                  </div>

                  <h3 className="text-ink-strong line-clamp-2 min-h-12 text-lg leading-snug font-bold">
                    {event.title}
                  </h3>

                  <div className="text-ink-soft mt-4 space-y-2 text-sm">
                    <p className="flex items-center gap-2">
                      <CalendarDays className="size-4 shrink-0" aria-hidden="true" />
                      {event.date}
                    </p>
                    {event.time ? (
                      <p className="flex items-center gap-2">
                        <Clock3 className="size-4 shrink-0" aria-hidden="true" />
                        {event.time}
                      </p>
                    ) : null}
                    {event.venue ? (
                      <p className="flex items-center gap-2">
                        <MapPin className="size-4 shrink-0" aria-hidden="true" />
                        {event.venue}
                      </p>
                    ) : null}
                    <p className="flex items-center gap-2">
                      <UserRound className="size-4 shrink-0" aria-hidden="true" />
                      {event.organizer}
                    </p>
                  </div>

                  <div className="border-border/70 mt-auto flex items-center justify-between border-t pt-4">
                    <p className="text-ink-strong nums font-semibold">
                      {event.fee === 0 ? 'Free' : `৳${event.fee}`}
                    </p>
                    <Button asChild size="sm" className="rounded-full">
                      <Link href={`/events/${event.id}`}>View Details</Link>
                    </Button>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default HomeUpcomingEventsSection;
