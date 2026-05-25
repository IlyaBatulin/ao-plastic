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
  "Кажущаяся_плотность_кг_м3": "Кажущаяся плотность, кг/м³",
  "Порообразователь_число": "Порообразователь, %",
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
}

export function formatSpecKey(rawKey: string, lang: "ru" | "en" = "ru"): string {
  if (!rawKey) return ""

  if (lang === "en" && SPEC_KEY_EN[rawKey]) {
    return SPEC_KEY_EN[rawKey]
  }

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

export function formatSpecValue(key: string, value: any): string {
  if (value === null || value === undefined) return "—"
  
  if (Array.isArray(value)) {
    return value.join(", ")
  }

  // Если значение уже строка и содержит единицы измерения, возвращаем как есть
  if (typeof value === "string" && (value.includes("%") || value.includes("°") || value.includes("/"))) {
    return value
  }

  // Если значение - число и есть единицы измерения для этого ключа, добавляем их
  if (typeof value === "number" && VALUE_UNITS[key]) {
    // Для процентов и температур без пробела перед единицами
    if (VALUE_UNITS[key].startsWith("%") || VALUE_UNITS[key].startsWith("°")) {
      return `${value}${VALUE_UNITS[key]}`
    }
    return `${value}${VALUE_UNITS[key]}`
  }

  return String(value)
}

