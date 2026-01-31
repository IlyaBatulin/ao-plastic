import { Hero } from "@/sections/hero"
import { Stats } from "@/sections/stats"
import { About } from "@/sections/about"
import { ProductsPreview } from "@/sections/products-preview"
import { Partners } from "@/sections/partners"
import { News } from "@/sections/news"
import { Contact } from "@/sections/contact"
import { Footer } from "@/components/footer"
import { createClient, withRetry } from "@/utils/supabase/server"

export const revalidate = 300

export default async function Home() {
  // Получаем реальные актуальные товары из базы данных
  let featuredProducts: any[] = []
  let allProducts: any[] = []
  const subcategoriesMap: { [key: string]: { slug: string; name: string } } = {}
  const categoriesMap: { [key: string]: { name: string } } = {}

  try {
    // Проверяем наличие переменных окружения Supabase
    const hasSupabaseConfig = 
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!hasSupabaseConfig) {
      console.warn('[Home] Supabase не настроен. Используются пустые данные. Настройте .env.local для подключения к базе данных.')
    } else {
      const supabase = createClient()

      // ОПТИМИЗАЦИЯ: Выполняем запросы параллельно для ускорения загрузки
      const [
        { data: subcatsData },
        { data: catsData },
        { data: allProductsData, error: allProductsError }
      ] = await Promise.all([
        // Получаем подкатегории
        withRetry(() => 
          supabase
            .from("subcategories")
            .select("id, slug, name, category_id")
            .eq("is_active", true)
        ),
        // Получаем категории
        withRetry(() =>
          supabase
            .from("categories")
            .select("id, name")
            .eq("is_active", true)
        ),
        // Получаем все товары для поиска
        withRetry(() =>
          supabase
            .from("products")
            .select("*")
            .eq("is_active", true)
            .order("sort", { ascending: true })
        )
      ])

      // Заполняем маппинги
      if (subcatsData) {
        subcatsData.forEach((sub) => {
          subcategoriesMap[sub.id] = { slug: sub.slug, name: sub.name }
        })
      }

      if (catsData) {
        catsData.forEach((cat) => {
          categoriesMap[cat.id] = { name: cat.name }
        })
      }

      // Получаем избранные товары параллельно
      if (subcatsData && subcatsData.length > 0) {
        const absInjectionSubcat = subcatsData.find((s) => s.slug === "abs-injection")
        const psPsvSSubcat = subcatsData.find((s) => s.slug === "ps-psv-s")
        const psPsvLSubcat = subcatsData.find((s) => s.slug === "ps-psv-l")

        // Выполняем запросы товаров параллельно
        const productPromises = []
        
        if (absInjectionSubcat) {
          productPromises.push(
            withRetry(() =>
              supabase
                .from("products")
                .select("*")
                .eq("subcategory_id", absInjectionSubcat.id)
                .eq("is_active", true)
                .order("sort", { ascending: true })
                .limit(1)
            )
          )
        }
        
        if (psPsvSSubcat) {
          productPromises.push(
            withRetry(() =>
              supabase
                .from("products")
                .select("*")
                .eq("subcategory_id", psPsvSSubcat.id)
                .eq("is_active", true)
                .order("sort", { ascending: true })
                .limit(1)
            )
          )
        }
        
        if (psPsvLSubcat) {
          productPromises.push(
            withRetry(() =>
              supabase
                .from("products")
                .select("*")
                .eq("subcategory_id", psPsvLSubcat.id)
                .eq("is_active", true)
                .order("sort", { ascending: true })
                .limit(1)
            )
          )
        }

        // Ждем все запросы товаров одновременно
        const productsResults = await Promise.all(productPromises)
        
        // Собираем все товары
        productsResults.forEach(({ data }) => {
          if (data && data.length > 0) {
            featuredProducts.push(...data)
          }
        })
      }

      if (allProductsError) {
        console.warn("Error fetching all products:", allProductsError)
        // Не критично - продолжаем работу без всех товаров
      }

      if (allProductsData && Array.isArray(allProductsData)) {
        allProducts = allProductsData
      } else if (!allProductsError) {
        console.warn("All products data is empty or not an array")
      }
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
      <Partners />
      <News />
      <Contact />
      <Footer />
    </main>
  )
}
