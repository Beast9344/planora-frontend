import {
  CalendarCheck2,
  CreditCard,
  LayoutDashboard,
  Lock,
  Mail,
  ShieldCheck,
  Star,
  UserCheck,
} from 'lucide-react';
import { Reveal, Spotlight } from '@/components/motion';

/**
 * Icon colours are paired per theme on purpose: the -600 shades carry enough
 * contrast on the light page, the -400 shades stay bright on the dark one.
 */
const features = [
  {
    icon: ShieldCheck,
    title: 'Secure Authentication',
    description:
      'JWT-based auth with refresh tokens, email OTP verification, and Google OAuth support for seamless, safe access.',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-500/10 dark:bg-emerald-400/10',
  },
  {
    icon: Lock,
    title: 'Role-Based Access Control',
    description:
      'Separate Admin and User roles with fine-grained permissions. Admins manage all data while users control their own events.',
    color: 'text-sky-600 dark:text-sky-400',
    bg: 'bg-sky-500/10 dark:bg-sky-400/10',
  },
  {
    icon: CalendarCheck2,
    title: 'Public & Private Events',
    description:
      'Create open public events or invite-only private events with full visibility control and participant approval workflows.',
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-500/10 dark:bg-orange-400/10',
  },
  {
    icon: CreditCard,
    title: 'Integrated Payments',
    description:
      'Secure paid event registrations powered by SSLCommerz. Free events are always frictionless — no payment required.',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-500/10 dark:bg-amber-400/10',
  },
  {
    icon: Mail,
    title: 'Invitation Workflow',
    description:
      'Event owners can invite specific users. Invitees accept or decline with real-time status updates across all dashboards.',
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-500/10 dark:bg-violet-400/10',
  },
  {
    icon: UserCheck,
    title: 'Participant Management',
    description:
      'Approve or reject join requests, track participation status, and manage your attendee list from one clean dashboard.',
    color: 'text-pink-600 dark:text-pink-400',
    bg: 'bg-pink-500/10 dark:bg-pink-400/10',
  },
  {
    icon: Star,
    title: 'Reviews & Ratings',
    description:
      'Participants can leave ratings and reviews after events. Organizers build reputation through consistent quality.',
    color: 'text-yellow-700 dark:text-yellow-300',
    bg: 'bg-yellow-500/10 dark:bg-yellow-400/10',
  },
  {
    icon: LayoutDashboard,
    title: 'Powerful Dashboard',
    description:
      'A dedicated workspace for managing your events, invitations, payments, reviews, and profile — all in one place.',
    color: 'text-cyan-700 dark:text-cyan-300',
    bg: 'bg-cyan-500/10 dark:bg-cyan-400/10',
  },
];

const HomeFeaturesSection = () => {
  return (
    <section className="bg-background relative isolate overflow-hidden py-20 sm:py-24">
      <div
        aria-hidden="true"
        className="bg-grid animate-grid-drift absolute inset-0 -z-10 opacity-70"
      />
      <div
        aria-hidden="true"
        className="glow-1 animate-orb-slow absolute -bottom-40 -left-32 -z-10 size-[30rem] rounded-full blur-3xl"
      />
      <div
        aria-hidden="true"
        className="glow-3 animate-orb absolute -top-32 -right-24 -z-10 size-[26rem] rounded-full blur-3xl"
      />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-12 text-center">
          <h2 className="text-ink-strong text-3xl font-bold tracking-tight sm:text-4xl">
            Everything You Need to Run{' '}
            <span className="text-brand-gradient">Great Events</span>
          </h2>
          <p className="text-ink-soft mx-auto mt-3 max-w-2xl text-base leading-relaxed">
            Planora is built with the features modern event organizers and attendees
            actually need — from secure auth to payment processing.
          </p>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Reveal key={feature.title} delay={(index % 4) * 80}>
                <Spotlight className="h-full rounded-2xl">
                  <article className="lift border-border bg-card/80 hover:border-brand-1/40 h-full rounded-2xl border p-6 backdrop-blur-sm hover:shadow-xl">
                    <span className={`inline-flex rounded-xl p-2.5 ${feature.bg}`}>
                      <Icon className={`size-5 ${feature.color}`} aria-hidden="true" />
                    </span>
                    <h3 className="text-ink-strong mt-4 text-base font-semibold">
                      {feature.title}
                    </h3>
                    <p className="text-ink-soft mt-2 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </article>
                </Spotlight>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomeFeaturesSection;
