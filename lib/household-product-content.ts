type ProductLike = Record<string, any>

const BOX_PRODUCT = {
  id: "box-polymer",
  name: "Ящик полимерный (черный, синий)",
  brand: "Ящик полимерный",
  type: "Литьевое изделие",
  subcategory: "boxes",
  description:
    "Полимерный ящик для упаковки, хранения и транспортировки свежих грибов, овощей, ягод, зелени и других пищевых продуктов.",
  image: "/prevyu/produktsiya/yaschik-polimernyi-1.jpeg",
  package_quantity: 160,
  specifications: {
    "Размер": "299 мм (ширина) × 399 мм (длина) × 123 мм (высота)",
    "Сквозная перфорация": "Да",
    "Система штабелирования": "Удобная система штабелирования",
    "Максимальный вес содержимого": "до 3 кг",
    "Вес ящика": "175 гр",
    "Материал ящика": "полипропилен",
    "Цвет": "синий, черный",
    "Поставка": "160 штук на поддоне (8 шт. в ряду, 20 рядов по высоте)",
  },
  detailSections: [
    {
      title: "Преимущества",
      paragraphs: [
        "Пластиковые ящики от АО «Пластик» идеально подходят для упаковки, хранения и транспортировки свежих грибов, овощей, ягод, зелени и других пищевых продуктов.",
        "Сквозная перфорация ящика обеспечивает необходимую вентиляцию содержимого и позволяет сохранять высокое качество свежих продуктов.",
        "Благодаря продуманной конструкции ящики могут штабелироваться один на другой, что предотвращает высыпание и повреждение продуктов, а также экономит место и придает устойчивость грузу при транспортировке.",
        "Полимерный ящик выдерживает до 3 кг упакованной в него продукции, при этом его собственная масса составляет всего 175 гр, что дает экономию логистических расходов.",
        "Применяемый для изготовления ящика полипропилен обеспечивает таре не только легкость, но и прочность, а также экологичность за счет возможности вторичной переработки.",
      ],
    },
    {
      title: "Применение",
      paragraphs: ["Ящик может быть использован:"],
      items: [
        "многократно в качестве оборотной тары, долго сохраняя прочность и привлекательный внешний вид",
        "в качестве внутрицеховой тары для пищевых производств",
        "однократно с возможностью последующей вторичной переработки",
      ],
      after: [
        "Ящики производства АО «Пластик» — это экономичное и экологичное решение задач хранения, логистики и презентации товара в торговых залах.",
      ],
    },
    {
      title: "Поставка",
      paragraphs: [
        "Ящики поставляются оптовыми партиям в промышленной упаковке: 160 штук на поддоне (8 шт. в ряду, 20 рядов по высоте). Возможны другие способы и виды упаковки по согласованию с потребителем.",
        "Продажа продукции осуществляется оптом со склада на производстве в г. Узловая Тульской области с доставкой транспортными компаниями в любой регион.",
      ],
    },
  ],
  detailSectionsEn: [
    {
      title: "Benefits",
      paragraphs: [
        "JSC Plastic polymer crates are designed for packaging, storage and transportation of fresh mushrooms, vegetables, berries, herbs and other food products.",
        "Through perforations provide ventilation and help preserve product quality. The stackable design protects the contents, saves space and keeps loads stable during transportation.",
        "Each crate carries up to 3 kg while weighing only 175 g. Polypropylene makes it lightweight, durable and recyclable.",
      ],
    },
    {
      title: "Applications",
      paragraphs: ["The crate can be used as reusable transport packaging, in food-production facilities or as recyclable single-use packaging."],
    },
    {
      title: "Supply",
      paragraphs: [
        "Crates are supplied in industrial packaging: 160 units per pallet. Other packaging options are available by agreement. Wholesale delivery is available from the production site in Uzlovaya, Tula Region, to any region of Russia.",
      ],
    },
  ],
}

const CANISTER_PRODUCT = {
  id: "canister-21-5l",
  name: "Канистры полимерные с крышками",
  brand: "Канистра полимерная",
  type: "Экструзионно-выдувное изделие",
  subcategory: "canisters",
  description:
    "Канистры полимерные с крышками вместимостью 21,5 дм3 для упаковывания, транспортирования и хранения пищевой, химической и другой продукции.",
  image: "/prevyu/produktsiya/kanistra-0.jpeg",
  package_quantity: 5,
  specifications: {
    "Вместимость": "21,5 дм3",
    "Габаритные размеры, Ш×Д×В": "230 × 285 × 410 мм",
    "Метод изготовления канистры": "экструзионно-выдувной метод",
    "Метод изготовления крышки": "литье под давлением",
    "Материал": "химически стойкие марки полиэтилена",
    "Плотность упаковываемых жидкостей": "до 1,35 г/см3",
    "Комплектация": "канистра с крышкой",
    "Упаковка канистр": "полиэтиленовые мешки по 5 штук",
    "Упаковка крышек": "ящики из гофрированного картона, не менее 200 штук в коробке",
  },
  detailSections: [
    {
      title: "Описание",
      image: "/prevyu/produktsiya/kanistry-polimernye-white-bg.png",
      imageAlt: "Канистры полимерные с крышками",
      imageFit: "contain",
      imageBackground: "white",
      paragraphs: [
        "Канистры полимерные с крышками.",
        "Канистры изготавливают экструзионно-выдувным методом, крышки методом литья под давлением из химически стойких марок полиэтилена. Вместимость канистр 21,5 дм3.",
        "Канистры имеют универсальное назначение и предназначены для упаковывания, транспортирования и хранения пищевой продукции (вода питьевая, безалкогольные напитки, спиртосодержащие жидкости, молоко и молочнокислые продукты и др.), дезинфицирующих и лекарственных средств, парфюмерно-косметической, лакокрасочной, химической (в том числе опасных грузов) и другой продукции промышленного и бытового назначения. Возможно использование в качестве потребительской тары в хозяйственном обиходе.",
        "В канистры упаковывают жидкости с плотностью до 1,35 г/см3.",
        "Возможность применения канистр для химической продукции, относящейся к категории опасной по ГОСТ 19433, устанавливается в соответствии с требованиями нормативных документов на загружаемую продукцию и правил перевозки грузов, действующих на соответствующих видах транспорта.",
      ],
    },
    {
      title: "Крышка и комплектность",
      paragraphs: [
        "Канистры поставляются в комплекте с крышками.",
        "Крышка должна быть с уплотнителем, с клапаном избыточного давления или без клапана.",
        "Крышка изготавливается с защитным приспособлением в виде предохранительного кольца, которое должно гарантировать сохранность продукта до первичного вскрытия. При откручивании крышки целостность предохранительного кольца должна быть нарушена.",
      ],
    },
    {
      title: "Упаковка",
      paragraphs: [
        "Канистры упаковывают в полиэтиленовые мешки по 5 штук.",
        "По согласованию с Потребителем допускаются другие способы и иные виды тары и упаковки, обеспечивающие сохранность канистр при транспортировании и хранении.",
        "Крышки для канистр в собранном виде укладывают насыпью ровными слоями в ящики из гофрированного картона. Количество крышек в одной коробке должно быть не менее 200 штук.",
      ],
    },
  ],
  detailSectionsEn: [
    {
      title: "Description",
      image: "/prevyu/produktsiya/kanistry-polimernye-white-bg.png",
      imageAlt: "Polymer canisters with caps",
      imageFit: "contain",
      imageBackground: "white",
      paragraphs: [
        "The 21.5 dm³ canisters are extrusion blow-moulded from chemically resistant polyethylene; the caps are injection-moulded.",
        "They are suitable for food products, drinking water, beverages, dairy products, disinfectants, medicines, cosmetics, paints, chemicals and other industrial or household liquids with a density of up to 1.35 g/cm³.",
        "Suitability for dangerous goods is determined by the applicable product and transport regulations.",
      ],
    },
    {
      title: "Cap and components",
      paragraphs: [
        "Canisters are supplied with caps. Caps may include a seal and a pressure-relief valve and feature a tamper-evident ring that breaks upon first opening.",
      ],
    },
    {
      title: "Packaging",
      paragraphs: [
        "Canisters are packed in polyethylene bags, five units per bag. Caps are packed in corrugated cardboard boxes containing at least 200 units. Alternative packaging can be agreed with the customer.",
      ],
    },
  ],
}

function isCanisterSubcategory(categoryId?: string, subcategoryId?: string) {
  return categoryId === "hoztovary" && subcategoryId === "canisters"
}

function isBoxesSubcategory(categoryId?: string, subcategoryId?: string) {
  return categoryId === "hoztovary" && subcategoryId === "boxes"
}

export function normalizeHouseholdProduct(
  product: ProductLike,
  categoryId?: string,
  subcategoryId?: string
) {
  if (isCanisterSubcategory(categoryId, subcategoryId)) {
    return { ...product, ...CANISTER_PRODUCT }
  }

  if (isBoxesSubcategory(categoryId, subcategoryId)) {
    const id = String(product.id ?? "")
    const name = String(product.name ?? "").toLowerCase()
    if (id.includes("60") || name.includes("60 л")) return null
    return { ...product, ...BOX_PRODUCT }
  }

  return product
}

export function normalizeHouseholdProducts(
  products: ProductLike[],
  categoryId?: string,
  subcategoryId?: string
) {
  if (isCanisterSubcategory(categoryId, subcategoryId)) {
    return [{ ...(products[0] ?? {}), ...CANISTER_PRODUCT }]
  }

  if (isBoxesSubcategory(categoryId, subcategoryId)) {
    const source =
      products.find((product) => {
        const id = String(product.id ?? "")
        const name = String(product.name ?? "").toLowerCase()
        return !id.includes("60") && !name.includes("60 л")
      }) ?? {}
    return [{ ...source, ...BOX_PRODUCT }]
  }

  return products
}
