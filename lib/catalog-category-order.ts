/**
 * Канонический порядок разделов каталога: «УПЕКС» открывает каталог,
 * затем идут основные сырьевые направления и весь существующий ассортимент.
 * Применяется поверх sort из Supabase и порядка в products.json.
 */
export const CATALOG_CATEGORY_ORDER = [
  "styrene",
  "abs",
  "polystyrene",
  "dispersion",
  "machine-parts",
  "hoztovary",
  "pvc-modifier",
  "kors",
] as const

export type CatalogCategoryId = (typeof CATALOG_CATEGORY_ORDER)[number]

const ORDER_INDEX = new Map<string, number>(
  CATALOG_CATEGORY_ORDER.map((id, index) => [id, index])
)

export function getCatalogCategorySortIndex(categoryId: string): number {
  return ORDER_INDEX.get(categoryId) ?? 1_000
}

export function sortCatalogCategories<T extends { id: string }>(categories: T[]): T[] {
  return [...categories].sort((a, b) => {
    const diff = getCatalogCategorySortIndex(a.id) - getCatalogCategorySortIndex(b.id)
    if (diff !== 0) return diff
    return a.id.localeCompare(b.id, "ru")
  })
}
