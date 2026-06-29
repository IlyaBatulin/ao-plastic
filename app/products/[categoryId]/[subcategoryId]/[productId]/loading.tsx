export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 lg:px-8 pt-32 pb-8">
        <div className="h-5 w-48 animate-pulse rounded bg-muted" />
      </div>
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="h-[28rem] sm:h-[32rem] lg:min-h-[500px] animate-pulse bg-white" />
          <div className="space-y-4">
            <div className="h-12 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-24 w-full animate-pulse rounded bg-muted/70" />
            <div className="h-12 w-full animate-pulse rounded-xl bg-muted" />
          </div>
        </div>
      </div>
    </div>
  )
}
