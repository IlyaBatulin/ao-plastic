import { Footer } from "@/components/footer"
import { createClient } from "@/utils/supabase/server"
import productsData from "@/data/products.json"
import { ProductsCatalogClient } from "@/app/products/_components/products-catalog-client"

export const revalidate = 300

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
      categories = data.map((cat) => {
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
      categories = productsData.categories.filter((cat) => cat.id !== 'dispersion')
    }
  } catch {
    categories = productsData.categories.filter((cat) => cat.id !== 'dispersion')
  }

  return (
    <>
      <ProductsCatalogClient categories={categories} />
      <Footer />
    </>
  )
}
