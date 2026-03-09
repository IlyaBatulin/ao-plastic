"use client"

import Image from "next/image"
import { StatsCounter } from "@/components/stats-counter"
import { Beaker, Package, Factory } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function Stats() {
  const { t } = useLanguage()

  const statStyle = {
    color: "from-[#1e3a8a] to-[#1e40af]",
    bgColor: "bg-[#1e3a8a]/5 dark:bg-[#3b82f6]/10",
    borderColor: "border-[#1e3a8a]/20 dark:border-[#3b82f6]/20",
    iconColor: "text-[#1e3a8a] dark:text-[#3b82f6]",
  }
  const stats = [
    { icon: Beaker, value: 60, label: "styrene", ...statStyle },
    { icon: Package, value: 11, label: "polystyrene", ...statStyle },
    { icon: Factory, value: 23, label: "abs", ...statStyle },
  ]
  return (
    <section
      id="stats"
      className="py-20 sm:py-28 bg-background relative overflow-hidden"
    >
      {/* Декоративные элементы фона */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#1e3a8a]/5 dark:bg-[#3b82f6]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-50" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#1e3a8a]/5 dark:bg-[#3b82f6]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 opacity-50" />
      
      {/* Сетка для делового стиля */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(30,58,138,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(30,58,138,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Заголовок */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-[#1e3a8a] dark:text-[#60a5fa]">
            {t("homePage.stats.title")}
          </h2>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto">
            {t("homePage.stats.subtitle")}
          </p>
          <div className="mt-6 h-0.5 w-24 mx-auto bg-[#1e3a8a] dark:bg-[#3b82f6]" />
        </div>

        {/* Фото производства + карточки статистики */}
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14 max-w-6xl mx-auto">
          <div className="w-full lg:w-[42%] flex-shrink-0 order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5 dark:ring-white/10 aspect-[4/3] max-h-[320px] lg:max-h-none">
              <Image
                src="/images/FURS0085.jpeg"
                alt="Производственные мощности предприятия"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 42vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
          <div className="w-full lg:flex-1 order-1 lg:order-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`group relative bg-card rounded-lg p-8 border ${stat.borderColor} hover:border-[#1e3a8a]/40 dark:hover:border-[#3b82f6]/40 hover:shadow-xl transition-all duration-300`}
                >
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} rounded-t-lg`} />
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${stat.bgColor} border ${stat.borderColor} mb-4 transition-transform duration-300 group-hover:scale-105`}>
                      <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                    </div>
                    <div className="mb-2">
                      <StatsCounter end={stat.value} suffix={t("homePage.stats.suffix")} />
                    </div>
                    <p className="text-muted-foreground text-sm sm:text-base leading-snug">
                      {t(`homePage.stats.${stat.label}`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
