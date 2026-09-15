import type { HeroData, HistoryPeriod } from "@/data/historyPeriods22"

type HistoryPage = {
  hero: HeroData
  periods: HistoryPeriod[]
  scrollHint: string
  heroImageAlt: string
  closingPhrase: string
}

export const historyPageContent: Record<"ru" | "en", HistoryPage> = {
  ru: {
    scrollHint: "Прокрутите вниз",
    heroImageAlt: "Производственная площадка АО «Пластик»",
    closingPhrase:
      "Опираясь на многолетний опыт, мы совершенствуем производство, осваиваем новые технологии и продолжаем историю предприятия.",
    hero: {
      heroImage: "/images/history/history-hero.jpeg",
      heroTitle: "История АО «Пластик»",
      heroSubTitle: "Ключевые этапы развития предприятия",
      heroTextSlides: [],
    },
    periods: [
      {
        id: "period-1",
        title: "1959–1973",
        subtitle: "Формирование производственного комплекса",
        image: "/images/history/period-1959-1992.jpeg",
        timeline: [
          {
            year: "1959",
            description:
              "В Узловой основано предприятие, с которого началась история АО «Пластик».",
          },
          {
            year: "1964",
            description:
              "Введён в эксплуатацию цех по производству фенопласта (волокнита) — материала для изготовления деталей машин.",
          },
          {
            year: "1967",
            description:
              "В новом цехе началось производство эмульсионного и суспензионного полистиролов.",
          },
          {
            year: "1968",
            description:
              "Прессовое отделение приступило к выпуску комплектующих для ВАЗа и товаров народного потребления.",
          },
          {
            year: "1969–1971",
            description:
              "В 1969 году в новом цехе организован выпуск профильно-погонажных изделий для ВАЗа. В 1971 году предприятие освоило производство компаундов и металлизированного профиля.",
          },
          {
            year: "1973",
            description:
              "Введён в эксплуатацию комплекс по производству АБС-пластика — ударопрочного полимерного материала.",
          },
        ],
        infographic: [],
      },
      {
        id: "period-2",
        title: "1974–1992",
        subtitle: "Расширение мощностей и производство автокомпонентов",
        image: "/images/history/period-1974-1992-v2.webp",
        timeline: [
          {
            year: "1974–1975",
            description:
              "Производственные мощности расширены: последовательно начали работу первая и вторая очереди цеха изделий из термопластов для Камского автомобильного завода.",
          },
          {
            year: "Конец 1975",
            description: "Производство стирола вышло на проектную мощность.",
          },
          {
            year: "Декабрь 1992",
            description:
              "Предприятие преобразовано в акционерное общество открытого типа.",
          },
        ],
        infographic: [],
      },
      {
        id: "period-3",
        title: "2001–2010",
        subtitle: "Модернизация и развитие технологий",
        image: "/images/history/period-modernization.png",
        timeline: [
          {
            year: "2001",
            description: "Предприятие вошло в группу компаний СИБУР.",
          },
          {
            year: "Апрель 2003",
            description:
              "Новая технологическая линия обеспечила выпуск компаундов на основе АБС-пластика собственного производства.",
          },
          {
            year: "Декабрь 2005",
            description:
              "Система менеджмента качества ОАО «Пластик» сертифицирована по международному стандарту ISO 9001.",
          },
          {
            year: "2009",
            description:
              "Завершены реконструкция и модернизация линии по производству АБС-ПК.",
          },
          {
            year: "7 ноября 2010",
            description:
              "После реконструкции цех стирола возобновил работу с увеличенной производственной мощностью и выпустил первую партию продукции.",
          },
        ],
        infographic: [],
      },
      {
        id: "period-4",
        title: "2011–2019",
        subtitle: "Новый этап развития компании",
        image: "/images/history/period-2019-present.jpeg",
        timeline: [
          {
            year: "Декабрь 2011",
            description:
              "Предприятие прошло ресертификационный аудит системы менеджмента качества на соответствие ISO 9001:2008 и ГОСТ Р ИСО 9001-2008.",
          },
          {
            year: "Декабрь 2013",
            description:
              "Группа частных инвесторов приобрела 100% акций ОАО «Пластик».",
          },
          {
            year: "Январь 2014",
            description: "Создан Торговый дом «Пластик».",
          },
          {
            year: "Март 2014",
            description:
              "В группу компаний «Пластик» вошло ЗАО «Узловский завод строительных конструкций». Предприятие выпускает стеновые панели и плиты перекрытия из пенополистирола и арматурных каркасов по технологии Plastbau-3.",
          },
          {
            year: "Декабрь 2014",
            description:
              "ОАО «Пластик» прошло ресертификационный аудит системы менеджмента качества на соответствие ISO 9001-2008 и ГОСТ ISO 9001-2011. По его итогам получены сертификаты органов по сертификации «АКАДЕМИЯ-СЕРТ» и «ИНТЕРСЕРТИФИКА-ТЮФ».",
          },
          {
            year: "Июнь 2019",
            description: "Наименование предприятия изменено с ОАО «Пластик» на АО «Пластик».",
          },
        ],
        infographic: [],
      },
      {
        id: "period-5",
        title: "2019–2024",
        subtitle: "Развитие продуктовой линейки и рынков России и СНГ",
        image: "/images/history/period-1974-1992.png",
        timeline: [
          {
            year: "2019",
            description: "Компания «ФНМ Алькар» открыла производство геотекстиля на промышленной площадке АО «Пластик». Это стало новым этапом развития технопарка.",
          },
          {
            year: "2020",
            description: "В период ограничений АО «Пластик» сохранило поставки АБС-пластиков и полистиролов заказчикам в России и ближнем зарубежье.",
          },
          {
            year: "2021",
            description: "Представлен проект развития промышленного технопарка «Пластик»: 50 га территории, 67 тыс. м² объектов промышленной инфраструктуры, собственные инженерные сети и возможности железнодорожной доставки.",
          },
          {
            year: "2021–2024",
            description: "Компания расширила ассортимент стирольных материалов и развивала направление стирол-акриловых дисперсий для лакокрасочных материалов и строительной химии.",
          },
        ],
        infographic: [],
      },
      {
        id: "period-6",
        title: "2024–2026",
        subtitle: "Развитие группы и новые производственные проекты",
        image: "/images/history/period-2024-2026.png",
        timeline: [
          {
            year: "2024",
            description:
              "АО «Пластик» отметило 65-летие со дня основания — важную веху в истории одного из крупнейших российских производителей АБС-пластиков и суспензионного полистирола.",
          },
          {
            year: "2024",
            description:
              "ООО «Финндисп» вошло в группу компаний АО «Пластик».",
          },
          {
            year: "2025",
            description:
              "Состоялся первый выпуск специалистов по программе «Профессионалитет». Совместно с учебными заведениями Узловой предприятие создало систему подготовки кадров для химического производства.",
          },
          {
            year: "2026 · проект в реализации",
            description:
              "Продолжается реализация проекта по строительству нового цеха для производства вспенивающегося полистирола.",
          },
        ],
        infographic: [],
      },
    ],
  },
  en: {
    scrollHint: "Scroll down",
    heroImageAlt: "JSC Plastic production site",
    closingPhrase:
      "Building on decades of experience, we continue to improve production, adopt new technologies and write the next chapter of our history.",
    hero: {
      heroImage: "/images/history/history-hero.jpeg",
      heroTitle: "History of JSC «Plastic»",
      heroSubTitle: "Key milestones in the development of the enterprise",
      heroTextSlides: [],
    },
    periods: [
      {
        id: "period-1",
        title: "1959–1973",
        subtitle: "Formation of the production complex",
        image: "/images/history/period-1959-1992.jpeg",
        timeline: [
          { year: "1959", description: "The enterprise that began the history of JSC Plastic was founded in Uzlovaya." },
          { year: "1964", description: "A production facility for phenolic moulding compound (voloknit), a material used to manufacture machine components, was commissioned." },
          { year: "1967", description: "A shop producing emulsion and suspension polystyrene was commissioned." },
          { year: "1968", description: "A press shop was commissioned to manufacture components for VAZ and consumer goods." },
          { year: "1969–1971", description: "A facility producing extruded profiles for VAZ was commissioned in 1969. In 1971, the enterprise began manufacturing compounds and metallized profiles." },
          { year: "1973", description: "A production complex for ABS plastic, an impact-resistant polymer material, was commissioned." },
        ],
        infographic: [],
      },
      {
        id: "period-2",
        title: "1974–1992",
        subtitle: "Capacity expansion and automotive component production",
        image: "/images/history/period-1974-1992-v2.webp",
        timeline: [
          { year: "1974–1975", description: "The first and second phases of the thermoplastic products shop for the Kama Automobile Plant were commissioned." },
          { year: "Late 1975", description: "The styrene production facility reached its design capacity." },
          { year: "December 1992", description: "The plant was transformed into an open joint-stock company." },
        ],
        infographic: [],
      },
      {
        id: "period-3",
        title: "2001–2010",
        subtitle: "Modernization and technological development",
        image: "/images/history/period-modernization.png",
        timeline: [
          { year: "2001", description: "The enterprise joined the SIBUR Group." },
          { year: "April 2003", description: "A line for producing compounds based on the company's own ABS plastic was commissioned." },
          { year: "December 2005", description: "The quality management system of OJSC Plastic was certified to the international ISO 9001 standard." },
          { year: "2009", description: "The ABS-PC plastics production line was reconstructed and modernized." },
          { year: "7 November 2010", description: "The styrene facility was commissioned following reconstruction, with increased production capacity. The first batch of styrene was produced." },
        ],
        infographic: [],
      },
      {
        id: "period-4",
        title: "2011–2019",
        subtitle: "A new stage in the company's development",
        image: "/images/history/period-2019-present.jpeg",
        timeline: [
          { year: "December 2011", description: "Plastic passed a quality management system recertification audit for compliance with ISO 9001:2008 and its Russian counterpart GOST R ISO 9001-2008." },
          { year: "December 2013", description: "The ownership of OJSC Plastic changed, with a group of private investors acquiring 100% of the company's shares." },
          { year: "January 2014", description: "Trading House Plastic was established." },
          { year: "March 2014", description: "Uzlovaya Structural Components Plant joined Plastic Group, producing expanded-polystyrene wall panels and floor slabs, as well as reinforcement frames using Plastbau-3 technology." },
          { year: "December 2014", description: "OJSC Plastic passed a QMS recertification audit for compliance with ISO 9001-2008 and GOST ISO 9001-2011. The relevant certificates were issued by ACADEMY-CERT and INTERCERTIFICA-TÜV." },
          { year: "June 2019", description: "OJSC Plastic changed its legal name to JSC Plastic." },
        ],
        infographic: [],
      },
      {
        id: "period-5",
        title: "2019–2024",
        subtitle: "Product portfolio development across Russia and the CIS",
        image: "/images/history/period-1974-1992.png",
        timeline: [
          { year: "2019", description: "FNM Alkar opened a geotextile production facility at the JSC Plastic industrial site, marking a new stage in the industrial park's development." },
          { year: "2020", description: "During the period of restrictions, JSC Plastic maintained supplies of ABS plastics and polystyrene to customers in Russia and neighbouring countries." },
          { year: "2021", description: "A development project for the Plastic industrial park was presented, covering 50 hectares, 67,000 m² of industrial infrastructure, dedicated utility networks and rail logistics." },
          { year: "2021–2024", description: "The company expanded its styrenic materials portfolio and developed its styrene-acrylic dispersions business for paints, coatings and construction chemicals." },
        ],
        infographic: [],
      },
      {
        id: "period-6",
        title: "2024–2026",
        subtitle: "Group development and new production projects",
        image: "/images/history/period-2024-2026.png",
        timeline: [
          { year: "2024", description: "JSC Plastic celebrated its 65th anniversary, a milestone in the history of one of Russia's largest manufacturers of ABS plastics and suspension polystyrene." },
          { year: "2024", description: "Finndisp LLC joined the JSC Plastic Group." },
          { year: "2025", description: "The first specialists graduated under the Professionalitet program. Together with educational institutions in Uzlovaya, the enterprise established its own training system for chemical production personnel." },
          { year: "2026 · project in progress", description: "Work continues on a project to build a new expandable polystyrene production facility." },
        ],
        infographic: [],
      },
    ],
  },
}
