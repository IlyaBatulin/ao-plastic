"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { StatsCounter } from "@/components/stats-counter"
import type { LucideIcon } from "lucide-react"
import { Beaker, Package, Cog, Droplets, FlaskConical, Factory, TrendingUp } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function Stats() {
  const { t } = useLanguage()

  const stats: {
    icon: LucideIcon
    value: number
    label: string
    /** Если не задан — используется homePage.stats.suffix */
    suffixKey?: string
  }[] = [
    { icon: TrendingUp, value: 150, label: "totalProductVolume", suffixKey: "homePage.stats.suffixPlus" },
    { icon: FlaskConical, value: 20, label: "sadStyreneAcrylicDispersions" },
    { icon: Factory, value: 23, label: "absPlastics" },
    { icon: Package, value: 42, label: "expandablePolystyrene" },
    { icon: Beaker, value: 60, label: "styrene" },
    { icon: Cog, value: 3, label: "machineBuildingPartsDms" },
    { icon: Droplets, value: 20, label: "dispersionsInRamenskoye" },
  ]

  return (
    <section id="stats" className="relative overflow-hidden bg-background">
      <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2">
        <div className="flex min-h-[100dvh] w-full flex-col items-stretch bg-background lg:h-[100dvh] lg:min-h-[100dvh] lg:flex-row">
          {/* Слева: статистика на фоне страницы, без градиента поверх фото */}
          <div className="flex min-h-0 flex-1 flex-col justify-center p-3 pt-5 sm:p-5 sm:pt-7 lg:max-w-md lg:flex-none lg:basis-[min(28rem,44%)] lg:pl-8 lg:pt-9 xl:max-w-xl xl:basis-[min(36rem,40%)]">
            <div className="flex max-h-[min(100dvh,920px)] min-h-0 w-full max-w-lg flex-1 flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-lg sm:max-w-xl lg:max-h-none lg:h-full dark:bg-card">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -22 }}
                  whileInView={{ x: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="flex min-h-0 flex-1 flex-row items-stretch border-b border-border/60 last:border-b-0"
                >
                  {/* Фиксированная ширина «в длину», высота — доля ряда */}
                  <div className="flex w-14 shrink-0 flex-col items-center justify-center border-r border-primary/20 bg-primary/10 py-1 sm:w-16 dark:bg-primary/15">
                    <motion.div
                      className="flex h-[88%] max-h-full w-full items-center justify-center px-1"
                      initial={{ opacity: 0, scale: 0.88 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, amount: 0.35 }}
                      transition={{
                        duration: 0.55,
                        delay: index * 0.12 + 0.15,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <stat.icon
                        className="h-full w-full max-w-[2.75rem] text-primary sm:max-w-[3.25rem]"
                        strokeWidth={1.65}
                        aria-hidden
                      />
                    </motion.div>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-center px-3 py-2 sm:px-5 sm:py-3">
                    <StatsCounter
                      end={stat.value}
                      suffix={t(stat.suffixKey ?? "homePage.stats.suffix")}
                      className="text-xl font-bold leading-tight text-[#1e3a8a] tabular-nums sm:text-2xl lg:text-3xl xl:text-4xl dark:text-[#60a5fa]"
                    />
                    <p className="mt-1 text-sm font-medium leading-snug text-muted-foreground sm:text-base lg:text-lg">
                      {t(`homePage.stats.${stat.label}`)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Справа: фото на всю колонку до края экрана, по высоте как секция (ровно с блоком статистики) */}
          <div className="relative flex min-h-[42vh] w-full min-w-0 flex-1 flex-col self-stretch lg:min-h-0">
            <motion.div
              className="relative h-full min-h-[42vh] w-full flex-1 overflow-hidden bg-muted/20 lg:min-h-0 lg:rounded-l-xl lg:border-l lg:border-border/45 dark:bg-muted/15"
              initial={{ opacity: 0, scale: 1.02 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src="/images/FURS0085.jpeg"
                alt="Производственные мощности предприятия"
                fill
                className="object-cover object-center lg:object-right lg:object-[85%_center]"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
