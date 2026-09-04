import { CalendarRange, Gift, Ticket, Wallet } from 'lucide-react';
import { CountUp, Reveal } from '@/components/motion';
import { HomeEvent } from './home-data';

type HomeEventStatsSectionProps = {
  events: HomeEvent[];
};

const HomeEventStatsSection = ({ events }: HomeEventStatsSectionProps) => {
  const totalUpcoming = events.length;
  const paidCount = events.filter(event => event.feeType === 'Paid').length;
  const freeCount = events.filter(event => event.feeType === 'Free').length;
  const avgFee =
    paidCount > 0
      ? Math.round(
          events
            .filter(event => event.fee > 0)
            .reduce((sum, event) => sum + event.fee, 0) / paidCount,
        )
      : 0;

  const items = [
    {
      icon: CalendarRange,
      label: 'Upcoming Public Events',
      value: totalUpcoming,
      prefix: '',
      helper: 'Live events open for registration',
    },
    {
      icon: Gift,
      label: 'Free Events',
      value: freeCount,
      prefix: '',
      helper: 'Open access community sessions',
    },
    {
      icon: Ticket,
      label: 'Paid Events',
      value: paidCount,
      prefix: '',
      helper: 'Premium and workshop style sessions',
    },
    {
      icon: Wallet,
      label: 'Average Paid Fee',
      value: avgFee,
      prefix: '৳',
      helper: 'Calculated from current paid events',
    },
  ];

  return (
    <section className="bg-primary dark:bg-background relative isolate overflow-hidden py-16 sm:py-20">
      {/* decorative wash — text sits on tokens that are legible over both surfaces */}
      <div
        aria-hidden="true"
        className="animate-aurora-slow absolute -top-40 left-1/4 -z-10 size-[34rem] rounded-full bg-white/10 blur-3xl dark:bg-transparent"
      />
      <div
        aria-hidden="true"
        className="glow-2 animate-orb absolute -right-24 -bottom-32 -z-10 size-[24rem] rounded-full opacity-0 blur-3xl dark:opacity-100"
      />
      <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10 opacity-60" />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-on-brand-strong text-3xl font-bold tracking-tight sm:text-4xl">
            Live Event Snapshot
          </h2>
          <p className="text-on-brand-soft mt-3 max-w-2xl">
            Real-time highlights generated from your event inventory.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, ...item }, index) => (
            <Reveal key={item.label} delay={index * 90} direction="up">
              <article className="lift border-on-brand/20 bg-on-brand/10 dark:border-border dark:bg-card h-full rounded-2xl border p-6 backdrop-blur-sm hover:shadow-xl">
                <span className="border-on-brand/20 bg-on-brand/10 dark:border-border dark:bg-muted mb-4 inline-flex size-10 items-center justify-center rounded-xl border">
                  <Icon className="text-on-brand-strong size-5" aria-hidden="true" />
                </span>
                <p className="text-on-brand-soft text-sm">{item.label}</p>
                <p className="text-on-brand-strong mt-2 text-4xl font-bold tracking-tight">
                  <CountUp value={item.value} prefix={item.prefix} />
                </p>
                <p className="text-on-brand-soft mt-2 text-xs">{item.helper}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeEventStatsSection;
