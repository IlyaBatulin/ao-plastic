import { cache } from "react"
import productsData from "@/data/products.json"
import { getSubcategoryPageData } from "@/lib/catalog-subcategory"
import { normalizeHouseholdProduct } from "@/lib/household-product-content"
import { getProductUrlPath } from "@/lib/product-url"

export type ProductPageData = {
  product: Record<string, unknown>
  category: Record<string, unknown>
  subcategory: Record<string, unknown>
  canonicalPath: string
}

/** Resolve products from the same section as the listing, including its fallbacks.
 * Arbitrary category/product combinations must not become duplicate pages.
 */
export const getProductPageData = cache(async (
  categoryId: string, subcategoryId: string, productId: string
): Promise<ProductPageData | null> => {
  const section = await getSubcategoryPageData(categoryId, subcategoryId)
  if (!section) return null
  const needle = productId.toLowerCase()
  let product = section.displayProducts.find((p) =>
    String(p.id).toLowerCase() === needle ||
    (p.slug && String(p.slug).toLowerCase() === needle)
  )

  // Preserve known household URLs after editorial consolidation.
  if (!product && categoryId === "hoztovary") {
    const legacy = productsData.categories.find((c) => c.id === categoryId)?.products
      ?.find((p) => p.id.toLowerCase() === needle && "subcategory" in p && p.subcategory === section.publicSubcategorySlug)
    const normalized = legacy && normalizeHouseholdProduct(legacy, categoryId, section.publicSubcategorySlug)
    if (normalized) product = section.displayProducts.find((p) => p.id === normalized.id)
  }
  if (!product) return null

  return {
    product,
    category: { id: categoryId, name: section.categoryDisplayName, image: section.categoryImage },
    subcategory: section.subcategory,
    canonicalPath: getProductUrlPath(categoryId, section.publicSubcategorySlug, {
      id: String(product.id), slug: typeof product.slug === "string" ? product.slug : null,
    }),
  }
})
