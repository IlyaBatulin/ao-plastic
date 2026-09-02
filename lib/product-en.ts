import { HOUSEHOLD_PRODUCT_EN } from "@/lib/household-product-en"
import { getHouseholdProductRu } from "@/lib/household-product-ru"
import productsData from "@/data/products.json"
import {
  EXTRUSION_PART_TYPE_EN,
  isSupplyPhrase,
  translateExtrusionPartType,
  translateExtrusionPlaceholder,
  translateSupplyPhrase,
} from "@/lib/extrusion-i18n"

export type ProductEnEntry = { name: string; description: string }

/** Каталог (кроме ТНП): id → EN name + description */
const CATALOG_PRODUCT_EN: Record<string, ProductEnEntry> = {
  "styrene-monomer": {
    name: "Monomeric Styrene",
    description:
      "High-purity monomeric styrene for polystyrene and copolymer production. Used in the chemical industry for polymer synthesis.",
  },
  "abs-l-121": {
    name: "ABS L-121",
    description:
      "General-purpose injection ABS for automotive parts and consumer appliances.",
  },
  "abs-e-110": {
    name: "ABS E-110",
    description: "Extrusion ABS for sheet, profile and pipe production.",
  },
  ...Object.fromEntries(
    ["1", "2", "3", "4", "6"].map((grade) => [
      `psv-s-${grade}`,
      {
        name: `UPEX Expandable Polystyrene, Grade ${grade}`,
        description: `Self-extinguishing UPEX expandable polystyrene, grade ${grade}.`,
      },
    ])
  ),
  "psv-s-5m": {
    name: "UPEX Expandable Polystyrene, Grade 5",
    description: "Self-extinguishing UPEX expandable polystyrene, grade 5.",
  },
  "finndisp-a-10": {
    name: "FINNDISP A-10",
    description: "Plasticizer-free aqueous styrene-acrylic copolymer dispersion for interior, exterior and washable paints, varnishes and primers.",
  },
  "finndisp-a-10l": {
    name: "FINNDISP A-10L (freeze-resistant)",
    description: "Freeze-resistant, plasticizer-free aqueous styrene-acrylic copolymer dispersion for interior, exterior and washable paints, varnishes and primers.",
  },
  "finndisp-ac-2010": {
    name: "FINNDISP AC-2010",
    description: "Plasticizer-free aqueous styrene-acrylic copolymer dispersion used for geogrids and glass-fiber mat.",
  },
  "finndisp-ac-2020": {
    name: "FINNDISP AC-2020",
    description: "Plasticizer-free aqueous styrene-acrylic copolymer dispersion for water-based interior and exterior paints, varnishes, primers and fillers.",
  },
  "akromol-ac-101": {
    name: "AKROMOL AC-101",
    description: "Plasticizer-free aqueous styrene-acrylic copolymer dispersion for geogrids, glass-fiber mat, interior and exterior paints, primers, fillers and renders.",
  },
  "finndisp-a-1049": {
    name: "FINNDISP A-1049",
    description: "Polymer adhesive dispersion for protective films and removable adhesive tapes applied to polyolefin films.",
  },
  "finndisp-a-801": {
    name: "FINNDISP A-801",
    description: "Polymer adhesive dispersion for packaging-tape production.",
  },
  "finndisp-a-337": {
    name: "FINNDISP A-337",
    description: "Plasticizer-free aqueous acrylic copolymer dispersion for interior and exterior paints and wood coatings, varnishes and stains.",
  },
  "finndisp-a-09": {
    name: "FINNDISP A-09",
    description: "Aqueous styrene-acrylic copolymer dispersion for waterproofing membranes, mastics, fillers and sealants.",
  },
  "finndisp-ac-129": {
    name: "FINNDISP AC-129",
    description: "Polymer dispersion for coalescent-free interior paints and silicate paints.",
  },
  "door-handle-profile": {
    name: "Decorative Door Handle Profile",
    description: "Decorative profile for automotive door handles.",
  },
  "roof-trim-2101": {
    name: 'Roof Gutter Trim "Fishing Rod" 2101-07',
    description: "Trim for roof gutter of VAZ 2101-07 vehicles.",
  },
  "tube-yellow": {
    name: "Tube (Yellow)",
    description: "Yellow plastic tube for various applications.",
  },
  "tube-blue": {
    name: "Tube (Blue)",
    description: "Blue plastic tube for various applications.",
  },
  "modifier-pvc": {
    name: "PVC Composition Modifier",
    description: "Modifier to improve properties of PVC compounds.",
  },
  "kors-fuel": {
    name: "CORS",
    description:
      "Cubic residue of styrene rectification used as fuel or a component in paint formulations.",
  },
  "bentol": {
    name: "Bentol",
    description: "Bentol processing product for industrial applications.",
  },
  "custom-molding": {
    name: "Custom ABS Injection Molding",
    description: "Manufacturing of ABS parts to customer drawings by injection molding.",
  },
  "custom-extrusion": {
    name: "Custom ABS Extrusion",
    description: "Manufacturing of ABS profiles and sheets to customer specifications.",
  },
}

const ALL_PRODUCT_EN: Record<string, ProductEnEntry> = {
  ...HOUSEHOLD_PRODUCT_EN,
  ...CATALOG_PRODUCT_EN,
}

/** slug или русское имя → id в словаре */
const PRODUCT_LOOKUP_ALIASES: Record<string, string> = {
  "abs-l-121": "abs-l-121",
  "абс л-121": "abs-l-121",
  "abs-e-110": "abs-e-110",
  "абс э-110": "abs-e-110",
  "псв-с": "psv-s",
  "псв-л": "psv-l",
  "псэ-1": "pse-1",
  "полистирол вспенивающийся псв-с": "psv-s",
  "полистирол вспенивающийся псв-л": "psv-l",
  "expandable polystyrene eps-s": "psv-s",
  "expandable polystyrene eps-l": "psv-l",
  "полистирол псэ-1": "pse-1",
  "стирол мономерный": "styrene-monomer",
  "корс": "kors-fuel",
  "бентол": "bentol",
}

function buildLookupAliases(): Record<string, string> {
  const aliases = { ...PRODUCT_LOOKUP_ALIASES }
  for (const category of productsData.categories) {
    for (const product of category.products ?? []) {
      if (product.id && product.name) {
        aliases[normalizeLookupKey(product.name)] = product.id
      }
    }
  }
  return aliases
}

const LOOKUP_ALIASES = buildLookupAliases()

/** Фразы в описаниях товаров RU → EN */
const PRODUCT_DESCRIPTION_PHRASES_EN: [RegExp, string][] = [
  [/\bУПЕКС\b/gi, "UPEX"],
  [/Нерассеянная\s+фракция/gi, "Unscreened fraction"],
  [/для\s+изготовления\s+газифицируемых\s+моделей\s+в\s+литейном\s+производстве/gi, "for expendable-pattern casting"],
  [/Способ\s+получения:\s*Э\s*[—-]\s*эмульсионный\.?/gi, "Production method: E — emulsion process."],
  [/Первый\s+сорт\.?/gi, "First grade."],
  [/Нормативный\s+документ:\s*/gi, "Specification: "],
  [/ТУ/g, "TU"],
  [/ГОСТ/g, "GOST"],
  [/изменение\s*№?\s*(\d+)/gi, "amendment No. $1"],
  [
    /Экструзионный\s+АБС-пластик\s+марки\s+/gi,
    "Extrusion ABS plastic grade ",
  ],
  [
    /Экструзионный\s+АБС-пластик\s+для\s+производства\s+листов\s+и\s+профилей/gi,
    "Extrusion ABS plastic for sheet and profile production",
  ],
  [
    /для\s+производства\s+листов\s+и\s+профилей\s+методом\s+экструзии/gi,
    "for sheet and profile production by extrusion",
  ],
  [/литьевой\s+АБС-пластик/gi, "Injection ABS plastic"],
  [/марки\s+/gi, "grade "],
  [/для\s+производства\s+деталей\s+методом\s+литья\s+под\s+давлением/gi, "for manufacturing parts by injection molding"],
  [/для\s+производства\s+деталей/gi, "for manufacturing parts"],
  [/методом\s+литья\s+под\s+давлением/gi, "by injection molding"],
  [/АБС-пластик/gi, "ABS plastic"],
  [/вспенивающийся\s+полистирол/gi, "expandable polystyrene"],
  [/полистирол\s+экструзионный/gi, "extrusion polystyrene"],
  [/полистирол\s+эмульсионный/gi, "emulsion polystyrene"],
  [/полистирол/gi, "polystyrene"],
  [/для\s+производства\s+пенопласта/gi, "for foam plastic production"],
  [/теплоизоляционных\s+плит/gi, "insulation boards"],
  [/упаковочных\s+материалов/gi, "packaging materials"],
  [/общего\s+назначения/gi, "general-purpose"],
  [/с\s+повышенным\s+коэффициентом\s+вспенивания/gi, "with a higher expansion ratio"],
]

/** Длинные фразы в названиях ДМС / каталога (сначала длинные) */
const PRODUCT_NAME_PHRASES_EN: [RegExp, string][] = [
  [/Направляющий диск/gi, "Guide disc"],
  [/Заглушка отверстия внутренней панели/gi, "Inner panel hole plug"],
  [/Ролик/gi, "Roller"],
  [
    /Накладка облицовочная сточного желоба крыши «удочка» 2101-07/i,
    'Roof gutter trim overlay "Fishing rod" 2101-07',
  ],
  [/Профиль декоративный в дверную ручку/i, "Decorative door handle profile"],
  [/Трубка \(желтая\)/i, "Tube (yellow)"],
  [/Трубка \(синяя\)/i, "Tube (blue)"],
  [/литьевое изделие/i, "injection-molded part"],
  [/экструзионное изделие/i, "extruded part"],
  [/декоративный/i, "decorative"],
  [/облицовочная/i, "facing"],
  [/сточного желоба/i, "gutter"],
]

/**
 * Кириллица в марках → общепринятые EN-аббревиатуры.
 * Без \b после кириллицы: в JS \b не работает на границе кириллических букв,
 * иначе «ПСВ-С» превращается только в «EPS-С» (частичная замена ПСВ→EPS).
 */
const CYRILLIC_MARK_REPLACEMENTS: [RegExp, string][] = [
  [/КА\s*[-–]?\s*(\d+)\s*А/gi, "KA-$1A"],
  [/КА(?=\s*[-–]?\s*\d)/gi, "KA"],
  [/УПЕКС/gi, "UPEX"],
  [/Нерассеянная\s+фракция/gi, "Unscreened Fraction"],
  [/ПСВ\s*[-–]?\s*[СC](?![А-Яа-яA-Za-z])/gi, "EPS-S"],
  [/ПСВ\s*[-–]?\s*[ЛL](?![А-Яа-яA-Za-z])/gi, "EPS-L"],
  [/PSV\s*[-–]?\s*[СC](?![А-Яа-яA-Za-z])/gi, "EPS-S"],
  [/PSV\s*[-–]?\s*[ЛL](?![А-Яа-яA-Za-z])/gi, "EPS-L"],
  [/EPS\s*[-–]?\s*[СC](?![А-Яа-яA-Za-z])/gi, "EPS-S"],
  [/EPS\s*[-–]?\s*[ЛL](?![А-Яа-яA-Za-z])/gi, "EPS-L"],
  [/ПСЭ\s*[-–]?\s*1(?!\d)/gi, "PSE-1"],
  [/ПСЭ-1(?!\d)/gi, "PSE-1"],
]

function normalizeLookupKey(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ")
}

function resolveDictionaryId(
  productId: string,
  hints?: { slug?: string | null; name?: string | null; brand?: string | null }
): string | null {
  const id = String(productId).trim()
  if (ALL_PRODUCT_EN[id]) return id

  const slug = hints?.slug?.trim()
  if (slug && ALL_PRODUCT_EN[slug]) return slug

  const brand = hints?.brand?.trim()
  if (brand && ALL_PRODUCT_EN[brand]) return brand

  const nameKey = hints?.name ? normalizeLookupKey(hints.name) : ""
  if (nameKey && LOOKUP_ALIASES[nameKey]) return LOOKUP_ALIASES[nameKey]
  if (nameKey && ALL_PRODUCT_EN[nameKey]) return nameKey

  return null
}

export function getProductEn(
  productId: string,
  hints?: { slug?: string | null; name?: string | null; brand?: string | null }
): ProductEnEntry | null {
  const dictId = resolveDictionaryId(productId, hints)
  return dictId ? ALL_PRODUCT_EN[dictId] ?? null : null
}

/** @deprecated Use getProductEn */
export function getHouseholdProductEn(productId: string): ProductEnEntry | null {
  return getProductEn(productId)
}

function translateExtrusionType(type: string): string {
  return translateExtrusionPartType(type, "en")
}

function translateBrandMark(brand: string): string {
  let b = brand.trim()
  for (const [re, replacement] of CYRILLIC_MARK_REPLACEMENTS) {
    b = b.replace(re, replacement)
  }
  return fallbackLatinProductName(b)
}

/** «ПСВ-С» + «марка 6» или «PSV-С марка 6» */
function tryGradeNameFromBrandAndTitle(
  name: string,
  brand?: string | null
): ProductEnEntry | null {
  const gradeMatch = name.match(/(?:^|\s)марка\s*№?\s*(\d+(?:[.,]\d+)?)\s*$/i)
  if (!gradeMatch) return null

  const grade = gradeMatch[1].replace(",", ".")
  const brandPart = brand?.trim()
    ? translateBrandMark(brand)
    : name
        .replace(/(?:^|\s)марка\s*№?\s*\d+(?:[.,]\d+)?\s*$/i, "")
        .trim()

  if (!brandPart) return null

  const normalizedBrand = translateBrandMark(brandPart)
  return {
    name: `${normalizedBrand} Grade ${grade}`,
    description: `Expandable polystyrene grade ${grade}.`,
  }
}

function translateProductDescriptionFallback(description: string): string {
  let result = description.trim()
  for (const [re, en] of PRODUCT_DESCRIPTION_PHRASES_EN) {
    result = result.replace(re, en)
  }
  for (const [re, replacement] of CYRILLIC_MARK_REPLACEMENTS) {
    result = result.replace(re, replacement)
  }
  return result
    .replace(/АБС/g, "ABS")
    .replace(/ПТР/g, "MFR")
    .replace(/\s+/g, " ")
    .trim()
}

function applyPhraseTranslations(name: string): string {
  let result = name
  for (const [re, en] of PRODUCT_NAME_PHRASES_EN) {
    result = result.replace(re, en)
  }
  for (const [ru, en] of Object.entries(EXTRUSION_PART_TYPE_EN)) {
    if (result.startsWith(ru)) {
      result = en + result.slice(ru.length)
      break
    }
  }
  return result
}

const CYRILLIC_RE = /[\u0400-\u04FF]/

export function hasCyrillic(text: string): boolean {
  return CYRILLIC_RE.test(text)
}

function normalizeSpecs(
  specifications?: Record<string, unknown> | string | null
): Record<string, unknown> {
  if (!specifications) return {}
  if (typeof specifications === "string") {
    try {
      return JSON.parse(specifications) as Record<string, unknown>
    } catch {
      return {}
    }
  }
  return specifications
}

/** мм → mm и т.п. в размерах (цифры не трогаем) */
function latinizeUnits(value: string): string {
  return value
    .replace(/х/g, "x")
    .replace(/Х/g, "X")
    .replace(/мм/g, "mm")
    .replace(/см/g, "cm")
    .replace(/(\d)\s*м\b/g, "$1 m")
    .replace(/бухт/gi, "coils")
    .trim()
}

/** Убрать кириллицу, оставить цифры/латиницу/знаки */
function toLatinOnly(text: string, fallback = "Product"): string {
  const latin = text
    .replace(/[\u0400-\u04FF]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
  return latin || fallback
}

function translateSupply(value: unknown): string | null {
  const s = String(value ?? "").trim()
  if (!s) return null
  const translated = translateSupplyPhrase(s, "en")
  if (translated !== s) return translated
  if (hasCyrillic(s)) return null
  return s
}

/** EN-название ДМС только из латиницы: тип + шифр/размеры (без русского name из БД) */
export function buildDmsEnglishName(product: {
  id?: string
  name: string
  slug?: string | null
  brand?: string | null
  specifications?: Record<string, unknown> | string | null
}): string {
  const specs = normalizeSpecs(product.specifications)
  const typeRu = String(specs["Тип изделия"] ?? specs.type ?? "").trim()
  const typeEn = typeRu ? translateExtrusionType(typeRu) : ""

  const code = specs["Шифр изделия"] ?? specs.code
  const sizeRaw = specs["Габаритные размеры"] ?? specs.size_raw
  const lengthRaw = specs["Длина изделия"] ?? specs.length_raw

  const codeStr = code != null ? String(code).trim() : ""
  const sizeStr = sizeRaw != null ? latinizeUnits(String(sizeRaw)) : ""
  const lengthStr = lengthRaw != null ? latinizeUnits(String(lengthRaw)) : ""

  const titleParts: string[] = []
  if (typeEn) titleParts.push(typeEn)

  const detail =
    codeStr && !hasCyrillic(codeStr)
      ? codeStr
      : sizeStr && !hasCyrillic(sizeStr)
        ? sizeStr
        : lengthStr && !hasCyrillic(lengthStr)
          ? lengthStr
          : null

  if (titleParts.length > 0 && detail) return `${titleParts[0]} — ${detail}`
  if (titleParts.length > 0) return titleParts[0]

  if (product.id) {
    const fromDict = getProductEn(String(product.id), {
      slug: product.slug,
      name: product.name,
      brand: product.brand,
    })
    if (fromDict && !hasCyrillic(fromDict.name)) return fromDict.name
  }

  const fromPhrase = translateProductNameFallback(product.name)
  if (!hasCyrillic(fromPhrase)) return fromPhrase

  if (codeStr) return typeEn ? `${typeEn} — ${codeStr}` : codeStr
  return typeEn || "Machine-building part"
}

export function buildDmsEnglishDescription(product: {
  description?: string | null
  specifications?: Record<string, unknown> | string | null
}): string {
  const specs = normalizeSpecs(product.specifications)
  const parts: string[] = []

  const size = specs["Габаритные размеры"] ?? specs.size_raw
  const length = specs["Длина изделия"] ?? specs.length_raw
  const code = specs["Шифр изделия"] ?? specs.code
  const supply = translateSupply(specs["Поставка"] ?? specs.length_kind)

  if (size) {
    const sizeStr = String(size)
    const sizeEn =
      translateExtrusionPlaceholder(sizeStr, "en") !== sizeStr
        ? translateExtrusionPlaceholder(sizeStr, "en")
        : latinizeUnits(sizeStr)
    parts.push(`Dimensions: ${sizeEn}`)
  }

  const lengthStr = length != null ? String(length).trim() : ""
  if (lengthStr && !isSupplyPhrase(lengthStr)) {
    parts.push(`Length: ${latinizeUnits(lengthStr)}`)
  }

  if (code) parts.push(`Code: ${code}`)

  const supplyFromLength =
    lengthStr && isSupplyPhrase(lengthStr) ? translateSupplyPhrase(lengthStr, "en") : null
  const supplyLabel = supply ?? supplyFromLength
  if (supplyLabel) parts.push(`Supply: ${supplyLabel}`)

  if (parts.length > 0) return parts.join(" · ")

  const desc = product.description ?? ""
  if (desc && !hasCyrillic(desc)) return desc
  return ""
}

/** EN для экструзионных изделий ДМС (id вида extrusion-123) */
export function getExtrusionProductEn(product: {
  name: string
  description?: string | null
  specifications?: Record<string, unknown> | null
  id?: string
  slug?: string | null
  brand?: string | null
}): ProductEnEntry {
  return {
    name: buildDmsEnglishName(product),
    description: buildDmsEnglishDescription(product),
  }
}

function isDmsProduct(
  product: { id: string },
  options?: { categoryId?: string; subcategoryId?: string }
): boolean {
  if (options?.categoryId === "machine-parts") return true
  if (String(product.id).startsWith("extrusion-")) return true
  return false
}

export type ResolveProductDisplayOptions = {
  categoryId?: string
  subcategoryId?: string
}

export function resolveProductDisplay(
  product: {
    id: string
    name: string
    description?: string | null
    slug?: string | null
    brand?: string | null
    specifications?: Record<string, unknown> | string | null
  },
  lang: "ru" | "en",
  options?: ResolveProductDisplayOptions
): { name: string; description: string | undefined } {
  if (lang !== "en") {
    const ru = getHouseholdProductRu(String(product.id))
    if (ru) {
      return {
        name: ru.name,
        description: ru.description ?? product.description ?? undefined,
      }
    }
    return {
      name: product.name,
      description: product.description ?? undefined,
    }
  }

  if (isDmsProduct(product, options)) {
    const name = buildDmsEnglishName(product)
    const description = buildDmsEnglishDescription(product)
    return {
      name,
      description: description || undefined,
    }
  }

  const gradeFromBrand = tryGradeNameFromBrandAndTitle(product.name, product.brand)
  if (gradeFromBrand) {
    return { name: gradeFromBrand.name, description: gradeFromBrand.description }
  }

  const en = getProductEn(String(product.id), {
    slug: product.slug,
    name: product.name,
    brand: product.brand,
  })
  if (en) {
    return { name: en.name, description: en.description }
  }

  const fallbackName = translateProductNameFallback(product.name)
  const rawDescription = product.description ?? undefined
  const description =
    rawDescription && hasCyrillic(rawDescription)
      ? translateProductDescriptionFallback(rawDescription)
      : rawDescription

  return {
    name: hasCyrillic(fallbackName) ? toLatinOnly(fallbackName) : fallbackName,
    description,
  }
}

/** Марки АБС/ПС, ДМС и др. из БД без отдельной записи в словаре */
function translateProductNameFallback(name: string): string {
  let result = name
  for (const [re, replacement] of CYRILLIC_MARK_REPLACEMENTS) {
    result = result.replace(re, replacement)
  }
  result = applyPhraseTranslations(result)
  result = result.replace(/\bмарка\s*№?\s*/gi, "Grade ")
  result = result.replace(/\bМарка\s*№?\s*/g, "Grade ")
  for (const [ru, en] of Object.entries(EXTRUSION_PART_TYPE_EN)) {
    result = result.replace(new RegExp(ru.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), en)
  }
  return fallbackLatinProductName(result)
}

function fallbackLatinProductName(name: string): string {
  let result = name
  for (const [re, replacement] of CYRILLIC_MARK_REPLACEMENTS) {
    result = result.replace(re, replacement)
  }
  return result
    .replace(/АБС/g, "ABS")
    .replace(/ПСВ/g, "EPS")
    .replace(/ПСЭ/g, "PSE")
    .replace(/ПТР/g, "MFR")
    .replace(/ПВХ/g, "PVC")
    .replace(/КОРС/g, "CORS")
    .replace(/Стирол/gi, "Styrene")
    .replace(/Бентол/gi, "Bentol")
}
