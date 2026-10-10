import { truncateMeta } from "@/lib/seo/text"
import { resolveProductImageUrl } from "@/lib/product-image"
import { getProductPageData } from "@/lib/catalog-product"
import { getSubcategoryPageData } from "@/lib/catalog-subcategory"
import { parseSpecifications } from "@/lib/product-specs"
import { getProductSearchName } from "@/lib/seo/product-name"
import { getServerLanguage } from "@/lib/server-language"
import { resolveProductDisplay } from "@/lib/product-en"
import { getCatalogCategoryLabel } from "@/lib/catalog-translations"

export async function getSubcategorySeo(categoryId: string, subcategorySlug: string) {
  const page = await getSubcategoryPageData(categoryId, subcategorySlug)
  if (!page) return null
  return {
    subName: String(page.subcategory.name),
    subDescription: typeof page.subcategory.description === "string" ? page.subcategory.description : null,
    categoryName: page.categoryDisplayName,
    canonicalSlug: page.publicSubcategorySlug,
  }
}

export async function getProductSeo(categoryId: string, subcategorySlug: string, productId: string) {
  const page = await getProductPageData(categoryId, subcategorySlug, productId)
  if (!page) return null
  const { product, category, subcategory } = page
  const lang = await getServerLanguage()
  const display = resolveProductDisplay({ ...product, id: String(product.id), name: String(product.name) }, lang, { categoryId })
  const productName = lang === "en" ? display.name : getProductSearchName(String(product.name), categoryId, parseSpecifications(product.specifications))
  return {
    productName,
    description: truncateMeta(`${productName}. ${lang === "en" ? display.description || "Manufactured by JSC Plastic in Uzlovaya, Russia." : product.description || `${category.name}. Производство АО «Пластик», Узловая.`}`),
    image: resolveProductImageUrl(String(product.id), typeof product.image === "string" ? product.image : undefined),
    categoryName: getCatalogCategoryLabel(categoryId, String(category.name), lang),
    subName: String(subcategory.name),
    canonicalPath: page.canonicalPath,
  }
}
