/**
 * Подмена путей к изображениям (например, после замены файла в public без смены записи в БД).
 */
const PRODUCT_IMAGE_OVERRIDES: Record<string, string> = {
  "shchetka-smetka": "/images/xoztov/п2711.png",
  "sovok-dlya-musora": "/images/xoztov/П494.png",
}

/** Считаем, что у товара нет своего фото — показываем бренд-значок на карточке. */
export function isProductImagePlaceholder(url: string | null | undefined): boolean {
  if (url == null || String(url).trim() === "") return true
  const u = String(url).toLowerCase()
  return u.includes("placeholder.svg") || u.includes("placeholder-logo")
}

export function resolveProductImageUrl(
  productId: string,
  image: string | null | undefined,
  fallback?: string | null
): string {
  const override = PRODUCT_IMAGE_OVERRIDES[productId]
  if (override) return override
  return image || fallback || "/placeholder.svg"
}
