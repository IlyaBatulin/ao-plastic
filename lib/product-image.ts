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
  "canister-21-5l": "/prevyu/produktsiya/kanistra-single-clean.webp",
  "canister-20l": "/prevyu/produktsiya/kanistra-single-clean.webp",
  "box-polymer": "/prevyu/produktsiya/yaschik-polimernyi-studio.webp",
  "box-40l": "/prevyu/produktsiya/yaschik-polimernyi-studio.webp",
  "kruzhka-02l": "/images/xoztov/p1834-studio.webp",
  "voronka-120mm": "/images/xoztov/p2040-studio.webp",
  "filtr-setochka": "/images/xoztov/p1802-studio.webp",
  "mylnitsa": "/images/xoztov/p1611-studio.webp",
  "komplekt-dlya-tualeta-kompakt": "/images/xoztov/p2716-studio.webp",
  "komplekt-dlya-tualeta": "/images/xoztov/p2717-studio.webp",
  "komplekt-dlya-tualeta-ergo": "/images/xoztov/p2718-studio.webp",
  "veshalka-plechiki-36-38": "/images/xoztov/hanger-36-38-studio.webp",
  "veshalka-plechiki-48-50": "/images/xoztov/hanger-48-50-studio.webp",
  "veshalka-plechiki-52-54": "/images/xoztov/hanger-52-54-studio.webp",
  "veshalka-plechiki-povorotnyy-44-46": "/images/xoztov/hanger-swivel-44-46-studio.webp",
  "veshalka-plechiki-povorotnyy-48-50": "/images/xoztov/hanger-swivel-48-50-studio.webp",
  "ka-23": "/images/litev/ka-23-studio.webp",
  "ka-25b": "/images/litev/ka-25b-studio.webp",
  "ka-56r": "/images/litev/ka-56r-studio.webp",
  "ka-62a": "/images/litev/ka-62a-studio.webp",
  "ka-65": "/images/litev/ka-65-studio.webp",
  "ka-70": "/images/litev/ka-70-studio.webp",
  "ka-83a": "/images/litev/ka-83a-studio.webp",
  "ka-288a": "/images/litev/ka-288a-studio.webp",
  "ka-80": "/images/litev/ka-80-studio.webp",
  "ka-96": "/images/litev/ka-96-no-reflection.webp",
  "ka-583": "/images/litev/ka-583-studio.webp",
  "ka-343a": "/images/litev/ka-343a-white-studio.webp",
  "ka-587": "/images/litev/ka-587-white-studio.webp",
  "ka-41a": "/images/litev/ka-41a-white-studio.webp",
  "ka-555": "/images/litev/ka-555-studio.webp",
  "ka-560": "/images/litev/ka-560-studio.webp",
  "ka-561": "/images/litev/ka-561-studio.webp",
  "ka-562": "/images/litev/ka-562-studio.webp",
  "ka-564": "/images/litev/ka-564-studio.webp",
  "ka-565": "/images/litev/ka-565-studio.webp",
  "ka-572a": "/images/litev/ka-572a-studio.webp",
  "ka-134": "/images/litev/ka-134-studio.webp",
  "ka-287a": "/images/litev/ka-287a-studio.webp",
  "ka-27b": "/images/litev/ka-27b-studio.webp",
  "f-226-1": "/images/litev/f-226-pair-studio.webp",
  "f-226-2": "/images/litev/f-226-pair-studio.webp",
  "ka-28b": "/images/litev/ka-28b-studio.webp",
  "ka-37-ka-38": "/images/litev/ka-37-38-studio.webp",
  "ka-39a": "/images/litev/ka-39a-studio.webp",
  "ka-44": "/images/litev/ka-44-studio.webp",
  "ka-46a": "/images/litev/ka-46a-studio.webp",
  "ka-50a": "/images/litev/ka-50a-studio.webp",
  "ka-51": "/images/litev/ka-51-studio.webp",
  "ka-53": "/images/litev/ka-53-studio.webp",
  "ka-54a": "/images/litev/ka-54a-studio.webp",
  "ka-55": "/images/litev/ka-55-studio.webp",
  "ka-89": "/images/litev/ka-89-studio.webp",
  "ka-122": "/images/litev/ka-122-studio.webp",
  "ka-123": "/images/litev/ka-123-studio.webp",
  "ka-124": "/images/litev/ka-124-studio.webp",
  "ka-128": "/images/litev/ka-128-studio.webp",
  "ka-132": "/images/litev/ka-132-studio.webp",
  "ka-133a": "/images/litev/ka-133a-studio.webp",
  "ka-280a": "/images/litev/ka-280a-studio.webp",
  "ka-281a": "/images/litev/ka-281a-studio.webp",
  "ka-282a": "/images/litev/ka-282a-studio.webp",
  "ka-283": "/images/litev/ka-283-studio.webp",
  "ka-284": "/images/litev/ka-284-studio.webp",
  "ka-285": "/images/litev/ka-285-studio.webp",
  "ka-286a": "/images/litev/ka-286a-studio.webp",
  "ka-345a": "/images/litev/ka-345a-studio.webp",
  "ka-346": "/images/litev/ka-346-studio.webp",
  "ka-551b": "/images/litev/ka-551b-studio.webp",
  "ka-552": "/images/litev/ka-552-studio.webp",
  "ka-553": "/images/litev/ka-553-studio.webp",
  "ka-554a": "/images/litev/ka-554a-studio.webp",
  "ka-568": "/images/litev/ka-568-studio.webp",
  "ka-568a": "/images/litev/ka-568a-studio.webp",
  "ka-572": "/images/litev/ka-572-studio.webp",
  "ka-585": "/images/litev/ka-585-studio.webp",
  "ka-586": "/images/litev/ka-586-studio.webp",
  "ka-589": "/images/litev/ka-589-studio.webp",
  "ka-590": "/images/litev/ka-590-studio.webp",
  "ka-603": "/images/litev/ka-603-studio.webp",
  "mmz-10": "/images/litev/mmz-10-studio.webp",
  "ka-02": "/images/litev/ka-02-studio.webp",
  "ka-10a": "/images/litev/ka-10a-studio.webp",
  "ka-19": "/images/litev/ka-19-studio.webp",
  "ka-43": "/images/litev/ka-43-studio.webp",
  "extrusion-1": "/images/extrusion/extrusion-1-studio-v2.webp",
  "extrusion-2": "/images/extrusion/extrusion-2-studio.webp",
  "extrusion-3": "/images/extrusion/extrusion-3-studio.webp",
  "extrusion-4": "/images/extrusion/extrusion-4-studio.webp",
  "extrusion-5": "/images/extrusion/extrusion-5-studio.webp",
  "extrusion-6": "/images/extrusion/extrusion-5-studio.webp",
  "extrusion-7": "/images/extrusion/extrusion-7-studio.webp",
  "extrusion-8": "/images/extrusion/extrusion-8-studio.webp",
  "extrusion-9": "/images/extrusion/extrusion-4-studio.webp",
  "extrusion-10": "/images/extrusion/extrusion-10-studio.webp",
  "extrusion-11": "/images/extrusion/extrusion-11-studio.webp",
  "extrusion-12": "/images/extrusion/extrusion-12-studio.webp",
  "extrusion-13": "/images/extrusion/extrusion-13-studio-v2.webp",
  "extrusion-14": "/images/extrusion/extrusion-14-studio.webp",
  "extrusion-15": "/images/extrusion/extrusion-15-studio.webp",
  "extrusion-16": "/images/extrusion/extrusion-16-studio.webp",
  "extrusion-17": "/images/extrusion/extrusion-16-studio.webp",
  "extrusion-18": "/images/extrusion/extrusion-18-studio.webp",
  "extrusion-19": "/images/extrusion/extrusion-18-studio.webp",
  "extrusion-20": "/images/extrusion/extrusion-20-studio.webp",
  "extrusion-21": "/images/extrusion/extrusion-21-studio.webp",
  "extrusion-22": "/images/extrusion/extrusion-22-studio.webp",
  "extrusion-23": "/images/extrusion/extrusion-23-studio.webp",
  "extrusion-24": "/images/extrusion/extrusion-24-studio.webp",
  "extrusion-25": "/images/extrusion/extrusion-25-studio.webp",
  "extrusion-26": "/images/extrusion/extrusion-26-studio.webp",
  "extrusion-27": "/images/extrusion/extrusion-27-studio.webp",
  "extrusion-28": "/images/extrusion/extrusion-28-studio.webp",
  "extrusion-29": "/images/extrusion/extrusion-29-studio.webp",
  "extrusion-30": "/images/extrusion/extrusion-30-studio.webp",
  "extrusion-31": "/images/extrusion/extrusion-31-studio.webp",
  "extrusion-32": "/images/extrusion/extrusion-32-studio.webp",
  "extrusion-33": "/images/extrusion/extrusion-33-studio.webp",
  "extrusion-34": "/images/extrusion/extrusion-34-studio.webp",
  "extrusion-36": "/images/extrusion/extrusion-36-studio.webp",
  "extrusion-37": "/images/extrusion/extrusion-37-studio.webp",
  "extrusion-39": "/images/extrusion/extrusion-39-studio.webp",
  "extrusion-41": "/images/extrusion/extrusion-41-studio.webp",
  "extrusion-42": "/images/extrusion/extrusion-42-studio.webp",
  "extrusion-43": "/images/extrusion/extrusion-43-studio.webp",
  "extrusion-44": "/images/extrusion/extrusion-44-studio.webp",
  "extrusion-45": "/images/extrusion/extrusion-45-studio.webp",
  "extrusion-46": "/images/extrusion/extrusion-46-studio.webp",
  "extrusion-47": "/images/extrusion/extrusion-47-studio.webp",
  "extrusion-48": "/images/extrusion/extrusion-47-studio.webp",
  "extrusion-49": "/images/extrusion/extrusion-49-studio.webp",
  "extrusion-50": "/images/extrusion/extrusion-49-studio.webp",
  "extrusion-51": "/images/extrusion/extrusion-51-studio.webp",
  "extrusion-52": "/images/extrusion/extrusion-52-studio.webp",
  "extrusion-53": "/images/extrusion/extrusion-53-studio.webp",
  "extrusion-54": "/images/extrusion/extrusion-54-studio.webp",
  "extrusion-55": "/images/extrusion/extrusion-55-studio.webp",
  "extrusion-56": "/images/extrusion/extrusion-55-studio.webp",
  "extrusion-57": "/images/extrusion/extrusion-57-studio.webp",
  "extrusion-58": "/images/extrusion/extrusion-58-studio.webp",
  "extrusion-59": "/images/extrusion/extrusion-58-studio.webp",
  "extrusion-60": "/images/extrusion/extrusion-60-studio-v2.webp",
  "extrusion-61": "/images/extrusion/extrusion-60-studio-v2.webp",
  "extrusion-62": "/images/extrusion/extrusion-62-studio.webp",
  "extrusion-63": "/images/extrusion/extrusion-63-studio.webp",
  "extrusion-64": "/images/extrusion/extrusion-64-studio.webp",
  "extrusion-65": "/images/extrusion/extrusion-65-studio.webp",
  "extrusion-66": "/images/extrusion/extrusion-65-studio.webp",
  "extrusion-67": "/images/extrusion/extrusion-65-studio.webp",
  "extrusion-68": "/images/extrusion/extrusion-65-studio.webp",
  "extrusion-69": "/images/extrusion/extrusion-69-studio.webp",
  "extrusion-70": "/images/extrusion/extrusion-70-studio.webp",
  "extrusion-71": "/images/extrusion/extrusion-71-studio.webp",
  "extrusion-72": "/images/extrusion/extrusion-72-studio.webp",
  "extrusion-73": "/images/extrusion/extrusion-72-studio.webp",
  "extrusion-74": "/images/extrusion/extrusion-72-studio.webp",
  "extrusion-75": "/images/extrusion/extrusion-72-studio.webp",
  "extrusion-76": "/images/extrusion/extrusion-76-studio.webp",
  "extrusion-77": "/images/extrusion/extrusion-77-studio.webp",
  "extrusion-78": "/images/extrusion/extrusion-78-studio.webp",
  "extrusion-79": "/images/extrusion/extrusion-79-studio.webp",
  "extrusion-80": "/images/extrusion/extrusion-80-studio.webp",
}

/**
 * Совместимость со старыми путями изображений после переименования файлов.
 * Ключ — путь, который может прийти из БД, значение — актуальный путь в public.
 */
const IMAGE_PATH_OVERRIDES: Record<string, string> = {
  "/images/xoztov/p1834.jpg": "/images/xoztov/p1834-studio.webp",
  "/images/xoztov/п1834.jpg": "/images/xoztov/p1834-studio.webp",
  "/images/xoztov/p1834.png": "/images/xoztov/p1834-studio.webp",
  "/images/xoztov/п1834.png": "/images/xoztov/p1834-studio.webp",
  "/images/xoztov/p2040.jpg": "/images/xoztov/p2040-studio.webp",
  "/images/xoztov/п2040.jpg": "/images/xoztov/p2040-studio.webp",
  "/images/xoztov/p1802.jpg": "/images/xoztov/p1802-studio.webp",
  "/images/xoztov/п1802.jpg": "/images/xoztov/p1802-studio.webp",
  "/images/xoztov/p1611.jpg": "/images/xoztov/p1611-studio.webp",
  "/images/xoztov/п1611.jpg": "/images/xoztov/p1611-studio.webp",
  "/images/xoztov/p2716.jpg": "/images/xoztov/p2716-studio.webp",
  "/images/xoztov/п2716.jpg": "/images/xoztov/p2716-studio.webp",
  "/images/xoztov/p2717.jpg": "/images/xoztov/p2717-studio.webp",
  "/images/xoztov/п2717.jpg": "/images/xoztov/p2717-studio.webp",
  "/images/xoztov/p2718.jpg": "/images/xoztov/p2718-studio.webp",
  "/images/xoztov/п2718.jpg": "/images/xoztov/p2718-studio.webp",
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
