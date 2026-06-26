"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { StatsCounter } from "@/components/stats-counter"
import { cn } from "@/lib/utils"

type AdminStatCardProps = {
  title: string
  value: number
  subtitle: string
  icon: LucideIcon
  index?: number
  accent?: "blue" | "emerald" | "violet" | "amber"
  badge?: string
  loading?: boolean
}

const accentStyles = {
  blue: {
    icon: "bg-blue-500/15 text-blue-600",
    glow: "from-blue-500/20 to-blue-600/5",
    bar: "bg-blue-500",
  },
  emerald: {
    icon: "bg-emerald-500/15 text-emerald-600",
    glow: "from-emerald-500/20 to-emerald-600/5",
    bar: "bg-emerald-500",
  },
  violet: {
    icon: "bg-violet-500/15 text-violet-600",
    glow: "from-violet-500/20 to-violet-600/5",
    bar: "bg-violet-500",
  },
  amber: {
    icon: "bg-amber-500/15 text-amber-600",
    glow: "from-amber-500/20 to-amber-600/5",
    bar: "bg-amber-500",
  },
} as const

export function AdminStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  index = 0,
  accent = "blue",
  badge,
  loading = false,
}: AdminStatCardProps) {
  const styles = accentStyles[accent]

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
      className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-lg"
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100",
          styles.glow
        )}
      />
      <div className={cn("absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100", styles.bar)} />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex items-center gap-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {badge ? (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                {badge}
              </span>
            ) : null}
          </div>

          {loading ? (
            <div className="h-10 w-24 animate-pulse rounded-lg bg-muted" />
          ) : (
            <StatsCounter
              end={value}
              duration={1400}
              className="text-4xl font-bold leading-none text-foreground"
            />
          )}

          <p className="mt-2 text-xs text-muted-foreground">{subtitle}</p>
        </div>

        <div className={cn("rounded-2xl p-3 transition-transform duration-300 group-hover:scale-110", styles.icon)}>
          <Icon className="h-6 w-6" strokeWidth={1.8} />
        </div>
      </div>
    </motion.div>
  )
}
