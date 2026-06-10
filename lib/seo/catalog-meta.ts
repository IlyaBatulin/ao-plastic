import { createCatalogClient, supabaseCatalogQuery } from "@/utils/supabase/server"
import productsData from "@/data/products.json"
import { truncateMeta } from "@/lib/seo/text"
import { resolveProductImageUrl } from "@/lib/product-image"
import {
  findJsonSubcategory,
  isMachinePartsExtrusion,
} from "@/lib/catalog-slugs"
import { findJsonProduct, getProductPageData } from "@/lib/catalog-product"
import { getSubcategoryPageData } from "@/lib/catalog-subcategory"

export type SubcategorySeo = {
  subName: string
  subDescription: string | null | undefined
  categoryName: string
}

/** Данные подкатегории для title/description (как на странице каталога). */
export async function getSubcategorySeo(
  categoryId: string,
  subcategorySlug: string
): Promise<SubcategorySeo | null> {
  const pageData = await getSubcategoryPageData(categoryId, subcategorySlug)
  if (!pageData) return null

  const description =
    typeof pageData.subcategory.description === "string"
      ? pageData.subcategory.description
      : null

  return {
    subName: String(pageData.subcategory.name),
    subDescription: description,
    categoryName: pageData.categoryDisplayName,
  }
}

export type ProductSeo = {
  productName: string
  description: string
  image: string | null | undefined
  categoryName: string
  subName: string
}

/** Карточка товара для meta / JSON-LD (общий cache с page.tsx). */
export async function getProductSeo(
  categoryId: string,
  subcategorySlug: string,
  productId: string
): Promise<ProductSeo | null> {
  const isExtrusion =
    isMachinePartsExtrusion(categoryId, subcategorySlug) &&
    productId.startsWith("extrusion-")

  if (isExtrusion) {
    const supabase = createCatalogClient()
    const numericId = Number(productId.replace("extrusion-", ""))
    if (!Number.isNaN(numericId)) {
      const extrusionResult = await supabaseCatalogQuery(`extrusion_seo:${numericId}`, () =>
        supabase
          .from("extrusion_products")
          .select("name, image, size_raw, length_raw, code")
          .eq("id", numericId)
          .eq("is_active", true)
          .single()
      )
      const extrusionProduct = extrusionResult?.data

      if (extrusionProduct) {
        const parts: string[] = []
        if (extrusionProduct.size_raw) parts.push(`Габариты: ${extrusionProduct.size_raw}`)
        if (extrusionProduct.length_raw) parts.push(`Длина: ${extrusionProduct.length_raw}`)
        if (extrusionProduct.code) parts.push(`Шифр: ${extrusionProduct.code}`)
        const fromJsonCat = productsData.categories.find((c) => c.id === categoryId)
        const fromJsonSub = findJsonSubcategory(categoryId, subcategorySlug)
        return {
          productName: extrusionProduct.name,
          description: truncateMeta(parts.join(" · ")),
          image: resolveProductImageUrl(productId, extrusionProduct.image),
          categoryName: fromJsonCat?.name || categoryId,
          subName: fromJsonSub?.name || subcategorySlug,
        }
      }
    }
  }

  const pageData = await getProductPageData(categoryId, subcategorySlug, productId)
  if (!pageData) {
    const fallbackCategory = productsData.categories.find((c) => c.id === categoryId)
    const fallbackProduct = findJsonProduct(categoryId, productId)
    if (!fallbackProduct) return null

    const categoryName = fallbackCategory?.name || categoryId
    const fallbackSub = fallbackCategory?.subcategories?.find(
      (s: { slug?: string }) => s.slug === subcategorySlug
    )
    const rawDesc =
      typeof fallbackProduct.description === "string"
        ? fallbackProduct.description
        : fallbackProduct.description != null
          ? String(fallbackProduct.description)
          : ""

    return {
      productName: String(fallbackProduct.name),
      description: truncateMeta(
        rawDesc ||
          `${fallbackProduct.name}. ${categoryName}, ${fallbackSub?.name || subcategorySlug}. Производство АО «Пластик», Узловая.`
      ),
      image: resolveProductImageUrl(productId, fallbackProduct.image as string | undefined),
      categoryName,
      subName: fallbackSub?.name || subcategorySlug,
    }
  }

  const { product, category, subcategory } = pageData
  const categoryName =
    typeof category?.name === "string" ? category.name : categoryId
  const subName =
    typeof subcategory?.name === "string" ? subcategory.name : subcategorySlug

  const rawDesc =
    typeof product.description === "string"
      ? product.description
      : product.description != null
        ? String(product.description)
        : ""

  return {
    productName: String(product.name),
    description: truncateMeta(
      rawDesc ||
        `${product.name}. ${categoryName}, ${subName}. Производство АО «Пластик», Узловая.`
    ),
    image: resolveProductImageUrl(
      productId,
      product.image as string | undefined,
      typeof category?.image === "string" ? category.image : null
    ),
    categoryName,
    subName,
  }
}
