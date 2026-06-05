export interface SafetyDocument {
  title: string
  file: string
  fileType: string
  size?: number
}

export interface SafetyDocumentSection {
  title: string
  intro?: string
  docs: SafetyDocument[]
}

// Источник: http://oaoplastic.ru/about/ohrana-truda-promyshlennaya-bezopasno
export const safetyDocumentSections: SafetyDocumentSection[] = [
  {
    title: "Политика АО «Пластик» в области промышленной безопасности и охраны труда",
    docs: [
      {
        title: "Политика АО «Пластик» в области промышленной безопасности и охраны труда",
        file: "/documents/safety/politika-ao-plastik-v-oblasti-promyshlennoy-bezopasnosti-i-ohrany-trud.pdf",
        fileType: "PDF",
        size: 263110,
      },
    ],
  },
  {
    title: "Информация по результатам специальной оценки условий труда",
    intro:
      "В соответствии с п. 6 ст. 15 Федерального закона от 28.12.2013 N 426-ФЗ «О специальной оценке условий труда»",
    docs: [
      {
        title: "Сводная ведомость результатов проведения специальной оценки условия труда 2020 год",
        file: "/documents/safety/svodnaya-vedomost-rezultatov-provedeniya-specialnoy-ocenki-usloviya-tr.pdf",
        fileType: "PDF",
        size: 422691,
      },
      {
        title: "Сводная ведомость результатов проведения специальной оценки условия труда 2021 год",
        file: "/documents/safety/svodnaya-vedomost-rezultatov-provedeniya-specialnoy-ocenki-usloviya-tr-2.pdf",
        fileType: "PDF",
        size: 148799,
      },
      {
        title: "Сводная ведомость результатов проведения специальной оценки условия труда 2022 год",
        file: "/documents/safety/svodnaya-vedomost-rezultatov-provedeniya-specialnoy-ocenki-usloviya-tr-3.pdf",
        fileType: "PDF",
        size: 107415,
      },
      {
        title: "Сводная ведомость результатов проведения специальной оценки условия труда 2022 (2) год",
        file: "/documents/safety/svodnaya-vedomost-rezultatov-provedeniya-specialnoy-ocenki-usloviya-tr-4.pdf",
        fileType: "PDF",
        size: 112305,
      },
      {
        title: "Сводная ведомость результатов проведения специальной оценки условия труда 2023 год",
        file: "/documents/safety/svodnaya-vedomost-rezultatov-provedeniya-specialnoy-ocenki-usloviya-tr-5.pdf",
        fileType: "PDF",
        size: 104616,
      },
      {
        title: "Сводная ведомость результатов проведения специальной оценки условия труда 2023 (2) год",
        file: "/documents/safety/svodnaya-vedomost-rezultatov-provedeniya-specialnoy-ocenki-usloviya-tr-6.pdf",
        fileType: "PDF",
        size: 107051,
      },
      {
        title: "Сводная ведомость результатов проведения специальной оценки условия труда 2023 (3) год",
        file: "/documents/safety/svodnaya-vedomost-rezultatov-provedeniya-specialnoy-ocenki-usloviya-tr-7.pdf",
        fileType: "PDF",
        size: 114478,
      },
      {
        title: "Сводная ведомость результатов проведения специальной оценки условия труда 2024 год",
        file: "/documents/safety/svodnaya-vedomost-rezultatov-provedeniya-specialnoy-ocenki-usloviya-tr-8.pdf",
        fileType: "PDF",
        size: 107449,
      },
      {
        title: "Сводная ведомость результатов проведения специальной оценки условия труда 2025 год",
        file: "/documents/safety/svodnaya-vedomost-rezultatov-provedeniya-specialnoy-ocenki-usloviya-tr-9.pdf",
        fileType: "PDF",
        size: 383946,
      },
      {
        title: "Сводная ведомость результатов проведения специальной оценки условия труда 26.09.2025 года",
        file: "/documents/safety/svodnaya-vedomost-rezultatov-provedeniya-specialnoy-ocenki-usloviya-tr-10.pdf",
        fileType: "PDF",
        size: 384333,
      },
      {
        title: "Сводная ведомость результатов проведения специальной оценки условия труда 26.09.2025 года (1)",
        file: "/documents/safety/svodnaya-vedomost-rezultatov-provedeniya-specialnoy-ocenki-usloviya-tr-11.pdf",
        fileType: "PDF",
        size: 384327,
      },
    ],
  },
  {
    title: "Экологическая политика и сертификаты",
    docs: [
      {
        title: "Экологическая политика АО «Пластик»",
        file: "/documents/safety/ekologicheskaya-politika-ao-plastik.jpg",
        fileType: "JPG",
        size: 220791,
      },
      {
        title: "Сертификат системы экологического менеджмента ГОСТ Р ИСО 14001-2016 (2023)",
        file: "/documents/safety/sertifikat-sistemy-ekologicheskogo-menedzhmenta-gost-r-iso-14001-2016-.pdf",
        fileType: "PDF",
        size: 870389,
      },
      {
        title: "Сертификат системы менеджмента качества (действителен до 2026 г.)",
        file: "/docs/quality/sertifikat-smk-2026.jpg",
        fileType: "JPG",
      },
      {
        title: "Сертификат соответствия ISO (2020)",
        file: "/docs/quality/iso-2020.jpg",
        fileType: "JPG",
      },
    ],
  },
]

export const safetyPageContent = {
  ru: {
    heroTitle: "Охрана труда и экология",
    heroSubtitle:
      "АО «Пластик» считает экологическую безопасность, охрану здоровья человека и окружающей среды неотъемлемой частью своей деятельности и одним из приоритетов.",
    cards: [
      { title: "Безопасность труда", description: "Соблюдение всех норм охраны труда" },
      { title: "Экология", description: "Минимизация воздействия на окружающую среду" },
      { title: "Обучение", description: "Регулярное обучение персонала" },
    ],
    policyTitle: "Экологическая политика АО «Пластик»",
    policyIntro: [
      "АО «Пластик» — химическое предприятие, производящее стирол, АБС-пластик, полистирол, сепараторы, пластмассы в первичных формах и из вторично переработанных пластмасс в изделия. Основная цель предприятия — непрерывный рост капитализации, максимальная эффективность бизнеса и лидерство в химическом производстве при обеспечении экологической безопасности.",
      "АО «Пластик» считает экологическую безопасность, охрану здоровья человека и окружающей среды неотъемлемым элементом своей деятельности и приоритетом, в связи с чем настоящая Экологическая политика является составной частью миссии и стратегии развития АО «Пластик».",
    ],
    goalsTitle: "Основные цели Экологической политики АО «Пластик»",
    goals: [
      "Внедрение передовых научных разработок и технологий для повышения полезного использования сырья с максимальным выходом продукции.",
      "Приоритет запланированных и реализуемых действий и мероприятий по предупреждению воздействия на окружающую среду перед мерами по ликвидации последствий такого воздействия.",
      "Достижение уровня экологической безопасности, соответствующего лучшим показателям ведущих нефтехимических компаний.",
      "Снижение выбросов и сбросов загрязняющих веществ, уменьшение объёмов отходов при росте объёмов производства за счёт внедрения новых экологически безопасных технологий, оборудования, материалов и совершенствования автоматизации технологических процессов.",
      "Повышение экологической безопасности производственных объектов и работ, снижение негативного воздействия на окружающую среду за счёт повышения надёжности технологического оборудования, обеспечения его безопасной и безаварийной эксплуатации.",
      "Повышение эффективности производственного контроля и экологического мониторинга на основе внедрения современных информационных технологий и методов технической диагностики.",
      "Информирование и ведение активного диалога с заинтересованными сторонами, общественностью и населением по вопросам деятельности предприятия в области экологической безопасности.",
      "Соблюдение природоохранного законодательства Российской Федерации, развитие сотрудничества с государственными и региональными законодательными и исполнительными органами в области охраны окружающей среды, а также расширение международного сотрудничества в создании экологически чистых, эффективных и экономически выгодных технологий и оборудования.",
    ],
    commitmentsTitle: "Обязательства АО «Пластик»",
    commitmentsIntro:
      "Для достижения указанных целей АО «Пластик» принимает на себя следующие обязательства:",
    commitments: [
      "Принимать и выполнять решения с обязательным учётом экологических аспектов планируемой деятельности, выпускаемой продукции и оказываемых услуг.",
      "Оценивать экологические аспекты, последовательно разрабатывать и внедрять мероприятия по их снижению и компенсации причинённого экологическими аспектами ущерба.",
      "Соблюдать применимые законодательные требования и иные требования, которые предприятие само определило в отношении управления экологическими аспектами своей деятельности.",
      "Планировать и реализовывать мероприятия по совершенствованию системы экологического менеджмента, снижению воздействия на окружающую среду, предупреждению аварий и смягчению их последствий.",
      "Модернизировать действующее технологическое оборудование и совершенствовать производственные технологические схемы с учётом ресурсосберегающих и малоотходных технологий.",
      "Обеспечивать вовлечённость всех работников в деятельность по экологическому менеджменту путём систематического обучения, повышения компетентности и мотивации.",
      "Требовать от подрядчиков, выполняющих работы от имени АО «Пластик», соблюдения законодательных норм и внутренних требований АО «Пластик».",
    ],
    policyClosing:
      "Реализация целей настоящей политики обеспечивается персональной ответственностью руководства и каждого работника АО «Пластик».",
    documentsTitle: "Документы",
    documentsIntro:
      "Политики, сводные ведомости специальной оценки условий труда, экологическая политика и сертификаты.",
    download: "Скачать",
  },
  en: {
    heroTitle: "Occupational Safety and Environment",
    heroSubtitle:
      "JSC Plastik considers environmental safety, protection of human health and the environment an integral part of its activities and a key priority.",
    cards: [
      { title: "Occupational Safety", description: "Compliance with all occupational health and safety standards" },
      { title: "Environment", description: "Minimizing environmental impact" },
      { title: "Training", description: "Regular staff training" },
    ],
    policyTitle: "Environmental Policy of JSC Plastik",
    policyIntro: [
      "JSC Plastik is a chemical enterprise producing styrene, ABS plastics, polystyrene, separators, plastics in primary forms and products from recycled plastics. The company's main objectives are continuous capitalization growth, maximum business efficiency and leadership in chemical production while ensuring environmental safety.",
      "JSC Plastik considers environmental safety, protection of human health and the environment an integral element of its activities and a priority; this Environmental Policy is therefore part of the mission and development strategy of JSC Plastik.",
    ],
    goalsTitle: "Main Objectives of the Environmental Policy of JSC Plastik",
    goals: [
      "Implementing advanced scientific developments and technologies to increase efficient use of raw materials with maximum product yield.",
      "Prioritizing planned and implemented preventive measures regarding environmental impact over measures to remediate such impact.",
      "Achieving a level of environmental safety comparable to the best indicators of leading petrochemical companies.",
      "Reducing emissions and discharges of pollutants and waste volumes as production grows through new environmentally safe technologies, equipment and materials and improved process automation.",
      "Improving environmental safety of production facilities and operations and reducing negative environmental impact by increasing reliability of process equipment and ensuring its safe, accident-free operation.",
      "Improving effectiveness of production control and environmental monitoring through modern information technologies and technical diagnostics.",
      "Informing and maintaining active dialogue with stakeholders, the public and local communities on the company's environmental safety activities.",
      "Complying with environmental legislation of the Russian Federation, developing cooperation with federal and regional legislative and executive authorities on environmental protection, and expanding international cooperation in environmentally clean, efficient and economically viable technologies and equipment.",
    ],
    commitmentsTitle: "Commitments of JSC Plastik",
    commitmentsIntro:
      "To achieve the stated objectives, JSC Plastik undertakes the following commitments:",
    commitments: [
      "Make and implement decisions with mandatory consideration of environmental aspects of planned activities, products and services.",
      "Assess environmental aspects and systematically develop and implement measures to reduce them and compensate damage caused by environmental aspects.",
      "Comply with applicable legal requirements and other requirements the company has defined regarding management of environmental aspects of its activities.",
      "Plan and implement measures to improve the environmental management system, reduce environmental impact, prevent accidents and mitigate their consequences.",
      "Upgrade existing process equipment and improve production schemes using resource-saving and low-waste technologies.",
      "Ensure involvement of all employees in environmental management through systematic training, competence development and motivation.",
      "Require contractors performing work on behalf of JSC Plastik to comply with legal norms and internal requirements of JSC Plastik.",
    ],
    policyClosing:
      "Achievement of the objectives of this policy is ensured by the personal responsibility of management and every employee of JSC Plastik.",
    documentsTitle: "Documents",
    documentsIntro:
      "Policies, special assessment of working conditions reports, environmental policy and certificates.",
    download: "Download",
  },
}
