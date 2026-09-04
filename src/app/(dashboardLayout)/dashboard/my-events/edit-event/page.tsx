import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MyEventForm from '@/components/modules/Dashboard/MyEventForm';
import { platformServerServices } from '@/services/platform.server.services';

const asRecord = (value: unknown): Record<string, unknown> => {
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : {};
};

const pickString = (value: unknown, fallback = ''): string => {
  return typeof value === 'string' ? value : fallback;
};

const pickNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
};

type EditEventPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const EditMyEventPage = async ({ searchParams }: EditEventPageProps) => {
  const resolvedSearchParams = (await searchParams) || {};
  const eventId =
    typeof resolvedSearchParams.eventId === 'string'
      ? resolvedSearchParams.eventId
      : '';

  if (!eventId) {
    return (
      <main className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
        <section className="mx-auto w-full max-w-3xl rounded-3xl border border-rose-200 bg-card p-8 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Event Not Selected
          </h1>
          <p className="mt-2 text-muted-foreground">
            Choose an event from My Events list before editing.
          </p>
          <Button
            asChild
            className="mt-5 bg-primary text-white hover:bg-primary/90"
          >
            <Link href="/dashboard/my-events">Go to My Events</Link>
          </Button>
        </section>
      </main>
    );
  }

  let initialValues = {
    title: '',
    description: '',
    image: '',
    eventDate: '',
    eventTime: '',
    venue: '',
    eventLink: '',
    visibility: 'PUBLIC' as 'PUBLIC' | 'PRIVATE',
    registrationFee: 0,
  };

  try {
    const response = await platformServerServices.getEventById(eventId);
    const event = asRecord(response.data);
    const eventDateTimeRaw = pickString(event.eventDateTime);
    const parsedDate = eventDateTimeRaw ? new Date(eventDateTimeRaw) : null;

    initialValues = {
      title: pickString(event.title),
      description: pickString(event.description),
      image: pickString(event.image),
      eventDate:
        parsedDate && !Number.isNaN(parsedDate.getTime())
          ? parsedDate.toISOString().slice(0, 10)
          : '',
      eventTime:
        parsedDate && !Number.isNaN(parsedDate.getTime())
          ? parsedDate.toTimeString().slice(0, 5)
          : '',
      venue: pickString(event.venue),
      eventLink: pickString(event.eventLink),
      visibility:
        pickString(event.visibility) === 'PRIVATE' ? 'PRIVATE' : 'PUBLIC',
      registrationFee: pickNumber(event.registrationFee, 0),
    };
  } catch {
    return (
      <main className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
        <section className="mx-auto w-full max-w-3xl rounded-3xl border border-rose-200 bg-card p-8 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Unable to Load Event
          </h1>
          <p className="mt-2 text-muted-foreground">
            The event might be deleted or you may not have permission.
          </p>
          <Button
            asChild
            className="mt-5 bg-primary text-white hover:bg-primary/90"
          >
            <Link href="/dashboard/my-events">Back to My Events</Link>
          </Button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <section className="mx-auto w-full max-w-5xl space-y-6">
        <header className="rounded-3xl bg-primary p-7 text-primary-foreground dark:bg-card dark:text-card-foreground sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-300">
            My Events
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Edit Event</h1>
          <p className="mt-3 text-primary-foreground/80 dark:text-muted-foreground">
            Update timeline, fee, visibility, and location details.
          </p>
          <Button
            asChild
            variant="outline"
            className="mt-5 border-border bg-transparent text-primary-foreground hover:bg-primary/80 dark:text-foreground dark:hover:bg-muted"
          >
            <Link href={`/dashboard/my-events/${eventId}`}>
              <ArrowLeft className="size-4" /> Back to Event Details
            </Link>
          </Button>
        </header>

        <MyEventForm
          mode="edit"
          eventId={eventId}
          initialValues={initialValues}
        />
      </section>
    </main>
  );
};

export default EditMyEventPage;
