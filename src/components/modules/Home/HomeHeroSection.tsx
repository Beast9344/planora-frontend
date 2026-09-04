import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Calendar,
  Clock3,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AuroraCanvas, Reveal, TypewriterWords } from '@/components/motion';
import { HomeEvent } from './home-data';

type HomeHeroSectionProps = {
  event?: HomeEvent;
};

const rotatingWords = [
  'Memorable Events',
  'Private Meetups',
  'Paid Workshops',
  'Campus Festivals',
  'Community Nights',
];

const trustPoints = [
  { icon: ShieldCheck, label: 'Verified accounts' },
  { icon: Users, label: 'Host-approved guest lists' },
  { icon: Sparkles, label: 'Instant payment receipts' },
];

const HomeHeroSection = ({ event }: HomeHeroSectionProps) => {
  const feeLabel = event ? (event.fee === 0 ? 'Free' : `৳${event.fee}`) : '';

  return (
    <section className="relative isolate overflow-hidden border-b border-border">
      {/* ---------- animated backdrop (decorative) ---------- */}
      <AuroraCanvas className="-z-20 opacity-90" />
      <div
        aria-hidden="true"
        className="bg-grid animate-grid-drift absolute inset-0 -z-20"
      />
      <div
        aria-hidden="true"
        className="glow-3 animate-orb absolute -top-24 -left-32 -z-20 size-[26rem] rounded-full blur-3xl"
      />
      <div
        aria-hidden="true"
        className="glow-2 animate-orb-slow absolute -top-16 right-[-8rem] -z-20 size-[30rem] rounded-full blur-3xl"
      />
      {/* keeps the copy readable no matter where the aurora drifts */}
      <div
        aria-hidden="true"
        className="from-background/85 via-background/55 to-background/85 absolute inset-0 -z-10 bg-gradient-to-b"
      />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-4 py-24 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
        {/* ---------- left: the promise ---------- */}
        <div className="space-y-7">
          <Reveal>
            <Badge className="border-border/70 bg-card/80 text-ink gap-2 rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur">
              <span className="relative flex size-2">
                <span className="animate-ping-ring absolute inline-flex size-full rounded-full bg-orange-500" />
                <span className="relative inline-flex size-2 rounded-full bg-orange-500" />
              </span>
              {event ? 'Featured event is live' : 'Welcome to Planora'}
            </Badge>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="text-ink-strong text-4xl leading-[1.08] font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Build, Host, and Join
              <br />
              <TypewriterWords
                words={rotatingWords}
                className="text-brand-gradient text-brand-gradient-animated"
              />
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p className="text-ink-soft max-w-xl text-base leading-relaxed sm:text-lg">
              A secure platform for managing public and private events with smooth
              registration, invite workflows, and integrated payments.
            </p>
          </Reveal>

          <Reveal delay={200}>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                asChild
                size="lg"
                className="group rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/25 transition-transform hover:-translate-y-0.5 hover:bg-orange-400"
              >
                <Link href={event ? `/events/${event.id}` : '/events'}>
                  {event ? 'View Featured Event' : 'Browse Events'}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-ink border-border bg-card/70 hover:bg-muted rounded-full backdrop-blur transition-transform hover:-translate-y-0.5"
              >
                <Link href="/dashboard/my-events/create-event">Create Event</Link>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={260}>
            <ul className="text-ink-faint flex flex-wrap gap-x-6 gap-y-2 pt-2 text-sm">
              {trustPoints.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2">
                  <Icon className="text-brand-1 size-4 shrink-0" aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* ---------- right: the featured event ---------- */}
        {event ? (
          <Reveal direction="scale" delay={160}>
            <article className="ring-gradient bg-card/80 relative rounded-3xl p-6 shadow-2xl backdrop-blur-xl sm:p-7">
              {event.image ? (
                <div className="relative mb-5 aspect-16/9 overflow-hidden rounded-2xl">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    priority
                    sizes="(min-width: 1024px) 44vw, 100vw"
                    className="object-cover"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent"
                  />
                  <span className="absolute bottom-3 left-3 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                    Featured
                  </span>
                </div>
              ) : null}

              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Badge className="bg-sky-500/15 text-sky-800 dark:bg-sky-400/15 dark:text-sky-200">
                  {event.visibility}
                </Badge>
                <Badge
                  className={
                    event.feeType === 'Free'
                      ? 'bg-emerald-500/15 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-200'
                      : 'bg-amber-500/15 text-amber-900 dark:bg-amber-400/15 dark:text-amber-100'
                  }
                >
                  {event.feeType}
                </Badge>
                <Badge className="bg-violet-500/15 text-violet-800 dark:bg-violet-400/15 dark:text-violet-200">
                  {feeLabel}
                </Badge>
              </div>

              <h2 className="text-ink-strong text-2xl leading-snug font-bold">
                {event.title}
              </h2>

              {event.description ? (
                <p className="text-ink-soft mt-2 mb-5 line-clamp-3 text-sm leading-relaxed">
                  {event.description}
                </p>
              ) : null}

              <dl className="text-ink-soft space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 shrink-0 text-orange-500" aria-hidden="true" />
                  <dt className="sr-only">Date</dt>
                  <dd>{event.date}</dd>
                </div>
                {event.time ? (
                  <div className="flex items-center gap-2">
                    <Clock3 className="text-brand-2 size-4 shrink-0" aria-hidden="true" />
                    <dt className="sr-only">Time</dt>
                    <dd>{event.time}</dd>
                  </div>
                ) : null}
                {event.venue ? (
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                    <dt className="sr-only">Venue</dt>
                    <dd>{event.venue}</dd>
                  </div>
                ) : null}
                <div className="flex items-center gap-2">
                  <Users className="text-brand-3 size-4 shrink-0" aria-hidden="true" />
                  <dt className="sr-only">Organizer</dt>
                  <dd>Organizer: {event.organizer}</dd>
                </div>
              </dl>

              {event.participantCount !== undefined ? (
                <p className="text-ink-faint border-border/70 mt-5 border-t pt-4 text-sm">
                  <span className="text-ink-strong nums font-semibold">
                    {event.participantCount}
                  </span>{' '}
                  participant{event.participantCount !== 1 ? 's' : ''} joined so far
                </p>
              ) : null}

              <Button
                asChild
                className="group mt-5 w-full rounded-full"
              >
                <Link href={`/events/${event.id}`}>
                  View Details
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </article>
          </Reveal>
        ) : (
          <Reveal direction="scale" delay={160}>
            <div className="ring-gradient bg-card/70 text-ink-soft rounded-3xl p-10 text-center shadow-xl backdrop-blur-xl">
              <Sparkles className="text-brand-1 mx-auto mb-4 size-8" aria-hidden="true" />
              <p className="text-ink-strong text-lg font-semibold">
                No featured event just yet
              </p>
              <p className="mt-2 text-sm">
                Be the first to publish one — it takes about a minute.
              </p>
              <Button asChild className="mt-6 rounded-full">
                <Link href="/dashboard/my-events/create-event">Create the first event</Link>
              </Button>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
};

export default HomeHeroSection;
