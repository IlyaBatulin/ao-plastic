import { createClient } from "@/utils/supabase/server"
import productsData from "@/data/products.json"
import { notFound } from "next/navigation"
import { CategoryPageClient } from "@/app/products/_components/category-page-client"
import { getCategoryVideo } from "@/lib/video-config"

export const revalidate = 300

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

  return (
    <CategoryPageClient
      categoryId={resolvedParams.categoryId}
      category={category}
      subcategories={subcategories}
      hasVideo={!!getCategoryVideo(resolvedParams.categoryId)}
      videoSrc={getCategoryVideo(resolvedParams.categoryId)}
    />
  )
}
