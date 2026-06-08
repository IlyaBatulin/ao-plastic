import { cache } from "react"
import productsData from "@/data/products.json"
import { findJsonSubcategory, getPublicSubcategorySlug, resolveSubcategory } from "@/lib/catalog-slugs"
import { normalizeHouseholdProduct } from "@/lib/household-product-content"
import { isNextBuild } from "@/lib/next-build"
import { createClient, supabaseQuery } from "@/utils/supabase/server"

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

export function getProductPathSegment(product: { id: string; slug?: string | null }) {
  const slug = typeof product.slug === "string" ? product.slug.trim() : ""
  return slug || String(product.id)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseLike = { from: (table: string) => any }

export async function resolveProduct(
  supabase: SupabaseLike,
  categoryId: string,
  subcategoryId: string,
  productIdOrSlug: string
) {
  const decoded = decodeURIComponent(productIdOrSlug)
  let product: Record<string, unknown> | null = null

  const isExtrusionCategory =
    categoryId === "machine-parts" &&
    ["parts-extrusion", "extrusion", "extrusion-parts"].includes(subcategoryId)

  if (isExtrusionCategory && decoded.startsWith("extrusion-")) {
    const numericId = Number(decoded.replace("extrusion-", ""))
    if (!Number.isNaN(numericId)) {
      const { data: extrusionProduct } = await supabaseQuery(`extrusion_product:${numericId}`, () =>
        supabase
          .from("extrusion_products")
          .select("id, name, type, subtype, size_raw, length_raw, code, length_kind, image")
          .eq("id", numericId)
          .eq("is_active", true)
          .single()
      )

      if (extrusionProduct) {
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

        product = {
          id: decoded,
          name: extrusionProduct.name,
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
    }
  } else {
    const { data: matched } = await supabaseQuery(`product:${decoded}`, () =>
      supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .or(`id.eq.${decoded},slug.eq.${decoded}`)
        .limit(1)
        .maybeSingle()
    )

    if (matched) product = matched
  }

  if (!product) {
    const fallbackProduct = findJsonProduct(categoryId, decoded)
    if (fallbackProduct) {
      const fallbackCategory = productsData.categories.find((cat) => cat.id === categoryId)
      const fallbackSubcategory = fallbackCategory?.subcategories?.find((sub) => {
        const publicSlug = getPublicSubcategorySlug(categoryId, {
          id: sub.id,
          slug: sub.slug,
        })
        return (
          publicSlug === subcategoryId ||
          sub.slug === subcategoryId ||
          sub.id === subcategoryId ||
          fallbackProduct.subcategory === sub.slug ||
          fallbackProduct.subcategory === sub.id
        )
      })

      return {
        product: fallbackProduct,
        category: fallbackCategory ?? null,
        subcategory: fallbackSubcategory ?? null,
      }
    }

    return { product: null, category: null, subcategory: null }
  }

  return { product, category: null, subcategory: null }
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
      const fallbackProduct = findJsonProduct(categoryId, productId)
      if (!fallbackProduct) return null
      return {
        product: normalizeHouseholdProduct(fallbackProduct, categoryId, subcategoryId),
        category: fallbackCategory,
        subcategory: fallbackSubcategory,
      }
    }

    const supabase = createClient()

    try {
      const [resolved, categoryResult, subcategoryData] = await Promise.all([
        supabaseQuery(`resolveProduct:${productId}`, () =>
          resolveProduct(supabase, categoryId, subcategoryId, productId)
        ),
        supabaseQuery(`category:${categoryId}`, () =>
          supabase.from("categories").select("*").eq("id", categoryId).single()
        ),
        supabaseQuery(`resolveSubcategory:${subcategoryId}`, () =>
          resolveSubcategory(supabase, categoryId, subcategoryId)
        ),
      ])

      let product = resolved.product
      let category =
        categoryResult.data ??
        resolved.category ??
        fallbackCategory
      let subcategory =
        subcategoryData ??
        resolved.subcategory ??
        fallbackSubcategory

      if (!product) {
        const fallbackProduct = findJsonProduct(categoryId, productId)
        if (!fallbackProduct) return null
        product = fallbackProduct
        category = category ?? fallbackCategory
        subcategory = subcategory ?? fallbackSubcategory
      }

      return {
        product: normalizeHouseholdProduct(product, categoryId, subcategoryId),
        category,
        subcategory,
      }
    } catch {
      const fallbackProduct = findJsonProduct(categoryId, productId)
      if (!fallbackProduct) return null
      return {
        product: normalizeHouseholdProduct(fallbackProduct, categoryId, subcategoryId),
        category: fallbackCategory,
        subcategory: fallbackSubcategory,
      }
    }
  }
)
