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
      color: "from-[#1e3a8a] to-[#1e40af]",
      bgColor: "bg-[#1e3a8a]/5 dark:bg-[#3b82f6]/10",
      borderColor: "border-[#1e3a8a]/20 dark:border-[#3b82f6]/20",
      iconColor: "text-[#1e3a8a] dark:text-[#3b82f6]",
    },
    {
      icon: Package,
      value: 11,
      label: "polystyrene",
      color: "from-[#0f766e] to-[#0d9488]",
      bgColor: "bg-teal-700/5 dark:bg-teal-500/10",
      borderColor: "border-teal-700/20 dark:border-teal-500/20",
      iconColor: "text-teal-700 dark:text-teal-500",
    },
    {
      icon: Factory,
      value: 23,
      label: "abs",
      color: "from-[#1e3a8a] to-[#1e40af]",
      bgColor: "bg-[#1e3a8a]/5 dark:bg-[#3b82f6]/10",
      borderColor: "border-[#1e3a8a]/20 dark:border-[#3b82f6]/20",
      iconColor: "text-[#1e3a8a] dark:text-[#3b82f6]",
    },
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

        {/* Карточки статистики */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`group relative bg-card rounded-lg p-8 border ${stat.borderColor} hover:border-[#1e3a8a]/40 dark:hover:border-[#3b82f6]/40 hover:shadow-xl transition-all duration-300`}
            >
              {/* Декоративная полоска сверху */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} rounded-t-lg`} />
              
              <div className="text-center">
                {/* Иконка */}
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-xl ${stat.bgColor} border ${stat.borderColor} mb-6 transition-transform duration-300 group-hover:scale-105`}>
                  <stat.icon className={`w-10 h-10 ${stat.iconColor}`} />
                </div>
                
                {/* Число */}
                <div className="mb-2">
                  <StatsCounter end={stat.value} suffix={t("homePage.stats.suffix")} />
                </div>
                
                {/* Описание */}
                <p className="text-muted-foreground text-sm sm:text-base leading-snug">
                  {t(`homePage.stats.${stat.label}`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
