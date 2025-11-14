"use client"

import { useEffect, useState } from "react"
import { CustomOrderForm } from "./custom-order-form"

const introText =
  "Наша компания изготавливает разнообразные изделия из АБС-пластика. Также мы готовы реализовывать индивидуальные заказы любого объема. Современные производственные мощности предприятия и высококвалифицированный персонал позволяют нам гарантировать высокое качество продукции при оптимальной цене. Также мы организуем отправку приобретенной партии товаров в оптимальные сроки."

const advantages = [
  "Высокие показатели надежности и ударопрочности, стойкости к механическим повреждениям.",
  "Теплостойкость и морозостойкость.",
  "Стойкость к разнообразным негативным факторам – атмосферным, химическим.",
  "Привлекательная стоимость.",
  "Эстетичность. Пластик можно окрашивать практически в любой цвет.",
]

export function AbsCustomInfo() {
  const [visibleIntro, setVisibleIntro] = useState(false)
  const [visibleAdvantages, setVisibleAdvantages] = useState(false)
  const [visibleApplications, setVisibleApplications] = useState(false)
  const [visibleForm, setVisibleForm] = useState(false)

  useEffect(() => {
    const timers = [
      setTimeout(() => setVisibleIntro(true), 100),
      setTimeout(() => setVisibleAdvantages(true), 400),
      setTimeout(() => setVisibleApplications(true), 800),
      setTimeout(() => setVisibleForm(true), 1200),
    ]

    return () => {
      timers.forEach((timer) => clearTimeout(timer))
    }
  }, [])

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Вводный текст крупным шрифтом */}
      <div
        className={`py-8 transition-all duration-700 ease-out ${
          visibleIntro ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <p className="text-xl lg:text-2xl text-foreground leading-relaxed font-light">{introText}</p>
      </div>

      {/* Преимущества в виде карточек */}
      <div
        className={`transition-all duration-700 ease-out ${
          visibleAdvantages ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <h3 className="text-3xl lg:text-4xl font-bold mb-8">Преимущества АБС-пластика</h3>

        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {advantages.map((advantage, index) => (
            <div
              key={index}
              className="bg-background rounded-2xl p-5 border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-lg hover:shadow-primary/10"
              style={{
                opacity: visibleAdvantages ? 1 : 0,
                transform: visibleAdvantages ? "translateY(0)" : "translateY(20px)",
                transitionDelay: visibleAdvantages ? `${index * 100}ms` : "0ms",
              }}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary font-bold text-sm">✓</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">{advantage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Что изготавливают из ABS-пластика */}
      <div
        className={`transition-all duration-700 ease-out ${
          visibleApplications ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <h3 className="text-3xl lg:text-4xl font-bold mb-6">Что изготавливают из ABS-пластика</h3>

        <p className="text-xl lg:text-2xl text-foreground mb-6 leading-relaxed font-light">
          Мы осуществляем экструзию или литье АБС-пластика в готовые изделия. Также имеется оборудование для изготовления
          компаундов. Именно поэтому предлагается широкий спектр продукции с нужными характеристиками для медицинской,
          радиотехнической, приборостроительной и других отраслей промышленности. Производственные мощности позволяют
          изготавливать из АБС-пластика на заказ:
        </p>

        <ul className="space-y-4 mt-6">
          {[
            "корпусы для бытовой техники: холодильников, пылесосов, сушилок и т. д.;",
            "элементы автомобилей: радиаторные решетки, приборные панели, другие части отделки;",
            "бытовые изделия, игрушки и др.",
          ].map((item, index) => (
            <li key={item} className="flex items-start gap-3 group">
              <span className="text-primary font-semibold mt-1 text-xl group-hover:scale-125 transition-transform duration-300">
                •
              </span>
              <span className="text-xl lg:text-2xl text-foreground leading-relaxed font-light">{item}</span>
            </li>
          ))}
        </ul>

        <p className="text-xl lg:text-2xl text-foreground mt-8 leading-relaxed font-light">
          Чтобы приобрести имеющиеся товары или заказать изготовление изделий из АБС-пластика под индивидуальные
          требования, оставьте запрос на сайте либо свяжитесь с нашими специалистами по контактному номеру телефона.
          Также можно написать письмо на электронную почту info@td-plastic.ru.
        </p>
      </div>

      {/* Форма заказа с анимацией подсветки */}
      <div
        className={`bg-card rounded-3xl p-8 lg:p-12 border border-border shadow-sm relative overflow-hidden transition-all duration-700 ease-out ${
          visibleForm ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
        }`}
      >
        {/* Анимация переливания/подсветки */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
          <div
            className="absolute inset-0 animate-shimmer"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.15) 50%, transparent 100%)",
              width: "200%",
            }}
          />
        </div>

        <h3 className="text-2xl lg:text-3xl font-bold mb-6 relative z-10">Оставить заявку на изготовление</h3>
        <div className="relative z-10">
          <CustomOrderForm />
        </div>
      </div>
    </div>
  )
}

