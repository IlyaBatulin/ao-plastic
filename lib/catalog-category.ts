import { cache } from "react"
import productsData from "@/data/products.json"
import { isNextBuild } from "@/lib/next-build"
import { createCatalogClient, supabaseCatalogQuery } from "@/utils/supabase/server"

export type CategoryRecord = Record<string, unknown>
export type SubcategoryRecord = Record<string, unknown>

export type CategoryPageData = {
  category: CategoryRecord
  subcategories: SubcategoryRecord[]
}

const CATALOG_DB_BUDGET_MS = 5_500

function filterAbsSpecs(
  subcategories: SubcategoryRecord[],
  categoryId: string
): SubcategoryRecord[] {
  if (categoryId !== "abs") return subcategories
  return subcategories.filter(
    (s) => s?.id !== "abs-specs" && s?.slug !== "abs-specs"
  )
}

function buildJsonCategoryPageData(categoryId: string): CategoryPageData | null {
  const fallbackCategory =
    productsData.categories.find((cat) => cat.id === categoryId) ?? null
  if (!fallbackCategory) return null

  return {
    category: fallbackCategory,
    subcategories: filterAbsSpecs(
      (fallbackCategory.subcategories as SubcategoryRecord[]) ?? [],
      categoryId
    ),
  }
}

async function fetchCategoryPageDataFromDb(
  categoryId: string
): Promise<CategoryPageData | null> {
  const fallbackCategory =
    productsData.categories.find((cat) => cat.id === categoryId) ?? null
  const supabase = createCatalogClient()

  const [catResult, subResult] = await Promise.all([
    supabaseCatalogQuery(`category:${categoryId}`, () =>
      supabase.from("categories").select("*").eq("id", categoryId).single()
    ),
    supabaseCatalogQuery(`subcategories:${categoryId}`, () =>
      supabase
        .from("subcategories")
        .select("*")
        .eq("category_id", categoryId)
        .eq("is_active", true)
        .order("sort", { ascending: true }),
      { critical: true }
    ),
  ])

  let category: CategoryRecord | null = catResult?.data ?? null
  let subcategories: SubcategoryRecord[] = subResult?.data ?? []

  // The former database row combines every dispersion grade into one group.
  // Keep the three public application segments defined by the site catalogue.
  if (categoryId === "dispersion" && fallbackCategory?.subcategories) {
    subcategories = fallbackCategory.subcategories as SubcategoryRecord[]
  }

  if (!category && fallbackCategory) {
    category = fallbackCategory
    subcategories = (fallbackCategory.subcategories as SubcategoryRecord[]) ?? []
  } else if (subcategories.length === 0 && fallbackCategory?.subcategories) {
    subcategories = fallbackCategory.subcategories as SubcategoryRecord[]
  }

  if (!category) return null

  return {
    category,
    subcategories: filterAbsSpecs(subcategories, categoryId),
  }
}

async function loadCategoryPageData(categoryId: string): Promise<CategoryPageData | null> {
  const jsonFallback = buildJsonCategoryPageData(categoryId)
  if (isNextBuild()) return jsonFallback

  try {
    const fromDb = await Promise.race([
      fetchCategoryPageDataFromDb(categoryId).catch(() => null),
      new Promise<null>((resolve) =>
        setTimeout(() => resolve(null), CATALOG_DB_BUDGET_MS)
      ),
    ])
    return fromDb ?? jsonFallback
  } catch {
    return jsonFallback
  }
}

/** Один запрос на страницу категории (metadata + page делят результат через cache). */
export const getCategoryPageData = cache((categoryId: string) =>
  loadCategoryPageData(categoryId)
)
