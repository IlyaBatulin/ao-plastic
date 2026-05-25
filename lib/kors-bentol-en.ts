import {
  BENTOL_NORM_ROWS,
  BENTOL_TU_LABEL,
  KORS_NORM_ROWS,
  KORS_TU_LABEL,
} from "@/lib/kors-bentol-norms"

export type NormRow = { n: string; name: string; unit: string; norm: string }

const KORS_NORM_ROWS_EN: NormRow[] = [
  { n: "1", name: "Appearance", unit: "—", norm: "Viscous liquid from light yellow to dark brown" },
  { n: "2", name: "Density at 20 °C, min.", unit: "g/cm³", norm: "0.940" },
  { n: "3", name: "Dynamic viscosity at 80 °C, max.", unit: "mPa·s (cP)", norm: "10" },
  { n: "4", name: "Styrene mass fraction, max.", unit: "%", norm: "30.0" },
]

const BENTOL_NORM_ROWS_EN: NormRow[] = [
  {
    n: "1",
    name: "Appearance",
    unit: "—",
    norm: "Clear colorless or light yellow liquid free of mechanical impurities",
  },
  { n: "2", name: "Density at 20 °C", unit: "g/cm³", norm: "0.867–0.873" },
  { n: "3", name: "Benzene mass fraction", unit: "%", norm: "20.0–50.0" },
  { n: "4", name: "Toluene mass fraction", unit: "%", norm: "50.0–80.0" },
  { n: "5", name: "Ethylbenzene and styrene mass fraction, max.", unit: "%", norm: "6.0" },
]

export function getKorsNormRows(lang: "ru" | "en"): NormRow[] {
  return lang === "en" ? KORS_NORM_ROWS_EN : KORS_NORM_ROWS
}

export function getBentolNormRows(lang: "ru" | "en"): NormRow[] {
  return lang === "en" ? BENTOL_NORM_ROWS_EN : BENTOL_NORM_ROWS
}

export function getKorsTuLabel(lang: "ru" | "en"): string {
  return KORS_TU_LABEL
}

export function getBentolTuLabel(lang: "ru" | "en"): string {
  return BENTOL_TU_LABEL
}

/** Ключи → homePage.catalog.korsPage.* в locales */
export const KORS_PAGE_KEYS = {
  corsTitle: "homePage.catalog.korsPage.corsTitle",
  corsLead: "homePage.catalog.korsPage.corsLead",
  corsAlt: "homePage.catalog.korsPage.corsAlt",
  corsP1: "homePage.catalog.korsPage.corsP1",
  corsP2: "homePage.catalog.korsPage.corsP2",
  corsP3: "homePage.catalog.korsPage.corsP3",
  corsP4: "homePage.catalog.korsPage.corsP4",
  corsNormTitle: "homePage.catalog.korsPage.corsNormTitle",
  bentolTitle: "homePage.catalog.korsPage.bentolTitle",
  bentolLead: "homePage.catalog.korsPage.bentolLead",
  bentolAlt: "homePage.catalog.korsPage.bentolAlt",
  bentolP1: "homePage.catalog.korsPage.bentolP1",
  bentolP2: "homePage.catalog.korsPage.bentolP2",
  bentolP3: "homePage.catalog.korsPage.bentolP3",
  bentolP4: "homePage.catalog.korsPage.bentolP4",
  bentolNormTitle: "homePage.catalog.korsPage.bentolNormTitle",
  contactUs: "homePage.catalog.korsPage.contactUs",
  normColNo: "homePage.catalog.korsPage.normColNo",
  normColName: "homePage.catalog.korsPage.normColName",
  normColUnit: "homePage.catalog.korsPage.normColUnit",
  normColValue: "homePage.catalog.korsPage.normColValue",
} as const
