"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { CustomOrderForm } from "./custom-order-form"
import { cn } from "@/lib/utils"

const introText =
  "Наша компания изготавливает разнообразные изделия из АБС-пластика. Также мы готовы реализовывать индивидуальные заказы любого объема. Современные производственные мощности предприятия и высококвалифицированный персонал позволяют нам гарантировать высокое качество продукции при оптимальной цене. Также мы организуем отправку приобретенной партии товаров в оптимальные сроки."

const advantages = [
  "Высокие показатели надежности и ударопрочности, стойкости к механическим повреждениям.",
  "Теплостойкость и морозостойкость.",
  "Стойкость к разнообразным негативным факторам – атмосферным, химическим.",
  "Привлекательная стоимость.",
  "Эстетичность. Пластик можно окрашивать практически в любой цвет.",
]

const applicationsList = [
  "корпусы для бытовой техники: холодильников, пылесосов, сушилок и т. д.;",
  "элементы автомобилей: радиаторные решетки, приборные панели, другие части отделки;",
  "бытовые изделия, игрушки и др.",
]

const ioDefault: IntersectionObserverInit = {
  threshold: 0.12,
  rootMargin: "0px 0px -8% 0px",
}

function ScrollReveal({
  children,
  className,
  withScale = false,
  delayMs = 0,
}: {
  children: ReactNode
  className?: string
  /** лёгкое «всплытие» с масштабом (блок формы) */
  withScale?: boolean
  /** задержка после пересечения (для лёгкого каскада) */
  delayMs?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true)
      return
    }

    let timer: ReturnType<typeof setTimeout> | undefined
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          io.unobserve(entry.target)
          if (delayMs > 0) {
            timer = setTimeout(() => setShown(true), delayMs)
          } else {
            setShown(true)
          }
        })
      },
      ioDefault
    )

    io.observe(el)
    return () => {
      io.disconnect()
      if (timer) clearTimeout(timer)
    }
  }, [delayMs])

  return (
    <div
      ref={ref}
      className={cn(
        "transition-[opacity,transform] duration-[850ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform",
        shown
          ? "opacity-100 translate-y-0"
          : cn(
              "opacity-0 translate-y-10",
              withScale && "scale-[0.97]"
            ),
        shown && withScale && "scale-100",
        className
      )}
    >
      {children}
    </div>
  )
}

export function AbsCustomInfo() {
  return (
    <div className="font-zerno w-full max-w-none space-y-14 lg:space-y-16">
      <ScrollReveal className="py-6 lg:py-10">
        <p className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl text-foreground leading-[1.35] font-normal tracking-tight">
          {introText}
        </p>
      </ScrollReveal>

      <div className="space-y-8 lg:space-y-10">
        <ScrollReveal>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Преимущества АБС-пластика
          </h3>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-5 lg:gap-6">
          {advantages.map((advantage, index) => (
            <ScrollReveal key={advantage} delayMs={index * 70}>
              <div className="bg-background rounded-2xl p-6 lg:p-7 border border-border transition-all duration-500 h-full">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-bold text-sm">✓</span>
                  </div>
                  <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed">{advantage}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <div className="space-y-8 lg:space-y-10">
        <ScrollReveal>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Что изготавливают из АБС-пластика
          </h3>
        </ScrollReveal>

        <ScrollReveal delayMs={40}>
          <p className="text-2xl sm:text-3xl md:text-4xl text-foreground leading-[1.35] font-normal">
            Мы осуществляем экструзию или литье АБС-пластика в готовые изделия. Также имеется оборудование для
            изготовления компаундов. Именно поэтому предлагается широкий спектр продукции с нужными характеристиками для
            медицинской, радиотехнической, приборостроительной и других отраслей промышленности. Производственные
            мощности позволяют изготавливать из АБС-пластика на заказ:
          </p>
        </ScrollReveal>

        <ul className="space-y-5 lg:space-y-6">
          {applicationsList.map((item, index) => (
            <li key={item} className="list-none">
              <ScrollReveal delayMs={index * 90}>
                <div className="flex items-start gap-3">
                  <span className="text-primary font-semibold mt-1.5 text-2xl md:text-3xl">
                    •
                  </span>
                  <span className="text-2xl sm:text-3xl md:text-4xl text-foreground leading-[1.35] font-normal">
                    {item}
                  </span>
                </div>
              </ScrollReveal>
            </li>
          ))}
        </ul>

        <ScrollReveal delayMs={120}>
          <p className="text-2xl sm:text-3xl md:text-4xl text-foreground leading-[1.35] font-normal">
            Чтобы приобрести имеющиеся товары или заказать изготовление изделий из АБС-пластика под индивидуальные
            требования, оставьте запрос на сайте либо свяжитесь с нашими специалистами по контактному номеру телефона.
            Также можно написать письмо на электронную почту info@td-plastic.ru.
          </p>
        </ScrollReveal>
      </div>

      <ScrollReveal withScale className="relative">
        <div className="bg-card rounded-3xl p-8 lg:p-12 border border-border shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
            <div
              className="absolute inset-0 animate-shimmer"
              style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.15) 50%, transparent 100%)",
                width: "200%",
              }}
            />
          </div>

          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 relative z-10 tracking-tight">
            Оставить заявку на изготовление
          </h3>
          <div className="relative z-10">
            <CustomOrderForm />
          </div>
        </div>
      </ScrollReveal>
    </div>
  )
}
