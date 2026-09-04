import { Badge } from '@/components/ui/badge';
import { Globe2, Rocket, ShieldCheck, Sparkles } from 'lucide-react';
import { Reveal, Spotlight } from '@/components/motion';

const highlights = [
  {
    icon: Sparkles,
    title: 'Modern Event Experience',
    description:
      'A polished workflow from discovery to registration, designed for speed and clarity.',
    badge: 'UX',
  },
  {
    icon: ShieldCheck,
    title: 'Trust And Safety',
    description:
      'Role-based controls, verified actions, and secure payment integrations for confidence.',
    badge: 'Security',
  },
  {
    icon: Globe2,
    title: 'Flexible For Communities',
    description:
      'Host meetups, workshops, summits, or private invite-only sessions with consistent tooling.',
    badge: 'Scale',
  },
  {
    icon: Rocket,
    title: 'Built For Growth',
    description:
      'Analytics-ready foundations and operational features to expand events sustainably.',
    badge: 'Growth',
  },
];

const HomeHighlightsSection = () => {
  return (
    <section className="bg-background relative isolate overflow-hidden py-20 sm:py-24">
      <div
        aria-hidden="true"
        className="glow-1 animate-orb-slow absolute -top-32 left-1/2 -z-10 size-[28rem] -translate-x-1/2 rounded-full blur-3xl"
      />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-12 max-w-2xl">
          <h2 className="text-ink-strong text-3xl font-bold tracking-tight sm:text-4xl">
            Platform <span className="text-brand-gradient">Highlights</span>
          </h2>
          <p className="text-ink-soft mt-3 text-base leading-relaxed">
            Why teams choose Planora for reliable event operations.
          </p>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={index * 90}>
                <Spotlight className="h-full rounded-2xl">
                  <article className="lift border-border bg-card hover:border-brand-1/40 flex h-full flex-col rounded-2xl border p-6 shadow-sm hover:shadow-xl">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="from-brand-1/15 to-brand-3/15 text-brand-1 inline-flex rounded-xl bg-gradient-to-br p-2.5">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <Badge variant="outline" className="text-ink-faint">
                        {item.badge}
                      </Badge>
                    </div>
                    <h3 className="text-ink-strong text-lg font-semibold">{item.title}</h3>
                    <p className="text-ink-soft mt-2 text-sm leading-relaxed">
                      {item.description}
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

export default HomeHighlightsSection;
