"use client"

import Image from "next/image"
import { useEffect, useRef, useState, type ReactNode } from "react"
import { CustomOrderForm } from "./custom-order-form"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"

const copy = {
  ru: {
    intro: "Наша компания изготавливает разнообразные изделия из АБС-пластика. Также мы готовы реализовывать индивидуальные заказы любого объема. Современные производственные мощности предприятия и высококвалифицированный персонал позволяют нам гарантировать высокое качество продукции при оптимальной цене. Также мы организуем отправку приобретенной партии товаров в оптимальные сроки.",
    advantagesTitle: "Преимущества АБС-пластика",
    advantages: [
      "Высокие показатели надежности и ударопрочности, стойкости к механическим повреждениям.",
      "Теплостойкость и морозостойкость.",
      "Стойкость к разнообразным негативным факторам – атмосферным, химическим.",
      "Привлекательная стоимость.",
      "Эстетичность. Пластик можно окрашивать практически в любой цвет.",
    ],
    applicationsTitle: "Что изготавливают из АБС-пластика",
    applicationsIntro: "Мы осуществляем экструзию или литье АБС-пластика в готовые изделия. Также имеется оборудование для изготовления компаундов. Именно поэтому предлагается широкий спектр продукции с нужными характеристиками для медицинской, радиотехнической, приборостроительной и других отраслей промышленности. Производственные мощности позволяют изготавливать из АБС-пластика на заказ:",
    applications: [
      "корпусы для бытовой техники: холодильников, пылесосов, сушилок и т. д.;",
      "элементы автомобилей: радиаторные решетки, приборные панели, другие части отделки;",
      "бытовые изделия, игрушки и др.",
    ],
    materialsTitle: "Материалы и примеры применения",
    materialsText: "Визуальный ряд с гранулами, компаундами и готовыми пластиковыми изделиями показывает связь сырья с конечной продукцией и помогает быстрее понять возможности производства.",
    contactText: "Чтобы приобрести имеющиеся товары или заказать изготовление изделий из АБС-пластика под индивидуальные требования, оставьте запрос на сайте либо свяжитесь с нашими специалистами по контактному номеру телефона. Также можно написать письмо на электронную почту info@td-plastic.ru.",
    formTitle: "Оставить заявку на изготовление",
  },
  en: {
    intro: "Our company manufactures a wide range of ABS plastic products and fulfils custom orders of any volume. Modern production facilities and an experienced team enable us to deliver consistently high quality at a competitive price. We also arrange reliable and timely shipment of every order.",
    advantagesTitle: "Advantages of ABS plastic",
    advantages: [
      "High reliability and impact strength, with excellent resistance to mechanical damage.",
      "Resistance to both high and low temperatures.",
      "Resistance to atmospheric exposure and a wide range of chemicals.",
      "Cost-effective material and production.",
      "An attractive finish with the option of colouring the plastic in virtually any shade.",
    ],
    applicationsTitle: "Products made from ABS plastic",
    applicationsIntro: "We use extrusion and injection moulding to manufacture finished ABS plastic products. Our compounding equipment also allows us to produce materials with properties tailored to medical technology, radio electronics, instrumentation and other industries. Our production capabilities include custom manufacturing of:",
    applications: [
      "housings for household appliances, including refrigerators, vacuum cleaners and dryers;",
      "automotive components, including radiator grilles, instrument panels and interior trim parts;",
      "household products, toys and other polymer items.",
    ],
    materialsTitle: "Materials and application examples",
    materialsText: "The images of granules, compounds and finished plastic products illustrate the complete path from raw material to the final product and demonstrate the breadth of our manufacturing capabilities.",
    contactText: "To purchase available products or order custom ABS plastic components, submit a request on the website or contact our specialists by phone. You can also email us at info@td-plastic.ru.",
    formTitle: "Request custom manufacturing",
  },
} as const

const galleryImages = [
  {
    src: "/images/abs-custom/abs-production-materials.png",
    alt: "АБС-пластик, гранулы и готовые изделия",
  },
  {
    src: "/images/abs-custom/abs-colored-granules.png",
    alt: "Цветные гранулы АБС-пластика",
  },
  {
    src: "/images/abs-custom/abs-resin-granules.png",
    alt: "Гранулы АБС-смолы",
  },
  {
    src: "/prevyu/produktsiya/polimernye-granuly-lab.png",
    alt: "Полимерные гранулы в лабораторных колбах",
  },
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
  direction = "up",
}: {
  children: ReactNode
  className?: string
  /** лёгкое «всплытие» с масштабом (блок формы) */
  withScale?: boolean
  /** задержка после пересечения (для лёгкого каскада) */
  delayMs?: number
  /** направление плавного появления */
  direction?: "up" | "left" | "right"
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
          ? "opacity-100 translate-x-0 translate-y-0"
          : cn(
              "opacity-0",
              direction === "left" && "-translate-x-10",
              direction === "right" && "translate-x-10",
              direction === "up" && "translate-y-10",
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
  const { lang } = useLanguage()
  const text = copy[lang === "en" ? "en" : "ru"]

  return (
    <div className="w-full max-w-none space-y-12 lg:space-y-14">
      <ScrollReveal direction="left" className="py-2 lg:py-4">
        <div className="w-full rounded-3xl border border-border bg-card/80 p-6 shadow-sm sm:p-8">
          <p className="text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {text.intro}
          </p>
        </div>
      </ScrollReveal>

      <div className="grid gap-8 lg:grid-cols-[28rem_minmax(0,1fr)] lg:items-center">
        <ScrollReveal direction="left">
          <div className="group relative h-72 overflow-hidden rounded-3xl border border-border bg-muted shadow-sm lg:h-[30rem]">
            <Image
              src={galleryImages[0].src}
              alt={galleryImages[0].alt}
              fill
              sizes="(min-width: 1024px) 28rem, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </ScrollReveal>
        <div className="space-y-6 lg:space-y-8">
          <ScrollReveal direction="right">
            <h3 className="text-h3">
              {text.advantagesTitle}
            </h3>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-5 lg:gap-6">
            {text.advantages.map((advantage, index) => (
              <ScrollReveal key={advantage} direction="right" delayMs={index * 70}>
                <div className="bg-background rounded-2xl p-6 lg:p-7 border border-border transition-all duration-500 h-full">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary font-bold text-sm">✓</span>
                    </div>
                    <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">{advantage}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_28rem] lg:items-center">
        <div className="space-y-6 lg:space-y-8">
          <ScrollReveal direction="left">
            <h3 className="text-h3">
              {text.applicationsTitle}
            </h3>
          </ScrollReveal>

          <ScrollReveal direction="left" delayMs={40}>
            <p className="max-w-5xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              {text.applicationsIntro}
            </p>
          </ScrollReveal>

          <ul className="space-y-5 lg:space-y-6">
            {text.applications.map((item, index) => (
              <li key={item} className="list-none">
                <ScrollReveal direction="left" delayMs={index * 90}>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 text-xl font-semibold text-primary">
                      •
                    </span>
                    <span className="text-lg leading-relaxed text-foreground sm:text-xl">
                      {item}
                    </span>
                  </div>
                </ScrollReveal>
              </li>
            ))}
          </ul>
        </div>
        <ScrollReveal direction="right" delayMs={100}>
          <div className="group relative h-72 overflow-hidden rounded-3xl border border-border bg-muted shadow-sm lg:h-[30rem]">
            <Image
              src={galleryImages[1].src}
              alt={galleryImages[1].alt}
              fill
              sizes="(min-width: 1024px) 28rem, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </ScrollReveal>
      </div>

      <div className="grid gap-8 lg:grid-cols-[28rem_minmax(0,1fr)] lg:items-center">
        <ScrollReveal direction="left">
          <div className="group relative h-72 overflow-hidden rounded-3xl border border-border bg-muted shadow-sm lg:h-96">
            <Image
              src={galleryImages[2].src}
              alt={galleryImages[2].alt}
              fill
              sizes="(min-width: 1024px) 28rem, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </ScrollReveal>
        <ScrollReveal direction="right" delayMs={100}>
          <div className="space-y-4">
            <h3 className="text-h3">
              {text.materialsTitle}
            </h3>
            <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              {text.materialsText}
            </p>
            <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              {text.contactText}
            </p>
          </div>
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

          <h3 className="text-h2 mb-8 relative z-10">
            {text.formTitle}
          </h3>
          <div className="relative z-10">
            <CustomOrderForm />
          </div>
        </div>
      </ScrollReveal>
    </div>
  )
}
