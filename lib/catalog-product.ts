import { cache } from "react"
import productsData from "@/data/products.json"
import { DMS_EXTRUSION_FALLBACK, DMS_INJECTION_FALLBACK } from "@/data/dms-fallback"
import { findJsonSubcategory, resolveSubcategory } from "@/lib/catalog-slugs"
import { normalizeHouseholdProduct } from "@/lib/household-product-content"
import { isNextBuild } from "@/lib/next-build"
import { createCatalogClient, supabaseCatalogQuery } from "@/utils/supabase/server"

type JsonProduct = {
  id: string
  slug?: string
  subcategory?: string
  [key: string]: unknown
}

export function findJsonProduct(categoryId: string, productIdOrSlug: string) {
  const category = productsData.categories.find((cat) => cat.id === categoryId)
  if (!category?.products) return null

  const needle = decodeURIComponent(productIdOrSlug)
  return (
    category.products.find(
      (product: JsonProduct) =>
        product.id === needle ||
        product.slug === needle ||
        String(product.id).toLowerCase() === needle.toLowerCase() ||
        String(product.slug ?? "").toLowerCase() === needle.toLowerCase()
    ) ?? null
  )
}

function findLocalProduct(categoryId: string, subcategoryId: string, productIdOrSlug: string) {
  const jsonProduct = findJsonProduct(categoryId, productIdOrSlug)
  if (jsonProduct) return jsonProduct
  if (categoryId !== "machine-parts") return null

  const decoded = decodeURIComponent(productIdOrSlug).toLowerCase()
  const products = subcategoryId.includes("extrusion")
    ? DMS_EXTRUSION_FALLBACK
    : DMS_INJECTION_FALLBACK

  return products.find((product) => product.id.toLowerCase() === decoded) ?? null
}

export function getProductPathSegment(product: { id: string; slug?: string | null }) {
  const slug = typeof product.slug === "string" ? product.slug.trim() : ""
  return slug || String(product.id)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseLike = { from: (table: string) => any }

async function fetchProductRecord(
  supabase: SupabaseLike,
  categoryId: string,
  subcategoryId: string,
  productIdOrSlug: string
): Promise<Record<string, unknown> | null> {
  const decoded = decodeURIComponent(productIdOrSlug)

  const isExtrusionCategory =
    categoryId === "machine-parts" &&
    ["parts-extrusion", "extrusion", "extrusion-parts"].includes(subcategoryId)

  if (isExtrusionCategory && decoded.startsWith("extrusion-")) {
    const numericId = Number(decoded.replace("extrusion-", ""))
    if (Number.isNaN(numericId)) return null

    const { data: extrusionProduct } = await supabase
      .from("extrusion_products")
      .select("id, name, type, subtype, size_raw, length_raw, code, length_kind, image")
      .eq("id", numericId)
      .eq("is_active", true)
      .single()

    if (!extrusionProduct) return null

    const parts: string[] = []
    if (extrusionProduct.size_raw) {
      parts.push(`Габаритные размеры: ${extrusionProduct.size_raw}`)
    }
    if (extrusionProduct.length_raw) {
      parts.push(`Длина изделия: ${extrusionProduct.length_raw}`)
    }
    if (extrusionProduct.code) {
      parts.push(`Шифр: ${extrusionProduct.code}`)
    }

    return {
      id: decoded,
      name:
        typeof extrusionProduct.name === "string" &&
        extrusionProduct.name.startsWith("По документу")
          ? extrusionProduct.code || "Изделие ДМС"
          : extrusionProduct.name,
      description: parts.join(" · ") || null,
      image: extrusionProduct.image || "/placeholder-logo.png",
      specifications: {
        "Тип изделия": extrusionProduct.type,
        ...(extrusionProduct.subtype ? { Подтип: extrusionProduct.subtype } : {}),
        ...(extrusionProduct.size_raw
          ? { "Габаритные размеры": extrusionProduct.size_raw }
          : {}),
        ...(extrusionProduct.code ? { "Шифр изделия": extrusionProduct.code } : {}),
        ...(extrusionProduct.length_raw
          ? { "Длина изделия": extrusionProduct.length_raw }
          : {}),
        ...(extrusionProduct.length_kind === "coil"
          ? { Поставка: "в бухтах" }
          : extrusionProduct.length_kind === "fixed"
            ? { Поставка: "фиксированная длина" }
            : {}),
      },
    }
  }

  const { data: matched } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .or(`id.eq.${decoded},slug.eq.${decoded}`)
    .limit(1)
    .maybeSingle()

  return matched ?? null
}

export type ProductPageData = {
  product: Record<string, unknown>
  category: Record<string, unknown> | null
  subcategory: Record<string, unknown> | null
}

/** Один запрос на страницу товара (metadata + page делят результат через cache). */
export const getProductPageData = cache(
  async (
    categoryId: string,
    subcategoryId: string,
    productId: string
  ): Promise<ProductPageData | null> => {
    const fallbackCategory =
      productsData.categories.find((cat) => cat.id === categoryId) ?? null
    const fallbackSubcategory = findJsonSubcategory(categoryId, subcategoryId)

    if (isNextBuild()) {
      const fallbackProduct = findLocalProduct(categoryId, subcategoryId, productId)
      if (!fallbackProduct) return null
      return {
        product: normalizeHouseholdProduct(
          fallbackProduct as unknown as Record<string, unknown>,
          categoryId,
          subcategoryId
        ),
        category: fallbackCategory,
        subcategory: fallbackSubcategory,
      }
    }

    const supabase = createCatalogClient()

    const [product, categoryResult, subcategoryData] = await Promise.all([
      supabaseCatalogQuery(`product:${productId}`, () =>
        fetchProductRecord(supabase, categoryId, subcategoryId, productId),
        { critical: true }
      ),
      supabaseCatalogQuery(`category:${categoryId}`, () =>
        supabase.from("categories").select("*").eq("id", categoryId).single()
      ),
      supabaseCatalogQuery(`resolveSubcategory:${subcategoryId}`, () =>
        resolveSubcategory(supabase, categoryId, subcategoryId)
      ),
    ])

    let resolvedProduct = product
    if (!resolvedProduct) {
      const fallbackProduct = findLocalProduct(categoryId, subcategoryId, productId)
      if (!fallbackProduct) return null
      resolvedProduct = fallbackProduct as unknown as Record<string, unknown>
    }

    const category =
      categoryResult?.data ?? fallbackCategory
    const subcategory =
      subcategoryData ?? fallbackSubcategory

    return {
      product: normalizeHouseholdProduct(resolvedProduct, categoryId, subcategoryId),
      category,
      subcategory,
    }
  }
)
