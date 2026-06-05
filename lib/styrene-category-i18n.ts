import type { NormRow } from "@/lib/kors-bentol-en"

export const STYRENE_NORM_ROWS_RU: NormRow[] = [
  {
    n: "1",
    name: "Внешний вид",
    unit: "—",
    norm: "Прозрачная однородная жидкость без механических примесей и нерастворенной влаги",
  },
  { n: "2", name: "Массовая доля стирола, не менее", unit: "%", norm: "99,80" },
  { n: "3", name: "Массовая доля дивинилбензола, не более", unit: "%", norm: "0,0005" },
  {
    n: "4",
    name: "Массовая доля карбонильных соединений в пересчете на бензальдегид, не более",
    unit: "%",
    norm: "0,01",
  },
  {
    n: "5",
    name: "Массовая доля перекисных соединений в пересчете на активный кислород, не более",
    unit: "%",
    norm: "0,0005",
  },
  { n: "6", name: "Массовая доля полимера, не более", unit: "%", norm: "0,001" },
  { n: "7", name: "Массовая доля фенилацетилена, не более", unit: "%", norm: "0,01" },
  {
    n: "8",
    name: "Массовая доля стабилизатора пара-трет-бутилпирокатехина, в пределах",
    unit: "%",
    norm: "0,0005-0,0010",
  },
  {
    n: "9",
    name: "Цветность по платиново-кобальтовой шкале, не более",
    unit: "ед. Хазена",
    norm: "10",
  },
]

export const STYRENE_NORM_ROWS_EN: NormRow[] = [
  {
    n: "1",
    name: "Appearance",
    unit: "—",
    norm: "Clear homogeneous liquid free of mechanical impurities and undissolved moisture",
  },
  { n: "2", name: "Styrene mass fraction, min.", unit: "%", norm: "99.80" },
  { n: "3", name: "Divinylbenzene mass fraction, max.", unit: "%", norm: "0.0005" },
  {
    n: "4",
    name: "Carbonyl compounds mass fraction (as benzaldehyde), max.",
    unit: "%",
    norm: "0.01",
  },
  {
    n: "5",
    name: "Peroxide compounds mass fraction (as active oxygen), max.",
    unit: "%",
    norm: "0.0005",
  },
  { n: "6", name: "Polymer mass fraction, max.", unit: "%", norm: "0.001" },
  { n: "7", name: "Phenylacetylene mass fraction, max.", unit: "%", norm: "0.01" },
  {
    n: "8",
    name: "p-tert-Butylpyrocatechol stabilizer mass fraction, range",
    unit: "%",
    norm: "0.0005–0.0010",
  },
  {
    n: "9",
    name: "Colour (platinum-cobalt scale), max.",
    unit: "Hazen units",
    norm: "10",
  },
]

export function getStyreneNormRows(lang: "ru" | "en"): NormRow[] {
  return lang === "en" ? STYRENE_NORM_ROWS_EN : STYRENE_NORM_ROWS_RU
}

export const STYRENE_OKP_LABEL = "ОКП 24 14930120"

/** Ключи → homePage.catalog.styrenePage.* в locales */
export const STYRENE_PAGE_KEYS = {
  title: "homePage.catalog.styrenePage.title",
  lead: "homePage.catalog.styrenePage.lead",
  imageAlt: "homePage.catalog.styrenePage.imageAlt",
  p1: "homePage.catalog.styrenePage.p1",
  p2: "homePage.catalog.styrenePage.p2",
  gradeTitle: "homePage.catalog.styrenePage.gradeTitle",
  gradeGost: "homePage.catalog.styrenePage.gradeGost",
  gradeNote: "homePage.catalog.styrenePage.gradeNote",
  normTitle: "homePage.catalog.styrenePage.normTitle",
  contactUs: "homePage.catalog.korsPage.contactUs",
} as const
