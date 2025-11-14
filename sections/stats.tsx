"use client"

import { StatsCounter } from "@/components/stats-counter"
import { Beaker, Package, Factory } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function Stats() {
  const { t } = useLanguage()

  const stats = [
    {
      icon: Beaker,
      value: 60,
      label: "styrene",
    },
    {
      icon: Package,
      value: 11,
      label: "polystyrene",
    },
    {
      icon: Factory,
      value: 23,
      label: "abs",
    },
  ]
  return (
    <section
      id="stats"
      className="py-16 sm:py-24 bg-gradient-to-br from-primary/10 via-background to-primary/5 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            {t("homePage.stats.title")}
          </h2>
          <p className="text-muted-foreground text-lg">{t("homePage.stats.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300 shadow-blue-sm group-hover:shadow-blue-lg">
                <stat.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <StatsCounter end={stat.value} suffix={t("homePage.stats.suffix")} />
              <p className="text-muted-foreground mt-2 group-hover:text-primary transition-colors text-sm sm:text-base">
                {t(`homePage.stats.${stat.label}`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
