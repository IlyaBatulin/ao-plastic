"use client"

import { useState } from "react"
import { Syringe, Zap, Shield, Package } from "lucide-react"

const advantageIcons = [Syringe, Zap, Shield] as const

const introShort =
  "Широкий выбор марок литьевого АБС-пластика. Основной метод переработки — литьё под давлением на термопластавтоматах."

const advantages = [
  { title: "Высокий ПТР", desc: "Отдельные марки — стойкость к горению, антистатика" },
  { title: "Термостойкость", desc: "Детали автопрома, компаундирование с поликарбонатом" },
  { title: "Жёсткость и текучесть", desc: "Мелкие детали приборостроения и техники" },
]

const applications = [
  "Решётки радиатора",
  "Колпаки колёс",
  "Корпуса бытовой и оргтехники",
  "Металлизированные детали",
  "Выключатели, переключатели",
  "Корпуса электроинструмента",
  "Канцелярия и настольные принадлежности",
  "Игрушки и конструкторы",
  "Дверные ручки",
  "Сантехника",
  "Фитинги",
  "Медицинские изделия",
]

export function AbsInjectionInfo() {
  const [hoveredApp, setHoveredApp] = useState<string | null>(null)

  return (
    <div className="max-w-4xl mx-auto py-8 lg:py-10">
      {/* Краткое описание */}
      <div className="rounded-2xl border border-border/60 bg-muted/30 px-5 py-4 mb-8">
        <p className="text-base lg:text-lg text-foreground/90 leading-snug">
          {introShort}
        </p>
      </div>

      {/* Достоинства — карточки */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {advantages.map((item, i) => {
          const Icon = advantageIcons[i]
          return (
            <div
              key={item.title}
              className="rounded-xl border border-border/50 bg-card p-4 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-2">
                {Icon && <Icon className="w-5 h-5 text-primary shrink-0" />}
                <h3 className="font-semibold text-foreground text-sm lg:text-base">{item.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-snug">{item.desc}</p>
            </div>
          )
        })}
      </div>

      {/* Применение — интерактивная сетка */}
      <div className="mb-8">
        <h3 className="flex items-center gap-2 font-semibold text-foreground mb-4 text-sm lg:text-base">
          <Package className="w-4 h-4 text-primary" />
          Применение
        </h3>
        <div className="flex flex-wrap gap-2">
          {applications.map((app) => (
            <span
              key={app}
              onMouseEnter={() => setHoveredApp(app)}
              onMouseLeave={() => setHoveredApp(null)}
              className={`
                inline-flex px-3 py-1.5 rounded-full text-sm border transition-all duration-200 cursor-default
                ${hoveredApp === app
                  ? "bg-primary/15 border-primary/50 text-foreground scale-105"
                  : "bg-muted/50 border-border/50 text-muted-foreground hover:bg-muted hover:border-border"
                }
              `}
            >
              {app}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-center">
        <p className="text-sm text-foreground/90">
          Чтобы купить АБС-пластик в гранулах по выгодной стоимости, обращайтесь в нашу компанию — гранулированный пластик с соответствием всем стандартам качества.
        </p>
      </div>
    </div>
  )
}
