import {
  isExtrusionPartTypeKey,
  isLengthSpecKey,
  isSupplyPhrase,
  translateExtrusionPartType,
  translateExtrusionPlaceholder,
  translateSupplyPhrase,
} from "@/lib/extrusion-i18n"

const SPEC_KEY_MAP: Record<string, string> = {
  // Экструзионные (legacy / англ. ключи из импорта)
  "size_raw": "Габаритные размеры",
  "Size raw": "Габаритные размеры",
  "length_raw": "Длина изделия",
  "code": "Шифр изделия",
  "type": "Тип изделия",
  "subtype": "Подтип",
  "length_kind": "Поставка",
  // Общие поля
  "Application": "Применение",
  "Применение": "Применение",
  "Type": "Тип",
  "Тип": "Тип",
  "Grade": "Марка",
  "Марка": "Марка",
  "Packaging": "Упаковка",
  "Упаковка": "Упаковка",
  "Granule size": "Размер гранул",
  "Размер гранул": "Размер гранул",
  // АБС-пластики
  "Плотность_кг_м3": "Плотность, кг/м³",
  "Плотность_кг_м3_мин": "Плотность (мин.), кг/м³",
  "Плотность_кг_м3_макс": "Плотность (макс.), кг/м³",
  "Фракция_мин": "Фракция (мин)",
  "Фракция_макс": "Фракция (макс)",
  "Усадка_проц": "Усадка, %",
  "Показатель_текучести_расплава_MFR_г_10мин": "Показатель текучести расплава (MFR), г/10 мин",
  "Относительное_удлинение_при_разрыве_проц": "Относительное удлинение при разрыве, %",
  "Ударная_вязкость_по_Изоду_кДж_м2": "Ударная вязкость по Изоду, кДж/м²",
  "Предел_текучести_при_растяжении_МПа": "Предел текучести при растяжении, МПа",
  "Температура_размягчения_по_Вика_градС": "Температура размягчения по Вика, °C",
  "Блеск_проц": "Блеск, %",
  // Полистирол
  "Разрушающее_напряжение_МПа": "Разрушающее напряжение, МПа",
  "Разрушающее_напряжение_при_статическом_изгибе_МПа": "Разрушающее напряжение при статическом изгибе, МПа",
  "Кажущаяся_плотность_кг_м3": "Кажущаяся плотность, кг/м³",
  "Относительная_вязкость": "Относительная вязкость",
  "Насыпная плотность": "Насыпная плотность",
  "Порообразователь_число": "Порообразователь, %",
  "Коэффициент вспенивания": "Коэффициент вспенивания",
  "Фракция, мм": "Фракция, мм",
  "Фракция": "Фракция",
  "Потеря_массы_при_сушке_проц": "Потеря массы при сушке, %",
  "Массовая_доля_свободного_стирола_проц": "Массовая доля свободного стирола, %",
  "Массовая_доля_остаточного_стирола_проц": "Массовая доля остаточного стирола, %",
  "Горючесть_время_самовоспламенения_сек": "Горючесть — время самовоспламенения, с",
  "Массовая_доля_частиц_основной_фракции_проц": "Массовая доля частиц основной фракции, %",
  "Массовая_доля_остатка_на_сите_1_6_мм_проц": "Массовая доля остатка на сите 1,6 мм, %",
  "Массовая_доля_остатка_на_сите_1_4_мм_проц": "Массовая доля остатка на сите 1,4 мм, %",
  "Массовая_доля_остатка_на_сите_3_2_мм_проц": "Массовая доля остатка на сите 3,2 мм, %",
  "Массовая_доля_остатка_на_сите_0_9_мм_проц": "Массовая доля остатка на сите 0,9 мм, %",
  "Массовая_доля_частиц_прошедших_через_сито_0_4_мм_проц":
    "Массовая доля частиц, прошедших через сито 0,4 мм, %",
  "Разрушающее_напряжение_при_статическом_изгибе_кг_см2":
    "Разрушающее напряжение при статическом изгибе, кг/см²",
  "ПТР": "ПТР",
  "Высота": "Высота",
  "Ширина": "Ширина",
  "Артикул": "Артикул",
  "Материал": "Материал",
  "Назначение": "Назначение",
  "Вес изделия": "Вес изделия",
  "Количество в упаковке": "Количество в упаковке",
}

const SPEC_KEY_EN: Record<string, string> = {
  "Применение": "Application",
  Application: "Application",
  "Тип": "Type",
  Type: "Type",
  "Марка": "Grade",
  Grade: "Grade",
  "Упаковка": "Packaging",
  Packaging: "Packaging",
  "Размер гранул": "Granule size",
  "Granule size": "Granule size",
  "Тип изделия": "Part type",
  "Подтип": "Subtype",
  "Габаритные размеры": "Dimensions",
  "Шифр изделия": "Product code",
  "Длина изделия": "Length",
  "Поставка": "Supply",
  "Плотность": "Density",
  "Цвет": "Color",
  "Чистота": "Purity",
  "Температура размягчения": "Vicat softening temperature",
  "Прочность при изгибе": "Flexural strength",
  "Ударная вязкость": "Impact strength",
  "Насыпная плотность": "Bulk density",
  "Коэффициент вспенивания": "Expansion ratio",
  "Температура плавления": "Melting temperature",
  "Сухой остаток": "Solids content",
  "Вязкость": "Viscosity",
  "Внешний вид": "Appearance",
  "Плотность, кг/м³": "Density, kg/m³",
  "Фракция (мин)": "Fraction (min)",
  "Фракция (макс)": "Fraction (max)",
  "Фракция, мм": "Fraction, mm",
  "Кажущаяся плотность, кг/м³": "Apparent density, kg/m³",
  "Разрушающее напряжение, МПа": "Breaking stress, MPa",
  "Разрушающее напряжение при статическом изгибе, МПа": "Breaking stress in static flexure, MPa",
  "Относительная вязкость": "Relative viscosity",
  "Порообразователь, %": "Blowing agent, %",
  "Показатель текучести расплава (MFR), г/10 мин": "Melt flow rate (MFR), g/10 min",
  "Относительное удлинение при разрыве, %": "Elongation at break, %",
  "Ударная вязкость по Изоду, кДж/м²": "Izod impact strength, kJ/m²",
  "Предел текучести при растяжении, МПа": "Tensile yield strength, MPa",
  "Температура размягчения по Вика, °C": "Vicat softening temperature, °C",
  "Блеск, %": "Gloss, %",
  "Усадка, %": "Shrinkage, %",
  "Фракция": "Fraction",
  "Потеря массы при сушке, %": "Mass loss on drying, %",
  "Потеря массы при сушке %": "Mass loss on drying, %",
  "Массовая доля свободного стирола, %": "Free styrene content, %",
  "Массовая доля свободного стирола %": "Free styrene content, %",
  "Массовая доля остаточного стирола, %": "Residual styrene content, %",
  "Массовая доля остаточного стирола %": "Residual styrene content, %",
  "Горючесть — время самовоспламенения, с": "Flammability — time to self-ignition, s",
  "Горючесть время самовоспламенения сек": "Flammability — time to self-ignition, s",
  "Массовая доля частиц основной фракции, %": "Main fraction particle content, %",
  "Массовая доля частиц основной фракции %": "Main fraction particle content, %",
  "Массовая доля остатка на сите 1,6 мм, %": "Residue on 1.6 mm sieve, %",
  "Массовая доля остатка на сите 1 6 мм %": "Residue on 1.6 mm sieve, %",
  "Массовая доля остатка на сите 1,4 мм, %": "Residue on 1.4 mm sieve, %",
  "Массовая доля остатка на сите 1 4 мм %": "Residue on 1.4 mm sieve, %",
  "Массовая доля остатка на сите 3,2 мм, %": "Residue on 3.2 mm sieve, %",
  "Массовая доля остатка на сите 3 2 мм %": "Residue on 3.2 mm sieve, %",
  "Массовая доля остатка на сите 0,9 мм, %": "Residue on 0.9 mm sieve, %",
  "Массовая доля остатка на сите 0 9 мм %": "Residue on 0.9 mm sieve, %",
  "Массовая доля частиц, прошедших через сито 0,4 мм, %":
    "Particles passing through 0.4 mm sieve, %",
  "Массовая доля частиц прошедших через сито 0 4 мм %":
    "Particles passing through 0.4 mm sieve, %",
  "Разрушающее напряжение при статическом изгибе, кг/см²":
    "Breaking stress in static flexure, kg/cm²",
  "ПТР": "MFR",
  "Высота": "Height",
  "Ширина": "Width",
  "Артикул": "SKU",
  "Материал": "Material",
  "Назначение": "Purpose",
  "Вес изделия": "Product weight",
  "Количество в упаковке": "Quantity per pack",
}

/** Точные совпадения значений характеристик RU → EN */
const SPEC_VALUE_EN_EXACT: Record<string, string> = {
  "Мешки 25 кг": "Bags, 25 kg",
  "Мешки 15 кг": "Bags, 15 kg",
  "Комплект": "Set",
  "Цистерны, бочки": "Tank trucks, drums",
  "Цистерны, бочки 200 л": "Tank trucks, 200 L drums",
  "Бочки 200 л, еврокубы 1000 л": "200 L drums, 1000 L IBC totes",
  "Автомобильные панели, корпуса приборов": "Automotive panels, appliance housings",
  "Листы, профили, трубы": "Sheets, profiles, pipes",
  "Теплоизоляция, упаковка": "Thermal insulation, packaging",
  "Теплоизоляция": "Thermal insulation",
  "Легкая теплоизоляция": "Light thermal insulation",
  "0.5-2.0 мм": "0.5–2.0 mm",
  "15-20 кг/м³": "15–20 kg/m³",
  "20-25 кг/м³": "20–25 kg/m³",
  "Листы, одноразовая посуда": "Sheets, disposable tableware",
  "Строительные краски, ЛКМ": "Construction paints, coatings",
  "Автомобильные дверные ручки": "Automotive door handles",
  "Топливо, компонент ЛКМ": "Fuel, paint component",
  "Промышленное применение": "Industrial applications",
  "в бухтах": "in coils",
  "фиксированная длина": "fixed length",
  "Экструзионный": "Extrusion",
  "Литьевой": "Injection molding",
  "Листы, профили, изделия": "Sheets, profiles, products",
  "Натуральный": "Natural",
  "Полипропилен": "Polypropylene",
  "Для мангала, барбекю": "For barbecue grill",
}

function normalizeSpecValueInput(text: string): string {
  return text.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim()
}

/** Шаблоны для составных значений */
const SPEC_VALUE_PHRASES_EN: [RegExp, string][] = [
  [/(\d+(?:[.,]\d+)?)\s*-\s*(\d+(?:[.,]\d+)?)\s*кг\/м³/gi, "$1–$2 kg/m³"],
  [/(\d+(?:[.,]\d+)?)\s*-\s*(\d+(?:[.,]\d+)?)\s*мм/gi, "$1–$2 mm"],
  [/(?:>|≥)\s*(\d+(?:[.,]\d+)?)\s*мм/gi, "> $1 mm"],
  [/(?:<|≤)\s*(\d+(?:[.,]\d+)?)\s*мм/gi, "< $1 mm"],
  [/(\d+(?:[.,]\d+)?)\s*мм/gi, "$1 mm"],
  [/(\d+(?:[.,]\d+)?)\s*г\/см³/gi, "$1 g/cm³"],
  [/(\d+(?:[.,]\d+)?)\s*г\/10\s*мин/gi, "$1 g/10 min"],
  [/(\d+(?:[.,]\d+)?)\s*МПа/gi, "$1 MPa"],
  [/(\d+(?:[.,]\d+)?)\s*кДж\/м²/gi, "$1 kJ/m²"],
  [/(\d+)\s*шт/gi, "$1 pcs"],
  [/(\d+(?:[.,]\d+)?)\s*г\b/gi, "$1 g"],
  [/экструзионный/gi, "Extrusion"],
  [/литьевой/gi, "Injection molding"],
  [/листы,\s*профили,\s*изделия/gi, "Sheets, profiles, products"],
  [/полипропилен/gi, "Polypropylene"],
  [/для мангала,\s*барбекю/gi, "For barbecue grill"],
  [/натуральный/gi, "Natural"],
  [/легкая теплоизоляция/gi, "Light thermal insulation"],
  [/Мешки\s+(\d+)\s*кг/gi, "Bags, $1 kg"],
  [/еврокубы\s+(\d+)\s*л/gi, "$1 L IBC totes"],
  [/бочки\s+(\d+)\s*л/gi, "$1 L drums"],
  [/(\d+)\s*л\b/gi, "$1 L"],
  [/(\d+)\s*кг\b/gi, "$1 kg"],
  [/Цистерны/g, "Tank trucks"],
  [/цистерны/g, "tank trucks"],
  [/бочки/gi, "drums"],
  [/Мешки/g, "Bags"],
  [/мешки/g, "bags"],
  [/штук/g, "pcs"],
  [/литейный/gi, "casting-grade"],
  [/самозатухающийся/gi, "self-extinguishing"],
]

function translateSpecValueText(text: string, lang: "ru" | "en"): string {
  if (lang !== "en" || !text) return text

  const trimmed = normalizeSpecValueInput(text)
  if (SPEC_VALUE_EN_EXACT[trimmed]) {
    return SPEC_VALUE_EN_EXACT[trimmed]
  }

  const lower = trimmed.toLowerCase()
  for (const [ru, en] of Object.entries(SPEC_VALUE_EN_EXACT)) {
    if (ru.toLowerCase() === lower) return en
  }

  let result = trimmed
  for (const [pattern, replacement] of SPEC_VALUE_PHRASES_EN) {
    result = result.replace(pattern, replacement)
  }

  return result
}

function normalizeSpecKey(rawKey: string): string {
  if (!rawKey) return ""

  if (SPEC_KEY_MAP[rawKey]) {
    return SPEC_KEY_MAP[rawKey]
  }

  let key = rawKey.replace(/_/g, " ").replace(/\s+/g, " ").trim()

  key = key.replace(/кг м3/gi, "кг/м³")
  key = key.replace(/г 10мин/gi, "г/10 мин")
  key = key.replace(/проц/gi, "%")
  key = key.replace(/градс/gi, "°C")

  if (key.length > 0) {
    key = key[0].toUpperCase() + key.slice(1)
  }

  return key
}

export function formatSpecKey(
  rawKey: string,
  lang: "ru" | "en" = "ru",
  value?: unknown
): string {
  if (!rawKey) return ""

  const ruLabel = normalizeSpecKey(rawKey)

  if (lang === "en") {
    if (value != null && isLengthSpecKey(rawKey) && isSupplyPhrase(String(value))) {
      return SPEC_KEY_EN["Поставка"] ?? "Supply"
    }
    return SPEC_KEY_EN[ruLabel] ?? SPEC_KEY_EN[rawKey] ?? ruLabel
  }

  return ruLabel
}

// Единицы измерения для числовых значений (извлекаются из ключа)
const VALUE_UNITS: Record<string, string> = {
  "Плотность_кг_м3": " кг/м³",
  "Плотность_кг_м3_мин": " кг/м³",
  "Плотность_кг_м3_макс": " кг/м³",
  "Усадка_проц": "%",
  "Показатель_текучести_расплава_MFR_г_10мин": " г/10 мин",
  "Относительное_удлинение_при_разрыве_проц": "%",
  "Ударная_вязкость_по_Изоду_кДж_м2": " кДж/м²",
  "Предел_текучести_при_растяжении_МПа": " МПа",
  "Температура_размягчения_по_Вика_градС": "°C",
  "Блеск_проц": "%",
  "Разрушающее_напряжение_МПа": " МПа",
  "Кажущаяся_плотность_кг_м3": " кг/м³",
  "Порообразователь_число": "%",
}

const VALUE_UNITS_EN: Record<string, string> = {
  "Плотность_кг_м3": " kg/m³",
  "Плотность_кг_м3_мин": " kg/m³",
  "Плотность_кг_м3_макс": " kg/m³",
  "Усадка_проц": "%",
  "Показатель_текучести_расплава_MFR_г_10мин": " g/10 min",
  "Относительное_удлинение_при_разрыве_проц": "%",
  "Ударная_вязкость_по_Изоду_кДж_м2": " kJ/m²",
  "Предел_текучести_при_растяжении_МПа": " MPa",
  "Температура_размягчения_по_Вика_градС": "°C",
  "Блеск_проц": "%",
  "Разрушающее_напряжение_МПа": " MPa",
  "Кажущаяся_плотность_кг_м3": " kg/m³",
  "Порообразователь_число": "%",
}

export function formatSpecValue(key: string, value: any, lang: "ru" | "en" = "ru"): string {
  if (value === null || value === undefined) return "—"

  if (Array.isArray(value)) {
    return value.map((item) => translateSpecValueText(String(item), lang)).join(", ")
  }

  const units = lang === "en" ? VALUE_UNITS_EN : VALUE_UNITS

  // Если значение - число и есть единицы измерения для этого ключа, добавляем их
  if (typeof value === "number" && units[key]) {
    if (units[key].startsWith("%") || units[key].startsWith("°")) {
      return `${value}${units[key]}`
    }
    return `${value}${units[key]}`
  }

  const text = String(value)

  if (lang === "en") {
    const supply = translateSupplyPhrase(text, lang)
    if (supply !== text) return supply

    const placeholder = translateExtrusionPlaceholder(text, lang)
    if (placeholder !== text) return placeholder

    if (isExtrusionPartTypeKey(key) || normalizeSpecKey(key) === "Тип изделия") {
      const partType = translateExtrusionPartType(text, lang)
      if (partType !== text) return partType
    }
  }

  // Числовые строки с единицами — только переводим подписи, не трогаем чистые числа
  if (typeof value === "string" && (text.includes("%") || text.includes("°") || text.includes("/"))) {
    return translateSpecValueText(text, lang)
  }

  return translateSpecValueText(text, lang)
}

