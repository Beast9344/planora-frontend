import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/motion';

const blogs = [
  {
    slug: 'event-planning-checklist-2026',
    title: 'Event Planning Checklist For 2026',
    summary:
      'A practical checklist covering timeline, ticketing, host communication, and post-event follow-up.',
    category: 'Guides',
  },
  {
    slug: 'increase-attendee-engagement',
    title: '7 Ways To Increase Attendee Engagement',
    summary:
      'Simple tactics for interaction before, during, and after events to improve retention and satisfaction.',
    category: 'Strategy',
  },
  {
    slug: 'private-events-best-practices',
    title: 'Private Events: Best Practices',
    summary:
      'How to handle invites, approvals, and communication for secure private community sessions.',
    category: 'Operations',
  },
];

const HomeBlogsSection = () => {
  return (
    <section className="bg-muted/40 dark:bg-card relative isolate overflow-hidden py-20 sm:py-24">
      <div
        aria-hidden="true"
        className="glow-3 animate-orb-slow absolute -right-32 -bottom-32 -z-10 size-[24rem] rounded-full blur-3xl"
      />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h2 className="text-ink-strong text-3xl font-bold tracking-tight sm:text-4xl">
              Latest <span className="text-brand-gradient">Insights</span>
            </h2>
            <p className="text-ink-soft mt-3 text-base leading-relaxed">
              Tips and patterns for running better events.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="text-ink border-border bg-card hover:bg-muted group rounded-full"
          >
            <Link href="/about-us">
              View All Articles
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-3">
          {blogs.map((blog, index) => (
            <Reveal key={blog.slug} delay={index * 100}>
              {/* the whole card is the link target; the visible "Read more" row is
                  decorative so there is only one tab stop per article */}
              <Link
                href="/about-us"
                className="lift group border-border bg-card hover:border-brand-1/40 focus-visible:ring-ring flex h-full flex-col rounded-2xl border p-6 shadow-sm hover:shadow-xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="text-brand-1 size-4" aria-hidden="true" />
                  <p className="text-brand-1 text-xs font-semibold tracking-wide uppercase">
                    {blog.category}
                  </p>
                </div>
                <h3 className="text-ink-strong mt-4 text-lg leading-snug font-semibold">
                  {blog.title}
                </h3>
                <p className="text-ink-soft mt-2 text-sm leading-relaxed">{blog.summary}</p>
                <span
                  className="text-brand-1 mt-auto flex items-center gap-1.5 pt-5 text-sm font-medium"
                  aria-hidden="true"
                >
                  Read More
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeBlogsSection;
