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
    // Итог = 60 стирол + 23 АБС + 30 ПСВ + 40 дисперсии + 3 ДМС
    { icon: TrendingUp, value: 156, label: "totalProductVolume", suffixKey: "homePage.stats.suffixPlus" },
    { icon: FlaskConical, value: 40, label: "sadStyreneAcrylicDispersions" },
    { icon: Factory, value: 23, label: "absPlastics" },
    { icon: Package, value: 30, label: "expandablePolystyrene" },
    { icon: Beaker, value: 60, label: "styrene" },
    { icon: Cog, value: 3, label: "machineBuildingPartsDms" },
  ]
  const statGroups = [
    {
      key: "main-production",
      items: stats.slice(0, 4),
      image: "/images/furs0085.jpeg",
      imageAlt: "Производственные мощности предприятия",
      imageSide: "left",
    },
    {
      key: "additional-production",
      items: stats.slice(4),
      image: "/prevyu/fasad/furs0072.jpeg",
      imageAlt: "Фасад производственного корпуса АО Пластик",
      imageSide: "right",
    },
  ]

  return (
    <section id="stats" className="relative overflow-hidden bg-background">
      <div className="container mx-auto max-w-7xl px-3 py-12 sm:px-5 sm:py-14 lg:px-8 lg:py-20">
        <SectionHeading
          title={t("homePage.stats.title")}
          subtitle={t("homePage.stats.subtitle")}
          centered
          className="mb-8 sm:mb-10"
        />

        <div className="space-y-10 lg:space-y-16">
          {statGroups.map((group, groupIndex) => (
            <motion.div
              key={group.key}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: 0.45, delay: groupIndex * 0.08, ease: "easeOut" }}
              className="grid items-stretch gap-7 lg:grid-cols-2 lg:gap-12"
            >
              <motion.div
                className={`relative h-72 w-full overflow-hidden rounded-3xl shadow-xl sm:h-80 lg:h-full lg:min-h-[420px] ${
                  group.imageSide === "right" ? "lg:order-2" : ""
                }`}
                initial={{ opacity: 0, x: group.imageSide === "left" ? -44 : 44 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.65, ease: "easeOut" }}
              >
                <Image
                  src={group.image}
                  alt={group.imageAlt}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority={groupIndex === 0}
                />
              </motion.div>

              <div className="grid content-center gap-4 sm:grid-cols-2 sm:gap-5">
                {group.items.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.35, delay: 0.2 + index * 0.06, ease: "easeOut" }}
                    className="flex min-h-[92px] items-stretch rounded-xl border border-border/70 bg-background shadow-sm"
                  >
                    <div className="flex w-14 shrink-0 items-center justify-center border-r border-primary/20 bg-primary/10 sm:w-16">
                      <stat.icon className="h-7 w-7 text-primary sm:h-8 sm:w-8" strokeWidth={1.7} aria-hidden />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-center px-3 py-3 sm:px-4">
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
