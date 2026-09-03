"use client"

import { Footer } from "@/components/footer"
import PeriodBlock22 from "@/components/history22/PeriodBlock22"
import { HistoryClosing } from "@/components/history22/HistoryClosing"
import { ChevronDown } from "lucide-react"
import { motion, type Variants } from "framer-motion"
import { useLocalizedContent } from "@/lib/use-localized-content"
import { missionPageContent } from "@/data/about-pages/mission"
import { historyPageContent } from "@/data/about-pages/history"

const periodImages: Record<string, string> = {
  "period-1": "/images/history/period-1959-1992.jpeg",
  "period-2": "/images/history/period-1974-1992-v2.webp",
  "period-3": "/images/history/period-modernization.png",
  "period-4": "/images/history/period-2019-present.jpeg",
  "period-5": "/images/history/period-1974-1992.png",
  "period-6": "/images/history/period-2024-2026.png",
}

const missionSequence: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.18,
      staggerChildren: 0.14,
    },
  },
}

const missionReveal: Variants = {
  hidden: { opacity: 0, y: 34, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
}

export function MissionPageClient() {
  const page = useLocalizedContent(missionPageContent)
  const history = useLocalizedContent(historyPageContent)

  return (
    <div className="min-h-screen bg-background">
      <section className="relative flex min-h-[100svh] items-center overflow-hidden px-4 pb-16 pt-28 md:px-8 md:pt-32">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/history/history-hero.jpeg"
            alt=""
            className="h-full w-full object-cover"
            aria-hidden
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,17,44,0.92)_0%,rgba(8,33,78,0.76)_54%,rgba(8,30,67,0.45)_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06152f]/95 via-transparent to-[#06152f]/40" />
        </div>

        <div className="container relative z-10 mx-auto max-w-[90rem]">
          <motion.div
            className="max-w-[78rem] text-white"
            variants={missionSequence}
            initial="hidden"
            animate="visible"
          >
            <motion.p variants={missionReveal} className="mb-6 text-caption text-white/70 md:mb-8">
              {page.eyebrow}
            </motion.p>
            <motion.h1
              variants={missionReveal}
              className="max-w-6xl text-[clamp(3.25rem,6.3vw,7rem)] font-semibold leading-[0.94] tracking-[-0.045em] text-white"
            >
              {page.title}
            </motion.h1>
            <motion.p
              variants={missionReveal}
              className="mt-9 max-w-[68rem] text-[clamp(1.2rem,1.65vw,1.75rem)] leading-[1.48] text-white/92 md:mt-12"
            >
              {page.intro}
            </motion.p>
            <motion.div variants={missionReveal} className="my-10 h-px w-full max-w-[68rem] bg-gradient-to-r from-white/55 via-white/20 to-transparent md:my-12" />
            <motion.div
              variants={missionReveal}
              className="grid max-w-[68rem] gap-5 md:grid-cols-[minmax(18rem,0.85fr)_minmax(0,1.4fr)] md:items-start md:gap-12"
            >
              <p className="text-[clamp(1.35rem,2vw,2rem)] font-medium italic leading-snug text-white">
                {page.motto}
              </p>
              <p className="text-base leading-relaxed text-white/76 md:text-lg">
                {page.mottoSuffix}
              </p>
            </motion.div>
          </motion.div>
        </div>

        <a
          href="#history"
          className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
        >
          <span>{page.scrollToHistory}</span>
          <ChevronDown className="h-5 w-5 animate-bounce" aria-hidden />
        </a>
      </section>

      <section id="history" className="scroll-mt-20 border-b border-border/60 bg-background px-4 py-20 text-center md:px-8 md:py-28">
        <div className="mx-auto max-w-4xl">
          <p className="mb-4 text-caption text-primary">{page.historyEyebrow}</p>
          <h2 className="text-h1 text-foreground">{history.hero.heroTitle}</h2>
          <p className="mx-auto mt-6 max-w-2xl text-body-lead text-muted-foreground">
            {page.historyLead}
          </p>
        </div>
      </section>

      {history.periods.map((period) => (
        <PeriodBlock22 key={period.id} period={period} image={periodImages[period.id]} />
      ))}

      <HistoryClosing phrase={history.closingPhrase} logoAlt={history.heroImageAlt} />

      <Footer />
    </div>
  )
}
