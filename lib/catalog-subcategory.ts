import { cache } from "react"
import { unstable_cache } from "next/cache"
import productsData from "@/data/products.json"
import {
  getPublicSubcategorySlug,
  getSubcategorySlugCandidates,
  isMachinePartsExtrusion,
  resolveSubcategory,
} from "@/lib/catalog-slugs"
import { normalizeHouseholdProducts } from "@/lib/household-product-content"
import { isNextBuild } from "@/lib/next-build"
import { resolveProductImageUrl } from "@/lib/product-image"
import { stripHiddenSpecs } from "@/lib/product-specs"
import { createClient, supabaseQuery } from "@/utils/supabase/server"

const EXTRUSION_SELECT =
  "id, name, type, subtype, size_raw, length_raw, code, length_kind, image, source_no"

const CATALOG_DB_BUDGET_MS = 2_500

export type SubcategoryPageData = {
  subcategory: Record<string, unknown>
  publicSubcategorySlug: string
  categoryDisplayName: string
  categoryImage: string | null
  displayProducts: Record<string, unknown>[]
}

function mapExtrusionProducts(extrusionData: Record<string, unknown>[]) {
  return extrusionData.map((item) => {
    const parts: string[] = []
    if (item.size_raw) parts.push(`Габаритные размеры: ${item.size_raw}`)
    if (item.length_raw) parts.push(`Длина изделия: ${item.length_raw}`)
    if (item.code) parts.push(`Шифр: ${item.code}`)
    const description = parts.join(" · ")

    return {
      id: `extrusion-${item.id}`,
      name: item.name,
      description: description || null,
      image: item.image || "/placeholder-logo.png",
      specifications: {
        "Тип изделия": item.type,
        ...(item.subtype ? { Подтип: item.subtype } : {}),
        ...(item.size_raw ? { "Габаритные размеры": item.size_raw } : {}),
        ...(item.code ? { "Шифр изделия": item.code } : {}),
        ...(item.length_raw ? { "Длина изделия": item.length_raw } : {}),
        ...(item.length_kind === "coil"
          ? { Поставка: "в бухтах" }
          : item.length_kind === "fixed"
            ? { Поставка: "фиксированная длина" }
            : {}),
      },
    }
  })
}

function buildDisplayProducts(
  categoryId: string,
  publicSubcategorySlug: string,
  subcategory: Record<string, unknown>,
  subcategoryId: string,
  products: Record<string, unknown>[] | null,
  categoryImage: string | null
) {
  const fallbackCategory = productsData.categories.find((cat) => cat.id === categoryId)
  const fallbackProductsAll = fallbackCategory?.products ?? []

  const slugCandidates = new Set(getSubcategorySlugCandidates(categoryId, subcategoryId))
  const fallbackProducts = fallbackProductsAll.filter((product: Record<string, unknown>) => {
    const productSub = product.subcategory ?? ""
    return (
      slugCandidates.has(String(subcategory.slug)) ||
      slugCandidates.has(subcategoryId) ||
      slugCandidates.has(String(productSub)) ||
      slugCandidates.has(String(subcategory.id)) ||
      slugCandidates.has(`ps-${String(productSub)}`)
    )
  })

  const fallbackById = new Map(
    fallbackProductsAll.map((product: Record<string, unknown>) => [product.id, product])
  )
  const fallbackBySub = new Map(
    fallbackProductsAll.flatMap((product: Record<string, unknown>) => {
      const keys: string[] = []
      if (product.subcategory) {
        keys.push(String(product.subcategory))
        keys.push(`ps-${String(product.subcategory)}`)
      }
      return keys.map((key) => [key, product])
    })
  )

  const baseProducts = products && products.length > 0 ? products : fallbackProducts
  const normalizedBaseProducts = normalizeHouseholdProducts(
    baseProducts,
    categoryId,
    publicSubcategorySlug
  )

  return normalizedBaseProducts.map((product: Record<string, unknown>) => {
    const fallback =
      fallbackById.get(product.id) ||
      fallbackBySub.get(product.subcategory_id ?? "") ||
      fallbackBySub.get(subcategory.slug) ||
      fallbackProducts[0]

    let specifications = product.specifications
    if (typeof specifications === "string") {
      try {
        specifications = JSON.parse(specifications)
      } catch {
        specifications = {}
      }
    }

    const hasProductSpecs =
      specifications &&
      typeof specifications === "object" &&
      Object.keys(specifications).length > 0
    const mergedSpecs = stripHiddenSpecs(
      hasProductSpecs ? specifications : ((fallback as Record<string, unknown>)?.specifications ?? {})
    )

    const imageRaw =
      product.image ||
      categoryImage ||
      (fallback as Record<string, unknown>)?.image ||
      fallbackCategory?.image ||
      undefined
    const image = resolveProductImageUrl(
      String(product.id),
      imageRaw as string | undefined,
      categoryImage || (fallbackCategory?.image as string | undefined)
    )
    const description =
      product.description ??
      (fallback as Record<string, unknown>)?.description ??
      fallbackCategory?.description

    return {
      ...product,
      image,
      description,
      specifications: mergedSpecs,
    }
  })
}

function buildJsonSubcategoryPageData(
  categoryId: string,
  subcategoryId: string
): SubcategoryPageData | null {
  const fallbackCategory = productsData.categories.find((cat) => cat.id === categoryId) ?? null
  const isExtrusion = isMachinePartsExtrusion(categoryId, subcategoryId)
  const jsonSub = fallbackCategory?.subcategories?.find((sub) => {
    const candidates = new Set(getSubcategorySlugCandidates(categoryId, subcategoryId))
    return candidates.has(sub.slug) || candidates.has(sub.id)
  })
  if (!jsonSub) return null

  const publicSubcategorySlug = getPublicSubcategorySlug(categoryId, jsonSub)
  return {
    subcategory: jsonSub,
    publicSubcategorySlug,
    categoryDisplayName: fallbackCategory?.name ?? categoryId,
    categoryImage: (fallbackCategory?.image as string) ?? null,
    displayProducts: isExtrusion
      ? []
      : buildDisplayProducts(
          categoryId,
          publicSubcategorySlug,
          jsonSub,
          subcategoryId,
          null,
          (fallbackCategory?.image as string) ?? null
        ),
  }
}

async function fetchSubcategoryPageDataFromDb(
  categoryId: string,
  subcategoryId: string
): Promise<SubcategoryPageData | null> {
  const fallbackCategory = productsData.categories.find((cat) => cat.id === categoryId) ?? null
  const isExtrusion = isMachinePartsExtrusion(categoryId, subcategoryId)
  const supabase = createClient()

  const subcategory = await supabaseQuery(`resolveSubcategory:${categoryId}/${subcategoryId}`, () =>
    resolveSubcategory(supabase, categoryId, subcategoryId)
  )
  if (!subcategory) return null

  const publicSubcategorySlug = getPublicSubcategorySlug(categoryId, {
    id: String(subcategory.id),
    slug: String(subcategory.slug),
  })

  const [categoryResult, productsResult, extrusionResult] = await Promise.all([
    supabaseQuery(`category:${categoryId}`, () =>
      supabase.from("categories").select("name, image").eq("id", categoryId).single()
    ),
    isExtrusion
      ? Promise.resolve({ data: null, error: null })
      : supabaseQuery(`products:${subcategory.id}`, () =>
          supabase
            .from("products")
            .select(
              "id, name, slug, description, image, specifications, subcategory_id, sort, package_quantity, brand"
            )
            .eq("subcategory_id", subcategory.id)
            .eq("is_active", true)
            .order("sort", { ascending: true })
        ),
    isExtrusion
      ? supabaseQuery("extrusion_products:list", () =>
          supabase
            .from("extrusion_products")
            .select(EXTRUSION_SELECT)
            .eq("is_active", true)
            .order("source_no", { ascending: true, nullsFirst: false })
        )
      : Promise.resolve({ data: null, error: null }),
  ])

  const categoryImage = (categoryResult.data?.image as string) ?? null
  const categoryDisplayName =
    (categoryResult.data?.name as string) ?? fallbackCategory?.name ?? categoryId

  const displayProducts = isExtrusion
    ? mapExtrusionProducts((extrusionResult.data as Record<string, unknown>[]) ?? [])
    : buildDisplayProducts(
        categoryId,
        publicSubcategorySlug,
        subcategory,
        subcategoryId,
        (productsResult.data as Record<string, unknown>[]) ?? null,
        categoryImage
      )

  return {
    subcategory,
    publicSubcategorySlug,
    categoryDisplayName,
    categoryImage,
    displayProducts,
  }
}

async function loadSubcategoryPageData(
  categoryId: string,
  subcategoryId: string
): Promise<SubcategoryPageData | null> {
  const jsonFallback = buildJsonSubcategoryPageData(categoryId, subcategoryId)
  if (isNextBuild()) return jsonFallback

  try {
    const fromDb = await Promise.race([
      fetchSubcategoryPageDataFromDb(categoryId, subcategoryId),
      new Promise<null>((resolve) =>
        setTimeout(() => resolve(null), CATALOG_DB_BUDGET_MS)
      ),
    ])
    return fromDb ?? jsonFallback
  } catch {
    return jsonFallback
  }
}

const getSubcategoryPageDataCached = unstable_cache(
  async (categoryId: string, subcategoryId: string) =>
    loadSubcategoryPageData(categoryId, subcategoryId),
  ["subcategory-page-data"],
  { revalidate: 300 }
)

/** Один кэшированный запрос на страницу подкатегории (metadata + page). */
export const getSubcategoryPageData = cache((categoryId: string, subcategoryId: string) =>
  getSubcategoryPageDataCached(categoryId, subcategoryId)
)
