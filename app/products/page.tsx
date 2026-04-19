import type { Metadata } from "next"
import { Footer } from "@/components/footer"
import { BackgroundPaths } from "@/components/ui/background-paths"
import { createClient } from "@/utils/supabase/server"
import productsData from "@/data/products.json"
import { ProductsCatalogClient } from "@/app/products/_components/products-catalog-client"

export const revalidate = 300

export const metadata: Metadata = {
  title: "Каталог продукции",
  description:
    "Каталог АО «Пластик»: АБС-пластики, полистирол, стирол, детали машиностроения, канистры и бытовые изделия. Подкатегории, характеристики и заказ продукции.",
  alternates: { canonical: "/products" },
}

export default async function ProductsPage() {
  // Пытаемся получить категории из Supabase; при ошибке/пусто используем локальный JSON
  let categories: any[] = []
  const fallbackMap = new Map(productsData.categories.map((cat) => [cat.id, cat]))

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("v_categories_summary")
      .select("id, name, description, image")
      .order("sort", { ascending: true })

    if (!error && data && data.length > 0) {
      categories = data
        .filter((cat: any) => cat.id !== "dispersion" && cat.id !== "pvc-modifier")
        .map((cat) => {
          const fallback = fallbackMap.get(cat.id)
          const image = cat.image ?? fallback?.image ?? undefined
          const description = cat.description ?? fallback?.description
          return {
            ...cat,
            image,
            description,
            subcategories: fallback?.subcategories ?? [],
          }
        })
    } else {
      categories = productsData.categories.filter((cat) => cat.id !== "dispersion" && cat.id !== "pvc-modifier")
    }
  } catch {
    categories = productsData.categories.filter((cat) => cat.id !== "dispersion" && cat.id !== "pvc-modifier")
  }

  return (
    <>
      <BackgroundPaths />
      <ProductsCatalogClient categories={categories} />
      <Footer />
    </>
  )
}
