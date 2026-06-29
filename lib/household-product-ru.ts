/**
 * Исправления русских названий товаров ТНП (данные в Supabase могут не совпадать с фактом).
 */
const HOUSEHOLD_PRODUCT_RU: Record<string, { name: string; description?: string }> = {
  "vedro-base-95l": {
    name: "Таз 10 л",
    description:
      "Пластиковый таз вместимостью 10 л — практичный объём, прочный и устойчивый к нагрузкам. Удобен для стирки, уборки, на кухне или в саду.",
  },
  "taz-10l": {
    name: "Ведро BASE 9,5 л",
    description:
      "Прямоугольное ведро BASE объёмом 9,5 л для современных плоских швабр с отжимом. Форма делает мытьё полов быстрым и удобным.",
  },
}

export function getHouseholdProductRu(
  productId: string
): { name: string; description?: string } | null {
  return HOUSEHOLD_PRODUCT_RU[productId] ?? null
}
