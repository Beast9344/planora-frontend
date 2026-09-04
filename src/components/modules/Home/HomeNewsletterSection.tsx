import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Reveal } from '@/components/motion';

/**
 * Currently not mounted on the home page (slot 11 in page.tsx is commented out),
 * but kept in step with the redesign so it can be dropped back in unchanged.
 */
const HomeNewsletterSection = () => {
  return (
    <section className="from-primary via-primary to-brand-2 dark:from-card dark:via-card dark:to-background relative isolate overflow-hidden bg-gradient-to-br py-20 sm:py-24">
      <div
        aria-hidden="true"
        className="animate-aurora absolute -top-32 right-1/4 -z-10 size-[30rem] rounded-full bg-white/10 blur-3xl dark:bg-transparent"
      />
      <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10 opacity-50" />

      <div className="mx-auto w-full max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <Reveal>
          <span className="border-on-brand/25 bg-on-brand/10 text-on-brand mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur">
            <Mail className="size-3.5" aria-hidden="true" />
            Newsletter
          </span>
          <h2 className="text-on-brand-strong text-3xl font-bold tracking-tight sm:text-4xl">
            Get Event Strategy Updates
          </h2>
          <p className="text-on-brand-soft mx-auto mt-4 max-w-2xl text-base leading-relaxed">
            Receive product updates, event playbooks, and practical growth ideas in your
            inbox.
          </p>
        </Reveal>

        <Reveal delay={140}>
          <form className="mx-auto mt-9 flex w-full max-w-2xl flex-col gap-3 sm:flex-row">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <Input
              id="newsletter-email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              className="text-ink placeholder:text-ink-faint bg-card h-12 rounded-full border-0 px-5 shadow-lg"
            />
            <Button
              type="button"
              className="h-12 shrink-0 rounded-full bg-orange-500 px-7 text-white shadow-lg shadow-orange-500/25 transition-transform hover:-translate-y-0.5 hover:bg-orange-400"
            >
              Subscribe
            </Button>
          </form>
        </Reveal>
      </div>
    </section>
  );
};

export default HomeNewsletterSection;
