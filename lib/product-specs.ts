/** Ключи характеристик, не показываемые на карточках и в кратком списке. */
export const HIDDEN_SPEC_KEYS = new Set([
  "Норма",
  "Норма по НТД",
  "Штрихкод",
  "штрихкод",
  "barcode",
])

export const ABS_CARD_SPEC_KEYS = [
  "Плотность, кг/м³",
  "Усадка при литье под давлением, %, в пределах",
  "Показатель текучести расплава, г/10 мин",
  "Температура размягчения по Вика, °C, не менее",
  "Ударная вязкость по Изоду, кДж/м², не менее",
  "Предел текучести при растяжении, кгс/см², не менее",
  "Относительное удлинение при разрыве, %, не менее",
  "Блеск, %",
  "Плотность_кг_м3",
  "Показатель_текучести_расплава_MFR_г_10мин",
  "Температура_размягчения_по_Вика_градС",
  "Ударная_вязкость_по_Изоду_кДж_м2",
  "Предел_текучести_при_растяжении_МПа",
  "Предел_текучести_при_растяжении_кгс_см2",
  "Относительное_удлинение_при_разрыве_проц",
  "Усадка_проц",
  "Блеск_проц",
]

export const POLYSTYRENE_CARD_SPEC_KEYS = [
  "Размер основной фракции",
  "Размер частиц основной фракции",
  "Массовая доля частиц основной фракции, %, не менее",
  "Массовая доля порообразователя, %, не менее",
  "Массовая доля пентанов, %, в пределах",
  "Относительная вязкость, не менее",
  "Потеря массы при сушке, %, не более",
  "Кажущаяся плотность пенополистирола, кг/м³, не более",
  "Внешний вид",
  "Показатель текучести расплава, г/10 мин, в пределах",
  "Температура размягчения по Вика при P=5 кгс, °C, не ниже",
  "Кажущаяся_плотность_кг_м3",
  "Коэффициент вспенивания",
  "Насыпная плотность",
  "Разрушающее_напряжение_МПа",
  "Разрушающее_напряжение_при_статическом_изгибе_МПа",
  "Относительная_вязкость",
  "Порообразователь_число",
  "Размер гранул",
]

const LOW_VALUE_CARD_SPEC_KEYS = new Set([
  "Тип",
  "Марка",
  "Применение",
  "Нормативный документ",
  "Чистота поверхности диска",
])

const ASCENDING_RANGE_SPEC_KEYS = new Set([
  "Размер частиц основной фракции",
  "Размер основной фракции по маркам",
  "Размер гранул",
])

function normalizeAscendingRangeValue(value: unknown): unknown {
  if (typeof value !== "string") return value

  return value.replace(
    /(\d+(?:[.,]\d+)?)\s*[-–—]\s*(\d+(?:[.,]\d+)?)/g,
    (range, left: string, right: string) => {
      const leftNumber = Number(left.replace(",", "."))
      const rightNumber = Number(right.replace(",", "."))

      if (!Number.isFinite(leftNumber) || !Number.isFinite(rightNumber)) return range
      return leftNumber > rightNumber ? `${right}–${left}` : `${left}–${right}`
    }
  )
}

function isValidSpecValue(value: unknown) {
  return value !== null && value !== undefined && value !== ""
}

/** Безопасно приводит specifications к объекту (строка JSON, объект или пусто). */
export function parseSpecifications(specs: unknown): Record<string, unknown> {
  if (!specs) return {}
  if (typeof specs === "object" && !Array.isArray(specs)) {
    return specs as Record<string, unknown>
  }
  if (typeof specs === "string") {
    try {
      const parsed = JSON.parse(specs)
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>
      }
    } catch {
      // ignore malformed JSON from DB
    }
  }
  return {}
}

export function stripHiddenSpecs(specs: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(specs)
      .filter(([key]) => !HIDDEN_SPEC_KEYS.has(key))
      .map(([key, value]) => [
        key,
        ASCENDING_RANGE_SPEC_KEYS.has(key) ? normalizeAscendingRangeValue(value) : value,
      ])
  )
}

export function getCardSpecEntries(
  specs: Record<string, unknown>,
  categoryId?: string
): [string, unknown][] {
  const visibleSpecs = stripHiddenSpecs(specs)
  const entries = Object.entries(visibleSpecs).filter(([, value]) => isValidSpecValue(value))

  const priorityKeys =
    categoryId === "abs"
      ? ABS_CARD_SPEC_KEYS
      : categoryId === "polystyrene"
        ? POLYSTYRENE_CARD_SPEC_KEYS
        : null

  if (!priorityKeys) {
    return entries
  }

  const prioritized = priorityKeys.flatMap((key) =>
    Object.prototype.hasOwnProperty.call(visibleSpecs, key) && isValidSpecValue(visibleSpecs[key])
      ? [[key, visibleSpecs[key]] as [string, unknown]]
      : []
  )
  const rest = entries.filter(
    ([key]) => !priorityKeys.includes(key) && !LOW_VALUE_CARD_SPEC_KEYS.has(key)
  )

  return [...prioritized, ...rest]
}

/** Извлекает числовой диапазон из значения характеристики (число или строка «40-50»). */
export function parseSpecNumberRange(value: unknown): { min: number; max: number } | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return { min: value, max: value }
  }
  if (typeof value !== "string") return null

  // Read the first value/range, not digits in units such as g/10 min or kg/m3.
  const match = value.replace(/(\d),(?=\d)/g, "$1.").match(/([+-]?\d+(?:\.\d+)?)(?:\s*(?:[-–—]|до|to)\s*([+-]?\d+(?:\.\d+)?))?/i)
  const numbers = match ? [match[1], match[2]].filter(v => v !== undefined).map(Number).filter(Number.isFinite) : []
  if (numbers.length === 0) return null
  if (numbers.length === 1) return { min: numbers[0], max: numbers[0] }
  return { min: Math.min(...numbers), max: Math.max(...numbers) }
}

export type SpecRange = { min: number; max: number; minExclusive?: boolean; maxExclusive?: boolean }

/** Canonical editorial values override legacy keys; UI tensile strength uses MPa. */
export function getNumericFilterRanges(specs: Record<string, unknown>) {
  const read = (...keys: string[]) => {
    for (const key of keys) {
      const range = parseSpecNumberRange(specs[key])
      if (range) return range
    }
    return null
  }
  const endpoints = (a: string, b: string) => {
    const min = read(a), max = read(b)
    return min && max ? { min: Math.min(min.min, max.min), max: Math.max(min.max, max.max) } : min || max
  }
  const kgf = read("Предел текучести при растяжении, кгс/см², не менее", "Предел_текучести_при_растяжении_кгс_см2")
  const particleRange = (): SpecRange | null => {
    for (const key of ["Размер частиц основной фракции", "Размер основной фракции", "Размер гранул"]) {
      const value = specs[key]
      const range = parseSpecNumberRange(value)
      if (!range) continue
      if (typeof value === "string") {
        if (/^(?:более|>|greater than)\s*/i.test(value.trim())) return { min: range.min, max: Infinity, minExclusive: true }
        if (/^(?:менее|<|less than)\s*/i.test(value.trim())) return { min: 0, max: range.max, maxExclusive: true }
      }
      return range
    }
    return endpoints("Фракция_мин", "Фракция_макс")
  }
  return {
    density: read("Плотность, кг/м³", "Плотность_кг_м3") || endpoints("Плотность_кг_м3_мин", "Плотность_кг_м3_макс"),
    fraction: particleRange(),
    mfr: read("Показатель текучести расплава, г/10 мин", "Показатель текучести расплава, г/10 мин, не менее", "Показатель текучести расплава, г/10 мин, в пределах", "Показатель_текучести_расплава_MFR_г_10мин"),
    elongation: read("Относительное удлинение при разрыве, %, не менее", "Относительное_удлинение_при_разрыве_проц"),
    impactStrength: read("Ударная вязкость по Изоду, кДж/м², не менее", "Ударная_вязкость_по_Изоду_кДж_м2"),
    tensileStrength: kgf ? { min: kgf.min * 0.0980665, max: kgf.max * 0.0980665 }
      : read("Предел текучести при растяжении, МПа, не менее", "Предел_текучести_при_растяжении_МПа"),
    vicaTemp: read("Температура размягчения по Вика, °C, не менее", "Температура размягчения по Вика при P=5 кгс, °C, не ниже", "Температура_размягчения_по_Вика_градС"),
    gloss: read("Блеск, %", "Блеск, %, не менее", "Блеск_проц"),
    apparentDensity: read("Кажущаяся плотность пенополистирола, кг/м³, не более", "Кажущаяся_плотность_кг_м3"),
    expansion: read("Коэффициент вспенивания"),
    relativeViscosity: read("Относительная вязкость, не менее", "Относительная_вязкость"),
  }
}

export function matchesSpecRange(range: SpecRange | null, min?: number, max?: number): boolean {
  if (min === undefined && max === undefined) return true
  if (!range || (min !== undefined && !Number.isFinite(min)) || (max !== undefined && !Number.isFinite(max))) return false
  if (min !== undefined && max !== undefined && min > max) return false
  if (range.minExclusive && max === range.min) return false
  if (range.maxExclusive && min === range.max) return false
  return (min === undefined || range.max >= min) && (max === undefined || range.min <= max)
}
