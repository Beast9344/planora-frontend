export default function EventDetailsPageLoading() {
  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-5xl sm:px-6 lg:px-8">
        {/* Back link */}
        <div className="mb-6 h-4 w-32 animate-pulse rounded bg-muted" />

        {/* Top badges */}
        <div className="mb-4 flex flex-wrap gap-2">
          <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
          <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
          <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
        </div>

        {/* Title */}
        <div className="h-9 w-3/4 animate-pulse rounded-xl bg-muted" />
        <div className="mt-2 h-9 w-1/2 animate-pulse rounded-xl bg-muted" />

        {/* Meta row */}
        <div className="mt-5 flex flex-wrap gap-5">
          <div className="h-4 w-36 animate-pulse rounded bg-muted" />
          <div className="h-4 w-36 animate-pulse rounded bg-muted" />
          <div className="h-4 w-36 animate-pulse rounded bg-muted" />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* Description block */}
          <div className="space-y-3">
            <div className="h-5 w-32 animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-11/12 animate-pulse rounded bg-muted" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />

            {/* Reviews skeleton */}
            <div className="mt-8 space-y-4">
              <div className="h-6 w-40 animate-pulse rounded bg-muted" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border bg-card p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-9 animate-pulse rounded-full bg-muted" />
                    <div className="space-y-1">
                      <div className="h-4 w-28 animate-pulse rounded bg-muted" />
                      <div className="h-3 w-20 animate-pulse rounded bg-muted" />
                    </div>
                  </div>
                  <div className="mt-3 h-4 w-full animate-pulse rounded bg-muted" />
                  <div className="mt-1 h-4 w-4/5 animate-pulse rounded bg-muted" />
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-4 h-5 w-32 animate-pulse rounded bg-muted" />
              <div className="space-y-3">
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
                <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
                <div className="h-4 w-3/5 animate-pulse rounded bg-muted" />
              </div>
              <div className="mt-6 h-10 w-full animate-pulse rounded-lg bg-muted" />
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-3 h-5 w-28 animate-pulse rounded bg-muted" />
              <div className="h-16 w-full animate-pulse rounded-xl bg-muted" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
