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
    dispersion: { ru: "Дисперсия стирол-акриловая", en: "Styrene-Acrylic Dispersion" },
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
    "ps-psv-s": { ru: "Полистирол вспенивающийся ПСВ-С", en: "Expandable Polystyrene PSV-S" },
    "ps-psv-l": { ru: "Полистирол вспенивающийся ПСВ-Л", en: "Expandable Polystyrene PSV-L" },
    "ps-pse": { ru: "Полистирол ПСЭ-1", en: "Polystyrene PSE-1" },
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

/** Slug из URL/БД → ключ в `homePage.catalog.subcategories` / `subcategoryDescriptions` (locales) */
export function getCatalogSubcategoryTranslationKey(slug: string): string {
  const slugToI18nKey: Record<string, string> = {
    "psv-s": "ps-psv-s",
    "psv-l": "ps-psv-l",
    "pse-1": "ps-pse",
    extrusion: "extrusion-parts",
    injection: "injection-parts",
    "parts-extrusion": "extrusion-parts",
    "parts-injection": "injection-parts",
  }
  return slugToI18nKey[slug] ?? slug
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
    "extrusion": "extrusion-parts",
    "injection": "injection-parts",
    "parts-extrusion": "extrusion-parts",
    "parts-injection": "injection-parts",
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
  const byId = getCategoryName(subcategoryId, lang)
  if (byId !== subcategoryId) return byId
  const bySlug = getSubcategoryNameBySlug(slug, lang)
  if (bySlug !== slug && bySlug !== subcategoryId) return bySlug
  return fallbackName
}

