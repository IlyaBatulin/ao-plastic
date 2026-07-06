import type { Metadata } from "next"
import { Hero } from "@/sections/hero"
import { Stats } from "@/sections/stats"
import { About } from "@/sections/about"
import { Partners } from "@/sections/partners"
import { News } from "@/sections/news"
import { Contact } from "@/sections/contact"
import { Footer } from "@/components/footer"
import { createClient, withRetry } from "@/utils/supabase/server"
import { pageOpenGraph } from "@/lib/seo/page-metadata"

export const revalidate = 300

export const metadata: Metadata = {
  title: {
    absolute:
      "АО «Пластик» — производство АБС-пластиков, полистирола и полимеров | Узловая",
  },
  description:
    "Официальный сайт производителя: АБС-пластики (литьё и экструзия), вспенивающийся и экструзионный полистирол, стирол, детали машиностроения, товары народного потребления. Каталог, новости, контакты завода в Узловой.",
  alternates: {
    canonical: "/",
  },
  openGraph: pageOpenGraph({
    title:
      "АО «Пластик» — производство АБС-пластиков, полистирола и полимеров | Узловая",
    description:
      "Официальный сайт производителя: АБС-пластики (литьё и экструзия), вспенивающийся и экструзионный полистирол, стирол, детали машиностроения, товары народного потребления. Каталог, новости, контакты завода в Узловой.",
    path: "/",
  }),
}

export default async function Home() {
  let newsItems: { id: number; title: string; excerpt: string | null; image_url: string | null; published_at: string | null; slug: string | null }[] = []

  try {
    const hasSupabaseConfig =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!hasSupabaseConfig) {
      console.warn('[Home] Supabase не настроен. Используются пустые данные. Настройте .env.local для подключения к базе данных.')
    } else {
      const supabase = createClient()
      const { data: newsData } = await withRetry(() =>
        supabase
          .from("news")
          .select("id, title, excerpt, image_url, published_at, slug")
          .eq("is_active", true)
          .order("published_at", { ascending: false })
          .limit(6)
      )
      if (newsData && Array.isArray(newsData)) {
        newsItems = newsData
      }
    }
  } catch (error) {
    console.error("Error fetching news:", error)
  }

  return (
    <main className="min-h-screen w-full max-w-full overflow-x-clip bg-background">
      <Hero />
      <About />
      <Stats />
      <Partners />
      <News items={newsItems} />
      <Contact />
      <Footer />
    </main>
  )
}
