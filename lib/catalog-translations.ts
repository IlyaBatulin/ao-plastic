/**
 * Функция для получения переведенного названия категории или подкатегории
 * Используется в серверных компонентах, где нет доступа к useLanguage
 */
export function getCategoryName(categoryId: string, lang: "ru" | "en" = "ru"): string {
  const translations: Record<string, { ru: string; en: string }> = {
    // Категории
    styrene: { ru: "Стирол", en: "Styrene" },
    abs: { ru: "АБС-пластики", en: "ABS Plastics" },
    polystyrene: { ru: "Полистирол", en: "Polystyrene" },
    dispersion: { ru: "Акриловые и стирол-акриловые дисперсии", en: "Acrylic and Styrene-Acrylic Dispersions" },
    "machine-parts": { ru: "Детали машиностроения", en: "Machine Parts" },
    hoztovary: { ru: "Товары народного потребления", en: "Consumer Goods" },
    canisters: { ru: "Канистры", en: "Canisters" },
    boxes: { ru: "Ящики", en: "Boxes" },
    "pvc-modifier": { ru: "Модификатор для композиций ПВХ", en: "PVC Composition Modifier" },
    kors: { ru: "КОРС и Бентол", en: "CORS and Bentol" },
    "custom-abs": { ru: "Изготовление изделий из АБС пластика на заказ", en: "Custom ABS Plastic Products Manufacturing" },
    
    // Подкатегории
    "abs-injection": { ru: "Литьевые марки", en: "Injection Grades" },
    "abs-extrusion": { ru: "Экструзионные марки", en: "Extrusion Grades" },
    "abs-custom": { ru: "Изготовление изделий из АБС пластика на заказ", en: "Custom ABS Plastic Products Manufacturing" },
    "ps-psv-s": { ru: "Полистирол вспенивающийся «УПЕКС»", en: "UPEX Expandable Polystyrene" },
    "ps-psv-l": { ru: "Полистирол вспенивающийся ПСВ-Л", en: "Expandable Polystyrene EPS-L" },
    "ps-pse": { ru: "Полистирол ПСЭ-1", en: "Polystyrene PSE-1" },
    "dispersion-coatings": { ru: "ЛКМ и строительные материалы", en: "Coatings and Construction Materials" },
    "dispersion-nonwovens": { ru: "Нетканые материалы", en: "Nonwoven Materials" },
    "dispersion-adhesives": { ru: "Адгезивы", en: "Adhesives" },
    "extrusion-parts": { ru: "Экструзионные изделия", en: "Extrusion Products" },
    "parts-extrusion": { ru: "Экструзионные изделия", en: "Extrusion Products" },
    "injection-parts": { ru: "Литьевые изделия", en: "Injection Products" },
    "vedra-tazy": { ru: "Ведра и тазы", en: "Buckets and Basins" },
    uborka: { ru: "Уборочный инвентарь", en: "Cleaning Supplies" },
    steklo: { ru: "Стеклоочистители", en: "Glass Cleaners" },
    sanuzel: { ru: "Для санузла", en: "Bathroom Accessories" },
    kuhnya: { ru: "Кухонные принадлежности", en: "Kitchenware" },
    veshalki: { ru: "Вешалки и плечики", en: "Hangers and Clothes Hangers" },
    otdyh: { ru: "Товары для отдыха", en: "Leisure Products" },
  }

  const translation = translations[categoryId]
  if (translation) {
    return translation[lang]
  }

  // Если перевод не найден, возвращаем ID
  return categoryId
}

const SUBCATEGORY_DESCRIPTIONS: Record<string, { ru: string; en: string }> = {
  "abs-injection": {
    ru: "Литьевые марки АБС-пластика для термопластавтоматов",
    en: "ABS grades for injection molding",
  },
  "abs-extrusion": {
    ru: "Экструзионные марки АБС-пластика для листов и профилей",
    en: "ABS grades for sheet and profile extrusion",
  },
  "abs-custom": {
    ru: "Изготовление изделий из АБС-пластика по индивидуальным заказам",
    en: "Manufacturing of ABS parts to individual orders",
  },
  "ps-psv-s": {
    ru: "Самозатухающий вспенивающийся полистирол «УПЕКС» марок 1–6. Марки отличаются размером гранул и предназначены для теплоизоляции, звукоизоляции, защитной упаковки и формованных изделий.",
    en: "Self-extinguishing UPEX expandable polystyrene in grades 1–6. The grades differ by bead size and are intended for thermal insulation, sound insulation, protective packaging and moulded products.",
  },
  "ps-psv-l": {
    ru: "Литейный вспенивающийся полистирол ПСВ-Л для изготовления газифицируемых моделей. При формовании материал точно воспроизводит геометрию будущей отливки и удаляется при заливке металла.",
    en: "Casting-grade EPS-L expandable polystyrene for expendable patterns. During moulding, the material accurately reproduces the future casting geometry and is displaced when molten metal is poured.",
  },
  "ps-pse": {
    ru: "Полистирол эмульсионный общего назначения",
    en: "General-purpose emulsion polystyrene",
  },
  "dispersion-coatings": {
    ru: "Дисперсии для водно-дисперсионных красок, лаков, грунтовок, шпатлёвок и строительных материалов",
    en: "Dispersions for water-based paints, varnishes, primers, fillers and construction materials",
  },
  "dispersion-nonwovens": {
    ru: "Дисперсии для синтетических волокон, геосеток, стеклохолста и кровельных материалов",
    en: "Dispersions for synthetic fibres, geogrids, glass fibre mats and roofing materials",
  },
  "dispersion-adhesives": {
    ru: "Полимерные дисперсии для промышленного применения в составе клеевых материалов",
    en: "Polymer dispersions for industrial adhesive formulations",
  },
  "extrusion-parts": {
    ru: "Профили, трубы, уплотнители",
    en: "Profiles, tubes, seals",
  },
  "injection-parts": {
    ru: "Облицовочные панели, вставки, защитные детали",
    en: "Trim panels, inserts, protective parts",
  },
  "vedra-tazy": {
    ru: "Прочные пластиковые вёдра и тазы различного объёма",
    en: "Durable plastic buckets and basins in various volumes",
  },
  uborka: {
    ru: "Совки, щётки и наборы для уборки",
    en: "Dustpans, brushes and cleaning sets",
  },
  steklo: {
    ru: "Сгоны для окон и зеркал",
    en: "Squeegees for windows and mirrors",
  },
  sanuzel: {
    ru: "Ёршики, мыльницы и аксессуары для санузла",
    en: "Toilet brush sets, soap dishes and accessories",
  },
  kuhnya: {
    ru: "Воронки, кружки, дуршлаги и другие кухонные принадлежности",
    en: "Funnels, mugs, strainers and other kitchen accessories",
  },
  veshalki: {
    ru: "Вешалки для одежды различных размеров",
    en: "Clothes hangers in various sizes",
  },
  otdyh: {
    ru: "Товары для пикника, барбекю и отдыха на природе",
    en: "Picnic, barbecue and outdoor leisure products",
  },
  canisters: {
    ru: "Канистры из ПНД для хранения жидкостей",
    en: "HDPE canisters for storing liquids",
  },
  boxes: {
    ru: "Пластиковые ящики для хранения и транспортировки (под заказ)",
    en: "Plastic storage and transport crates (to order)",
  },
}

/** Slug/id из URL/БД → ключ в словаре подкатегорий */
export function getCatalogSubcategoryTranslationKey(slug: string): string {
  const slugToI18nKey: Record<string, string> = {
    "psv-s": "ps-psv-s",
    "psv-l": "ps-psv-l",
    "pse-1": "ps-pse",
    "ps-pse": "ps-pse",
    "ps-pse-1": "ps-pse",
    extrusion: "extrusion-parts",
    injection: "injection-parts",
    "parts-extrusion": "extrusion-parts",
    "parts-injection": "injection-parts",
    coatings: "dispersion-coatings",
    nonwovens: "dispersion-nonwovens",
    adhesives: "dispersion-adhesives",
  }
  return slugToI18nKey[slug] ?? slug
}

/** Ключ i18n по slug и id подкатегории */
export function resolveCatalogSubcategoryI18nKey(subcategoryId: string, slug: string): string {
  const fromSlug = getCatalogSubcategoryTranslationKey(slug)
  if (fromSlug !== slug) return fromSlug
  const fromId = getCatalogSubcategoryTranslationKey(subcategoryId)
  if (fromId !== subcategoryId) return fromId
  return fromSlug
}

export function getSubcategoryDescription(
  i18nKey: string,
  lang: "ru" | "en" = "ru"
): string | null {
  const entry = SUBCATEGORY_DESCRIPTIONS[i18nKey]
  return entry ? entry[lang] : null
}

/**
 * Функция для получения переведенного названия подкатегории по slug
 */
export function getSubcategoryNameBySlug(slug: string, lang: "ru" | "en" = "ru"): string {
  // Сопоставление slug с ID подкатегорий
  const slugToId: Record<string, string> = {
    "abs-injection": "abs-injection",
    "abs-extrusion": "abs-extrusion",
    "abs-custom": "abs-custom",
    "psv-s": "ps-psv-s",
    "psv-l": "ps-psv-l",
    "pse-1": "ps-pse",
    "ps-pse": "ps-pse",
    "ps-pse-1": "ps-pse",
    "extrusion": "extrusion-parts",
    "injection": "injection-parts",
    "parts-extrusion": "extrusion-parts",
    "parts-injection": "injection-parts",
    "coatings": "dispersion-coatings",
    "nonwovens": "dispersion-nonwovens",
    "adhesives": "dispersion-adhesives",
    "vedra-tazy": "vedra-tazy",
    "uborka": "uborka",
    "steklo": "steklo",
    "sanuzel": "sanuzel",
    "kuhnya": "kuhnya",
    "veshalki": "veshalki",
    "otdyh": "otdyh",
    "canisters": "canisters",
    "boxes": "boxes",
  }

  const categoryId = slugToId[slug] || slug
  return getCategoryName(categoryId, lang)
}

/** Название категории: перевод по id или исходное из БД/JSON */
export function getCatalogCategoryLabel(
  categoryId: string,
  fallbackName: string,
  lang: "ru" | "en" = "ru"
): string {
  const translated = getCategoryName(categoryId, lang)
  return translated !== categoryId ? translated : fallbackName
}

/** Название подкатегории: id → slug → fallback */
export function getCatalogSubcategoryLabel(
  subcategoryId: string,
  slug: string,
  fallbackName: string,
  lang: "ru" | "en" = "ru"
): string {
  const i18nKey = resolveCatalogSubcategoryI18nKey(subcategoryId, slug)
  const byKey = getCategoryName(i18nKey, lang)
  if (byKey !== i18nKey) return byKey

  const byId = getCategoryName(subcategoryId, lang)
  if (byId !== subcategoryId) return byId
  const bySlug = getSubcategoryNameBySlug(slug, lang)
  if (bySlug !== slug && bySlug !== subcategoryId) return bySlug
  return fallbackName
}

/** Описание подкатегории: словарь → fallback только для RU */
export function getCatalogSubcategoryDescription(
  subcategoryId: string,
  slug: string,
  fallbackDescription: string | null | undefined,
  lang: "ru" | "en" = "ru"
): string | undefined {
  const i18nKey = resolveCatalogSubcategoryI18nKey(subcategoryId, slug)
  const fromDict = getSubcategoryDescription(i18nKey, lang)
  if (fromDict) return fromDict
  if (lang === "ru" && fallbackDescription) return fallbackDescription
  return undefined
}

