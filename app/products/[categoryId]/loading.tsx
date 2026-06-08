export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative min-h-[60vh] w-full overflow-hidden bg-muted/40">
        <div className="container mx-auto px-4 lg:px-8 pt-24 pb-12 sm:pt-28 lg:pt-32">
          <div className="h-10 w-44 animate-pulse rounded-full bg-muted" />
          <div className="mt-12 h-14 w-2/3 max-w-xl animate-pulse rounded bg-muted" />
          <div className="mt-6 h-20 w-full max-w-2xl animate-pulse rounded bg-muted/70" />
        </div>
      </div>
      <div className="container mx-auto px-4 lg:px-8 py-16 -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-72 sm:h-80 animate-pulse rounded-3xl border border-border bg-muted/50"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
