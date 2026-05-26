"use client"

import HeroBlock22 from "@/components/history22/HeroBlock22"
import PeriodBlock22 from "@/components/history22/PeriodBlock22"
import { HistoryClosing } from "@/components/history22/HistoryClosing"
import { useLocalizedContent } from "@/lib/use-localized-content"
import { historyPageContent } from "@/data/about-pages/history"

const periodImages: Record<string, string> = {
  "period-1": "/images/history/period-1959-1992.jpeg",
  "period-2": "/images/history/period-2001-2009.jpeg",
  "period-3": "/images/history/period-2010-2014.jpeg",
  "period-4": "/images/history/period-2019-present.jpeg",
}

export function HistoryPageClient() {
  const page = useLocalizedContent(historyPageContent)

  return (
    <main className="min-h-screen bg-background">
      <HeroBlock22
        title={page.hero.heroTitle}
        subtitle={page.hero.heroSubTitle}
        textSlides={page.hero.heroTextSlides}
        scrollHint={page.scrollHint}
        imageAlt={page.heroImageAlt}
      />

      {page.periods.map((period) => (
        <PeriodBlock22 key={period.id} period={period} image={periodImages[period.id]} />
      ))}

      <HistoryClosing phrase={page.closingPhrase} logoAlt={page.heroImageAlt} />
    </main>
  )
}
