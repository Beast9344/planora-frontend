import Link from 'next/link';
import { ArrowRight, CalendarPlus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/motion';

const HomeCtaSection = () => {
  return (
    <section className="from-primary via-primary to-brand-2 dark:from-card dark:via-card dark:to-background relative isolate overflow-hidden bg-gradient-to-br py-20 sm:py-24">
      {/* light mode sits on a deep blue, dark mode on an elevated dark surface —
          on-brand-* is light in both, so the copy never loses contrast */}
      <div
        aria-hidden="true"
        className="animate-aurora absolute -top-40 left-1/4 -z-10 size-[36rem] rounded-full bg-white/12 blur-3xl dark:bg-transparent"
      />
      <div
        aria-hidden="true"
        className="animate-orb-slow absolute -right-32 -bottom-40 -z-10 size-[28rem] rounded-full bg-orange-400/20 blur-3xl"
      />
      <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10 opacity-50" />

      <div className="mx-auto w-full max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <Reveal>
          <span className="border-on-brand/25 bg-on-brand/10 text-on-brand mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Free to start
          </span>
        </Reveal>

        <Reveal delay={80}>
          <h2 className="text-on-brand-strong text-3xl leading-tight font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Create Better Events.
            <br />
            Join Smarter Communities.
          </h2>
        </Reveal>

        <Reveal delay={140}>
          <p className="text-on-brand-soft mx-auto mt-5 max-w-2xl text-base leading-relaxed sm:text-lg">
            Whether you are hosting a paid summit or joining a private free meetup,
            Planora helps you manage invites, approvals, reviews, and payments in one
            workflow.
          </p>
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="group rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/25 transition-transform hover:-translate-y-0.5 hover:bg-orange-400"
            >
              <Link href="/dashboard/my-events/create-event">
                <CalendarPlus className="size-4" aria-hidden="true" />
                Create Event
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="group border-on-brand/30 bg-on-brand/10 text-on-brand-strong hover:bg-on-brand/20 rounded-full backdrop-blur transition-transform hover:-translate-y-0.5"
            >
              <Link href="/events">
                Join Events
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default HomeCtaSection;
