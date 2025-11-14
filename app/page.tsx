import { Hero } from "@/sections/hero"
import { Stats } from "@/sections/stats"
import { About } from "@/sections/about"
import { ProductsPreview } from "@/sections/products-preview"
import { VideoShowcase } from "@/sections/video-showcase"
import { Partners } from "@/sections/partners"
import { News } from "@/sections/news"
import { Contact } from "@/sections/contact"
import { Footer } from "@/components/footer"
import { createClient } from "@/utils/supabase/server"

export const revalidate = 300

export default async function Home() {
  // Получаем реальные актуальные товары из базы данных
  let featuredProducts: any[] = []
  let allProducts: any[] = []
  const subcategoriesMap: { [key: string]: { slug: string; name: string } } = {}
  const categoriesMap: { [key: string]: { name: string } } = {}

  try {
    const supabase = createClient()

    // Получаем подкатегории для формирования ссылок
    const { data: subcatsData } = await supabase
      .from("subcategories")
      .select("id, slug, name, category_id")
      .eq("is_active", true)

    if (subcatsData) {
      subcatsData.forEach((sub) => {
        subcategoriesMap[sub.id] = { slug: sub.slug, name: sub.name }
      })
    }

    // Получаем категории
    const { data: catsData } = await supabase
      .from("categories")
      .select("id, name")
      .eq("is_active", true)

    if (catsData) {
      catsData.forEach((cat) => {
        categoriesMap[cat.id] = { name: cat.name }
      })
    }

    // Получаем актуальные товары: 1 из АБС и 2 из разных категорий полистирола (всего 3 товара)
    if (subcatsData && subcatsData.length > 0) {
      const absInjectionSubcat = subcatsData.find((s) => s.slug === "abs-injection")
      const psPsvSSubcat = subcatsData.find((s) => s.slug === "ps-psv-s")
      const psPsvLSubcat = subcatsData.find((s) => s.slug === "ps-psv-l")

      // Получаем 1 товар из АБС
      if (absInjectionSubcat) {
        const { data: absProducts } = await supabase
          .from("products")
          .select("*")
          .eq("subcategory_id", absInjectionSubcat.id)
          .eq("is_active", true)
          .order("sort", { ascending: true })
          .limit(1)

        if (absProducts && absProducts.length > 0) {
          featuredProducts.push(...absProducts)
        }
      }

      // Получаем по 1 товару из двух категорий полистирола
      if (psPsvSSubcat) {
        const { data: psPsvSProducts } = await supabase
          .from("products")
          .select("*")
          .eq("subcategory_id", psPsvSSubcat.id)
          .eq("is_active", true)
          .order("sort", { ascending: true })
          .limit(1)

        if (psPsvSProducts && psPsvSProducts.length > 0) {
          featuredProducts.push(...psPsvSProducts)
        }
      }

      if (psPsvLSubcat) {
        const { data: psPsvLProducts } = await supabase
          .from("products")
          .select("*")
          .eq("subcategory_id", psPsvLSubcat.id)
          .eq("is_active", true)
          .order("sort", { ascending: true })
          .limit(1)

        if (psPsvLProducts && psPsvLProducts.length > 0) {
          featuredProducts.push(...psPsvLProducts)
        }
      }
    }

    // Получаем все товары для поиска по всему каталогу
    const { data: allProductsData, error: allProductsError } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("sort", { ascending: true })

    if (allProductsError) {
      console.error("Error fetching all products:", allProductsError)
    }

    if (allProductsData && Array.isArray(allProductsData)) {
      allProducts = allProductsData
    }
  } catch (error) {
    console.error("Error fetching featured products:", error)
  }

  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <Stats />
      <About />
      <ProductsPreview 
        products={featuredProducts}
        allProducts={allProducts}
        subcategories={subcategoriesMap}
        categories={categoriesMap}
      />
      <VideoShowcase />
      <Partners />
      <News />
      <Contact />
      <Footer />
    </main>
  )
}
