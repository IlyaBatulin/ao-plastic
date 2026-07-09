import type { MetadataRoute } from "next"
import { getSiteUrl } from "@/lib/site"
import productsData from "@/data/products.json"

export const revalidate = 3600

const HIDDEN_CATEGORIES = new Set(["dispersion"])

const STATIC_PATHS = [
  "",
  "/about",
  "/about/history",
  "/about/mission",
  "/about/ethics",
  "/about/safety",
  "/about/quality",
  "/about/vacancies",
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

function productEntriesFromJson(base: string): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const cat of productsData.categories) {
    if (HIDDEN_CATEGORIES.has(cat.id)) continue

    entries.push({
      url: `${base}/products/${cat.id}`,
      changeFrequency: "weekly",
      priority: 0.85,
    })

    for (const sub of cat.subcategories ?? []) {
      const slug = "slug" in sub && sub.slug ? sub.slug : (sub as { id?: string }).id
      if (!slug) continue
      entries.push({
        url: `${base}/products/${cat.id}/${slug}`,
        changeFrequency: "weekly",
        priority: 0.75,
      })
    }

    for (const product of cat.products ?? []) {
      const p = product as { id: string; subcategory?: string }
      const subSlug =
        p.subcategory ||
        (cat.subcategories?.[0] as { slug?: string } | undefined)?.slug ||
        ""
      if (!subSlug) continue
      entries.push({
        url: `${base}/products/${cat.id}/${subSlug}/${p.id}`,
        changeFrequency: "monthly",
        priority: 0.65,
      })
    }
  }

  return entries
}

async function fetchSupabaseProductUrls(base: string): Promise<MetadataRoute.Sitemap | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseKey) return null

  try {
    const [productsRes, subcatsRes, categoriesRes] = await Promise.all([
      fetch(`${supabaseUrl}/rest/v1/products?is_active=eq.true&select=id,category_id,subcategory_id,updated_at`, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        next: { revalidate: 3600 },
      }),
      fetch(`${supabaseUrl}/rest/v1/subcategories?select=id,slug,category_id,updated_at`, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        next: { revalidate: 3600 },
      }),
      fetch(`${supabaseUrl}/rest/v1/categories?is_active=eq.true&select=id,updated_at`, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        next: { revalidate: 3600 },
      }),
    ])

    if (!productsRes.ok || !subcatsRes.ok || !categoriesRes.ok) return null

    const products = (await productsRes.json()) as Array<{
      id: string
      category_id: string
      subcategory_id: string | null
      updated_at: string | null
    }>
    const subcategories = (await subcatsRes.json()) as Array<{
      id: string
      slug: string
      category_id: string
      updated_at: string | null
    }>
    const categories = (await categoriesRes.json()) as Array<{
      id: string
      updated_at: string | null
    }>

    const subcatMap = new Map(subcategories.map((s) => [s.id, s.slug]))
    const entries: MetadataRoute.Sitemap = []

    for (const p of products) {
      if (HIDDEN_CATEGORIES.has(p.category_id)) continue
      const subSlug = p.subcategory_id ? subcatMap.get(p.subcategory_id) : undefined
      if (!subSlug) continue
      entries.push({
        url: `${base}/products/${p.category_id}/${subSlug}/${p.id}`,
        ...(p.updated_at ? { lastModified: new Date(p.updated_at) } : {}),
        changeFrequency: "monthly",
        priority: 0.65,
      })
    }

    for (const c of categories) {
      if (HIDDEN_CATEGORIES.has(c.id)) continue
      entries.push({
        url: `${base}/products/${c.id}`,
        ...(c.updated_at ? { lastModified: new Date(c.updated_at) } : {}),
        changeFrequency: "weekly",
        priority: 0.85,
      })
    }

    for (const s of subcategories) {
      if (HIDDEN_CATEGORIES.has(s.category_id)) continue
      entries.push({
        url: `${base}/products/${s.category_id}/${s.slug}`,
        ...(s.updated_at ? { lastModified: new Date(s.updated_at) } : {}),
        changeFrequency: "weekly",
        priority: 0.75,
      })
    }

    return dedupeSitemap(entries)
  } catch {
    return null
  }
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
        lastModified: r.updated_at ? new Date(r.updated_at) : r.published_at ? new Date(r.published_at) : new Date(),
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
    if (a && b && a > b) map.set(e.url, e)
  }
  return [...map.values()]
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl()
  const staticPart = staticEntries(base)

  const fromDb = await fetchSupabaseProductUrls(base)
  const productPart = fromDb ?? productEntriesFromJson(base)
  const newsPart = await fetchNewsUrls(base)

  return dedupeSitemap([...staticPart, ...productPart, ...newsPart])
}
