/**
 * Подмена путей к изображениям (например, после замены файла в public без смены записи в БД).
 */
const PRODUCT_IMAGE_OVERRIDES: Record<string, string> = {
  "finndisp-a-10": "/images/finndisp/finndisp-product-logo.png",
  "finndisp-a-10l": "/images/finndisp/finndisp-product-logo.png",
  "finndisp-ac-2010": "/images/finndisp/finndisp-product-logo.png",
  "finndisp-ac-2020": "/images/finndisp/finndisp-product-logo.png",
  "akromol-ac-101": "/images/finndisp/finndisp-product-logo.png",
  "finndisp-a-1049": "/images/finndisp/finndisp-product-logo.png",
  "finndisp-a-801": "/images/finndisp/finndisp-product-logo.png",
  "finndisp-a-337": "/images/finndisp/finndisp-product-logo.png",
  "finndisp-a-09": "/images/finndisp/finndisp-product-logo.png",
  "finndisp-ac-129": "/images/finndisp/finndisp-product-logo.png",
  "psv-s-1": "/images/psv/upex-grade-1-v1.png",
  "psv-s-2": "/images/psv/upex-grade-2-v1.png",
  "psv-s-3": "/images/psv/upex-grade-3-v1.png",
  "psv-s-4": "/images/psv/upex-grade-4-v1.png",
  "psv-s-5m": "/images/psv/upex-grade-5-v1.png",
  "psv-s-6": "/images/psv/upex-grade-6-v1.png",
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

function transliterateLegacyDmsFilename(filename: string): string {
  const transliteration: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e",
    ж: "zh", з: "z", и: "i", й: "y", к: "k", л: "l", м: "m",
    н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u",
    ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch",
    ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
  }

  const dot = filename.lastIndexOf(".")
  const stem = dot >= 0 ? filename.slice(0, dot) : filename
  const extension = dot >= 0 ? filename.slice(dot).toLowerCase() : ""
  const latinStem = stem
    .toLowerCase()
    .split("")
    .map((char) => transliteration[char] ?? char)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return `${latinStem}${extension}`
}

function normalizeLegacyDmsImagePath(path: string): string {
  const normalized = path.trim().replace(/\\/g, "/")
  const match = normalized.match(/^\/images\/(litev|extrusion)\/([^/]+)$/i)
  if (!match || !/[\u0400-\u04ff]/i.test(match[2])) return normalized
  return `/images/${match[1].toLowerCase()}/${transliterateLegacyDmsFilename(match[2])}`
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
    return normalizeLegacyDmsImagePath(imageValue)
  }
  return imageValue || fallback || "/placeholder.svg"
}
