import type { Metadata } from "next"
import { Hero } from "@/sections/hero"
import { Stats } from "@/sections/stats"
import { About } from "@/sections/about"
import { Partners } from "@/sections/partners"
import { News } from "@/sections/news"
import { Contact } from "@/sections/contact"
import { Footer } from "@/components/footer"
import { HomeSectionDivider } from "@/components/home-section-divider"
import { createClient, withRetry } from "@/utils/supabase/server"

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
    <main className="min-h-screen bg-background">
      <Hero />
      <HomeSectionDivider titleKey="homePage.stats.title" subtitleKey="homePage.stats.subtitle" />
      <Stats />
      <HomeSectionDivider titleKey="homePage.about.title" />
      <About />
      <HomeSectionDivider titleKey="homePage.partners.title" subtitleKey="homePage.partners.description" />
      <Partners />
      <HomeSectionDivider titleKey="homePage.news.title" subtitleKey="homePage.news.description" />
      <News items={newsItems} />
      <HomeSectionDivider titleKey="homePage.contact.title" subtitleKey="homePage.contact.description" />
      <Contact />
      <Footer />
    </main>
  )
}
