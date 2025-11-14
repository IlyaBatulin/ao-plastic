"use client"

import { useEffect, useState } from "react"

const introText =
  "В линейке выпускаемой продукции завода АО «Пластик» широкий выбор марок литьевого АБС-пластика. Основной метод переработки литьевого АБС пластика – литье под давлением на термопластавтоматах. Данный метод предполагает нагревание литьевого АБС пластика до пластичного состояния, затем материал впрыскивается пресс-форму и охлаждается."

const advantagesText =
  "Марки литьевого АБС пластика отличаются высоким ПТР, отдельные марки - стойкостью к горению, антистатическими свойствами. Устойчивость к высоким температурам дает возможность использовать литьевой АБС пластик в производстве деталей автопрома. Отдельные марки обладают характеристиками повышенной жесткости и текучести, что позволяет производить из них мелкие детали приборостроения и автомобилестроения, разнообразные технические детали. Термостойкий литьевой АБС подходит для компаундирования с поликарбонатом."

const usageText =
  "Трудногорючие марки АБС применяются для литья корпусов агрегатов, приборов, деталей технических изделий и бытовых товаров. В ряде марок есть разрешение на food contact."

const conclusionText =
  "Чтобы купить ABS пластик в гранулах по выгодной стоимости, обращайтесь в нашу компанию. Мы продаем гранулированный пластик, соответствующий всем стандартам качества."

const applications = [
  "решетки радиатора в авто",
  "колпаки автомобильных колес",
  "корпуса бытовой и оргтехники",
  "металлизированные фрагменты бытовой техники и оргтехники",
  "выключатели, переключатели",
  "корпуса электроинструмента",
  "канцелярские изделия",
  "настольные принадлежности",
  "игрушки",
  "детские конструкторы",
  "дверные ручки",
  "металлизированные изделия для сантехники",
  "фитинги",
  "изделия медицинского назначения",
]

export function AbsInjectionInfo() {
  const [visibleStep, setVisibleStep] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setVisibleStep(1), 100),
      setTimeout(() => setVisibleStep(2), 400),
      setTimeout(() => setVisibleStep(3), 750),
      setTimeout(() => setVisibleStep(4), 1100),
      setTimeout(() => setVisibleStep(5), 1450),
    ]

    return () => {
      timers.forEach((timer) => clearTimeout(timer))
    }
  }, [])

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-12">
      <section
        className={`transition-all duration-700 ease-out ${
          visibleStep >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <p className="text-xl lg:text-2xl text-foreground leading-relaxed font-light">{introText}</p>
      </section>

      <section
        className={`transition-all duration-700 ease-out ${
          visibleStep >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <h3 className="text-3xl lg:text-4xl font-bold mb-6">Несколько важных достоинств</h3>
        <p className="text-xl lg:text-2xl text-foreground leading-relaxed font-light">{advantagesText}</p>
      </section>

      <section
        className={`transition-all duration-700 ease-out ${
          visibleStep >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <h3 className="text-3xl lg:text-4xl font-bold mb-6">Для чего используется материал?</h3>
        <p className="text-xl lg:text-2xl text-foreground leading-relaxed font-light">{usageText}</p>
      </section>

      <section
        className={`transition-all duration-700 ease-out ${
          visibleStep >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <h4 className="text-2xl lg:text-3xl font-bold mb-8">Список возможных применений:</h4>
        <ul className="space-y-4">
          {applications.map((app, index) => (
            <li
              key={app}
              className="flex items-start gap-4 group transition-all duration-500"
              style={{
                opacity: visibleStep >= 4 ? 1 : 0,
                transform: visibleStep >= 4 ? "translateY(0)" : "translateY(16px)",
                transitionDelay: visibleStep >= 4 ? `${index * 60}ms` : "0ms",
              }}
            >
              <span className="text-primary font-bold text-xl mt-1 group-hover:scale-125 transition-transform duration-300">
                •
              </span>
              <span className="text-lg lg:text-xl text-foreground leading-relaxed font-light">{app};</span>
            </li>
          ))}
        </ul>
      </section>

      <section
        className={`transition-all duration-700 ease-out ${
          visibleStep >= 5 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <p className="text-xl lg:text-2xl text-foreground leading-relaxed font-light">{conclusionText}</p>
      </section>
    </div>
  )
}

