"use client"

import { useEffect, useState } from "react"

const introText =
  "В каталоге компании АО «Пластик» представлены несколько марок экструзионного АБС-пластика. Процесс экструзии АБС-пластика следующий: материал плавится в экструдере затем «продавливается» через фильеру с последующим охлаждением и калибровкой. Преимущества экструзионного АБС-пластика – высокие ударные характеристики, механическая прочность и жесткость."

const detailsText =
  "Из марок пластика, представленных в этом разделе, чаще всего изготавливается листы с большей или меньшей толщины с глянцевой или матовой поверхностью, в некоторых случаях – с тиснением. Листы впоследствии обрабатываются вакуум- и пневмоформованием в изделия."

const applications = [
  "детали интерьера и экстерьера автомобиля, включая крупногабаритные корпусные детали;",
  "конструкции, используемые в индустрии рекламы;",
  "корпусные элементы некоторых видов бытовой техники;",
  "мебельная кромка АБС;",
  "чемоданы;",
  "ряд других изделий из АБС-пластика экструзионного типа.",
]

export function AbsExtrusionInfo() {
  const [visibleStep, setVisibleStep] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setVisibleStep(1), 100),
      setTimeout(() => setVisibleStep(2), 450),
      setTimeout(() => setVisibleStep(3), 800),
    ]

    return () => {
      timers.forEach((timer) => clearTimeout(timer))
    }
  }, [])

  return (
    <div className="bg-card rounded-3xl p-8 lg:p-12 border border-border shadow-sm space-y-10">
      <div
        className={`transition-all duration-700 ease-out ${
          visibleStep >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">Экструзионный АБС пластик</h2>
        <p className="text-muted-foreground text-lg lg:text-xl leading-relaxed">{introText}</p>
      </div>

      <div
        className={`transition-all duration-700 ease-out ${
          visibleStep >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <h3 className="text-2xl lg:text-3xl font-bold mb-4">Область применения экструзионного АБС-пластика</h3>
        <p className="text-muted-foreground text-lg lg:text-xl leading-relaxed">{detailsText}</p>
      </div>

      <ul className="space-y-3">
        {applications.map((item, index) => (
          <li
            key={item}
            className="flex items-start gap-3 transition-all duration-500"
            style={{
              opacity: visibleStep >= 3 ? 1 : 0,
              transform: visibleStep >= 3 ? "translateY(0)" : "translateY(16px)",
              transitionDelay: visibleStep >= 3 ? `${index * 70}ms` : "0ms",
            }}
          >
            <span className="text-primary font-semibold mt-1">•</span>
            <span className="text-muted-foreground text-lg leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

