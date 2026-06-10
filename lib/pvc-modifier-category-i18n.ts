export type PvcModifierSpecRow = {
  name: string
  grade20: string
  grade28: string
  grade15: string
  method: string
  /** Строка-заголовок секции (например «Справочные показатели») */
  isSectionHeader?: boolean
}

export const PVC_MODIFIER_SPEC_ROWS_RU: PvcModifierSpecRow[] = [
  {
    name: "Внешний вид",
    grade20: "Ф- флейки (хлопья), П- порошок",
    grade28: "",
    grade15: "",
    method: "Визуально",
  },
  {
    name: "Показатель текучести расплава, (при 220 °С/10 кгс), г/10мин, не менее/в пределах",
    grade20: "5,0-12,0",
    grade28: "4,0-7,0",
    grade15: "17,0",
    method: "Пункт 7.4 ТУ и ГОСТ 11645-73",
  },
  {
    name: "Ударная вязкость по Изоду, кгс·см/см² (кДж/м²), не менее",
    grade20: "24,5 (24,0)",
    grade28: "32,6 (32,0)",
    grade15: "13,0 (12,8)",
    method: "Пункт 7.5 ТУ и ГОСТ 19109-84",
  },
  {
    name: "Температура размягчения по Вика (50 Н), °C, не менее",
    grade20: "97",
    grade28: "96",
    grade15: "100",
    method: "Пункт 7.6 ТУ и ГОСТ 15088-2014",
  },
  {
    name: "Массовая доля влаги и летучих, %, не более",
    grade20: "0,3",
    grade28: "0,3",
    grade15: "0,3",
    method: "Пункт 7.7 ТУ",
  },
  { name: "Справочные показатели:", grade20: "", grade28: "", grade15: "", method: "", isSectionHeader: true },
  {
    name: "Плотность, кг/м³",
    grade20: "1040",
    grade28: "1040",
    grade15: "1040",
    method: "ГОСТ 15139-69",
  },
  {
    name: "Насыпная плотность, г/см³, в пределах",
    grade20: "0,29-0,38",
    grade28: "0,29-0,38",
    grade15: "0,29-0,38",
    method: "ГОСТ 11035.1-93",
  },
  {
    name: "Модуль упругости при растяжении, МПа, в пределах",
    grade20: "1800-2200",
    grade28: "1700-2200",
    grade15: "1900-2000",
    method: "ГОСТ 9550-81",
  },
  {
    name: "Твердость по Роквеллу (шкала R), в пределах",
    grade20: "100-110",
    grade28: "95-100",
    grade15: "100-110",
    method: "ГОСТ 24622-91",
  },
  {
    name: "Температура изгиба под нагрузкой, °С (1,8 МПа), не менее",
    grade20: "96",
    grade28: "95",
    grade15: "97",
    method: "ГОСТ 432657-2014",
  },
  {
    name: "Ударная вязкость по Изоду с надрезом (при минус 30°С), кДж/м², не менее",
    grade20: "12",
    grade28: "10",
    grade15: "7",
    method: "ГОСТ 19109-84",
  },
  {
    name: "Относительное удлинение при разрыве, %, не менее",
    grade20: "22",
    grade28: "25",
    grade15: "18",
    method: "ГОСТ 11262-80",
  },
]

export const PVC_MODIFIER_SPEC_ROWS_EN: PvcModifierSpecRow[] = [
  {
    name: "Appearance",
    grade20: "F — flakes, P — powder",
    grade28: "",
    grade15: "",
    method: "Visual",
  },
  {
    name: "Melt flow index (at 220 °C/10 kg), g/10 min, min./within range",
    grade20: "5.0–12.0",
    grade28: "4.0–7.0",
    grade15: "17.0",
    method: "Clause 7.4 TU and GOST 11645-73",
  },
  {
    name: "Izod impact strength, kg·cm/cm² (kJ/m²), min.",
    grade20: "24.5 (24.0)",
    grade28: "32.6 (32.0)",
    grade15: "13.0 (12.8)",
    method: "Clause 7.5 TU and GOST 19109-84",
  },
  {
    name: "Vicat softening temperature (50 N), °C, min.",
    grade20: "97",
    grade28: "96",
    grade15: "100",
    method: "Clause 7.6 TU and GOST 15088-2014",
  },
  {
    name: "Moisture and volatiles mass fraction, %, max.",
    grade20: "0.3",
    grade28: "0.3",
    grade15: "0.3",
    method: "Clause 7.7 TU",
  },
  { name: "Reference indicators:", grade20: "", grade28: "", grade15: "", method: "", isSectionHeader: true },
  {
    name: "Density, kg/m³",
    grade20: "1040",
    grade28: "1040",
    grade15: "1040",
    method: "GOST 15139-69",
  },
  {
    name: "Bulk density, g/cm³, within range",
    grade20: "0.29–0.38",
    grade28: "0.29–0.38",
    grade15: "0.29–0.38",
    method: "GOST 11035.1-93",
  },
  {
    name: "Tensile modulus, MPa, within range",
    grade20: "1800–2200",
    grade28: "1700–2200",
    grade15: "1900–2000",
    method: "GOST 9550-81",
  },
  {
    name: "Rockwell hardness (scale R), within range",
    grade20: "100–110",
    grade28: "95–100",
    grade15: "100–110",
    method: "GOST 24622-91",
  },
  {
    name: "Heat deflection temperature (1.8 MPa), °C, min.",
    grade20: "96",
    grade28: "95",
    grade15: "97",
    method: "GOST 432657-2014",
  },
  {
    name: "Notched Izod impact strength (at −30 °C), kJ/m², min.",
    grade20: "12",
    grade28: "10",
    grade15: "7",
    method: "GOST 19109-84",
  },
  {
    name: "Elongation at break, %, min.",
    grade20: "22",
    grade28: "25",
    grade15: "18",
    method: "GOST 11262-80",
  },
]

export function getPvcModifierSpecRows(lang: "ru" | "en"): PvcModifierSpecRow[] {
  return lang === "en" ? PVC_MODIFIER_SPEC_ROWS_EN : PVC_MODIFIER_SPEC_ROWS_RU
}

/** Ключи → homePage.catalog.pvcModifierPage.* в locales */
export const PVC_MODIFIER_PAGE_KEYS = {
  title: "homePage.catalog.pvcModifierPage.title",
  subtitle: "homePage.catalog.pvcModifierPage.subtitle",
  imageAlt: "homePage.catalog.pvcModifierPage.imageAlt",
  profilesImageAlt: "homePage.catalog.pvcModifierPage.profilesImageAlt",
  p1: "homePage.catalog.pvcModifierPage.p1",
  p2: "homePage.catalog.pvcModifierPage.p2",
  applicationsTitle: "homePage.catalog.pvcModifierPage.applicationsTitle",
  applications: "homePage.catalog.pvcModifierPage.applications",
  normTitle: "homePage.catalog.pvcModifierPage.normTitle",
  colIndicator: "homePage.catalog.pvcModifierPage.colIndicator",
  colNormGrades: "homePage.catalog.pvcModifierPage.colNormGrades",
  colGrade20: "homePage.catalog.pvcModifierPage.colGrade20",
  colGrade28: "homePage.catalog.pvcModifierPage.colGrade28",
  colGrade15: "homePage.catalog.pvcModifierPage.colGrade15",
  colMethod: "homePage.catalog.pvcModifierPage.colMethod",
  brochureLabel: "homePage.catalog.pvcModifierPage.brochureLabel",
  articleTitle: "homePage.catalog.pvcModifierPage.articleTitle",
  articleLead: "homePage.catalog.pvcModifierPage.articleLead",
  articleQuote: "homePage.catalog.pvcModifierPage.articleQuote",
  articleResultsTitle: "homePage.catalog.pvcModifierPage.articleResultsTitle",
  articleResults: "homePage.catalog.pvcModifierPage.articleResults",
  articleLink: "homePage.catalog.pvcModifierPage.articleLink",
  statsTitle: "homePage.catalog.pvcModifierPage.statsTitle",
  stat1Label: "homePage.catalog.pvcModifierPage.stat1Label",
  stat2Label: "homePage.catalog.pvcModifierPage.stat2Label",
  stat3Label: "homePage.catalog.pvcModifierPage.stat3Label",
  stat4Label: "homePage.catalog.pvcModifierPage.stat4Label",
  contactUs: "homePage.catalog.korsPage.contactUs",
} as const

export const PVC_MODIFIER_BROCHURE_PATH = "/docs/broshura-abs-modifikatory-pvh.pdf"
export const PVC_MODIFIER_MATERIAL_IMAGE = "/prevyu/rossyp-plastika/rossyp-1.jpeg"
export const PVC_MODIFIER_PROFILES_IMAGE = "/images/pvc-modifier-profiles.png"
export const PVC_MODIFIER_ARTICLE_PATH =
  "https://oaoplastic.ru/wp-content/uploads/2017/04/Barsamyan_statya_Plastiks.pdf"
