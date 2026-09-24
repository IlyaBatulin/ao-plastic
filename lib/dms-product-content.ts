type DmsTitle = { ru: string; en: string; type?: string }

// These descriptions are based on the existing catalog photos. Where several
// variants share one photo, we deliberately do not invent a different purpose.
const INJECTION_TITLES: Record<string, DmsTitle> = {
  "ka-02": { ru: "Скрепка с перемычкой", en: "Clip with bridge" },
  "ka-10a": { ru: "Пробка транспортная цилиндрическая", en: "Cylindrical transit plug" },
  "ka-19": { ru: "Втулка с широким буртиком", en: "Bushing with wide flange" },
  "ka-23": { ru: "Втулка кольцевая", en: "Ring-shaped bushing" },
  "ka-80": { ru: "Скрепка крепёжная чёрная", en: "Black push-in clip" },
  "ka-96": { ru: "Скрепка крепёжная светлая", en: "Light-coloured push-in clip" },
  "ka-122": { ru: "Пробка прямоугольная", en: "Rectangular plug" },
  "ka-280a": { ru: "Чистильщик кольцевой", en: "Ring-shaped cleaner" },
  "ka-281a": { ru: "Чистильщик кольцевой широкий", en: "Wide ring-shaped cleaner" },
  "ka-282a": { ru: "Чистильщик кольцевой узкий", en: "Narrow ring-shaped cleaner" },
  "ka-283": { ru: "Кольцо защитное серое", en: "Gray protective ring" },
  "ka-284": { ru: "Кольцо защитное светлое", en: "Light-coloured protective ring" },
  "ka-285": { ru: "Кольцо защитное прозрачное", en: "Clear protective ring" },
  "ka-286a": { ru: "Проставка кольцевая с фиксаторами", en: "Ring spacer with retaining tabs" },
  "ka-287a": { ru: "Проставка кольцевая широкая", en: "Wide ring spacer" },
  "ka-288a": { ru: "Проставка кольцевая узкая", en: "Narrow ring spacer" },
  "ka-345a": { ru: "Поршень цилиндрический чёрный", en: "Black cylindrical piston" },
  "ka-41a": { ru: "Заглушка отверстия внутренней панели", en: "Inner panel hole plug" },
  "ka-555": { ru: "Втулка с буртиком", en: "Flanged bushing" },
  "ka-561": { ru: "Поршень дисковый светлый", en: "Light-coloured disc piston" },
  "ka-562": { ru: "Кольцо направляющее чёрное", en: "Black guide ring" },
  "ka-564": { ru: "Кольцо направляющее светлое широкое", en: "Wide light-coloured guide ring" },
  "ka-565": { ru: "Кольцо направляющее светлое узкое", en: "Narrow light-coloured guide ring" },
  "ka-568": { ru: "Крышка красная с держателем", en: "Red cover with tab" },
  "ka-568a": { ru: "Крышка жёлтая с держателем", en: "Yellow cover with tab" },
  "ka-572": { ru: "Крышка круглая красная", en: "Red round cover" },
  "ka-572a": { ru: "Крышка круглая жёлтая", en: "Yellow round cover" },
  "ka-583": { ru: "Пробка круглая светлая", en: "Light-coloured round plug" },
  "ka-586": { ru: "Поршень цилиндрический светлый", en: "Light-coloured cylindrical piston" },
  "ka-587": { ru: "Ролик", en: "Roller" },
  "ka-589": { ru: "Втулка цилиндрическая", en: "Cylindrical bushing" },
  "ka-603": { ru: "Крышка круглая чёрная", en: "Black round cover" },
  "ka-343a": { ru: "Направляющий диск", en: "Guide disc" },
}

const EXTRUSION_TITLES: Record<number, DmsTitle> = {
  53: { ru: "Трубка экструзионная синяя", en: "Blue extruded tube", type: "Трубка" },
  54: { ru: "Профиль экструзионный чёрный", en: "Black extruded profile", type: "Профиль" },
  55: { ru: "Профиль прозрачный П-образный", en: "Clear U-shaped profile", type: "Профиль" },
  56: { ru: "Профиль прозрачный П-образный", en: "Clear U-shaped profile", type: "Профиль" },
  57: { ru: "Профиль облицовочный красно-чёрный", en: "Red and black trim profile", type: "Профиль" },
  58: { ru: "Профиль облицовочный красно-чёрный", en: "Red and black trim profile", type: "Профиль" },
  59: { ru: "Профиль облицовочный красно-чёрный", en: "Red and black trim profile", type: "Профиль" },
  60: { ru: "Профиль светлый П-образный", en: "Light-coloured U-shaped profile", type: "Профиль" },
  61: { ru: "Профиль светлый П-образный", en: "Light-coloured U-shaped profile", type: "Профиль" },
  62: { ru: "Трубка экструзионная красная", en: "Red extruded tube", type: "Трубка" },
  63: { ru: "Профиль чёрный П-образный", en: "Black U-shaped profile", type: "Профиль" },
  64: { ru: "Профиль экструзионный серый", en: "Gray extruded profile", type: "Профиль" },
  65: { ru: "Профиль экструзионный светлый", en: "Light-coloured extruded profile", type: "Профиль" },
  66: { ru: "Профиль экструзионный светлый", en: "Light-coloured extruded profile", type: "Профиль" },
  67: { ru: "Профиль экструзионный светлый", en: "Light-coloured extruded profile", type: "Профиль" },
  68: { ru: "Профиль экструзионный светлый", en: "Light-coloured extruded profile", type: "Профиль" },
  69: { ru: "Профиль экструзионный серый", en: "Gray extruded profile", type: "Профиль" },
  70: { ru: "Профиль белый П-образный", en: "White U-shaped profile", type: "Профиль" },
  71: { ru: "Трубка экструзионная голубая", en: "Light-blue extruded tube", type: "Трубка" },
  72: { ru: "Профиль чёрный многоканальный", en: "Black multi-channel profile", type: "Профиль" },
  73: { ru: "Профиль чёрный многоканальный", en: "Black multi-channel profile", type: "Профиль" },
  74: { ru: "Профиль чёрный многоканальный", en: "Black multi-channel profile", type: "Профиль" },
  75: { ru: "Профиль чёрный многоканальный", en: "Black multi-channel profile", type: "Профиль" },
  76: { ru: "Трубка экструзионная светлая", en: "Light-coloured extruded tube", type: "Трубка" },
  77: { ru: "Трубка экструзионная светлая", en: "Light-coloured extruded tube", type: "Трубка" },
  78: { ru: "Профиль экструзионный чёрный гибкий", en: "Flexible black extruded profile", type: "Профиль" },
  79: { ru: "Профиль экструзионный красно-чёрный", en: "Red and black extruded profile", type: "Профиль" },
  80: { ru: "Трубка экструзионная синяя", en: "Blue extruded tube", type: "Трубка" },
}

function meaningfulSize(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim() || /по документу|по чертежу/i.test(value)) return null
  return value.trim().replace(/\s*х\s*/gi, " × ").replace(/\s*мм\b/i, " мм")
}

export function getDmsEditorialTitle(
  id: string,
  sourceName: string,
  sizeRaw?: unknown
): DmsTitle | null {
  if (id.startsWith("extrusion-")) {
    const number = Number(id.slice("extrusion-".length))
    const fixed = EXTRUSION_TITLES[number]
    if (fixed) return fixed
    if (sourceName.trim() === "Трубка") {
      const size = meaningfulSize(sizeRaw)
      return {
        ru: size ? `Трубка экструзионная ${size}` : "Трубка экструзионная",
        en: size
          ? `Extruded tube ${size.replace(/мм/g, "mm").replace(/,/g, ".")}`
          : "Extruded tube",
        type: "Трубка",
      }
    }
    return null
  }
  return INJECTION_TITLES[id] ?? null
}

export function isMeaningfulDmsSize(value: unknown): boolean {
  return meaningfulSize(value) !== null
}

export function mapDmsExtrusionProduct(item: Record<string, unknown>) {
  const id = `extrusion-${item.id}`
  const title = getDmsEditorialTitle(id, String(item.name ?? ""), item.size_raw)
  const size = isMeaningfulDmsSize(item.size_raw) ? String(item.size_raw) : null
  const length = item.length_raw ? String(item.length_raw) : null
  const type = title?.type ?? String(item.type ?? "Экструзионное изделие")
  const details = [
    size ? `Габаритные размеры: ${size}` : null,
    length && !/поставка в бухтах/i.test(length) ? `Длина изделия: ${length}` : null,
    item.length_kind === "coil" ? "Поставка в бухтах" : null,
  ].filter(Boolean)

  return {
    id,
    name: title?.ru ?? String(item.name ?? "Экструзионное изделие"),
    brand: item.code,
    type,
    subtype: item.subtype,
    subcategory: "extrusion",
    description: details.join(" · ") || "Экструзионная деталь для машиностроения",
    image: item.image,
    specifications: {
      "Тип изделия": type,
      ...(item.subtype ? { Подтип: item.subtype } : {}),
      ...(size ? { "Габаритные размеры": size } : {}),
      ...(length && !/поставка в бухтах/i.test(length) ? { "Длина изделия": length } : {}),
      ...(item.length_kind === "coil"
        ? { Поставка: "в бухтах" }
        : item.length_kind === "fixed"
          ? { Поставка: "фиксированная длина" }
          : {}),
    },
  }
}
