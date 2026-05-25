"use client"

import { heroData, historyPeriods } from "@/data/historyPeriods22"
import HeroBlock22 from "@/components/history22/HeroBlock22"
import PeriodBlock22 from "@/components/history22/PeriodBlock22"

const periodImages: Record<string, string> = {
  "period-1": "/images/history/period-1959-1992.jpeg",
  "period-2": "/images/history/period-2001-2009.jpeg",
  "period-3": "/images/history/period-2010-2014.jpeg",
  "period-4": "/images/history/period-2019-present.jpeg",
}

export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-background">
      <HeroBlock22
        title={heroData.heroTitle}
        subtitle={heroData.heroSubTitle}
        textSlides={heroData.heroTextSlides}
      />

      {historyPeriods.map((period) => (
        <PeriodBlock22 key={period.id} period={period} image={periodImages[period.id]} />
      ))}
    </main>
  )
}
