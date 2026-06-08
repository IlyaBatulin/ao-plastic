export default function SubcategoryLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 lg:px-8 pt-32 pb-12">
        <div className="h-5 w-40 animate-pulse rounded bg-muted" />
        <div className="mt-8 h-12 w-2/3 max-w-xl animate-pulse rounded bg-muted" />
        <div className="mt-4 h-20 w-full max-w-2xl animate-pulse rounded bg-muted/70" />
      </div>
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div className="h-9 w-64 animate-pulse rounded bg-muted" />
          <div className="h-6 w-24 animate-pulse rounded bg-muted/70" />
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-3xl border border-border bg-card"
            >
              <div className="h-64 animate-pulse bg-muted" />
              <div className="space-y-3 p-6">
                <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-4 w-full animate-pulse rounded bg-muted/70" />
                <div className="h-10 w-full animate-pulse rounded-xl bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
