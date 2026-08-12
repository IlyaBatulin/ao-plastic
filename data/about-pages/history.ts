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
      "История продолжается — сохраняя накопленный опыт, мы совершенствуем производство и создаём основу для новых достижений.",
    hero: {
      heroImage: "/images/history/history-hero.jpeg",
      heroTitle: "История АО «Пластик»",
      heroSubTitle: "Ключевые этапы развития предприятия",
      heroTextSlides: [],
    },
    periods: [
      {
        id: "period-1",
        title: "1964–1973",
        subtitle: "Формирование производственного комплекса",
        image: "/images/history/period-1959-1992.jpeg",
        timeline: [
          {
            year: "1964",
            description:
              "Начал работу цех по производству фенопласта (волокнита), который является сырьём для изготовления деталей различных машин.",
          },
          {
            year: "1967",
            description:
              "Введён в строй цех по производству эмульсионного и суспензионного полистиролов.",
          },
          {
            year: "1968",
            description:
              "Пущено в эксплуатацию прессовое отделение для производства деталей для ВАЗа и товаров народного потребления.",
          },
          {
            year: "1969–1971",
            description:
              "В 1969 году начал работать цех по выпуску профильно-погонажных изделий для ВАЗа, а в 1971 году освоено новое производство компаундов и металлизированного профиля.",
          },
          {
            year: "1973",
            description:
              "Введён в действие комплекс по производству пластика АБС — нового вида тройного сополимера, ударопрочного полистирольного пластика.",
          },
        ],
        infographic: [],
      },
      {
        id: "period-2",
        title: "1974–1992",
        subtitle: "Рост мощностей и выпуск продукции для автопрома",
        image: "/images/history/period-capacity-growth.png",
        timeline: [
          {
            year: "1974–1975",
            description:
              "Пущены первая и вторая очереди цеха изделий из термопластов для Камского автомобильного завода.",
          },
          {
            year: "Конец 1975",
            description: "Освоена проектная мощность производства стирола.",
          },
          {
            year: "Декабрь 1992",
            description:
              "Завод был преобразован в акционерное общество открытого типа.",
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
              "Введена в эксплуатацию линия по производству компаундов на базе выпускаемого предприятием АБС-пластика.",
          },
          {
            year: "Декабрь 2005",
            description:
              "ОАО «Пластик» сертифицировано по международному стандарту ИСО 9001.",
          },
          {
            year: "2009",
            description:
              "Проведены реконструкция и модернизация линии по производству пластика АБС-ПК.",
          },
          {
            year: "7 ноября 2010",
            description:
              "После завершения реконструкции запущен цех по производству стирола с увеличенной мощностью и получена первая продукция.",
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
              "На «Пластике» прошёл ресертификационный аудит системы менеджмента качества на соответствие требованиям международного стандарта ИСО 9001:2008 и его российского аналога ГОСТ Р ИСО 9001-2008.",
          },
          {
            year: "Декабрь 2013",
            description:
              "Произошла смена собственников ОАО «Пластик»: 100% акций предприятия приобрела группа частных инвесторов.",
          },
          {
            year: "Январь 2014",
            description: "Создан Торговый дом «Пластик».",
          },
          {
            year: "Март 2014",
            description:
              "В Группу компаний «Пластик» вошло ЗАО «Узловский завод строительных конструкций», выпускающее стеновые панели и плиты перекрытия из пенополистирола и арматурных каркасов по технологии «Plastbau-3».",
          },
          {
            year: "Декабрь 2014",
            description:
              "На ОАО «Пластик» прошёл ресертификационный аудит СМК на соответствие требованиям ISO 9001-2008 и ГОСТ ISO 9001-2011. По итогам аудита органы «АКАДЕМИЯ-СЕРТ» и «ИНТЕРСЕРТИФИКА-ТЮФ» выдали соответствующие сертификаты.",
          },
          {
            year: "Июнь 2019",
            description: "ОАО «Пластик» сменило наименование на АО «Пластик».",
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
            description: "На территории промышленной площадки АО «Пластик» компания «ФНМ Алькар» открыла производство геотекстиля — продолжилось развитие промышленного технопарка и размещение новых производств.",
          },
          {
            year: "2020",
            description: "АО «Пластик» продолжило поставки АБС-пластиков и полистиролов российским потребителям и заказчикам ближнего зарубежья, сохраняя работу логистических цепочек в период ограничений.",
          },
          {
            year: "2021",
            description: "Представлен проект развития промышленного технопарка «Пластик»: территория 50 га, 67 тыс. м² объектов промышленной инфраструктуры, собственные инженерные сети и железнодорожная логистика.",
          },
          {
            year: "2021–2024",
            description: "Расширена линейка стирольных материалов: наряду с АБС-пластиками и полистиролами компания развивает направление стирол-акриловых дисперсий для лакокрасочных материалов и строительной химии.",
          },
          {
            year: "2024",
            description: "АО «Пластик» отметило 65-летие и подтвердило статус одного из крупнейших российских производителей АБС-пластиков и суспензионного полистирола.",
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
              "АО «Пластик» отметило 65-летие. Компания подтвердила статус одного из крупнейших российских производителей АБС-пластиков и суспензионного полистирола.",
          },
          {
            year: "2024",
            description:
              "ООО «Финндисп» вошло в группу компаний АО «Пластик».",
          },
          {
            year: "2025",
            description:
              "Состоялся первый выпуск специалистов по программе «Профессионалитет». Совместно с учебными заведениями Узловой предприятие сформировало собственную систему подготовки кадров для химического производства.",
          },
          {
            year: "2026 · в процессе",
            description:
              "Реализуется проект нового цеха по производству полистирола GPPS.",
          },
        ],
        infographic: [],
      },
    ],
  },
  en: {
    scrollHint: "Scroll down",
    heroImageAlt: "JSC Plastik production site",
    closingPhrase:
      "Our history continues — preserving accumulated expertise, we keep improving production and laying the foundation for new achievements.",
    hero: {
      heroImage: "/images/history/history-hero.jpeg",
      heroTitle: "History of JSC «Plastik»",
      heroSubTitle: "Key milestones in the development of the enterprise",
      heroTextSlides: [],
    },
    periods: [
      {
        id: "period-1",
        title: "1964–1973",
        subtitle: "Formation of the production complex",
        image: "/images/history/period-1959-1992.jpeg",
        timeline: [
          { year: "1964", description: "A phenolic molding compound (fibrous molding material) shop began operation, producing raw material for components used in various machines." },
          { year: "1967", description: "A shop producing emulsion and suspension polystyrene was commissioned." },
          { year: "1968", description: "A press shop was commissioned to manufacture components for VAZ and consumer goods." },
          { year: "1969–1971", description: "In 1969, a shop producing profile and linear products for VAZ began operation; in 1971, production of compounds and metallized profiles was launched." },
          { year: "1973", description: "An ABS plastics complex was commissioned to produce a new three-component copolymer — impact-resistant polystyrene plastic." },
        ],
        infographic: [],
      },
      {
        id: "period-2",
        title: "1974–1992",
        subtitle: "Capacity growth and production for the automotive industry",
        image: "/images/history/period-capacity-growth.png",
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
          { year: "December 2005", description: "OJSC Plastik was certified to the international ISO 9001 standard." },
          { year: "2009", description: "The ABS-PC plastics production line was reconstructed and modernized." },
          { year: "7 November 2010", description: "Following reconstruction, the upgraded styrene shop was launched at increased capacity and produced its first output." },
        ],
        infographic: [],
      },
      {
        id: "period-4",
        title: "2011–2019",
        subtitle: "A new stage in the company's development",
        image: "/images/history/period-2019-present.jpeg",
        timeline: [
          { year: "December 2011", description: "Plastik passed a quality management system recertification audit for compliance with ISO 9001:2008 and its Russian counterpart GOST R ISO 9001-2008." },
          { year: "December 2013", description: "The ownership of OJSC Plastik changed, with a group of private investors acquiring 100% of the company's shares." },
          { year: "January 2014", description: "Trading House Plastik was established." },
          { year: "March 2014", description: "Uzlovaya Structural Components Plant joined Plastik Group, producing expanded-polystyrene wall panels and floor slabs, as well as reinforcement frames using Plastbau-3 technology." },
          { year: "December 2014", description: "OJSC Plastik passed a QMS recertification audit for compliance with ISO 9001-2008 and GOST ISO 9001-2011. The relevant certificates were issued by ACADEMY-CERT and INTERCERTIFICA-TÜV." },
          { year: "June 2019", description: "OJSC Plastik changed its legal name to JSC Plastik." },
        ],
        infographic: [],
      },
      {
        id: "period-5",
        title: "2019–2024",
        subtitle: "Product portfolio development across Russia and the CIS",
        image: "/images/history/period-1974-1992.png",
        timeline: [
          { year: "2019", description: "FNM Alkar launched geotextile production at JSC Plastik’s industrial site, continuing the development of the industrial park and the placement of new manufacturing facilities." },
          { year: "2020", description: "JSC Plastik continued supplying ABS plastics and polystyrenes to customers in Russia and neighboring CIS markets while maintaining logistics during the period of restrictions." },
          { year: "2021", description: "The Plastik Industrial Park development project was presented: a 50-hectare site, 67,000 m² of industrial infrastructure, proprietary utilities and railway logistics." },
          { year: "2021–2024", description: "The styrenics portfolio was expanded: alongside ABS plastics and polystyrenes, the company developed styrene-acrylic dispersions for coatings and construction chemicals." },
          { year: "2024", description: "JSC Plastik celebrated its 65th anniversary and reaffirmed its status as one of Russia's largest manufacturers of ABS plastics and suspension polystyrene." },
        ],
        infographic: [],
      },
      {
        id: "period-6",
        title: "2024–2026",
        subtitle: "Group development and new production projects",
        image: "/images/history/period-2024-2026.png",
        timeline: [
          { year: "2024", description: "JSC Plastik celebrated its 65th anniversary and reaffirmed its status as one of Russia's largest manufacturers of ABS plastics and suspension polystyrene." },
          { year: "2024", description: "Finndisp LLC joined the JSC Plastik Group." },
          { year: "2025", description: "The first specialists graduated under the Professionalitet program. Together with educational institutions in Uzlovaya, the enterprise established its own training system for chemical production personnel." },
          { year: "2026 · in progress", description: "A project for a new GPPS polystyrene production shop is under development." },
        ],
        infographic: [],
      },
    ],
  },
}
