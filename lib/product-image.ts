/**
 * Подмена путей к изображениям (например, после замены файла в public без смены записи в БД).
 */
const PRODUCT_IMAGE_OVERRIDES: Record<string, string> = {
  "shchetka-smetka": "/images/xoztov/p2711.png",
  "sovok-dlya-musora": "/images/xoztov/p494.png",
}

/**
 * Совместимость со старыми путями изображений после переименования файлов.
 * Ключ — путь, который может прийти из БД, значение — актуальный путь в public.
 */
const IMAGE_PATH_OVERRIDES: Record<string, string> = {
  "/images/xoztov/p1834.jpg": "/images/xoztov/p1834.png",
  "/images/xoztov/п1834.jpg": "/images/xoztov/p1834.png",
}

function normalizeImagePathForLookup(path: string): string {
  return path.trim().replace(/\\/g, "/").toLowerCase()
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
  const imageValue = typeof image === "string" ? image.trim().replace(/\\/g, "/") : image
  if (typeof imageValue === "string" && imageValue.length > 0) {
    const normalized = normalizeImagePathForLookup(imageValue)
    if (IMAGE_PATH_OVERRIDES[normalized]) {
      return IMAGE_PATH_OVERRIDES[normalized]
    }
  }
  return imageValue || fallback || "/placeholder.svg"
}
