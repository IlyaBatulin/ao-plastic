import type { Metadata } from "next"
import { createClient } from "@/utils/supabase/server"
import productsData from "@/data/products.json"
import { notFound } from "next/navigation"
import { CategoryPageClient } from "@/app/products/_components/category-page-client"
import { getCategoryVideo } from "@/lib/video-config"
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld"

export const revalidate = 300

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoryId: string }>
}): Promise<Metadata> {
  const { categoryId } = await params
  let title = categoryId
  let description = `Каталог продукции «${categoryId}» — АО «Пластик».`
  let dbImage: string | undefined

  try {
    const supabase = createClient()
    const { data } = await supabase
      .from("categories")
      .select("name, description, image")
      .eq("id", categoryId)
      .single()
    if (data?.name) {
      title = data.name
      if (data.description) {
        description = String(data.description).replace(/<[^>]+>/g, "").trim().slice(0, 160)
      }
    }
    if (data?.image && typeof data.image === "string") {
      dbImage = data.image
    }
  } catch {
    /* fallback ниже */
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

// Генерируем статические страницы для всех категорий (SSG)
export async function generateStaticParams() {
  // Используем простой fetch для Supabase без cookies (SSG контекст)
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
          return categories.map((cat: any) => ({
            categoryId: cat.id,
          }))
        }
      }
    }
  } catch (error) {
    console.error("Error fetching categories for generateStaticParams:", error)
  }

  // Fallback на JSON
  return productsData.categories.map((cat) => ({
    categoryId: cat.id,
  }))
}

export default async function CategoryPage({ params }: { params: Promise<{ categoryId: string }> }) {
  const resolvedParams = await params
  let category: any = null
  let subcategories: any[] = []

  // Пытаемся получить из Supabase
  try {
    const supabase = createClient()

    // Получаем категорию
    const { data: catData, error: catError } = await supabase
      .from("categories")
      .select("*")
      .eq("id", resolvedParams.categoryId)
      .single()

    if (!catError && catData) {
      category = catData
    }

    // Получаем подкатегории
    const { data: subData, error: subError } = await supabase
      .from("subcategories")
      .select("*")
      .eq("category_id", resolvedParams.categoryId)
      .eq("is_active", true)
      .order("sort", { ascending: true })

    if (!subError && subData) {
      subcategories = subData
    }
  } catch (error) {
    console.error("Error fetching category from Supabase:", error)
  }

  // Fallback на JSON
  if (!category) {
    category = productsData.categories.find((cat) => cat.id === resolvedParams.categoryId)
    if (category?.subcategories) {
      subcategories = category.subcategories
    }
  }

  if (!category) {
    notFound()
  }

  // ABS: скрываем подкатегорию "Технические характеристики АБС" (abs-specs)
  if (resolvedParams.categoryId === "abs") {
    subcategories = (subcategories || []).filter(
      (s: any) => s?.id !== "abs-specs" && s?.slug !== "abs-specs"
    )
  }

  const categoryTitle =
    typeof category?.name === "string" ? category.name : resolvedParams.categoryId

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", path: "/" },
          { name: "Каталог", path: "/products" },
          { name: categoryTitle, path: `/products/${resolvedParams.categoryId}` },
        ]}
      />
      <CategoryPageClient
        categoryId={resolvedParams.categoryId}
        category={category}
        subcategories={subcategories}
        hasVideo={!!getCategoryVideo(resolvedParams.categoryId)}
        videoSrc={getCategoryVideo(resolvedParams.categoryId)}
      />
    </>
  )
}
