import { Quote, Star } from 'lucide-react';
import { Reveal } from '@/components/motion';

const testimonials = [
  {
    name: 'Raihan Kabir',
    role: 'Event Organizer',
    rating: 5,
    content:
      'Planora completely transformed how I run my tech workshops. The participant approval flow and integrated payment made managing 200+ attendees effortless.',
  },
  {
    name: 'Nusrat Jahan',
    role: 'Community Manager',
    rating: 5,
    content:
      'I love how easy it is to create private events and invite specific people. The invitation status tracking saves me so much back-and-forth messaging.',
  },
  {
    name: 'Farhan Hossain',
    role: 'Conference Speaker',
    rating: 5,
    content:
      "The dashboard gives me a bird's-eye view of everything — upcoming events, reviews, payment history. It's exactly what I needed as both an organizer and participant.",
  },
  {
    name: 'Tasnim Ahmed',
    role: 'Startup Founder',
    rating: 5,
    content:
      'Setting up a paid event with SSLCommerz took less than 5 minutes. The review system after the event gave us incredibly useful feedback from attendees.',
  },
  {
    name: 'Sabbir Rahman',
    role: 'University Club Lead',
    rating: 5,
    content:
      'We use Planora for all our campus events now. The free public events require zero registration fee setup, and private invites keep our exclusive sessions secure.',
  },
  {
    name: 'Lamia Sultana',
    role: 'Workshop Facilitator',
    rating: 5,
    content:
      'The role-based access means my co-organizers can manage participants while I focus on the content. Planora respects how teams actually work together.',
  },
];

type Testimonial = (typeof testimonials)[number];

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
  <article className="border-border bg-card lift hover:border-brand-1/40 flex w-[19rem] shrink-0 flex-col rounded-2xl border p-6 shadow-sm hover:shadow-xl sm:w-[22rem]">
    <Quote className="mb-3 size-6 shrink-0 text-orange-500/70" aria-hidden="true" />
    <p className="text-ink-soft flex-1 text-sm leading-relaxed">
      &ldquo;{testimonial.content}&rdquo;
    </p>

    <div className="border-border mt-5 flex items-center gap-3 border-t pt-4">
      <span className="bg-primary text-primary-foreground flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold">
        {testimonial.name.charAt(0)}
      </span>
      <div className="min-w-0">
        <p className="text-ink-strong truncate text-sm font-semibold">{testimonial.name}</p>
        <p className="text-ink-faint truncate text-xs">{testimonial.role}</p>
      </div>
      <div
        className="ml-auto flex shrink-0 items-center gap-0.5"
        aria-label={`${testimonial.rating} out of 5 stars`}
      >
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star
            key={i}
            className="size-3.5 fill-amber-500 text-amber-500 dark:fill-amber-400 dark:text-amber-400"
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  </article>
);

/**
 * Two rows drifting in opposite directions. The second copy of each row is
 * aria-hidden so a screen reader hears every quote exactly once, and the
 * marquee-* classes collapse into a normal wrapped block under reduced motion.
 */
const MarqueeRow = ({
  items,
  reverse = false,
}: {
  items: Testimonial[];
  reverse?: boolean;
}) => {
  // No gap on the track and a matching trailing pad on each group, so one group
  // is exactly 50% of the track and the -50% loop lands seamlessly.
  const group = 'flex shrink-0 gap-5 pr-5';

  return (
    <div className="marquee-row mask-edges-x overflow-hidden py-3">
      <div
        className={`marquee-track flex w-max hover:[animation-play-state:paused] ${
          reverse ? 'animate-marquee-reverse' : 'animate-marquee'
        }`}
      >
        <div className={group}>
          {items.map(testimonial => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} />
          ))}
        </div>
        <div className={`${group} marquee-clone`} aria-hidden="true">
          {items.map(testimonial => (
            <TestimonialCard key={`clone-${testimonial.name}`} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </div>
  );
};

const HomeTestimonialsSection = () => {
  const firstRow = testimonials.slice(0, 3);
  const secondRow = testimonials.slice(3);

  return (
    <section className="bg-background relative isolate overflow-hidden py-20 sm:py-24">
      <div
        aria-hidden="true"
        className="glow-1 animate-orb absolute -top-24 right-1/4 -z-10 size-[24rem] rounded-full blur-3xl"
      />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-10 text-center">
          <h2 className="text-ink-strong text-3xl font-bold tracking-tight sm:text-4xl">
            What Organizers Are <span className="text-brand-gradient">Saying</span>
          </h2>
          <p className="text-ink-soft mx-auto mt-3 max-w-2xl text-base leading-relaxed">
            Event creators and participants across Bangladesh trust Planora to run their
            most important gatherings.
          </p>
        </Reveal>
      </div>

      {/* full-bleed on purpose so the rows read as a continuous ribbon */}
      <Reveal className="space-y-2">
        <MarqueeRow items={firstRow} />
        <MarqueeRow items={secondRow} reverse />
      </Reveal>
    </section>
  );
};

export default HomeTestimonialsSection;
