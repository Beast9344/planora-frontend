import { extractArrayPayload, mapParticipation } from '@/lib/apiMappers';
import { platformServerServices } from '@/services/platform.server.services';

type MyPaymentsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const MyPaymentsPage = async ({ searchParams }: MyPaymentsPageProps) => {
  const resolvedSearchParams = (await searchParams) || {};
  const searchTerm =
    typeof resolvedSearchParams.searchTerm === 'string'
      ? resolvedSearchParams.searchTerm.trim().toLowerCase()
      : '';
  const statusFilter =
    typeof resolvedSearchParams.status === 'string'
      ? resolvedSearchParams.status.toUpperCase()
      : '';
  const pageParam =
    typeof resolvedSearchParams.page === 'string'
      ? resolvedSearchParams.page
      : '1';
  const page = Math.max(1, Number(pageParam) || 1);
  const limit = 8;

  let paymentRows = [] as ReturnType<typeof mapParticipation>[];

  try {
    const response = await platformServerServices.getMyParticipations();
    paymentRows = extractArrayPayload(response.data).map(item =>
      mapParticipation(item),
    );
  } catch {
    paymentRows = [];
  }

  const filteredRows = paymentRows.filter(row => {
    const matchesSearch =
      !searchTerm || row.eventTitle.toLowerCase().includes(searchTerm);

    const normalizedStatus =
      row.paymentStatus.toUpperCase() === 'PAID'
        ? 'PAID'
        : row.status.toUpperCase();

    const matchesStatus =
      !statusFilter ||
      statusFilter === 'ALL' ||
      normalizedStatus.includes(statusFilter);

    return matchesSearch && matchesStatus;
  });

  const total = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * limit;
  const paginatedRows = filteredRows.slice(start, start + limit);

  const baseQuery = new URLSearchParams();
  if (searchTerm) baseQuery.set('searchTerm', searchTerm);
  if (statusFilter) baseQuery.set('status', statusFilter);

  const getPageHref = (nextPage: number) => {
    const params = new URLSearchParams(baseQuery.toString());
    params.set('page', String(nextPage));
    return `/dashboard/my-payments?${params.toString()}`;
  };

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <section className="mx-auto w-full max-w-6xl space-y-6">
        <header className="rounded-3xl bg-primary p-7 text-primary-foreground dark:bg-card dark:text-card-foreground sm:p-10">
          <h1 className="text-3xl font-bold sm:text-4xl">My Payments</h1>
          <p className="mt-2 text-primary-foreground/80 dark:text-muted-foreground">
            Track payment status, transaction history, and approval state for
            paid events.
          </p>
        </header>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-bold text-foreground">
              Payment History
            </h2>
            <form className="grid gap-2 sm:grid-cols-3" method="GET">
              <input
                name="searchTerm"
                defaultValue={searchTerm}
                placeholder="Search event"
                className="h-9 rounded-md border border-border bg-background px-3 text-sm"
              />
              <select
                name="status"
                defaultValue={statusFilter || 'ALL'}
                className="h-9 rounded-md border border-border bg-background px-3 text-sm"
              >
                <option value="ALL">All Status</option>
                <option value="PAID">Paid</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
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
            <table className="w-full min-w-160 text-left text-sm">
              <thead className="text-muted-foreground">
                <tr>
                  <th className="py-2">Event</th>
                  <th className="py-2">Amount</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRows.map(row => (
                  <tr
                    key={`${row.id}-${row.createdAt}`}
                    className="border-t border-border text-muted-foreground"
                  >
                    <td className="py-3">{row.eventTitle}</td>
                    <td className="py-3 font-semibold">
                      {row.registrationFee === 0
                        ? 'Free'
                        : `৳${row.registrationFee}`}
                    </td>
                    <td className="py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          row.paymentStatus.toUpperCase() === 'PAID'
                            ? 'bg-emerald-100 text-emerald-700'
                            : row.status.toUpperCase().includes('APPROVED')
                              ? 'bg-sky-100 text-sky-700'
                              : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {row.paymentStatus.toUpperCase() === 'PAID'
                          ? 'Paid'
                          : row.status}
                      </span>
                    </td>
                    <td className="py-3">
                      {row.createdAt
                        ? new Date(row.createdAt).toLocaleDateString()
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {paginatedRows.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">
                No payment records found yet.
              </p>
            ) : null}

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
            ) : null}
          </div>
        </section>
      </section>
    </main>
  );
};

export default MyPaymentsPage;
