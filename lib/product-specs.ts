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
  "Размер частиц основной фракции",
  "Массовая доля частиц основной фракции, %, не менее",
  "Массовая доля пентанов, %, в пределах",
  "Кажущаяся_плотность_кг_м3",
  "Коэффициент вспенивания",
  "Насыпная плотность",
  "Разрушающее_напряжение_МПа",
  "Разрушающее_напряжение_при_статическом_изгибе_МПа",
  "Относительная_вязкость",
  "Порообразователь_число",
  "Размер гранул",
]

const LOW_VALUE_CARD_SPEC_KEYS = new Set(["Тип", "Марка", "Применение"])

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
    Object.entries(specs).filter(([key]) => !HIDDEN_SPEC_KEYS.has(key))
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

  const numbers = value.match(/[\d.]+/g)?.map(Number).filter(Number.isFinite) ?? []
  if (numbers.length === 0) return null
  if (numbers.length === 1) return { min: numbers[0], max: numbers[0] }
  return { min: Math.min(...numbers), max: Math.max(...numbers) }
}
