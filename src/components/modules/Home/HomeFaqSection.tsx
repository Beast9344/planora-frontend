import Link from 'next/link';
import { HelpCircle, MessageCircleQuestion } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/motion';

const faqs = [
  {
    q: 'Can I host both free and paid events?',
    a: 'Yes. Planora supports free and paid event setups with clear fee and visibility controls.',
  },
  {
    q: 'How do private invitations work?',
    a: 'Hosts can send direct invitations. Invitees can accept or decline, and hosts can monitor statuses from dashboard.',
  },
  {
    q: 'Can organizers review participant requests?',
    a: 'Yes. For controlled events, organizers can approve or reject join requests before participation is confirmed.',
  },
  {
    q: 'When can participants leave a review?',
    a: 'Reviews become available after event completion and valid participation status.',
  },
];

const HomeFaqSection = () => {
  return (
    <section className="bg-background relative isolate overflow-hidden py-20 sm:py-24">
      <div
        aria-hidden="true"
        className="glow-2 animate-orb absolute top-1/4 -left-40 -z-10 size-[24rem] rounded-full blur-3xl"
      />

      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <span className="border-border bg-card text-ink-soft mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium">
            <HelpCircle className="text-brand-1 size-3.5" aria-hidden="true" />
            Answers
          </span>
          <h2 className="text-ink-strong text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently Asked <span className="text-brand-gradient">Questions</span>
          </h2>
          <p className="text-ink-soft mx-auto mt-3 max-w-2xl text-base leading-relaxed">
            Quick answers to common questions from organizers and attendees.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div className="ring-gradient bg-card mt-10 rounded-3xl p-2 shadow-sm sm:p-3">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((item, index) => (
                <AccordionItem
                  key={item.q}
                  value={`faq-${index}`}
                  className="border-border/70 px-4 last:border-b-0"
                >
                  <AccordionTrigger className="text-ink-strong hover:text-brand-1 text-left text-base font-semibold transition-colors">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-ink-soft text-sm leading-relaxed">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Reveal>

        <Reveal delay={180}>
          <div className="text-ink-soft mt-8 flex flex-wrap items-center justify-center gap-3 text-sm">
            <MessageCircleQuestion className="text-brand-1 size-4" aria-hidden="true" />
            Still stuck on something?
            <Button asChild variant="link" className="text-brand-1 h-auto p-0">
              <Link href="/contact-us">Talk to us</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default HomeFaqSection;
