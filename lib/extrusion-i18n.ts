export const EXTRUSION_PART_TYPE_EN: Record<string, string> = {
  Сепаратор: "Separator",
  Трубка: "Tube",
  Шланг: "Hose",
  Окантовка: "Edging",
  Профиль: "Profile",
  Втулка: "Bushing",
  Прокладка: "Gasket",
  Облицовка: "Facing",
  Накладка: "Overlay",
  Молдинг: "Molding",
}

const SUPPLY_PHRASE_EN: Record<string, string> = {
  "в бухтах": "in coils",
  "поставка в бухтах": "in coils",
  "фиксированная длина": "fixed length",
}

/** Плейсхолдеры размеров/данных из каталога ДМС */
const EXTRUSION_PLACEHOLDER_EN: Record<string, string> = {
  "превью по документу": "Per technical document",
  "по документу": "Per technical document",
  "см. документ": "See technical document",
  "см документ": "See technical document",
  "по чертежу": "Per drawing",
  "см. чертеж": "See drawing",
}

function normalizePhrase(text: string): string {
  return text.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim().toLowerCase()
}

export function isSupplyPhrase(value: string): boolean {
  const n = normalizePhrase(value)
  if (SUPPLY_PHRASE_EN[n]) return true
  return n.includes("бухт") || n.includes("фиксированн")
}

export function translateSupplyPhrase(value: string, lang: "ru" | "en"): string {
  if (lang !== "en" || !value) return value

  const n = normalizePhrase(value)
  if (SUPPLY_PHRASE_EN[n]) return SUPPLY_PHRASE_EN[n]
  if (n.includes("поставка в бухтах") || n.includes("бухт")) return "in coils"
  if (n.includes("фиксированн")) return "fixed length"

  return value
}

export function translateExtrusionPartType(value: string, lang: "ru" | "en"): string {
  if (lang !== "en" || !value) return value
  const trimmed = value.trim()
  return EXTRUSION_PART_TYPE_EN[trimmed] ?? trimmed
}

export function isExtrusionPartTypeKey(rawKey: string): boolean {
  return rawKey === "type" || rawKey === "Тип изделия"
}

export function isLengthSpecKey(rawKey: string): boolean {
  return rawKey === "length_raw" || rawKey === "Длина изделия"
}

export function translateExtrusionPlaceholder(value: string, lang: "ru" | "en"): string {
  if (lang !== "en" || !value) return value

  const n = normalizePhrase(value)
  if (EXTRUSION_PLACEHOLDER_EN[n]) return EXTRUSION_PLACEHOLDER_EN[n]
  if (n.includes("превью") && n.includes("документ")) return "Per technical document"

  return value
}
