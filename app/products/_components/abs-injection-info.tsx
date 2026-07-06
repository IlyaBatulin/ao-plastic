"use client"

import { AbsShimmerCard } from "@/app/products/_components/abs-shimmer-card"
import { useLanguage } from "@/contexts/language-context"
import { ABS_PAGE_KEYS, type AbsAdvantageItem } from "@/lib/abs-category-i18n"

export function AbsInjectionInfo() {
  const { t } = useLanguage()
  const k = ABS_PAGE_KEYS
  const advantages = (t(k.injectionAdvantages) as AbsAdvantageItem[]) || []
  const applications = (t(k.injectionApplications) as string[]) || []

  return (
    <AbsShimmerCard>
      <h2 className="text-h3 text-foreground">{t(k.injectionTitle)}</h2>
      <p className="mt-4 text-muted-foreground leading-relaxed">{t(k.injectionIntro)}</p>

      <h3 className="mt-10 text-base font-semibold text-foreground">{t(k.injectionPropertiesHeading)}</h3>
      <dl className="mt-4 space-y-5 border-t border-border pt-5">
        {advantages.map((item) => (
          <div key={item.title}>
            <dt className="font-medium text-foreground">{item.title}</dt>
            <dd className="mt-1 text-sm text-muted-foreground leading-relaxed">{item.desc}</dd>
          </div>
        ))}
      </dl>

      <h3 className="mt-10 text-base font-semibold text-foreground">{t(k.injectionApplicationsHeading)}</h3>
      <ul className="mt-4 grid grid-cols-1 gap-x-10 gap-y-2 text-sm text-muted-foreground sm:grid-cols-2">
        {applications.map((app) => (
          <li key={app}>{app}</li>
        ))}
      </ul>

      <p className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground leading-relaxed">
        {t(k.injectionFooter)}
      </p>
    </AbsShimmerCard>
  )
}
