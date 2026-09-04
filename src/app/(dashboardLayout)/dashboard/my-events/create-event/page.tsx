import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MyEventForm from '@/components/modules/Dashboard/MyEventForm';

const CreateEventPage = () => {
  return (
    <main className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <section className="mx-auto w-full max-w-5xl space-y-6">
        <header className="rounded-3xl bg-primary p-7 text-primary-foreground dark:bg-card dark:text-card-foreground sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-300">
            My Events
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Create Event</h1>
          <p className="mt-3 text-primary-foreground/80 dark:text-muted-foreground">
            Configure details, visibility, and fee settings for your new event.
          </p>
          <Button
            asChild
            variant="outline"
            className="mt-5 border-border bg-transparent text-primary-foreground hover:bg-primary/80 dark:text-foreground dark:hover:bg-muted"
          >
            <Link href="/dashboard/my-events">
              <ArrowLeft className="size-4" /> Back to My Events
            </Link>
          </Button>
        </header>

        <MyEventForm mode="create" />
      </section>
    </main>
  );
};

export default CreateEventPage;
