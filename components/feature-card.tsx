import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  className?: string
}

export function FeatureCard({ icon: Icon, title, description, className }: FeatureCardProps) {
  return (
    <div className={cn("rounded-2xl border border-primary/15 bg-card p-8 shadow-blue-sm", className)}>
      <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
        <Icon className="h-7 w-7 text-primary" />
      </div>
      <h3 className="text-h3 mb-3">{title}</h3>
      <p className="text-body text-base sm:text-base text-muted-foreground">{description}</p>
    </div>
  )
}
