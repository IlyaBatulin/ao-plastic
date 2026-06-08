"use client"

import { AbsInjectionInfo } from "@/app/products/_components/abs-injection-info"
import { AbsExtrusionInfo } from "@/app/products/_components/abs-extrusion-info"
import { useLanguage } from "@/contexts/language-context"
import { ABS_PAGE_KEYS } from "@/lib/abs-category-i18n"

export function AbsCategorySection() {
  const { t } = useLanguage()
  const absK = ABS_PAGE_KEYS

  return (
    <section className="border-t border-border bg-muted/30 py-16 lg:py-20">
      <div className="container mx-auto max-w-7xl px-4 lg:px-8">
        <header className="mb-10 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground lg:text-3xl">
            {t(absK.sectionTitle)}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground leading-relaxed">
            {t(absK.sectionIntro)}
          </p>
        </header>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-stretch">
          <AbsInjectionInfo />
          <AbsExtrusionInfo />
        </div>
      </div>
    </section>
  )
}
