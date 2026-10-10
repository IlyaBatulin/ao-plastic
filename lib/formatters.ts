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
  "Остаток на сите после просева с сеткой № 0,2 К, %, не более": "Residue on No. 0.2 K sieve after screening, % max.",
  "Толщина стенки": "Wall thickness",
  "Верхний диаметр": "Top diameter",
  "Диаметр дна": "Base diameter",
  "Размер одежды": "Clothing size",
  "Серия": "Product range",
  "Особенность": "Features",
  "Ершик": "Toilet brush",
  "Ёршик": "Toilet brush",
  "Подставка": "Holder",
  "PH": "pH",
  "Ph": "pH",
  "Усиленная светостабилизация, атмосферостойкость": "Enhanced light stabilisation and weather resistance",
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
  "Горючесть — время самостоятельного горения, с, не более": "Flammability — self-burning time, s max.",
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
  "Длина": "Length",
  "Диаметр": "Diameter",
  "Размер": "Size",
  "Размеры": "Dimensions",
  "Объем": "Volume",
  "Объём": "Volume",
  "Вес": "Weight",
  "Вес ящика": "Crate weight",
  "Максимальный вес содержимого": "Maximum payload",
  "Габаритные размеры, Ш×Д×В": "Overall dimensions, W×L×H",
  "Массовая доля нелетучих веществ, %": "Non-volatile matter, %",
  "Вязкость при 23 °C, мПа·с": "Viscosity at 23 °C, mPa·s",
  "Вязкость при 23 °C (шпиндель 2, 20 об/мин), мПа·с": "Viscosity at 23 °C (spindle 2, 20 rpm), mPa·s",
  "Минимальная температура пленкообразования, °C": "Minimum film-forming temperature, °C",
  "Тип дисперсии": "Dispersion type",
  "Плотность, г/см³": "Density, g/cm³",
  "Содержание остаточных мономеров, %, не более": "Residual monomers, % max.",
  "Температура стеклования, °C": "Glass-transition temperature, °C",
  "Технические показатели": "Technical data",
  "Влияние": "Effect",
  "Вместимость": "Capacity",
  "Кажущаяся плотность пенополистирола, кг/м³, не более": "Apparent density of expanded polystyrene, kg/m³ max.",
  "Комплектация": "Included components",
  "Массовая доля воды, %, не более": "Water content, % max.",
  "Массовая доля остаточного мономера (стирола), %, не более": "Residual monomer (styrene), % max.",
  "Массовая доля пентанов, %, в пределах": "Pentane content, %",
  "Массовая доля порообразователя, %, не менее": "Blowing agent content, % min.",
  "Массовая доля частиц основной фракции, %, не менее": "Main fraction content, % min.",
  "Материал ящика": "Crate material",
  "Метод": "Method",
  "Метод изготовления канистры": "Canister manufacturing method",
  "Метод изготовления крышки": "Cap manufacturing method",
  "Минимальный заказ": "Minimum order",
  "Остаток на сите с сеткой № 0,2 К после просева, %, не более": "Residue on No. 0.2 K sieve after screening, % max.",
  "Относительная вязкость, не менее": "Relative viscosity, min.",
  "Отношение вязкостей, в пределах": "Viscosity ratio",
  "Отношение вязкостей": "Viscosity ratio",
  "Плотность упаковываемых жидкостей": "Density of packaged liquids",
  "Показатель текучести расплава, г/10 мин, в пределах": "Melt flow rate, g/10 min",
  "Показатель текучести расплава, г/10 мин": "Melt flow rate (MFR), g/10 min",
  "Усадка при литье под давлением, %, в пределах": "Moulding shrinkage, %",
  "Относительное удлинение при разрыве, %, не менее": "Elongation at break, % min.",
  "Ударная вязкость по Изоду, кДж/м², не менее": "Izod impact strength, kJ/m² min.",
  "Предел текучести при растяжении, кгс/см², не менее": "Tensile yield strength, kgf/cm² min.",
  "Температура размягчения по Вика, °C, не менее": "Vicat softening temperature, °C min.",
  "Потеря массы при сушке, %, не более": "Mass loss on drying, % max.",
  "Прочность при растяжении, МПа (кгс/см²), не менее": "Tensile strength, MPa (kgf/cm²) min.",
  "Размер основной фракции по маркам": "Main fraction size by grade",
  "Размер частиц основной фракции": "Main bead size range",
  "Разрушающее напряжение при статическом изгибе, кгс/см² (МПа), не менее": "Breaking stress in static flexure, kgf/cm² (MPa) min.",
  "Система штабелирования": "Stacking system",
  "Сквозная перфорация": "Through perforation",
  "Срок изготовления": "Production lead time",
  "Температура кипения": "Boiling point",
  "Температура размягчения по Вика при P=5 кгс, °C, не ниже": "Vicat softening temperature at 5 kgf, °C min.",
  "Упаковка канистр": "Canister packaging",
  "Упаковка крышек": "Cap packaging",
  "Хранение": "Storage",
  "Чистота поверхности диска": "Moulded test disc surface quality",
  "Нормативный документ": "Specification",
  "Термостабилизированная марка": "Heat-stabilised grade",
  "Термо- и светостабилизированная марка": "Heat- and light-stabilised grade",
  "Морозостойкая марка": "Frost-resistant grade",
  "Разрешен контакт с пищевыми продуктами": "Approved for food contact",
  "Размер основной фракции": "Main fraction size",
  "Способ получения": "Production method",
  "Сорт": "Quality grade",
}

/** Точные совпадения значений характеристик RU → EN */
const SPEC_VALUE_EN_EXACT: Record<string, string> = {
  "Поверхность диска должна быть чистой и блестящей. Серебристость не допускается. Допускаются включения не более одной точки на площади 10 см² диаметром 0,3 мм": "The disc surface must be clean and glossy. Silver streaks are not permitted. Inclusions: no more than one spot 0.3 mm in diameter per 10 cm²",
  "Совок П2706 с резинкой + Щетка-сметка П2711": "Dustpan P2706 with a rubber edge + hand brush P2711",
  "Совок П2705 + Щетка-сметка П2711": "Dustpan P2705 + hand brush P2711",
  "При температуре не выше 20°C": "At a temperature not exceeding 20°C",
  "Поверхность чистая и блестящая; серебристость не допускается; включения - не более одной точки диаметром 0,3 мм на площади 10 см²": "Clean, glossy surface; no silver streaks; inclusions: no more than one spot 0.3 mm in diameter per 10 cm²",
  "Интерьерные и фасадные покрытия, лаки": "Interior and exterior coatings and varnishes",
  "АБС": "ABS",
  "АБС-пластик": "ABS plastic",
  "ПВХ": "PVC",
  "По заказу": "On request",
  "Черный, серый": "Black, grey",
  "Черный": "Black",
  "Желтый": "Yellow",
  "Синий": "Blue",
  "Повышение прочности и термостабильности": "Improved strength and thermal stability",
  "Темная жидкость": "Dark liquid",
  "Жидкость": "Liquid",
  "От 1000 шт": "From 1,000 pcs",
  "От 30 дней": "From 30 days",
  "Экструзия": "Extrusion",
  "От 500 кг": "From 500 kg",
  "От 20 дней": "From 20 days",
  "ПЭНД": "High-density polyethylene (HDPE)",
  "Полиэтилен н.д.": "High-density polyethylene (HDPE)",
  "Для пищевых продуктов": "For food-contact use",
  "С резиновой кромкой": "With a rubber edge",
  "С поворотным крюком": "With a swivel hook",
  "С поворотным крючком": "With a swivel hook",
  "С черенком 60 см": "With a 60 cm handle",
  "С абразивом": "With an abrasive layer",
  "Подставка + Ершик": "Holder and toilet brush",
  "Подставка+Ершик": "Holder and toilet brush",
  "Компакт": "Compact",
  "Лаки и краски по дереву и металлу, печатные краски": "Varnishes and paints for wood and metal; printing inks",
  "Да": "Yes",
  "Нет": "No",
  "только для неокрашенного материала": "uncoloured material only",
  "ТУ 2214-033-05762341-2009, с изм. № 7, № 8 и № 9":
    "TU 2214-033-05762341-2009, with Amendments No. 7, 8 and 9",
  "экструзионно-выдувной метод": "extrusion blow moulding",
  "литье под давлением": "injection moulding",
  "химически стойкие марки полиэтилена": "chemically resistant polyethylene grades",
  "канистра с крышкой": "canister with cap",
  "полиэтиленовые мешки по 5 штук": "polyethylene bags, 5 canisters per bag",
  "ящики из гофрированного картона, не менее 200 штук в коробке": "corrugated cardboard boxes, at least 200 caps per box",
  "Удобная система штабелирования": "Convenient stacking system",
  "синий, черный": "blue, black",
  "до 3 кг": "up to 3 kg",
  "175 гр": "175 g",
  "160 штук на поддоне (8 шт. в ряду, 20 рядов по высоте)": "160 units per pallet (8 per row, 20 rows high)",
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
  "Молочно-белая жидкость": "Milky-white liquid",
  "Анионная": "Anionic",
  "Интерьерные, фасадные и моющиеся краски, лаки, грунтовки": "Interior, exterior and washable paints, varnishes and primers",
  "Геосетки, стеклохолст": "Geogrids and glass fibre mats",
  "Краски для внутренних и наружных работ, лаки, грунтовки, шпатлёвки": "Interior and exterior paints, varnishes, primers and fillers",
  "Геосетки, стеклохолст, краски, грунтовки, шпатлёвки, штукатурки": "Geogrids, glass fibre mats, paints, primers, fillers and renders",
  "Клей для защитных плёнок и легкосъёмных лент": "Adhesive for protective films and removable tapes",
  "Клей для упаковочной ленты": "Adhesive for packaging tape",
  "Интерьерные и фасадные краски, материалы по древесине": "Interior and exterior paints and wood coatings",
  "Гидроизоляционные мембраны, мастики, шпатлёвки, герметики": "Waterproofing membranes, mastics, fillers and sealants",
  "Интерьерные бескоалесцентные краски, силикатные краски": "Coalescent-free interior paints and silicate paints",
  "По актуальной спецификации производителя": "According to the current manufacturer specification",
  "менее 1000": "< 1000",
  "менее 0": "< 0",
  "Первый": "First",
  "Порошок белого цвета": "White powder",
  "Э — эмульсионный": "E — emulsion process",
}

function normalizeSpecValueInput(text: string): string {
  return text.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim()
}

function latinizeProductCode(value: string): string {
  const map: Record<string, string> = {
    А: "A", Б: "B", В: "V", Г: "G", Д: "D", Е: "E", Ё: "E",
    Ж: "ZH", З: "Z", И: "I", Й: "Y", К: "K", Л: "L", М: "M",
    Н: "N", О: "O", П: "P", Р: "R", С: "S", Т: "T", У: "U",
    Ф: "F", Х: "KH", Ц: "TS", Ч: "CH", Ш: "SH", Щ: "SHCH",
    Ъ: "", Ы: "Y", Ь: "", Э: "E", Ю: "YU", Я: "YA",
  }
  return value
    .toUpperCase()
    .split("")
    .map((char) => map[char] ?? char)
    .join("")
    .replace(/KA\s*(\d)/g, "KA-$1")
    .replace(/MMZ\s*(\d)/g, "MMZ-$1")
    .replace(/F\s*(\d)/g, "F-$1")
}

/** Шаблоны для составных значений */
const SPEC_VALUE_PHRASES_EN: [RegExp, string][] = [
  [/диаметр/gi, "diameter"],
  [/ширина/gi, "width"],
  [/длина/gi, "length"],
  [/высота/gi, "height"],
  [/до\s+(\d+(?:[.,]\d+)?)\s*г\/см3/gi, "up to $1 g/cm³"],
  [/(\d+(?:[.,]\d+)?)\s*дм3/gi, "$1 dm³"],
  [/(\d+(?:[.,]\d+)?)\s*гр\b/gi, "$1 g"],
  [/КА\s*[-–]?\s*(\d+)\s*А/gi, "KA-$1A"],
  [/КА(?=\s*[-–]?\s*\d)/gi, "KA"],
  [/\bУПЕКС\b/gi, "UPEX"],
  [/ТУ/g, "TU"],
  [/ГОСТ/g, "GOST"],
  [/с\s+изм\.\s*(\d+)/gi, "rev. $1"],
  [/изменение\s*№?\s*(\d+)/gi, "amendment No. $1"],
  [/более\s+(\d+(?:[.,]\d+)?)\s*мм/gi, "> $1 mm"],
  [/менее\s+(\d+(?:[.,]\d+)?)\s*мм/gi, "< $1 mm"],
  [/(\d+(?:[.,]\d+)?)\s*-\s*(\d+(?:[.,]\d+)?)\s*кг\/м³/gi, "$1–$2 kg/m³"],
  [/(\d+(?:[.,]\d+)?)\s*-\s*(\d+(?:[.,]\d+)?)\s*мм/gi, "$1–$2 mm"],
  [/([>≥<≤])\s*(\d+(?:[.,]\d+)?)\s*мм/gi, "$1 $2 mm"],
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

  // Translate complete terms before smaller fragments. Preserve inclusive bounds.
  let result = trimmed
    .replace(/не\s+более\s+(\d)/gi, "≤ $1")
    .replace(/не\s+менее\s+(\d)/gi, "≥ $1")
    .replace(/менее\s+(\d)/gi, "< $1")
    .replace(/более\s+(\d)/gi, "> $1")
    .replace(/Полистирол общего назначения/gi, "General-purpose polystyrene")
    .replace(/с развальцовкой/gi, "with a flared end")
    .replace(/защитная/gi, "protective")
    .replace(/перфорированная/gi, "perforated")
    .replace(/ОКП/g, "OKP")
    .replace(/(?<![а-яё])или(?![а-яё])/gi, "or")
  for (const [pattern, replacement] of SPEC_VALUE_PHRASES_EN) {
    result = result.replace(pattern, replacement)
  }

  const units: Record<string, string> = { кг: "kg", гр: "g", г: "g", л: "L", см: "cm", мм: "mm", м: "m" }
  result = result
    .replace(/(?<=[\d)\s])(кг|гр|см|мм|г|л|м)(?![а-яёa-z])/gi, (unit) => units[unit.toLowerCase()] ?? unit)
    .replace(/(?<=\d)\s*[хХ]\s*(?=\d)/g, " × ")
    .replace(/(\d),(\d)/g, "$1.$2")

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
    const known = SPEC_KEY_EN[ruLabel] ?? SPEC_KEY_EN[rawKey]
    if (known) return known
    const sieve = ruLabel.match(/^Массовая доля (остатка на сите|частиц,? прошедших через сито) (?:с размером ячеек )?([\d,.]+) мм(?: \(поддон\))?,? %,? (не более|не менее)$/i)
    if (sieve) return `${sieve[1].startsWith("остатка") ? "Residue on" : "Particles passing through"} ${sieve[2].replace(",", ".")} mm sieve, % ${sieve[3] === "не более" ? "max." : "min."}`
    return ruLabel
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
    const normalizedKey = normalizeSpecKey(key)
    if (normalizedKey === "Артикул" || normalizedKey === "Шифр изделия") {
      return latinizeProductCode(text)
    }

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

