import Link from 'next/link';
import { ArrowUpRight, Globe, Lock, Ticket, Wallet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Reveal } from '@/components/motion';
import { categoryFilters } from './home-data';

const categoryBadgeClass: Record<string, string> = {
  'public-free': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-200',
  'public-paid': 'bg-amber-100 text-amber-900 dark:bg-amber-400/15 dark:text-amber-100',
  'private-free': 'bg-sky-100 text-sky-800 dark:bg-sky-400/15 dark:text-sky-200',
  'private-paid': 'bg-violet-100 text-violet-800 dark:bg-violet-400/15 dark:text-violet-200',
};

const categoryQueryMap: Record<string, string> = {
  'public-free': 'visibility=PUBLIC&feeType=FREE',
  'public-paid': 'visibility=PUBLIC&feeType=PAID',
  'private-free': 'visibility=PRIVATE&feeType=FREE',
  'private-paid': 'visibility=PRIVATE&feeType=PAID',
};

const categoryIcon: Record<string, typeof Globe> = {
  'public-free': Globe,
  'public-paid': Ticket,
  'private-free': Lock,
  'private-paid': Wallet,
};

const HomeCategoriesSection = () => {
  return (
    <section className="bg-card relative isolate overflow-hidden py-20 sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-12 max-w-2xl">
          <h2 className="text-ink-strong text-3xl font-bold tracking-tight sm:text-4xl">
            Event <span className="text-brand-gradient">Categories</span>
          </h2>
          <p className="text-ink-soft mt-3 text-base leading-relaxed">
            Filter events by visibility and fee type.
          </p>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categoryFilters.map((filter, index) => {
            const Icon = categoryIcon[filter.value] ?? Globe;
            return (
              <Reveal key={filter.value} delay={index * 80}>
                {/* hover state is expressed with the warm accent's own alpha so it
                    reads correctly on both the light and the dark surface */}
                <Link
                  href={`/events?${categoryQueryMap[filter.value]}`}
                  className="lift group border-border bg-muted hover:border-orange-400/60 hover:bg-orange-500/10 focus-visible:ring-ring flex h-full flex-col rounded-2xl border p-6 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <div className="flex items-start justify-between gap-3">
                    <Badge
                      className={
                        categoryBadgeClass[filter.value] ??
                        'bg-primary text-primary-foreground'
                      }
                    >
                      {filter.label}
                    </Badge>
                    <ArrowUpRight
                      className="text-ink-faint size-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </div>

                  <Icon
                    className="text-brand-1 mt-6 size-6 transition-transform group-hover:scale-110"
                    aria-hidden="true"
                  />
                  <h3 className="text-ink-strong mt-3 text-lg font-semibold">
                    {filter.label}
                  </h3>
                  <p className="text-ink-soft mt-2 text-sm leading-relaxed">
                    Browse {filter.label.toLowerCase()} events on Planora.
                  </p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomeCategoriesSection;
