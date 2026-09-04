import { CheckCircle2, ShieldCheck, Users } from 'lucide-react';

const pillars = [
  {
    title: 'Secure by Design',
    description:
      'JWT-protected access and role-based workflows for admins and users.',
    icon: ShieldCheck,
  },
  {
    title: 'Community Focused',
    description:
      'Create public or private events and run smooth invitation experiences.',
    icon: Users,
  },
  {
    title: 'Payment Ready',
    description:
      'Support fee-based events with reliable payment and approval flow.',
    icon: CheckCircle2,
  },
];

const AboutUsPage = () => {
  return (
    <main className="min-h-screen bg-background py-14 sm:py-20">
      <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-primary p-8 text-primary-foreground dark:bg-card dark:text-card-foreground shadow-2xl sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-300">
            About Planora
          </p>
          <h1 className="mt-4 text-3xl font-bold sm:text-5xl">
            Powering modern event experiences with trust and control.
          </h1>
          <p className="mt-5 max-w-3xl text-primary-foreground/80 dark:text-muted-foreground">
            Planora helps teams host and scale events from one secure platform.
            Whether the event is free, paid, public, or private, we keep
            registrations, payments, reviews, and approvals simple.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {pillars.map(pillar => {
            const Icon = pillar.icon;
            return (
              <article
                key={pillar.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <span className="inline-flex rounded-xl bg-orange-100 p-2 text-orange-600">
                  <Icon className="size-5" />
                </span>
                <h2 className="mt-4 text-xl font-bold text-foreground">
                  {pillar.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {pillar.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default AboutUsPage;
