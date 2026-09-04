import Link from 'next/link';
import { Button } from '@/components/ui/button';
import EventInvitationForm from '@/components/modules/Dashboard/EventInvitationForm';
import { extractArrayPayload, mapEvent } from '@/lib/apiMappers';
import { platformServerServices } from '@/services/platform.server.services';

type MyEventInvitationsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const MyEventInvitationsPage = async ({
  searchParams,
}: MyEventInvitationsPageProps) => {
  const resolvedSearchParams = (await searchParams) || {};
  const eventIdFromQuery =
    typeof resolvedSearchParams.eventId === 'string'
      ? resolvedSearchParams.eventId
      : '';

  let myEvents = [] as ReturnType<typeof mapEvent>[];

  try {
    const [response, fallbackResponse] = await Promise.allSettled([
      platformServerServices.getMyEvents(),
      platformServerServices.getDashboardMyEvents(),
    ]);

    if (response.status === 'fulfilled') {
      myEvents = extractArrayPayload(response.value.data).map(item =>
        mapEvent(item),
      );
    } else if (fallbackResponse.status === 'fulfilled') {
      myEvents = extractArrayPayload(fallbackResponse.value.data).map(item =>
        mapEvent(item),
      );
    }
  } catch {
    myEvents = [];
  }

  const selectedEventId = eventIdFromQuery || myEvents[0]?.id || '';

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <section className="mx-auto w-full max-w-6xl space-y-6">
        <header className="rounded-3xl bg-primary p-7 text-primary-foreground dark:bg-card dark:text-card-foreground sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-300">
            My Events
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Event Invitations
          </h1>
          <p className="mt-3 text-primary-foreground/80 dark:text-muted-foreground">
            Invite users by userId to one of your events.
          </p>
          <Button
            asChild
            variant="outline"
            className="mt-5 border-border bg-transparent text-primary-foreground hover:bg-primary/80 dark:text-foreground dark:hover:bg-muted"
          >
            <Link href="/dashboard/my-events">Back to My Events</Link>
          </Button>
        </header>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-bold text-foreground">Select Event</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {myEvents.map(event => (
              <Button
                key={event.id}
                asChild
                size="sm"
                variant={selectedEventId === event.id ? 'default' : 'outline'}
              >
                <Link
                  href={`/dashboard/my-events/invitations?eventId=${event.id}`}
                >
                  {event.title}
                </Link>
              </Button>
            ))}
          </div>
          {myEvents.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Create an event first to send invitations.
            </p>
          ) : null}
        </section>

        {selectedEventId ? (
          <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-bold text-foreground">Invite User</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Provide the target user id to send an invitation.
            </p>
            <div className="mt-4">
              <EventInvitationForm eventId={selectedEventId} />
            </div>
          </section>
        ) : null}
      </section>
    </main>
  );
};

export default MyEventInvitationsPage;
