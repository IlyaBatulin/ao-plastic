import type { Metadata } from "next"
import productsData from "@/data/products.json"
import { notFound } from "next/navigation"
import { CategoryPageClient } from "@/app/products/_components/category-page-client"
import { getCategoryVideo } from "@/lib/video-config"
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld"
import { isNextBuild } from "@/lib/next-build"
import { getCategoryPageData } from "@/lib/catalog-category"
import { getSubcategoryPageData } from "@/lib/catalog-subcategory"
import type { CatalogShowcaseGroup, CatalogShowcaseProduct } from "@/app/products/_components/abs-catalog-showcase"

export const revalidate = 300

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoryId: string }>
}): Promise<Metadata> {
  const { categoryId } = await params
  const pageData = await getCategoryPageData(categoryId)

  let title = categoryId
  let description = `Каталог продукции «${categoryId}» — АО «Пластик».`
  let dbImage: string | undefined

  if (pageData?.category) {
    const category = pageData.category
    if (typeof category.name === "string") {
      title = category.name
    }
    if (category.description) {
      description = String(category.description)
        .replace(/<[^>]+>/g, "")
        .trim()
        .slice(0, 160)
    }
    if (typeof category.image === "string") {
      dbImage = category.image
    }
  }

  const fromJson = productsData.categories.find((c) => c.id === categoryId)
  if (fromJson?.name && title === categoryId) title = fromJson.name
  if (fromJson?.description && description.includes("Каталог продукции")) {
    description = fromJson.description.slice(0, 160)
  }

  const fromJsonImage = fromJson?.image as string | undefined
  const ogImage = dbImage || fromJsonImage

  return {
    title,
    description,
    alternates: { canonical: `/products/${categoryId}` },
    openGraph: {
      title,
      description,
      url: `/products/${categoryId}`,
      ...(ogImage ? { images: [{ url: ogImage, alt: title }] } : {}),
    },
  }
}

// Генерируем статические страницы для категорий (без Supabase на билде)
export async function generateStaticParams() {
  if (isNextBuild()) {
    return productsData.categories.map((cat) => ({ categoryId: cat.id }))
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseKey) {
      const response = await fetch(`${supabaseUrl}/rest/v1/categories?is_active=eq.true&select=id`, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        next: { revalidate: 300 },
      })

      if (response.ok) {
        const categories = await response.json()
        if (categories && categories.length > 0) {
          return categories.map((cat: { id: string }) => ({
            categoryId: cat.id,
          }))
        }
      }
    }
  } catch (error) {
    console.error("Error fetching categories for generateStaticParams:", error)
  }

  return productsData.categories.map((cat) => ({
    categoryId: cat.id,
  }))
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categoryId: string }>
}) {
  const { categoryId } = await params
  const pageData = await getCategoryPageData(categoryId)

  if (!pageData) {
    notFound()
  }

  const { category, subcategories } = pageData
  const categoryTitle =
    typeof category?.name === "string" ? category.name : categoryId
  const showcaseCategoryIds = new Set(["abs", "polystyrene", "dispersion", "hoztovary", "machine-parts"])
  const showcaseGroups: CatalogShowcaseGroup[] | undefined =
    showcaseCategoryIds.has(categoryId)
      ? await Promise.all(
          subcategories.map(async (sub) => {
            const subcategorySlug = String(sub.slug ?? sub.id ?? "")
            const subcategoryData = await getSubcategoryPageData(categoryId, subcategorySlug)
            const products = (subcategoryData?.displayProducts ?? []).map(
              (product): CatalogShowcaseProduct => ({
                id: String(product.id ?? ""),
                slug: typeof product.slug === "string" ? product.slug : null,
                name: String(product.name ?? ""),
                description: typeof product.description === "string" ? product.description : null,
                brand: typeof product.brand === "string" ? product.brand : null,
                specifications:
                  typeof product.specifications === "string" ||
                  (product.specifications !== null && typeof product.specifications === "object")
                    ? (product.specifications as Record<string, unknown> | string)
                    : null,
              })
            )

            return {
              id: String(sub.id ?? subcategorySlug),
              slug: String(subcategoryData?.publicSubcategorySlug ?? subcategorySlug),
              name: String(sub.name ?? ""),
              description: typeof sub.description === "string" ? sub.description : undefined,
              products,
            }
          })
        )
      : undefined

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", path: "/" },
          { name: "Каталог", path: "/products" },
          { name: categoryTitle, path: `/products/${categoryId}` },
        ]}
      />
      <CategoryPageClient
        categoryId={categoryId}
        category={{
          id: String(category.id ?? categoryId),
          name: categoryTitle,
          description:
            typeof category.description === "string" ? category.description : undefined,
          image: typeof category.image === "string" ? category.image : undefined,
        }}
        subcategories={subcategories.map((sub) => ({
          id: String(sub.id ?? ""),
          slug: String(sub.slug ?? sub.id ?? ""),
          name: String(sub.name ?? ""),
          description:
            typeof sub.description === "string" ? sub.description : undefined,
          image: typeof sub.image === "string" ? sub.image : null,
        }))}
        hasVideo={!!getCategoryVideo(categoryId)}
        videoSrc={getCategoryVideo(categoryId)}
        showcaseGroups={showcaseGroups}
      />
    </>
  )
}
