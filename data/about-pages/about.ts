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
      " было основано в 1959 году в г. Узловая Тульской области. За более чем 65 лет работы мы прошли путь от небольшого завода до лидера химической индустрии России в сегменте АБС-пластиков.",
    historyParagraphs: [
      "Наше предприятие непрерывно развивается, осваивая новые направления и постоянно модернизируясь. Сегодня мы производим вспенивающийся полистирол шести марок, экструзионные и литьевые марки АБС-пластиков, а также различные изделия из пластмасс.",
      "Наша продукция поставляется по всей России и используется в автомобилестроении, электронике, строительстве и других отраслях промышленности. Производство и оптовый склад находятся в 200 км от Москвы, вблизи трассы М4, с собственными подъездными путями к железнодорожному узлу Узловая-2.",
    ],
    valuesTitle: "Наши ценности",
    values: [
      { title: "Качество", description: "Строгий контроль на всех этапах производства" },
      { title: "Инновации", description: "Внедрение передовых технологий" },
      { title: "Команда", description: "Профессиональные специалисты" },
      { title: "Надёжность", description: "Более 65 лет на рынке" },
    ] as Omit<AboutValue, "icon">[],
    missionTitle: "Наша миссия",
    missionLead:
      "Производить высококачественное полимерное сырье, отвечающее современным стандартам качества, обеспечивая инновационные решения для промышленности и способствуя устойчивому развитию отрасли.",
    missionCards: [
      { title: "Качество", description: "ISO 9001-2008 и ГОСТ ISO 9001:2011" },
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
      " was founded in 1959 in Uzlovaya, Tula Region. Over more than 65 years, we have grown from a small plant into a leader of the Russian chemical industry in the ABS plastics segment.",
    historyParagraphs: [
      "Our enterprise continues to develop, exploring new directions and constantly upgrading. Today we produce six grades of expandable polystyrene, extrusion and injection grades of ABS plastics, and a wide range of plastic products.",
      "Our products are supplied across Russia and used in the automotive, electronics, construction, and other industries. The production site and wholesale warehouse are located 200 km from Moscow, near the M4 highway, with dedicated access to the Uzlovaya-2 railway junction.",
    ],
    valuesTitle: "Our Values",
    values: [
      { title: "Quality", description: "Strict control at every stage of production" },
      { title: "Innovation", description: "Adoption of advanced technologies" },
      { title: "Team", description: "Skilled professionals" },
      { title: "Reliability", description: "More than 65 years on the market" },
    ] as Omit<AboutValue, "icon">[],
    missionTitle: "Our Mission",
    missionLead:
      "To manufacture high-quality polymer raw materials that meet modern quality standards, providing innovative solutions for industry and contributing to the sustainable development of the sector.",
    missionCards: [
      { title: "Quality", description: "ISO 9001-2008 and GOST ISO 9001:2011" },
      { title: "Product Range", description: "6 polystyrene grades, ABS plastics" },
      { title: "Logistics", description: "200 km from Moscow, M4 highway, railway hub" },
    ] as AboutMissionCard[],
  },
}

export const valueIcons = [Target, Zap, Users, Award] as const
