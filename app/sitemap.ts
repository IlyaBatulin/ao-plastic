import type { MetadataRoute } from "next"
import { getSiteUrl } from "@/lib/site"
import productsData from "@/data/products.json"
import { getCategoryPageData } from "@/lib/catalog-category"
import { getSubcategoryPageData } from "@/lib/catalog-subcategory"
import { getPublicSubcategorySlug } from "@/lib/catalog-slugs"
import { getProductUrlPath } from "@/lib/product-url"

export const revalidate = 3600

const STATIC_PATHS = [
  "",
  "/about",
  "/about/mission",
  "/about/ethics",
  "/about/safety",
  "/about/quality",
  "/about/vacancies",
  "/about/college",
  "/about/news",
  "/about/disclosure",
  "/about/publications",
  "/certificates",
  "/contacts",
  "/dealers",
  "/finndisp",
  "/pasf",
  "/technopark",
  "/legal/privacy-policy",
  "/legal/terms",
  "/legal/personal-data-consent",
  "/legal/company-details",
  "/products",
  "/suppliers",
  "/technologies",
] as const

function staticPriority(path: string): number {
  if (path === "") return 1
  if (path === "/products") return 0.95
  if (path.startsWith("/about")) return 0.85
  if (path === "/contacts" || path === "/dealers" || path === "/suppliers") return 0.9
  return 0.75
}

function staticEntries(base: string): MetadataRoute.Sitemap {
  return STATIC_PATHS.map((path) => ({
    url: `${base}${path || "/"}`,
    changeFrequency: path === "" || path === "/about/news" ? ("weekly" as const) : ("monthly" as const),
    priority: staticPriority(path),
  }))
}

/** Use the same catalogue as category pages, including DMS/ABS fallbacks.
 * Never manufacture product URLs from obsolete database subcategory IDs.
 */
async function catalogEntries(base: string): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []
  const sections: Array<{ categoryId: string; slug: string }> = []
  for (const cat of productsData.categories) {
    const page = await getCategoryPageData(cat.id)
    if (!page) continue
    entries.push({ url: `${base}/products/${cat.id}`, changeFrequency: "weekly" })
    for (const sub of page.subcategories) {
      const slug = getPublicSubcategorySlug(cat.id, { id: String(sub.id), slug: String(sub.slug) })
      sections.push({ categoryId: cat.id, slug })
    }
  }
  // Bound parallel reads so sitemap generation does not overload the database.
  for (let i = 0; i < sections.length; i += 4) {
    const pages = await Promise.all(sections.slice(i, i + 4).map(async ({ categoryId, slug }) => {
      const page = await getSubcategoryPageData(categoryId, slug)
      if (!page) return []
      const path = `/products/${categoryId}/${page.publicSubcategorySlug}`
      return [
        { url: `${base}${path}`, changeFrequency: "weekly" as const },
        ...page.displayProducts.map((product) => ({
          url: base + getProductUrlPath(categoryId, page.publicSubcategorySlug, {
            id: String(product.id), slug: typeof product.slug === "string" ? product.slug : null,
          }),
          changeFrequency: "monthly" as const,
        })),
      ]
    }))
    entries.push(...pages.flat())
  }
  return entries
}

async function fetchNewsUrls(base: string): Promise<MetadataRoute.Sitemap> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseKey) return []

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/news?is_active=eq.true&select=slug,updated_at,published_at`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(5000),
      }
    )
    if (!res.ok) return []
    const rows = (await res.json()) as Array<{
      slug: string | null
      updated_at: string | null
      published_at: string | null
    }>
    return rows
      .filter((r) => r.slug)
      .map((r) => ({
        url: `${base}/about/news/${r.slug}`,
        ...((r.updated_at || r.published_at) && !Number.isNaN(Date.parse(r.updated_at || r.published_at || ""))
          ? { lastModified: new Date(r.updated_at || r.published_at!) } : {}),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }))
  } catch {
    return []
  }
}

function dedupeSitemap(entries: MetadataRoute.Sitemap): MetadataRoute.Sitemap {
  const map = new Map<string, MetadataRoute.Sitemap[0]>()
  for (const e of entries) {
    const prev = map.get(e.url)
    if (!prev) {
      map.set(e.url, e)
      continue
    }
    const a = e.lastModified
    const b = prev.lastModified
    if (a && (!b || new Date(a).getTime() > new Date(b).getTime())) map.set(e.url, e)
  }
  return [...map.values()]
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl()
  const staticPart = staticEntries(base)

  const [productPart, newsPart] = await Promise.all([catalogEntries(base), fetchNewsUrls(base)])

  return dedupeSitemap([...staticPart, ...productPart, ...newsPart])
}
