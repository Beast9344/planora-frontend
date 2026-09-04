export default function GlobalLoading() {
  return (
    <main className="min-h-screen bg-background px-4 py-16 sm:py-24">
      {/* Hero skeleton */}
      <section className="relative overflow-hidden border-b border-white/10 bg-background px-4 py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-10 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="space-y-5">
            <div className="h-5 w-32 animate-pulse rounded-full bg-orange-500/20" />
            <div className="h-10 w-4/5 animate-pulse rounded-xl bg-card/10" />
            <div className="h-10 w-3/5 animate-pulse rounded-xl bg-card/10" />
            <div className="h-4 w-full animate-pulse rounded bg-card/5" />
            <div className="h-4 w-11/12 animate-pulse rounded bg-card/5" />
            <div className="flex gap-3 pt-2">
              <div className="h-10 w-32 animate-pulse rounded-lg bg-orange-500/20" />
              <div className="h-10 w-32 animate-pulse rounded-lg bg-card/10" />
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-card/10 p-6">
            <div className="mb-4 flex gap-2">
              <div className="h-5 w-16 animate-pulse rounded-full bg-sky-500/20" />
              <div className="h-5 w-16 animate-pulse rounded-full bg-emerald-500/20" />
            </div>
            <div className="h-6 w-4/5 animate-pulse rounded-lg bg-card/10" />
            <div className="mt-3 h-4 w-full animate-pulse rounded bg-card/5" />
            <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-card/5" />
            <div className="mt-6 space-y-3">
              <div className="h-4 w-2/5 animate-pulse rounded bg-card/5" />
              <div className="h-4 w-2/5 animate-pulse rounded bg-card/5" />
              <div className="h-4 w-3/5 animate-pulse rounded bg-card/5" />
            </div>
            <div className="mt-6 h-10 w-28 animate-pulse rounded-lg bg-card/10" />
          </div>
        </div>
      </section>

      {/* Stats skeleton */}
      <section className="bg-background px-4 py-14">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-2xl bg-card/5"
            />
          ))}
        </div>
      </section>

      {/* Cards skeleton */}
      <section className="bg-card px-4 py-16">
        <div className="mx-auto w-full max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="h-7 w-56 animate-pulse rounded-lg bg-muted" />
            <div className="mt-2 h-4 w-72 animate-pulse rounded bg-muted" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
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
        </div>
      </section>
    </main>
  );
}
