"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { StatsCounter } from "@/components/stats-counter"
import type { LucideIcon } from "lucide-react"
import { Beaker, Package, Cog, Droplets, FlaskConical, Factory, TrendingUp } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { SectionHeading } from "@/components/section-heading"

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
      <div className="relative w-full max-w-full">
        <div className="flex min-h-[100dvh] w-full flex-col gap-8 bg-background px-3 py-8 sm:px-5 sm:py-10 lg:flex-row lg:items-stretch lg:gap-10 lg:px-8 lg:py-12 xl:px-10">
          {/* Слева: единый блок статистики */}
          <div className="flex min-h-0 flex-1 flex-col justify-center lg:max-w-[min(42rem,44%)]">
            <SectionHeading
              title={t("homePage.stats.title")}
              subtitle={t("homePage.stats.subtitle")}
              centered={false}
              className="mb-5 sm:mb-7"
              titleClassName="text-2xl sm:text-3xl lg:text-4xl"
              subtitleClassName="mt-3 text-sm sm:text-base"
            />
            <div className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-lg dark:bg-card">
              <div className="grid gap-3 p-4 sm:gap-4 sm:p-5">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.35, delay: index * 0.06, ease: "easeOut" }}
                    className="flex min-h-[86px] items-stretch rounded-lg border border-border/70 bg-background"
                  >
                    <div className="flex w-14 shrink-0 items-center justify-center border-r border-primary/20 bg-primary/10 sm:w-16">
                      <stat.icon className="h-7 w-7 text-primary sm:h-8 sm:w-8" strokeWidth={1.7} aria-hidden />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-center px-3 py-2 sm:px-4">
                      <StatsCounter
                        end={stat.value}
                        suffix={t(stat.suffixKey ?? "homePage.stats.suffix")}
                        className="text-xl font-bold leading-tight text-primary tabular-nums sm:text-2xl lg:text-3xl"
                      />
                      <p className="mt-1 text-sm font-medium leading-snug text-muted-foreground sm:text-base">
                        {t(`homePage.stats.${stat.label}`)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Справа: увеличенный единый блок фото */}
          <div className="relative w-full min-w-0 flex-1 self-stretch lg:basis-[56%]">
            <motion.div
              className="relative h-[48vh] min-h-[360px] w-full overflow-hidden rounded-2xl shadow-lg lg:h-full lg:min-h-0"
              initial={{ opacity: 0, scale: 1.02 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <Image
                src="/images/furs0085.jpeg"
                alt="Производственные мощности предприятия"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 56vw"
                priority
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
