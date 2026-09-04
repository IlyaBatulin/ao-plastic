import productsData from "@/data/products.json"

const MACHINE_PARTS_EXTRUSION = new Set([
  "parts-extrusion",
  "extrusion",
  "extrusion-parts",
])

const MACHINE_PARTS_INJECTION = new Set([
  "parts-injection",
  "injection",
  "injection-parts",
])

/** Все варианты slug в URL для поиска в БД */
export function getSubcategorySlugCandidates(
  categoryId: string,
  urlSlug: string
): string[] {
  if (categoryId === "machine-parts") {
    if (MACHINE_PARTS_EXTRUSION.has(urlSlug)) {
      return ["parts-extrusion", "extrusion", "extrusion-parts"]
    }
    if (MACHINE_PARTS_INJECTION.has(urlSlug)) {
      return ["parts-injection", "injection", "injection-parts"]
    }
  }
  if (categoryId === "polystyrene" && !urlSlug.startsWith("ps-")) {
    return [urlSlug, `ps-${urlSlug}`]
  }
  return [urlSlug]
}

/** Единый slug в ссылках каталога */
export function getPublicSubcategorySlug(
  categoryId: string,
  sub: { id: string; slug: string }
): string {
  if (categoryId === "machine-parts") {
    if (MACHINE_PARTS_EXTRUSION.has(sub.slug) || sub.id === "extrusion-parts") {
      return "parts-extrusion"
    }
    if (MACHINE_PARTS_INJECTION.has(sub.slug) || sub.id === "injection-parts") {
      return "parts-injection"
    }
  }
  return sub.slug
}

export function isMachinePartsExtrusion(
  categoryId: string,
  subcategorySlug: string
): boolean {
  return categoryId === "machine-parts" && MACHINE_PARTS_EXTRUSION.has(subcategorySlug)
}

export function findJsonSubcategory(categoryId: string, urlSlug: string) {
  const cat = productsData.categories.find((c) => c.id === categoryId)
  if (!cat?.subcategories) return null
  const candidates = new Set(getSubcategorySlugCandidates(categoryId, urlSlug))
  return (
    cat.subcategories.find(
      (s) => candidates.has(s.slug) || candidates.has(s.id)
    ) ?? null
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseLike = { from: (table: string) => any }

async function fetchFirstSubcategory(
  supabase: SupabaseLike,
  categoryId: string,
  column: "slug" | "id",
  values: string[]
): Promise<Record<string, unknown> | null> {
  const { data } = await supabase
    .from("subcategories")
    .select("*")
    .eq("category_id", categoryId)
    .eq("is_active", true)
    .in(column, values)
    .limit(1)

  const row = Array.isArray(data) ? data[0] : data
  return row ?? null
}

/** Подкатегория: Supabase (любой alias slug/id) → fallback JSON */
export async function resolveSubcategory(
  supabase: SupabaseLike,
  categoryId: string,
  urlSlug: string
): Promise<Record<string, unknown> | null> {
  const candidates = getSubcategorySlugCandidates(categoryId, urlSlug)

  const [bySlug, byId] = await Promise.all([
    fetchFirstSubcategory(supabase, categoryId, "slug", candidates),
    categoryId === "machine-parts"
      ? fetchFirstSubcategory(supabase, categoryId, "id", candidates)
      : Promise.resolve(null),
  ])

  if (bySlug) return bySlug
  if (byId) return byId

  const jsonSub = findJsonSubcategory(categoryId, urlSlug)
  if (!jsonSub) return null

  return {
    id: jsonSub.id,
    slug: getPublicSubcategorySlug(categoryId, {
      id: jsonSub.id,
      slug: jsonSub.slug,
    }),
    name: jsonSub.name,
    description: jsonSub.description ?? null,
    category_id: categoryId,
    is_active: true,
    image: (jsonSub as { image?: string }).image ?? null,
  }
}
