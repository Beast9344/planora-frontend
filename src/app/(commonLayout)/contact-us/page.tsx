import { Mail, MapPin, PhoneCall } from 'lucide-react';

const ContactUsPage = () => {
  return (
    <main className="min-h-screen bg-background py-14 sm:py-20">
      <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="rounded-3xl bg-card p-8 shadow-sm ring-1 ring-slate-200 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-orange-500">
            Contact
          </p>
          <h1 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
            Let us help you build better events.
          </h1>
          <p className="mt-4 text-muted-foreground">
            Reach out for onboarding, technical assistance, or partnership
            discussions. Our team responds quickly.
          </p>

          <div className="mt-8 space-y-5 text-muted-foreground">
            <p className="flex items-start gap-3">
              <Mail className="mt-0.5 size-5 text-orange-500" />
              support@planora.app
            </p>
            <p className="flex items-start gap-3">
              <PhoneCall className="mt-0.5 size-5 text-orange-500" />
              +880 1700 000000
            </p>
            <p className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-5 text-orange-500" />
              House 12, Road 7, Dhanmondi, Dhaka, Bangladesh
            </p>
          </div>
        </div>

        <div className="rounded-3xl bg-primary p-8 text-primary-foreground dark:bg-card dark:text-card-foreground shadow-xl sm:p-10">
          <h2 className="text-2xl font-bold">Support Hours</h2>
          <p className="mt-3 text-primary-foreground/80 dark:text-muted-foreground">
            Sunday to Thursday: 9:00 AM - 8:00 PM
          </p>
          <p className="mt-2 text-primary-foreground/70 dark:text-muted-foreground">
            Friday to Saturday: Emergency support only
          </p>

          <div className="mt-8 rounded-2xl bg-card/10 p-5">
            <h3 className="text-lg font-semibold">Need payment support?</h3>
            <p className="mt-2 text-sm text-primary-foreground/80 dark:text-muted-foreground">
              Share your transaction ID and event title, and our payments team
              will assist immediately.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactUsPage;
