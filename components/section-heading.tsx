import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  title: string
  subtitle?: string
  centered?: boolean
  className?: string
  titleClassName?: string
  subtitleClassName?: string
}

export function SectionHeading({
  title,
  subtitle,
  centered = true,
  className,
  titleClassName,
  subtitleClassName,
}: SectionHeadingProps) {
  return (
    <div className={cn(centered ? "text-center" : "text-left", className)}>
      <h2 className={cn("text-h2", titleClassName)}>{title}</h2>
      {subtitle ? (
        <p className={cn("mx-auto mt-4 max-w-2xl text-body", centered ? "mx-auto" : "mx-0", subtitleClassName)}>
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}
