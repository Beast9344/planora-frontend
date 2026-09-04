const CommonLayoutLoading = () => {
  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:py-16">
      {/* Page header skeleton */}
      <div className="mx-auto mb-8 w-full max-w-7xl sm:px-6 lg:px-8">
        <div className="h-8 w-64 animate-pulse rounded-xl bg-muted" />
        <div className="mt-2 h-4 w-96 animate-pulse rounded bg-muted" />
      </div>

      {/* Filter row */}
      <div className="mx-auto mb-8 w-full max-w-7xl sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-3">
          <div className="h-10 w-64 animate-pulse rounded-lg bg-muted" />
          <div className="h-10 w-32 animate-pulse rounded-lg bg-muted" />
          <div className="h-10 w-32 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>

      {/* Card grid skeleton */}
      <section className="mx-auto w-full max-w-7xl sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="mb-4 flex gap-2">
                <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
                <div className="h-5 w-12 animate-pulse rounded-full bg-muted" />
              </div>
              <div className="h-5 w-4/5 animate-pulse rounded bg-muted" />
              <div className="mt-4 space-y-2">
                <div className="h-4 w-2/5 animate-pulse rounded bg-muted" />
                <div className="h-4 w-2/5 animate-pulse rounded bg-muted" />
                <div className="h-4 w-3/5 animate-pulse rounded bg-muted" />
              </div>
              <div className="mt-5 flex justify-between">
                <div className="h-4 w-16 animate-pulse rounded bg-muted" />
                <div className="h-8 w-24 animate-pulse rounded-lg bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default CommonLayoutLoading;
