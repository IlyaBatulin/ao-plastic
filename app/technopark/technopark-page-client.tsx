"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import {
  ArrowRight,
  Factory,
  FlaskConical,
  Train,
  Warehouse,
  Users,
  Zap,
  Droplets,
  Flame,
  Wind,
  ShieldCheck,
  GraduationCap,
} from "lucide-react"

const IMG = "/images/technopark"

/** Действующие резиденты — данные из сводной таблицы индустриального парка. */
const RESIDENTS = [
  {
    key: "adventum",
    logo: `${IMG}/logo-adventum.png`,
    name: "ООО «Адвентум Технолоджис»",
    nameEn: "Adventum Technologies LLC",
    product: "Синтетические ткани и материалы, огнетермостойкие арамидные ткани по технологии Froban®",
    productEn: "Synthetic fabrics and materials, fire-resistant aramid fabrics using Froban® technology",
    capacity: "2,5 млн погонных метров в год",
    capacityEn: "2.5M linear meters per year",
    since: "2017",
  },
  {
    key: "palma",
    logo: `${IMG}/logo-palma.png`,
    name: "ООО «ПАЛМА»",
    nameEn: "PALMA LLC",
    product: "Средства индивидуальной защиты (перчатки)",
    productEn: "Personal protective equipment (gloves)",
    capacity: "2 млн пар в год",
    capacityEn: "2M pairs per year",
    since: "2021",
  },
  {
    key: "gea",
    logo: `${IMG}/logo-gea.png`,
    name: "ООО «Геа Фарм Технолоджис Рус»",
    nameEn: "GEA Farm Technologies Rus LLC",
    product: "Гигиенические средства для молочного животноводства",
    productEn: "Hygiene products for dairy farming",
    capacity: "10 тыс. тонн в год",
    capacityEn: "10,000 tonnes per year",
    since: "2021",
  },
  {
    key: "smola",
    logo: `${IMG}/logo-smola.png`,
    name: "ООО «Смола-Узловая»",
    nameEn: "Smola-Uzlovaya LLC",
    product: "Синтетические смолы в первичных формах",
    productEn: "Synthetic resins in primary forms",
    capacity: "40 тыс. тонн в год",
    capacityEn: "40,000 tonnes per year",
  },
  {
    key: "fabreex",
    logo: `${IMG}/logo-fabreex.png`,
    name: "ООО «ПК Фабрикс»",
    nameEn: "PK Fabrix LLC",
    product: "Синтетическое и натуральное трикотажное полотно",
    productEn: "Synthetic and natural knitted fabric",
    capacity: "1,5 тыс. тонн в год",
    capacityEn: "1,500 tonnes per year",
    since: "2020",
  },
  {
    key: "polimerdor",
    logo: `${IMG}/logo-polimerdor.png`,
    name: "ООО «Полимердор»",
    nameEn: "Polimerdor LLC",
    product: "Нетканое полотно из полипропилена",
    productEn: "Polypropylene non-woven fabric",
    capacity: "7 тыс. тонн в год",
    capacityEn: "7,000 tonnes per year",
  },
  {
    key: "alkar",
    logo: `${IMG}/logo-alkar.png`,
    name: "ФНМ Алькар",
    nameEn: "FNM Alkar",
    product: "Геосинтетические материалы, нетканое полотно из вторичного ПЭТФ",
    productEn: "Geosynthetic materials, non-woven fabric from recycled PET",
    capacity: "1,8 тыс. тонн в год",
    capacityEn: "1,800 tonnes per year",
  },
  {
    key: "chisto",
    logo: `${IMG}/logo-chisto.png`,
    name: "ООО «Стандарт чистоты»",
    nameEn: "Standart Chistoty LLC",
    product: "Бытовые моющие средства",
    productEn: "Household cleaning products",
    capacity: "2,4 тыс. тонн в год",
    capacityEn: "2,400 tonnes per year",
  },
  {
    key: "radius",
    logo: null,
    name: "ООО «РАДИУС-ПРО»",
    nameEn: "RADIUS-PRO LLC",
    product: "Огнестойкое турбинное масло на основе триксиленилфосфатов",
    productEn: "Fire-resistant turbine oil based on trixylenyl phosphates",
    capacity: "1,2 тыс. тонн в год",
    capacityEn: "1,200 tonnes per year",
  },
]

const GALLERY = [
  { src: `${IMG}/fabreex-line.jpg`, caption: "Производство трикотажного полотна — ПК Фабрикс", captionEn: "Knitted fabric production — PK Fabrix" },
  { src: `${IMG}/ansell-gloves.jpg`, caption: "Линия выпуска защитных перчаток", captionEn: "Protective gloves production line" },
  { src: `${IMG}/enhim-plant.jpg`, caption: "Производственная площадка резидента", captionEn: "Resident production site" },
  { src: `${IMG}/gea-plant.jpg`, caption: "Производство гигиенических средств — Геа Фарм", captionEn: "Hygiene products manufacturing — GEA Farm" },
  { src: `${IMG}/fabreex-facade.jpg`, caption: "Производственный корпус Fabreex", captionEn: "Fabreex production building" },
  { src: `${IMG}/enhim-facade.jpg`, caption: "Новый корпус на территории парка", captionEn: "New building within the park" },
  { src: `${IMG}/adventum-opening.jpg`, caption: "Церемония открытия производства — Адвентум Технолоджис, 2017", captionEn: "Production opening ceremony — Adventum Technologies, 2017" },
  { src: `${IMG}/palma-building.jpg`, caption: "Корпус компании ПАЛМА", captionEn: "PALMA company building" },
  { src: `${IMG}/adventum-line.jpg`, caption: "Линия по выпуску синтетических тканей — Адвентум Технолоджис", captionEn: "Synthetic fabric production line — Adventum Technologies" },
  { src: `${IMG}/ansell-work.jpg`, caption: "Выпуск средств индивидуальной защиты", captionEn: "Personal protective equipment production" },
]

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5, ease: "easeOut" as const },
}

export function TechnoparkPageClient() {
  const { lang } = useLanguage()
  const en = lang === "en"

  const keyStats = [
    { value: ">104", unit: en ? "ha" : "га", label: en ? "of territory" : "территория парка" },
    { value: ">100 000", unit: "м²", label: en ? "of buildings" : "комплекс зданий" },
    { value: "10", unit: "", label: en ? "active residents" : "действующих резидентов" },
    { value: "645", unit: "", label: en ? "jobs created" : "рабочих мест создано" },
  ]

  const infrastructure = [
    { icon: Flame, text: en ? "Steam boiler stations" : "Паровые котельные" },
    { icon: Droplets, text: en ? "Water treatment station — 400 m³/h" : "Станция фильтрации и очистки воды — 400 м³/час" },
    { icon: Zap, text: en ? "Power lines 2×15 MW" : "Линии электропередачи 2×15 МВт" },
    { icon: Wind, text: en ? "Compressor stations 108 and 210 m³/min" : "Компрессорные станции 108 и 210 м³/мин" },
    { icon: Train, text: en ? "Own railway station Uzlovaya-2" : "Собственная ж/д станция «Узловая-2»" },
    { icon: ShieldCheck, text: en ? "Own fire and gas rescue service" : "Собственная пожарная часть и газоспасательный отряд" },
  ]

  const parkFeatures = [
    { icon: Warehouse, title: en ? "Customs warehouse" : "Таможенный склад", text: en ? "4,000 m² open-type customs warehouse" : "4 000 м² — таможенный склад открытого типа" },
    { icon: Train, title: en ? "Railway infrastructure" : "Ж/д инфраструктура", text: en ? "Own railway tracks and station" : "Собственные железнодорожные пути и станция" },
    { icon: FlaskConical, title: en ? "Scientific base" : "Научно-техническая база", text: en ? "Own laboratories and testing facilities" : "Собственные лаборатории и испытательная база" },
    { icon: Factory, title: en ? "Production sites" : "Производственные площади", text: en ? "Ready sites with utilities for residents" : "Готовые площадки с коммуникациями для резидентов" },
  ]

  return (
    <main className="min-h-screen w-full max-w-full overflow-x-clip">
      {/* Hero */}
      <section className="relative flex min-h-[70svh] items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={`${IMG}/hero-render.jpg`}
            alt={en ? "Plastic Industrial Park" : "Индустриальный парк «Пластик»"}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
        </div>
        <div className="container relative z-10 mx-auto px-4 py-24 lg:px-8">
          <p className="text-caption mb-4 text-white/80">
            {en ? "Uzlovaya, Tula Region" : "г. Узловая, Тульская область"}
          </p>
          <h1 className="text-h1 max-w-3xl text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            {en ? "Plastic Industrial Park" : "Индустриальный парк «Пластик»"}
          </h1>
          <p className="text-body-lead mt-5 max-w-2xl text-white/90">
            {en
              ? "A ready-made industrial site with full engineering infrastructure on the grounds of one of Russia's largest chemical plants."
              : "Готовая промышленная площадка с полной инженерной инфраструктурой на территории одного из крупнейших химических предприятий России."}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" variant="brand" asChild className="px-8">
              <Link href="/contacts">
                {en ? "Become a resident" : "Стать резидентом"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Key stats strip */}
      <section className="border-b border-border/60 bg-secondary/60">
        <div className="container mx-auto grid grid-cols-2 gap-6 px-4 py-10 sm:py-12 lg:grid-cols-4 lg:px-8">
          {keyStats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl">
                {s.value}
                {s.unit && <span className="ml-1 text-xl font-semibold sm:text-2xl">{s.unit}</span>}
              </div>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Park features */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div {...fadeUp} className="mb-10 max-w-3xl lg:mb-14">
            <h2 className="text-h2 text-primary">{en ? "Park infrastructure" : "Возможности парка"}</h2>
            <p className="text-body mt-4 text-muted-foreground">
              {en
                ? "Everything needed to launch production quickly: sites, utilities, logistics and services on one territory."
                : "Всё для быстрого запуска производства: площадки, коммуникации, логистика и сервисы на одной территории."}
            </p>
          </motion.div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {parkFeatures.map((f, i) => (
              <motion.div
                key={f.title}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.06 }}
                className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm"
              >
                <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 text-primary">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="text-h4 mb-1.5 font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Engineering infrastructure with photos */}
      <section className="bg-secondary/50 py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <motion.div {...fadeUp}>
              <h2 className="text-h2 text-primary">
                {en ? "Modern engineering infrastructure" : "Современная инженерная инфраструктура"}
              </h2>
              <ul className="mt-8 space-y-4">
                {infrastructure.map((item) => (
                  <li key={item.text} className="flex items-start gap-4">
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <item.icon className="h-5 w-5" />
                    </span>
                    <span className="text-base leading-relaxed text-foreground sm:text-lg">{item.text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div {...fadeUp} className="grid gap-4">
              <div className="relative h-64 overflow-hidden rounded-2xl shadow-lg sm:h-80">
                <Image src={`${IMG}/boiler-station.jpg`} alt={en ? "Boiler station" : "Паровая котельная парка"} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative h-40 overflow-hidden rounded-2xl shadow-lg sm:h-52">
                  <Image src={`${IMG}/water-station.jpg`} alt={en ? "Water treatment" : "Станция фильтрации и очистки воды"} fill className="object-cover" sizes="(max-width: 1024px) 50vw, 25vw" />
                </div>
                <div className="relative h-40 overflow-hidden rounded-2xl shadow-lg sm:h-52">
                  <Image src={`${IMG}/boiler-building.jpg`} alt={en ? "Infrastructure building" : "Здание котельной"} fill className="object-cover" sizes="(max-width: 1024px) 50vw, 25vw" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Residents */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div {...fadeUp} className="mb-10 max-w-3xl lg:mb-14">
            <h2 className="text-h2 text-primary">{en ? "Park residents" : "Резиденты парка"}</h2>
            <p className="text-body mt-4 text-muted-foreground">
              {en
                ? "10 operating companies with total investments of 3.57 billion rubles have created 645 jobs."
                : "10 действующих компаний с общими инвестициями 3,57 млрд рублей создали 645 рабочих мест."}
            </p>
          </motion.div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {RESIDENTS.map((r, i) => (
              <motion.div
                key={r.key}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: (i % 3) * 0.06 }}
                className="flex flex-col rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-5 flex h-16 items-center">
                  {r.logo ? (
                    <Image
                      src={r.logo}
                      alt={en ? r.nameEn : r.name}
                      width={180}
                      height={60}
                      className="max-h-14 w-auto object-contain"
                    />
                  ) : (
                    <span className="inline-flex rounded-xl bg-primary/10 p-3 text-primary">
                      <Factory className="h-7 w-7" />
                    </span>
                  )}
                </div>
                <h3 className="text-base font-semibold text-foreground">{en ? r.nameEn : r.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {en ? r.productEn : r.product}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/60 pt-4">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {en ? r.capacityEn : r.capacity}
                  </span>
                  {r.since && (
                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                      {en ? `since ${r.since}` : `с ${r.since} года`}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-secondary/50 py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div {...fadeUp} className="mb-10 max-w-3xl lg:mb-14">
            <h2 className="text-h2 text-primary">{en ? "Park in operation" : "Парк в работе"}</h2>
            <p className="text-body mt-4 text-muted-foreground">
              {en
                ? "Production facilities of residents launched on the park's territory."
                : "Производства резидентов, запущенные на территории парка."}
            </p>
          </motion.div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {GALLERY.map((g, i) => (
              <motion.figure
                key={g.src}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: (i % 4) * 0.05 }}
                className={`group relative overflow-hidden rounded-2xl shadow-md ${
                  i === 0 || i === 5 ? "sm:col-span-2 sm:row-span-2" : ""
                }`}
              >
                <div className={`relative w-full ${i === 0 || i === 5 ? "h-64 sm:h-full sm:min-h-[420px]" : "h-52"}`}>
                  <Image
                    src={g.src}
                    alt={en ? g.captionEn : g.caption}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                <figcaption className="absolute inset-x-0 bottom-0 p-4 text-sm font-medium text-white drop-shadow">
                  {en ? g.captionEn : g.caption}
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* Training & labs */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <motion.div {...fadeUp} className="order-2 grid gap-4 lg:order-1">
              <div className="relative h-64 overflow-hidden rounded-2xl shadow-lg sm:h-80">
                <Image src={`${IMG}/lab-students.jpg`} alt={en ? "Students in the chemical laboratory" : "Студенты в химической лаборатории"} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative h-40 overflow-hidden rounded-2xl shadow-lg sm:h-52">
                  <Image src={`${IMG}/lab-class.jpg`} alt={en ? "Training class" : "Учебный класс"} fill className="object-cover" sizes="(max-width: 1024px) 50vw, 25vw" />
                </div>
                <div className="relative h-40 overflow-hidden rounded-2xl shadow-lg sm:h-52">
                  <Image src={`${IMG}/lab-rectification.jpg`} alt={en ? "Rectification laboratory unit" : "Лабораторная установка ректификации"} fill className="object-cover" sizes="(max-width: 1024px) 50vw, 25vw" />
                </div>
              </div>
            </motion.div>
            <motion.div {...fadeUp} className="order-1 lg:order-2">
              <span className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 text-primary">
                <GraduationCap className="h-7 w-7" />
              </span>
              <h2 className="text-h2 text-primary">
                {en ? "Laboratories and workforce training" : "Лаборатории и подготовка кадров"}
              </h2>
              <p className="text-body mt-5 text-muted-foreground">
                {en
                  ? "Plastic participates in the federal Professionalitet project together with the Uzlovaya Polytechnic College. In 2022 a new training and laboratory building was opened on the plant's territory."
                  : "«Пластик» участвует в федеральном проекте «Профессионалитет» вместе с Узловским политехническим колледжем. В 2022 году на территории предприятия открыт учебно-лабораторный корпус."}
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { v: ">900", u: "м²", l: en ? "training space" : "учебных площадей" },
                  { v: "6", u: "", l: en ? "chemical laboratories" : "химических лабораторий" },
                  { v: ">100", u: "", l: en ? "modern instruments" : "единиц современных приборов" },
                  { v: "110", u: "", l: en ? "study places" : "учебных мест" },
                ].map((s) => (
                  <div key={s.l} className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
                    <div className="text-2xl font-bold text-primary sm:text-3xl">
                      {s.v}
                      {s.u && <span className="ml-1 text-lg font-semibold">{s.u}</span>}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{s.l}</p>
                  </div>
                ))}
              </div>
              <p className="text-body mt-6 text-muted-foreground">
                {en
                  ? "The park trains personnel both for its own production facilities and for resident companies."
                  : "Парк готовит кадры как для собственного производства, так и для компаний-резидентов."}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-12 text-center shadow-xl sm:px-12 lg:py-16">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.18),transparent_55%)]" />
            <h2 className="text-h2 relative text-white">
              {en ? "Become a park resident" : "Станьте резидентом парка"}
            </h2>
            <p className="text-body-lead relative mx-auto mt-4 max-w-2xl text-white/85">
              {en
                ? "Ready sites, utilities, logistics and workforce — start your production at the Plastic Industrial Park."
                : "Готовые площадки, коммуникации, логистика и кадры — запустите производство в индустриальном парке «Пластик»."}
            </p>
            <div className="relative mt-8">
              <Button size="lg" asChild className="bg-white px-8 text-primary hover:bg-white/90">
                <Link href="/contacts">
                  {en ? "Contact us" : "Связаться с нами"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
