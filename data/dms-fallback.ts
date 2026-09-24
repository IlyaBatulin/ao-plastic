import catalogExport from "@/data/dms-products-export.json"
import { mapDmsExtrusionProduct } from "@/lib/dms-product-content"

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

export const DMS_EXTRUSION_FALLBACK = catalogExport.extrusion_products.map((product) =>
  mapDmsExtrusionProduct(product as Record<string, unknown>)
)
