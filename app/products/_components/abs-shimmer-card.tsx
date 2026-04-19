import type { ReactNode } from "react"

/** Карточка с переливающейся подсветкой, как у блока формы в AbsCustomInfo */
export function AbsShimmerCard({ children }: { children: ReactNode }) {
  return (
    <article className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-sm lg:p-12">
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
        <div
          className="absolute inset-0 animate-shimmer"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.15) 50%, transparent 100%)",
            width: "200%",
          }}
        />
      </div>
      <div className="relative z-10">{children}</div>
    </article>
  )
}
