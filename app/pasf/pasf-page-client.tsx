"use client"

import Link from "next/link"
import {
  Award,
  CheckCircle,
  Flame,
  Handshake,
  Shield,
  Target,
  Wind,
} from "lucide-react"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"

const content = {
  ru: {
    heroBadge: "Профессиональное аварийно-спасательное формирование",
    heroTitle: "ПАСФ «ПЛАСТИК»",
    heroText:
      "Комплексная безопасность обслуживаемых объектов заказчиков, минимизация ущерба при чрезвычайных ситуациях и защита экологической безопасности окружающей среды.",
    requestButton: "Направить запрос",
    servicesButton: "Направления работ",
    mainBadge: "Основная задача",
    mainTitle: "Обеспечение комплексной безопасности объектов заказчиков",
    summary: [
      "Обеспечение комплексной безопасности обслуживаемых объектов заказчиков.",
      "Минимизация ущерба при возникновении чрезвычайных ситуаций.",
      "Сохранение ресурсов предприятия и экологической безопасности окружающей среды.",
      "Поддержание постоянной готовности к локализации и ликвидации последствий аварий.",
    ],
    outsourcingBadge: "Аутсорсинг газоспасательных и пожарных услуг",
    outsourcingTitle: "Передача функций специализированной организации",
    outsourcingParagraphs: [
      "Организации, эксплуатирующие опасные производственные объекты, обязаны создавать собственные профессиональные аварийно-спасательные формирования либо заключать договоры на обслуживание.",
      "АО «ПЛАСТИК» предлагает передать функции газоспасательной службы и пожарной безопасности профессиональному аварийно-спасательному формированию. Работы выполняются в интересах заказчика под управлением и контролем исполнителя.",
    ],
    benefitsTitle: "Преимущества для предприятия",
    benefits: [
      "Снижение расходов на содержание персонала, обучение, страховые взносы и подбор кадров.",
      "Сокращение непрямых и непроизводственных затрат, связанных с обеспечением готовности аварийно-спасательных подразделений.",
      "Доступ к экспертным знаниям, методологиям и опыту профессионального аварийно-спасательного формирования.",
      "Ответственность ПАСФ АО «ПЛАСТИК» за боеготовность, реагирование и плановое перевооружение.",
    ],
    servicesBadge: "Основные направления",
    servicesTitle: "Газоспасательные работы и пожарная безопасность",
    gasTitle: "Газоспасательные работы",
    gasText:
      "Работы выполняются в условиях наличия токсичных, пожароопасных и взрывоопасных веществ с применением изолирующих средств индивидуальной защиты.",
    gasWorks: [
      "Поиск людей в помещениях и на территориях, загазованных токсичными веществами.",
      "Оказание помощи людям, застигнутым аварией.",
      "Локализация и ликвидация последствий аварий.",
      "Проверка состояния газозащитных средств и средств индивидуальной защиты персонала.",
      "Обеспечение безопасного проведения газоопасных работ.",
    ],
    fireTitle: "Пожарная безопасность",
    fireText:
      "ПАСФ оказывает услуги согласно имеющейся лицензии на деятельность по тушению пожаров в населённых пунктах, на производственных объектах и объектах инфраструктуры.",
    fireWorks: [
      "Спасение людей и имущества при пожарах, оказание первой помощи.",
      "Организация и осуществление тушения пожаров и аварийно-спасательных работ.",
      "Обеспечение безопасного проведения огневых работ.",
      "Проверка наружного противопожарного водоснабжения и внутреннего противопожарного водопровода на водоотдачу.",
      "Разработка и корректировка планов и карточек тушения пожаров.",
    ],
    resourcesBadge: "Ресурсы подразделения",
    resourcesTitle: "Личный состав, техника и профилактическая работа",
    resourcesText:
      "Штат ПАСФ «ПЛАСТИК» укомплектован оперативным командным и личным составом с опытом ведения всех видов аварийно-спасательных работ. Сотрудники прошли обязательную подготовку и аттестованы для выполнения поставленных задач.",
    fireTruckAlt: "Пожарный автомобиль ПАСФ «ПЛАСТИК»",
    equipmentTitle: "Оснащение подразделения",
    equipment: [
      "Новые пожарные автомобили, укомплектованные по требованиям МЧС.",
      "Рукавная база с трёхкратным запасом рукавов и возможностью их обслуживания.",
      "Пост ГДЗС для обслуживания дыхательных аппаратов на сжатом воздухе.",
      "Оборудование для проверки противопожарного водоснабжения на водоотдачу.",
      "Вывод сигналов автоматической пожарной сигнализации на монитор диспетчера ПАСФ.",
    ],
    preventiveTitle: "Профилактическая работа",
    preventiveWorks: [
      "Вводный инструктаж, обучение и практическая отработка действий персонала в газоопасных местах.",
      "Контроль наличия, подбора, содержания и использования средств индивидуальной защиты органов дыхания.",
      "Проверка соответствия планов мероприятий по локализации и ликвидации аварий.",
      "Участие в учебно-тренировочных занятиях.",
    ],
    docsBadge: "Документы и аттестация",
    docsTitle: "Право ведения аварийно-спасательных работ",
    docsText:
      "ПАСФ АО «ПЛАСТИК» выполняет работы и оказывает услуги в рамках действующего свидетельства об аттестации и лицензии на деятельность в области пожарной безопасности.",
    docsNote:
      "При заключении договора возможно доукомплектование техникой, оборудованием и средствами тушения под особенности вашего производства.",
    certificateAlt: "Свидетельство об аттестации ПАСФ «ПЛАСТИК»",
    licenseAlt: "Уведомление о предоставлении лицензии МЧС",
    cooperationBadge: "Опыт сотрудничества",
    cooperationTitle: "ПАСФ «ПЛАСТИК» оказывает услуги промышленным заказчикам",
    cooperationText:
      "Аварийно-спасательная служба АО «ПЛАСТИК» работает с производственными, инфраструктурными и сервисными компаниями, обеспечивая комплексную безопасность обслуживаемых объектов.",
    partners: [
      "ООО «Полимердор»",
      "ООО «Адвентум Технолоджис»",
      "ООО «Анселл Мануфактуринг Рус»",
      "ООО «ГЕА Фарм Технолоджиз Рус»",
      "ООО «Босс-эксплуатация»",
      "ООО «Фабрикс»",
      "ООО «Фан Фан Бейкери»",
    ],
    ctaTitle: "Рассмотрите ПАСФ «ПЛАСТИК» как надёжного партнёра",
    ctaText:
      "Мы готовы обеспечить комплексную безопасность опасных производственных объектов заказчиков и взять на себя ответственность за готовность, реагирование и профилактическую работу.",
    ctaButton: "Связаться с нами",
  },
  en: {
    heroBadge: "Professional emergency rescue formation",
    heroTitle: "PASF PLASTIK",
    heroText:
      "Comprehensive safety support for customer facilities, damage minimization in emergency situations and protection of environmental safety.",
    requestButton: "Send Request",
    servicesButton: "Areas of Work",
    mainBadge: "Main Objective",
    mainTitle: "Comprehensive Safety of Customer Facilities",
    summary: [
      "Comprehensive safety support for customer facilities.",
      "Minimization of damage in emergency situations.",
      "Protection of enterprise resources and environmental safety.",
      "Maintaining readiness for localization and elimination of accident consequences.",
    ],
    outsourcingBadge: "Outsourcing of Gas Rescue and Fire Safety Services",
    outsourcingTitle: "Transfer of Functions to a Specialized Organization",
    outsourcingParagraphs: [
      "Organizations operating hazardous production facilities are required to establish their own professional emergency rescue formations or enter into service contracts with specialized providers.",
      "AO PLASTIK offers to transfer gas rescue and fire safety functions to a professional emergency rescue formation. The work is performed in the interests of the customer under the management and control of the contractor.",
    ],
    benefitsTitle: "Benefits for the Enterprise",
    benefits: [
      "Reduction of personnel, training, insurance and recruitment costs.",
      "Reduction of indirect and non-production costs related to maintaining emergency rescue readiness.",
      "Access to the expertise, methodology and experience of a professional emergency rescue formation.",
      "Responsibility of PASF AO PLASTIK for operational readiness, response and scheduled technical re-equipment.",
    ],
    servicesBadge: "Main Areas",
    servicesTitle: "Gas Rescue Operations and Fire Safety",
    gasTitle: "Gas Rescue Operations",
    gasText:
      "These operations are performed in environments containing toxic, flammable and explosive substances, using isolated personal protective equipment.",
    gasWorks: [
      "Search for people in premises and areas contaminated with toxic substances.",
      "Assistance to people affected by an accident.",
      "Localization and elimination of accident consequences.",
      "Inspection of gas protection equipment and personal protective equipment.",
      "Ensuring the safe performance of gas hazardous works.",
    ],
    fireTitle: "Fire Safety",
    fireText:
      "PASF provides services under its license for fire extinguishing activities in settlements, production facilities and infrastructure facilities.",
    fireWorks: [
      "Rescue of people and property in fires, provision of first aid.",
      "Organization and execution of fire extinguishing and emergency rescue operations.",
      "Ensuring the safe performance of hot works.",
      "Inspection of external and internal fire water supply systems for water output.",
      "Development and revision of fire extinguishing plans and cards.",
    ],
    resourcesBadge: "Unit Resources",
    resourcesTitle: "Personnel, Equipment and Preventive Activities",
    resourcesText:
      "PASF PLASTIK is staffed with professional operational command and personnel experienced in all types of emergency rescue operations. Employees have completed mandatory training and are certified to perform their assigned tasks.",
    fireTruckAlt: "PASF PLASTIK fire truck",
    equipmentTitle: "Unit Equipment",
    equipment: [
      "Modern fire trucks equipped in accordance with EMERCOM requirements.",
      "Hose base with a threefold hose reserve and maintenance capability.",
      "Gas and smoke protection service post for compressed-air breathing apparatus maintenance.",
      "Equipment for checking fire water supply systems for water output.",
      "Automatic fire alarm signals displayed directly on the PASF dispatcher monitor.",
    ],
    preventiveTitle: "Preventive Activities",
    preventiveWorks: [
      "Introductory briefing, training and practical drills for personnel working in gas hazardous areas.",
      "Control of availability, selection, maintenance and use of respiratory protective equipment.",
      "Verification of emergency localization and response plans.",
      "Participation in training exercises.",
    ],
    docsBadge: "Documents and Certification",
    docsTitle: "Authorization to Conduct Emergency Rescue Operations",
    docsText:
      "PASF AO PLASTIK performs works and provides services under its valid certificate of attestation and fire safety license.",
    docsNote:
      "When entering into a service agreement, additional equipment, machinery and fire extinguishing means may be provided according to the specifics of your production facility.",
    certificateAlt: "PASF PLASTIK certificate of attestation",
    licenseAlt: "EMERCOM license notification",
    cooperationBadge: "Cooperation Experience",
    cooperationTitle: "PASF PLASTIK Provides Services to Industrial Customers",
    cooperationText:
      "The emergency rescue service of AO PLASTIK works with production, infrastructure and service companies, ensuring comprehensive safety of the facilities under service.",
    partners: [
      "Polymerdor LLC",
      "Adventum Technologies LLC",
      "Ansell Manufacturing Rus LLC",
      "GEA Pharm Technologies Rus LLC",
      "Boss-Exploitation LLC",
      "Fabriks LLC",
      "Fun Fun Bakery LLC",
    ],
    ctaTitle: "Consider PASF PLASTIK as a Reliable Safety Partner",
    ctaText:
      "We are ready to support the comprehensive safety of hazardous production facilities and assume responsibility for readiness, response and preventive activities.",
    ctaButton: "Contact Us",
  },
} as const

export function PasfPageClient() {
  const { lang } = useLanguage()
  const page = content[lang as keyof typeof content]

  return (
    <>      <div className="min-h-screen bg-transparent">
        <section className="relative overflow-hidden pt-32 pb-16">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div
              className="absolute inset-0 animate-blue-flow"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(59, 130, 246, 0.35) 0%, rgba(147, 197, 253, 0.28) 30%, rgba(96, 165, 250, 0.22) 50%, rgba(147, 197, 253, 0.15) 70%, transparent 100%)",
                backgroundSize: "180% 180%",
                filter: "blur(70px)",
              }}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-blue-50/8 via-transparent to-transparent" />

          <div className="container relative z-10 mx-auto px-4 lg:px-8">
            <div className="mx-auto mb-12 max-w-4xl text-center">
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
                <Shield className="h-4 w-4" />
                {page.heroBadge}
              </span>
              <h1 className="mb-6 text-4xl font-bold text-primary leading-tight break-words animate-in fade-in slide-in-from-bottom-4 duration-700 sm:text-5xl md:text-7xl">
                {page.heroTitle}
              </h1>
              <p className="text-xl leading-relaxed text-foreground/70 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200 md:text-2xl">
                {page.heroText}
              </p>
              <div className="mt-6 h-0.5 w-24 mx-auto bg-primary animate-in fade-in duration-700 delay-300" />
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button asChild size="lg">
                  <Link href="/contacts">{page.requestButton}</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="#services">{page.servicesButton}</a>
                </Button>
              </div>
            </div>

            <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <img
                src="/images/pasf/team.png"
                alt={page.heroTitle}
                className="h-auto max-h-[560px] w-full object-cover object-center"
                loading="eager"
                fetchPriority="high"
              />
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
                  <Target className="h-4 w-4" />
                  {page.mainBadge}
                </span>
                <h2 className="text-3xl font-bold text-balance text-foreground md:text-4xl">
                  {page.mainTitle}
                </h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {page.summary.map((item: string) => (
                  <div key={item} className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <p className="leading-relaxed text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
                  <Handshake className="h-4 w-4" />
                  {page.outsourcingBadge}
                </span>
                <h2 className="mb-6 text-3xl font-bold text-balance text-foreground md:text-4xl">
                  {page.outsourcingTitle}
                </h2>
                <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
                  {page.outsourcingParagraphs.map((paragraph: string) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-card p-8 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-600 shadow-lg shadow-blue-500/20">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-6 text-2xl font-bold text-foreground">{page.benefitsTitle}</h3>
                <ul className="space-y-4">
                  {page.benefits.map((item: string) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <span className="leading-relaxed text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="bg-secondary/30 py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mb-12 max-w-3xl">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
                <Shield className="h-4 w-4" />
                {page.servicesBadge}
              </span>
              <h2 className="text-3xl font-bold text-balance text-foreground md:text-4xl">
                {page.servicesTitle}
              </h2>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <article className="rounded-3xl border border-border bg-card p-8 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Wind className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-foreground">{page.gasTitle}</h3>
                <p className="mb-6 leading-relaxed text-muted-foreground">{page.gasText}</p>
                <ul className="space-y-3">
                  {page.gasWorks.map((item: string) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="rounded-3xl border border-border bg-card p-8 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500">
                  <Flame className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-foreground">{page.fireTitle}</h3>
                <p className="mb-6 leading-relaxed text-muted-foreground">{page.fireText}</p>
                <ul className="space-y-3">
                  {page.fireWorks.map((item: string) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="mb-4 text-caption text-muted-foreground">
                  {page.resourcesBadge}
                </p>
                <h2 className="text-h2 text-primary mb-6">{page.resourcesTitle}</h2>
                <p className="mb-6 text-lg leading-relaxed text-muted-foreground">{page.resourcesText}</p>
                <img
                  src="/images/pasf/fire-truck.png"
                  alt={page.fireTruckAlt}
                  className="h-72 w-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="space-y-8">
                <div className="border border-border bg-card p-8 shadow-sm">
                  <h3 className="mb-5 text-2xl font-bold">{page.equipmentTitle}</h3>
                  <ul className="space-y-3 list-disc pl-5">
                    {page.equipment.map((item: string) => (
                      <li key={item} className="text-muted-foreground">
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border border-border bg-card p-8 shadow-sm">
                  <h3 className="mb-5 text-2xl font-bold">{page.preventiveTitle}</h3>
                  <ul className="space-y-3 list-disc pl-5">
                    {page.preventiveWorks.map((item: string) => (
                      <li key={item} className="text-muted-foreground">
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-secondary py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="mb-4 text-caption text-muted-foreground">
                  {page.docsBadge}
                </p>
                <h2 className="text-h2 text-primary mb-6">{page.docsTitle}</h2>
                <p className="mb-8 text-lg leading-relaxed text-muted-foreground">{page.docsText}</p>
                <div className="border border-border bg-card p-6">
                  <p className="font-semibold text-foreground">{page.docsNote}</p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="overflow-hidden border border-border bg-card shadow-sm">
                  <img
                    src="/images/pasf/certificate.png"
                    alt={page.certificateAlt}
                    className="h-full max-h-[620px] w-full object-cover object-top"
                    loading="lazy"
                  />
                </div>
                <div className="overflow-hidden border border-border bg-card shadow-sm">
                  <img
                    src="/images/pasf/license.png"
                    alt={page.licenseAlt}
                    className="h-full max-h-[620px] w-full object-cover object-top"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mb-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <p className="mb-4 text-caption text-muted-foreground">
                  {page.cooperationBadge}
                </p>
                <h2 className="text-h2 text-primary">{page.cooperationTitle}</h2>
              </div>
              <p className="text-lg leading-relaxed text-muted-foreground">{page.cooperationText}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              {page.partners.map((partner: string) => (
                <span key={partner} className="border border-border bg-card px-5 py-3 font-medium shadow-sm">
                  {partner}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-950 py-16 text-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-3xl font-bold text-balance lg:text-4xl">{page.ctaTitle}</h2>
              <p className="mb-8 text-lg leading-relaxed text-white/75">{page.ctaText}</p>
              <Link
                href="/contacts"
                className="inline-flex items-center justify-center rounded-md bg-white px-8 py-4 font-semibold text-slate-950 transition-colors hover:bg-white/90"
              >
                {page.ctaButton}
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}
