import { CalendarCheck2, CreditCard, UserCheck } from 'lucide-react';
import { Reveal } from '@/components/motion';

const steps = [
  {
    title: 'Discover or Create',
    description:
      'Browse public events or create private experiences with complete control.',
    icon: CalendarCheck2,
  },
  {
    title: 'Invite and Approve',
    description:
      'Manage invitations and participant approvals with a clear status workflow.',
    icon: UserCheck,
  },
  {
    title: 'Pay and Participate',
    description:
      'Handle paid registrations securely while keeping free events frictionless.',
    icon: CreditCard,
  },
];

const HomeHowItWorksSection = () => {
  return (
    <section className="bg-card relative isolate overflow-hidden py-20 sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-12 max-w-2xl">
          <h2 className="text-ink-strong text-3xl font-bold tracking-tight sm:text-4xl">
            How <span className="text-brand-gradient">Planora</span> Works
          </h2>
          <p className="text-ink-soft mt-3 text-base leading-relaxed">
            A simple three-step flow from event discovery to participation.
          </p>
        </Reveal>

        <div className="relative">
          {/* connector line, drawn only where the three steps sit side by side */}
          <div
            aria-hidden="true"
            className="via-brand-1/40 absolute top-11 right-[16.6%] left-[16.6%] hidden h-px bg-gradient-to-r from-transparent to-transparent md:block"
          />

          <ol className="grid gap-5 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Reveal as="li" key={step.title} delay={index * 120} className="list-none">
                  <article className="lift border-border bg-muted hover:border-brand-1/40 relative h-full rounded-2xl border p-7 hover:shadow-xl">
                    <span
                      aria-hidden="true"
                      className="text-ink-faint/40 absolute top-5 right-6 text-5xl font-bold tabular-nums select-none"
                    >
                      {index + 1}
                    </span>
                    <span className="bg-primary text-primary-foreground relative inline-flex rounded-xl p-2.5 shadow-lg">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <h3 className="text-ink-strong mt-5 text-xl font-bold">{step.title}</h3>
                    <p className="text-ink-soft mt-2 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default HomeHowItWorksSection;
