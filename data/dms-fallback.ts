import catalogExport from "@/data/dms-products-export.json"

const INJECTION_SUBCATEGORIES = new Set([
  "injection-parts",
  "parts-injection",
  "injection",
])

export const DMS_INJECTION_FALLBACK = catalogExport.products
  .filter((product) => INJECTION_SUBCATEGORIES.has(product.subcategory_id))
  .map((product) => ({
    ...product,
    subcategory: "injection",
    description: product.description || "Литьевая деталь для машиностроения",
  }))

export const DMS_EXTRUSION_FALLBACK = catalogExport.extrusion_products.map((product) => {
  const displayName = product.name.startsWith("По документу")
    ? product.code || "Изделие ДМС"
    : product.name
  const details = [
    product.size_raw ? `Габаритные размеры: ${product.size_raw}` : null,
    product.length_raw ? `Длина изделия: ${product.length_raw}` : null,
    product.code ? `Шифр: ${product.code}` : null,
  ].filter(Boolean)

  return {
    id: `extrusion-${product.id}`,
    name: displayName,
    brand: product.code,
    type: product.type,
    subtype: product.subtype,
    subcategory: "extrusion",
    description: details.join(" · ") || "Экструзионная деталь для машиностроения",
    image: product.image,
    specifications: {
      "Тип изделия": product.type,
      ...(product.subtype ? { Подтип: product.subtype } : {}),
      ...(product.size_raw ? { "Габаритные размеры": product.size_raw } : {}),
      ...(product.code ? { "Шифр изделия": product.code } : {}),
      ...(product.length_raw ? { "Длина изделия": product.length_raw } : {}),
      ...(product.length_kind === "coil"
        ? { Поставка: "в бухтах" }
        : product.length_kind === "fixed"
          ? { Поставка: "фиксированная длина" }
          : {}),
    },
  }
})
