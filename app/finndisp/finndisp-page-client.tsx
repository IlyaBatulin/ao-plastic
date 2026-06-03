"use client"

import Link from "next/link"
import {
  Building2,
  CheckCircle,
  ExternalLink,
  FlaskConical,
  Leaf,
  Mail,
  MapPin,
  Phone,
  Shield,
} from "lucide-react"
import { motion } from "framer-motion"
import { Footer } from "@/components/footer"
import { BackgroundPaths } from "@/components/ui/background-paths"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { FinndispHistoryTimeline } from "./finndisp-history-timeline"
import { FinndispSegmentsShowcase } from "./finndisp-segments-showcase"

const FINNDISP_SITE = "https://www.finndisp.ru/"
const FINNDISP_BLUE = "#0046A0"
const finndispButtonClass =
  "border-[#0046A0] bg-[#0046A0] text-white hover:bg-[#003580] hover:text-white shadow-sm"

const content = {
  ru: {
    heroBadge: "Компания группы АО «Пластик»",
    heroTitle: "Финндисп",
    heroSubtitle: "Производитель акриловых дисперсий",
    heroText:
      "Завод стирол-акриловых дисперсий в г. Раменское — современное предприятие, организованное по международным стандартам безопасности с использованием ведущих мировых химических технологий.",
    siteButton: "Сайт Финндисп",
    logoAlt: "Логотип Финндисп",
    contactButton: "Связаться с нами",
    groupBadge: "Структура группы",
    groupTitle: "В январе 2024 года «Финндисп» вошёл в состав АО «Пластик»",
    groupParagraphs: [
      "В январе 2024 года «Финндисп» приобретён российскими инвесторами и вошёл в структуру российской химической компании АО «Пластик» (Узловая).",
      "Предприятие работает в Раменском с 2008 года. Производственные мощности позволяют выпускать до 20 тысяч тонн полимерных дисперсий для лакокрасочной промышленности.",
      "Безопасность, качество, экологичность и автоматизация — основные принципы работы компании «Финндисп».",
    ],
    capabilitiesBadge: "Производство и компетенции",
    capabilitiesTitle: "Мощности и R&D-центр",
    capabilities: [
      {
        title: "До 20 тыс. тонн в год",
        description:
          "Производственные мощности позволяют выпускать до 20 тысяч тонн полимерных дисперсий для лакокрасочной промышленности.",
      },
      {
        title: "R&D-центр",
        description:
          "Три лаборатории: ОТК, лаборатория синтеза дисперсий и аппликационная лаборатория.",
      },
      {
        title: "Сырьевая база",
        description:
          "Стирол собственного производства и сырьевые компоненты проверенных поставщиков.",
      },
      {
        title: "Развитие мощностей",
        description:
          "В планах — увеличение производственных мощностей на 60 тыс. тонн продукции в год на площадке АО «Пластик» в г. Узловая.",
      },
    ],
    segmentsBadge: "Ассортимент",
    segmentsTitle: "Сегменты дисперсий",
    segments: [
      {
        title: "ЛКМ и строительные материалы",
        description:
          "Дисперсии для водно-дисперсионных красок для внутренних и наружных работ, лаков, грунтовок и шпатлёвок.",
        image: "/images/finndisp/segment-paints.png",
        imageAlt: "Банки с краской — применение дисперсий в ЛКМ",
      },
      {
        title: "Нетканые материалы",
        description: "Дисперсии, используемые в синтетических волокнах, геосетках, стеклохолсте.",
        image: "/images/finndisp/segment-nonwovens.png",
        imageAlt: "Нетканый материал — применение дисперсий",
      },
      {
        title: "Адгезивы",
        description:
          "Полимерные дисперсии для промышленного применения в качестве компонента клеящего состава.",
        image: "/images/finndisp/segment-adhesives.png",
        imageAlt: "Клеящие ленты — применение дисперсий в адгезивах",
      },
    ],
    historyBadge: "История",
    historyTitle: "Ключевые этапы",
    history: [
      { year: "2003", text: "Образование предприятия «Финндисп»." },
      {
        year: "2004",
        text: "Компания становится торговым подразделением OY Forcit AB — финского производителя эмульсий для лакокрасочных покрытий.",
      },
      { year: "2007", text: "Получено разрешение на строительство завода в г. Раменское." },
      {
        year: "2008",
        text: "Завод построен, в июне состоялся запуск производственных мощностей. «Финндисп» становится частью Rohm&Haas (США).",
      },
      { year: "2009", text: "«Финндисп» входит в структуру компании Dow (США)." },
      { year: "2012", text: "Предприятие полностью адаптировано под стандарты Dow." },
      {
        year: "2024",
        text: "В январе «Финндисп» приобретён российскими инвесторами и вошёл в структуру АО «Пластик» (Узловая).",
      },
    ],
    contactsBadge: "Контакты",
    contactsTitle: "Офис и производственная площадка",
    salesOffice: "Офис продаж",
    plant: "Завод",
  },
  en: {
    heroBadge: "AO Plastik Group Company",
    heroTitle: "Finndisp",
    heroSubtitle: "Manufacturer of acrylic dispersions",
    heroText:
      "A styrene-acrylic dispersion plant in Ramenskoye — a modern facility built to international safety standards using leading global chemical technologies.",
    siteButton: "Finndisp website",
    logoAlt: "Finndisp logo",
    contactButton: "Contact us",
    groupBadge: "Group structure",
    groupTitle: "In January 2024, Finndisp joined AO Plastik",
    groupParagraphs: [
      "In January 2024, Finndisp was acquired by Russian investors and became part of AO Plastik (Uzlоvaya), a Russian chemical company.",
      "The plant has operated in Ramenskoye since 2008. Production capacity is up to 20,000 tonnes of polymer dispersions per year for the paint and coatings industry.",
      "Safety, quality, environmental responsibility, and automation are the core principles of Finndisp.",
    ],
    capabilitiesBadge: "Production & expertise",
    capabilitiesTitle: "Capacity and R&D center",
    capabilities: [
      {
        title: "Up to 20,000 t/year",
        description:
          "Production capacity of up to 20,000 tonnes of polymer dispersions for the paint and coatings industry.",
      },
      {
        title: "R&D center",
        description: "Three laboratories: QC, dispersion synthesis, and application laboratory.",
      },
      {
        title: "Raw material base",
        description: "In-house styrene production and raw materials from verified suppliers.",
      },
      {
        title: "Capacity expansion",
        description:
          "Plans include increasing capacity by 60,000 tonnes per year at the AO Plastik site in Uzlоvaya.",
      },
    ],
    segmentsBadge: "Product range",
    segmentsTitle: "Dispersion segments",
    segments: [
      {
        title: "Paints & building materials",
        description:
          "Dispersions for interior and exterior water-based paints, lacquers, primers, and putties.",
        image: "/images/finndisp/segment-paints.png",
        imageAlt: "Paint cans — dispersions for paints and coatings",
      },
      {
        title: "Nonwovens",
        description: "Dispersions used in synthetic fibers, geogrids, and fiberglass mat.",
        image: "/images/finndisp/segment-nonwovens.png",
        imageAlt: "Nonwoven mesh — dispersion applications",
      },
      {
        title: "Adhesives",
        description: "Polymer dispersions for industrial use as a component of adhesive formulations.",
        image: "/images/finndisp/segment-adhesives.png",
        imageAlt: "Adhesive tape rolls — dispersion applications",
      },
    ],
    historyBadge: "History",
    historyTitle: "Key milestones",
    history: [
      { year: "2003", text: "Finndisp company established." },
      {
        year: "2004",
        text: "Finndisp becomes the trading division of OY Forcit AB, a Finnish manufacturer of emulsions for paint and coatings.",
      },
      { year: "2007", text: "Permit obtained to build the plant in Ramenskoye." },
      {
        year: "2008",
        text: "The plant was completed and production launched in June. Finndisp became part of Rohm&Haas (USA).",
      },
      { year: "2009", text: "Finndisp joined Dow (USA)." },
      { year: "2012", text: "The plant was fully adapted to Dow standards." },
      {
        year: "2024",
        text: "In January, Finndisp was acquired by Russian investors and joined AO Plastik (Uzlоvaya).",
      },
    ],
    contactsBadge: "Contacts",
    contactsTitle: "Sales office and production site",
    salesOffice: "Sales office",
    plant: "Plant",
  },
} as const

const contacts = {
  salesPhone: "+7 (495) 201-07-77",
  salesPhoneHref: "tel:+74952010777",
  salesExt: "107",
  salesAddress: "115035, Москва, 3-й Кадашевский пер., д. 7–9, стр. 1, офис 2",
  plantPhone: "+7 (4964) 67-99-00",
  plantPhoneHref: "tel:+74964679900",
  plantAddress: "140108, Московская обл., г. Раменское, ул. Михалевича, д. 69А",
  email: "dispersion@finndisp.ru",
}

export function FinndispPageClient() {
  const { lang } = useLanguage()
  const page = content[lang === "en" ? "en" : "ru"]

  return (
    <>
      <BackgroundPaths />
      <div className="min-h-screen bg-transparent">
        <section className="relative overflow-hidden pt-32 pb-16">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0046A0]/8 via-transparent to-transparent" />

          <div className="container relative z-10 mx-auto px-4 lg:px-8">
            <div className="mx-auto mb-12 max-w-4xl text-center">
              <span
                className="mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-1 text-sm font-semibold"
                style={{ borderColor: `${FINNDISP_BLUE}66`, backgroundColor: `${FINNDISP_BLUE}14`, color: FINNDISP_BLUE }}
              >
                <Building2 className="h-4 w-4" />
                {page.heroBadge}
              </span>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: `${FINNDISP_BLUE}CC` }}>
                {page.heroSubtitle}
              </p>
              <h1
                className="mb-6 text-4xl font-bold leading-tight break-words animate-in fade-in slide-in-from-bottom-4 duration-700 sm:text-5xl md:text-7xl"
                style={{ color: FINNDISP_BLUE }}
              >
                {page.heroTitle}
              </h1>
              <p className="text-xl leading-relaxed text-foreground/70 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200 md:text-2xl">
                {page.heroText}
              </p>
              <div className="mx-auto mt-6 h-0.5 w-24 animate-in fade-in duration-700 delay-300" style={{ backgroundColor: FINNDISP_BLUE }} />
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button asChild size="lg" className={finndispButtonClass}>
                  <a href={FINNDISP_SITE} target="_blank" rel="noopener noreferrer">
                    {page.siteButton}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contacts">{page.contactButton}</Link>
                </Button>
              </div>
            </div>

            <motion.div
              className="mx-auto max-w-4xl overflow-hidden rounded-2xl shadow-lg"
              initial={{ opacity: 0, y: 56, scale: 0.94 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
            >
              <img
                src="/images/finndisp/logo-banner.png"
                alt={page.logoAlt}
                className="h-auto w-full object-contain"
                loading="eager"
                fetchPriority="high"
              />
            </motion.div>
          </div>
        </section>

      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
            <div>
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
                <Shield className="h-4 w-4" />
                {page.groupBadge}
              </span>
              <h2 className="text-3xl font-bold text-balance text-foreground md:text-4xl">{page.groupTitle}</h2>
            </div>
            <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
              {page.groupParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
              <FlaskConical className="h-4 w-4" />
              {page.capabilitiesBadge}
            </span>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">{page.capabilitiesTitle}</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {page.capabilities.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-foreground">{item.title}</h3>
                <p className="leading-relaxed text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
                <Leaf className="h-4 w-4" />
                {page.historyBadge}
              </span>
              <h2 className="text-3xl font-bold text-foreground md:text-4xl">{page.historyTitle}</h2>
            </div>
            <FinndispHistoryTimeline items={page.history} />
          </div>
        </div>
      </section>

      <FinndispSegmentsShowcase
        badge={page.segmentsBadge}
        title={page.segmentsTitle}
        segments={page.segments}
      />

      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
              <MapPin className="h-4 w-4" />
              {page.contactsBadge}
            </span>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">{page.contactsTitle}</h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-foreground">{page.salesOffice}</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <a href={contacts.salesPhoneHref} className="hover:text-primary transition-colors">
                    {contacts.salesPhone}
                    {lang === "ru" ? `, доб. ${contacts.salesExt}` : `, ext. ${contacts.salesExt}`}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{contacts.salesAddress}</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-foreground">{page.plant}</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <a href={contacts.plantPhoneHref} className="hover:text-primary transition-colors">
                    {contacts.plantPhone}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{contacts.plantAddress}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <a href={`mailto:${contacts.email}`} className="hover:text-primary transition-colors">
                    {contacts.email}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Button asChild size="lg" className={finndispButtonClass}>
              <a href={FINNDISP_SITE} target="_blank" rel="noopener noreferrer">
                {page.siteButton}
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      </div>
    </>
  )
}
