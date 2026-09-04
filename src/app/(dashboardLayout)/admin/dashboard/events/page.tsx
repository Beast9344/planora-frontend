import Link from 'next/link';
import { Button } from '@/components/ui/button';
import AdminEventRowActions from '@/components/modules/Dashboard/AdminEventRowActions';
import { extractArrayPayload } from '@/lib/apiMappers';
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

type AdminEventsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const EventsPage = async ({ searchParams }: AdminEventsPageProps) => {
  const resolvedSearchParams = (await searchParams) || {};
  const searchTerm =
    typeof resolvedSearchParams.searchTerm === 'string'
      ? resolvedSearchParams.searchTerm
      : '';
  const pageParam =
    typeof resolvedSearchParams.page === 'string'
      ? resolvedSearchParams.page
      : '1';
  const page = Math.max(1, Number(pageParam) || 1);

  let events = [] as unknown[];
  let total = 0;
  let limit = 10;

  try {
    const response = await platformServerServices.getAdminEvents({
      page,
      limit,
      ...(searchTerm ? { searchTerm } : {}),
    });

    events = extractArrayPayload(response.data);
    total = pickNumber(response.meta?.total);
    limit = pickNumber(response.meta?.limit, 10);
  } catch {
    events = [];
    total = 0;
  }

  const privateCount = events.filter(item => {
    const event = asRecord(item);
    return pickString(event.visibility).toUpperCase() === 'PRIVATE';
  }).length;
  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, limit)));

  return (
    <main className="space-y-6">
      <section className="rounded-3xl bg-primary p-7 text-primary-foreground dark:bg-card dark:text-card-foreground sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-300">
          Admin
        </p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
          Events Management
        </h1>
        <p className="mt-3 max-w-3xl text-primary-foreground/80 dark:text-muted-foreground">
          Audit published events and remove policy-violating content.
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Events</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{total}</p>
        </article>
        <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Private On This Page</p>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {privateCount}
          </p>
        </article>
        <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Current Page</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{page}</p>
        </article>
      </div>

      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <form
          className="mb-4 flex flex-col gap-3 sm:flex-row"
          action="/admin/dashboard/events"
          method="get"
        >
          <input
            name="searchTerm"
            defaultValue={searchTerm}
            placeholder="Search by title or owner"
            className="h-11 flex-1 rounded-lg border border-border px-3 text-sm"
          />
          <Button
            type="submit"
            className="h-11 bg-primary text-white hover:bg-primary/90"
          >
            Search
          </Button>
        </form>

        <div className="space-y-3">
          {events.map(item => {
            const event = asRecord(item);
            const owner = asRecord(event.owner);
            const count = asRecord(event._count);
            const eventId = pickString(event.id);

            return (
              <article
                key={eventId}
                className="rounded-xl border border-border p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">
                      {pickString(event.title, 'Untitled event')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Owner: {pickString(owner.name, 'Unknown')} (
                      {pickString(owner.email, 'N/A')})
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Visibility: {pickString(event.visibility, 'N/A')} | Fee:{' '}
                      {pickString(event.feeType, 'N/A')} | Participants:{' '}
                      {pickNumber(count.participants)} | Reviews:{' '}
                      {pickNumber(count.reviews)}
                    </p>
                    <div className="mt-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/admin/dashboard/events/${eventId}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <AdminEventRowActions eventId={eventId} />
                </div>
              </article>
            );
          })}

          {events.length === 0 ? (
            <p className="rounded-xl bg-muted p-4 text-sm text-muted-foreground">
              No events found.
            </p>
          ) : null}
        </div>

        <div className="mt-5 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button asChild size="sm" variant="outline" disabled={page <= 1}>
              <Link
                href={`/admin/dashboard/events?page=${Math.max(1, page - 1)}${searchTerm ? `&searchTerm=${encodeURIComponent(searchTerm)}` : ''}`}
              >
                Previous
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant="outline"
              disabled={page >= totalPages}
            >
              <Link
                href={`/admin/dashboard/events?page=${Math.min(totalPages, page + 1)}${searchTerm ? `&searchTerm=${encodeURIComponent(searchTerm)}` : ''}`}
              >
                Next
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default EventsPage;
