"use client"

import { AbsShimmerCard } from "@/app/products/_components/abs-shimmer-card"
import { useLanguage } from "@/contexts/language-context"
import { ABS_PAGE_KEYS } from "@/lib/abs-category-i18n"

export function AbsExtrusionInfo() {
  const { t } = useLanguage()
  const k = ABS_PAGE_KEYS
  const applications = (t(k.extrusionApplications) as string[]) || []

  return (
    <AbsShimmerCard>
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">{t(k.extrusionTitle)}</h2>
      <p className="mt-4 text-muted-foreground leading-relaxed">{t(k.extrusionIntro)}</p>

      <h3 className="mt-10 text-base font-semibold text-foreground">{t(k.extrusionApplicationsHeading)}</h3>
      <p className="mt-4 text-muted-foreground leading-relaxed">{t(k.extrusionDetails)}</p>

      <ul className="mt-6 space-y-2.5 text-sm text-muted-foreground leading-relaxed">
        {applications.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </AbsShimmerCard>
  )
}
