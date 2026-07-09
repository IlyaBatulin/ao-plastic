"use client"

import dynamic from "next/dynamic"
import { useLanguage } from "@/contexts/language-context"
import { SectionHeading } from "@/components/section-heading"

const RussiaMap = dynamic(() => import("@/components/russia-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
    </div>
  ),
})

/** География поставок: карта России с городами на главной странице. */
export function Geography() {
  const { t, lang } = useLanguage()

  return (
    <section id="geography" className="relative overflow-hidden bg-background py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading
          title={t("homePage.geography.title")}
          subtitle={t("homePage.geography.subtitle")}
          centered
          className="mb-8 lg:mb-12"
        />
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-b from-secondary/70 via-background to-secondary/40 shadow-sm">
          <div className="h-[380px] w-full sm:h-[480px] lg:h-[600px]">
            <RussiaMap lang={lang === "en" ? "en" : "ru"} factoryLabel={t("homePage.geography.factory")} />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-border/60 bg-background/60 px-4 py-3.5">
            <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <span className="relative flex h-3 w-3 items-center justify-center" aria-hidden>
                <span className="absolute h-full w-full rounded-full bg-[#0046FF]/30 motion-safe:animate-ping" />
                <span className="relative h-2.5 w-2.5 rounded-full bg-[#0046FF] ring-2 ring-white" />
              </span>
              {lang === "en" ? "Production — Uzlovaya" : "Производство — Узловая"}
            </span>
            <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-[#1e3a8a] ring-2 ring-white" aria-hidden />
              {lang === "en" ? "Delivery cities" : "Города поставок"}
            </span>
            <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <svg width="26" height="10" viewBox="0 0 26 10" className="text-[#0046FF]" aria-hidden>
                <path d="M1 9C8 2 18 2 25 9" fill="none" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.45" strokeLinecap="round" />
                <circle cx="13" cy="3.7" r="1.8" fill="currentColor" />
              </svg>
              {lang === "en" ? "Delivery routes" : "Маршруты поставок"}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
