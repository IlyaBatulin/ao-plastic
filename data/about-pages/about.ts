import type { LucideIcon } from "lucide-react"
import { Award, Target, Users, Zap } from "lucide-react"

export type AboutValue = {
  icon: LucideIcon
  title: string
  description: string
}

export type AboutMissionCard = {
  title: string
  description: string
}

export const aboutPageContent = {
  ru: {
    heroImageAlt: "Производственные колонны АО «Пластик», зима",
    heroBadge: "АО «Пластик» · с 1959 года",
    heroTitle: "О компании",
    heroSubtitle: "Создаём будущее пластиковой индустрии — от Узловой для всей России",
    stats: {
      founded: "Год основания",
      employees: "Сотрудников",
      clients: "Довольных клиентов",
      production: "Продукции в год",
      productionSuffix: "+ тыс. тонн",
    },
    historyTitle: "Наша история",
    historyImageAlt: "Производственная площадка АО «Пластик» зимой",
    historyLeadCompany: "АО «Пластик»",
    historyLeadText:
      " — ведущий российский производитель АБС-пластиков и полимерного сырья. Работаем с 1959 года, постоянно модернизируем производство и внедряем передовые технологии.",
    historyParagraphs: [
      "Наши современные марки полимерных материалов востребованы в промышленности и производстве товаров повседневного спроса.",
      "В ассортимент входят вспенивающийся полистирол, стирол-акриловые дисперсии, экструзионные и литьевые марки АБС-пластиков, а также готовые изделия из пластмасс.",
      "Система менеджмента качества сертифицирована по международным и российским стандартам. Мы гарантируем стабильные характеристики сырья от партии к партии и предлагаем выгодные условия напрямую от производителя.",
    ],
    valuesTitle: "Почему выбирают нас",
    values: [
      { title: "Стандарты ISO", description: "Система менеджмента качества сертифицирована по международным и российским стандартам" },
      { title: "Стабильность и надёжность", description: "Строгое соответствие характеристик сырья от партии к партии" },
      { title: "Выгодные условия", description: "Конкурентные условия напрямую от производителя для долгосрочного партнёрства" },
    ] as Omit<AboutValue, "icon">[],
    missionTitle: "Наша миссия",
    missionLead:
      "Мы строим эффективный бизнес, создавая качественный продукт, который полностью отвечает запросам наших клиентов. Мы верим в долгосрочное планирование, ценим вклад каждого сотрудника и стремимся улучшать качество жизни общества.",
    missionCards: [
      { title: "Качество", description: "ISO 9001:2015 и ГОСТ Р ИСО 9001-2015" },
      { title: "Ассортимент", description: "6 марок полистирола, АБС-пластики" },
      { title: "Логистика", description: "200 км от Москвы, М4, ж/д узел" },
    ] as AboutMissionCard[],
  },
  en: {
    heroImageAlt: "Production columns at JSC «Plastic», winter",
    heroBadge: "JSC «Plastic» · since 1959",
    heroTitle: "About Us",
    heroSubtitle: "Building the future of the plastics industry — from Uzlovaya for all of Russia",
    stats: {
      founded: "Year founded",
      employees: "Employees",
      clients: "Satisfied customers",
      production: "Annual output",
      productionSuffix: "+ thousand tons",
    },
    historyTitle: "Our History",
    historyImageAlt: "JSC Plastic production site in winter",
    historyLeadCompany: "JSC «Plastic»",
    historyLeadText:
      " is a leading Russian manufacturer of ABS plastics and polymer raw materials. Since 1959, we have continuously modernised production and introduced advanced technologies.",
    historyParagraphs: [
      "Our modern polymer grades are used in industry and in the production of everyday goods.",
      "Our portfolio includes expandable polystyrene, styrene-acrylic dispersions, extrusion and injection grades of ABS plastics, and finished plastic products.",
      "Our quality management system is certified to international and Russian standards. We ensure consistent raw-material characteristics from batch to batch and offer competitive terms directly from the manufacturer.",
    ],
    valuesTitle: "Why Customers Choose Us",
    values: [
      { title: "ISO Standards", description: "A quality management system certified to international and Russian standards" },
      { title: "Consistency and Reliability", description: "Stable raw-material characteristics from batch to batch" },
      { title: "Competitive Terms", description: "Direct manufacturer terms designed for long-term partnerships" },
    ] as Omit<AboutValue, "icon">[],
    missionTitle: "Our Mission",
    missionLead:
      "We build an efficient business by creating quality products that fully meet our customers' needs. We believe in long-term planning, value every employee's contribution and strive to improve quality of life in society.",
    missionCards: [
      { title: "Quality", description: "ISO 9001:2015 and GOST R ISO 9001-2015" },
      { title: "Product Range", description: "6 polystyrene grades, ABS plastics" },
      { title: "Logistics", description: "200 km from Moscow, M4 highway, railway hub" },
    ] as AboutMissionCard[],
  },
}

export const valueIcons = [Target, Zap, Users, Award] as const
