import { Activity, CalendarDays, Users } from 'lucide-react';
import { platformServerServices } from '@/services/platform.server.services';
import ReportsCharts from './ReportsCharts';

const asRecord = (value: unknown): Record<string, unknown> => {
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : {};
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

type ReportsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const ReportsPage = async ({ searchParams }: ReportsPageProps) => {
  const resolvedSearchParams = (await searchParams) || {};
  const tableSearch =
    typeof resolvedSearchParams.tableSearch === 'string'
      ? resolvedSearchParams.tableSearch.trim().toLowerCase()
      : '';
  const toneFilter =
    typeof resolvedSearchParams.tone === 'string'
      ? resolvedSearchParams.tone.toLowerCase()
      : 'all';
  const pageParam =
    typeof resolvedSearchParams.page === 'string'
      ? resolvedSearchParams.page
      : '1';
  const page = Math.max(1, Number(pageParam) || 1);
  const limit = 3;

  let usersSummary = {
    totalUsers: 0,
    activeUsers: 0,
    blockedUsers: 0,
    deletedUsers: 0,
  };

  let eventsSummary = {
    totalEvents: 0,
    privateEvents: 0,
    publicEvents: 0,
    paidEvents: 0,
    freeEvents: 0,
  };

  let engagementSummary = {
    totalReviews: 0,
    totalParticipants: 0,
  };

  try {
    const summaryResponse =
      await platformServerServices.getAdminReportsSummary();
    const summaryEnvelope = asRecord(summaryResponse.data);
    const summaryPayload = asRecord(summaryEnvelope.data ?? summaryEnvelope);
    const usersPayload = asRecord(summaryPayload.users);
    const eventsPayload = asRecord(summaryPayload.events);
    const engagementPayload = asRecord(summaryPayload.engagement);

    usersSummary = {
      totalUsers: pickNumber(usersPayload.totalUsers),
      activeUsers: pickNumber(usersPayload.activeUsers),
      blockedUsers: pickNumber(usersPayload.blockedUsers),
      deletedUsers: pickNumber(usersPayload.deletedUsers),
    };

    eventsSummary = {
      totalEvents: pickNumber(eventsPayload.totalEvents),
      privateEvents: pickNumber(eventsPayload.privateEvents),
      publicEvents: pickNumber(eventsPayload.publicEvents),
      paidEvents: pickNumber(eventsPayload.paidEvents),
      freeEvents: pickNumber(eventsPayload.freeEvents),
    };

    engagementSummary = {
      totalReviews: pickNumber(engagementPayload.totalReviews),
      totalParticipants: pickNumber(engagementPayload.totalParticipants),
    };
  } catch {
    usersSummary = {
      totalUsers: 0,
      activeUsers: 0,
      blockedUsers: 0,
      deletedUsers: 0,
    };

    eventsSummary = {
      totalEvents: 0,
      privateEvents: 0,
      publicEvents: 0,
      paidEvents: 0,
      freeEvents: 0,
    };

    engagementSummary = {
      totalReviews: 0,
      totalParticipants: 0,
    };
  }

  const stats = [
    {
      title: 'Total Events',
      value: String(eventsSummary.totalEvents),
      delta: `Public/Private: ${eventsSummary.publicEvents}/${eventsSummary.privateEvents}`,
      icon: CalendarDays,
    },
    {
      title: 'Total Users',
      value: String(usersSummary.totalUsers),
      delta: `Active/Blocked: ${usersSummary.activeUsers}/${usersSummary.blockedUsers}`,
      icon: Users,
    },
    {
      title: 'Reviews and Participation',
      value: `${engagementSummary.totalReviews} / ${engagementSummary.totalParticipants}`,
      delta: `Paid/Free events: ${eventsSummary.paidEvents}/${eventsSummary.freeEvents}`,
      icon: Activity,
    },
  ];

  const tableRows = [
    {
      category: 'Total Participants',
      count: engagementSummary.totalParticipants,
      status: 'Track approvals in event workspace',
      tone: 'watch',
    },
    {
      category: 'Blocked Users',
      count: usersSummary.blockedUsers,
      status: 'Monitor for abuse patterns',
      tone: 'risk',
    },
    {
      category: 'Private/Paid Events',
      count: `${eventsSummary.privateEvents} / ${eventsSummary.paidEvents}`,
      status: 'Visibility and monetization mix',
      tone: 'good',
    },
    {
      category: 'Deleted Users',
      count: usersSummary.deletedUsers,
      status: 'Historical moderation count',
      tone: 'neutral',
    },
  ];

  const filteredRows = tableRows.filter(row => {
    const matchesSearch =
      !tableSearch ||
      row.category.toLowerCase().includes(tableSearch) ||
      row.status.toLowerCase().includes(tableSearch);
    const matchesTone = toneFilter === 'all' || row.tone === toneFilter;
    return matchesSearch && matchesTone;
  });

  const totalRows = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / limit));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * limit;
  const paginatedRows = filteredRows.slice(start, start + limit);

  const baseQuery = new URLSearchParams();
  if (tableSearch) baseQuery.set('tableSearch', tableSearch);
  if (toneFilter && toneFilter !== 'all') baseQuery.set('tone', toneFilter);
  const getPageHref = (nextPage: number) => {
    const params = new URLSearchParams(baseQuery.toString());
    params.set('page', String(nextPage));
    return `/admin/dashboard/reports?${params.toString()}`;
  };

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <section className="mx-auto w-full max-w-7xl space-y-6">
        <header className="rounded-3xl bg-primary p-7 text-primary-foreground dark:bg-card dark:text-card-foreground sm:p-10">
          <h1 className="text-3xl font-bold sm:text-4xl">Admin Reports</h1>
          <p className="mt-2 text-primary-foreground/80 dark:text-muted-foreground">
            API-backed moderation and growth metrics for users, events, and
            engagement.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          {stats.map(stat => {
            const Icon = stat.icon;
            return (
              <article
                key={stat.title}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <span className="rounded-lg bg-muted p-2 text-muted-foreground">
                    <Icon className="size-4" />
                  </span>
                </div>
                <p className="mt-4 text-3xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm font-semibold text-emerald-600">
                  {stat.delta}
                </p>
              </article>
            );
          })}
        </div>

        <ReportsCharts
          users={usersSummary}
          events={eventsSummary}
          engagement={engagementSummary}
        />

        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-bold text-foreground">
              Moderation Snapshot
            </h2>
            <form className="grid gap-2 sm:grid-cols-3" method="GET">
              <input
                name="tableSearch"
                defaultValue={tableSearch}
                placeholder="Search rows"
                className="h-9 rounded-md border border-border bg-background px-3 text-sm"
              />
              <select
                name="tone"
                defaultValue={toneFilter || 'all'}
                className="h-9 rounded-md border border-border bg-background px-3 text-sm"
              >
                <option value="all">All Types</option>
                <option value="risk">Risk</option>
                <option value="watch">Watch</option>
                <option value="good">Good</option>
                <option value="neutral">Neutral</option>
              </select>
              <button
                type="submit"
                className="h-9 rounded-md bg-primary px-3 text-sm font-medium text-white"
              >
                Filter
              </button>
            </form>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-140 text-left text-sm">
              <thead className="text-muted-foreground">
                <tr>
                  <th className="py-2">Category</th>
                  <th className="py-2">Count</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {paginatedRows.map(row => (
                  <tr key={row.category} className="border-t border-border">
                    <td className="py-3">{row.category}</td>
                    <td className="py-3">{row.count}</td>
                    <td
                      className={`py-3 ${
                        row.tone === 'risk'
                          ? 'text-rose-600'
                          : row.tone === 'watch'
                            ? 'text-amber-600'
                            : row.tone === 'good'
                              ? 'text-emerald-600'
                              : 'text-muted-foreground'
                      }`}
                    >
                      {row.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {paginatedRows.length > 0 ? (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <a
                    href={getPageHref(Math.max(1, currentPage - 1))}
                    className={`rounded-md border border-border px-3 py-1.5 text-sm ${
                      currentPage <= 1 ? 'pointer-events-none opacity-50' : ''
                    }`}
                  >
                    Previous
                  </a>
                  <a
                    href={getPageHref(Math.min(totalPages, currentPage + 1))}
                    className={`rounded-md border border-border px-3 py-1.5 text-sm ${
                      currentPage >= totalPages
                        ? 'pointer-events-none opacity-50'
                        : ''
                    }`}
                  >
                    Next
                  </a>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">
                No table rows match this filter.
              </p>
            )}
          </div>
        </section>
      </section>
    </main>
  );
};

export default ReportsPage;
