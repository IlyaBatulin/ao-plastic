/** Ключи → homePage.catalog.absPage.* в locales */
export const ABS_PAGE_KEYS = {
  sectionTitle: "homePage.catalog.absPage.sectionTitle",
  sectionIntro: "homePage.catalog.absPage.sectionIntro",
  injectionTitle: "homePage.catalog.absPage.injection.title",
  injectionIntro: "homePage.catalog.absPage.injection.intro",
  injectionPropertiesHeading: "homePage.catalog.absPage.injection.propertiesHeading",
  injectionApplicationsHeading: "homePage.catalog.absPage.injection.applicationsHeading",
  injectionFooter: "homePage.catalog.absPage.injection.footer",
  injectionAdvantages: "homePage.catalog.absPage.injection.advantages",
  injectionApplications: "homePage.catalog.absPage.injection.applications",
  extrusionTitle: "homePage.catalog.absPage.extrusion.title",
  extrusionIntro: "homePage.catalog.absPage.extrusion.intro",
  extrusionApplicationsHeading: "homePage.catalog.absPage.extrusion.applicationsHeading",
  extrusionDetails: "homePage.catalog.absPage.extrusion.details",
  extrusionApplications: "homePage.catalog.absPage.extrusion.applications",
} as const

export type AbsAdvantageItem = { title: string; desc: string }
