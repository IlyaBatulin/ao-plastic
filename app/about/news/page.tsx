import { localizePageMetadata } from "@/lib/seo/localized-metadata"
import { getServerLanguage } from "@/lib/server-language"
import type { Metadata } from "next"
import { Footer } from "@/components/footer"
import { NewsClient } from "./news-client"
import { pageOpenGraph } from "@/lib/seo/page-metadata"

const originalMetadata: Metadata = {
  title: "Новости",
  description:
    "Новости АО «Пластик»: события завода, рынок полимеров, обновления ассортимента АБС и полистирола.",
  alternates: { canonical: "/about/news" },
  openGraph: pageOpenGraph({
    title: "Новости",
    description:
      "Новости АО «Пластик»: события завода, рынок полимеров, обновления ассортимента АБС и полистирола.",
    path: "/about/news",
  }),
}

export async function generateMetadata(): Promise<Metadata> {
  return localizePageMetadata(originalMetadata, "/about/news")
}

export default async function NewsPage() {
  const en = await getServerLanguage() === "en"
  return (
    <>
      <div className="min-h-screen bg-transparent">
        <section className="pt-32 pb-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {/* Выделенный заголовок */}
              <div className="mb-16 text-center">
                <h1 className="text-h1 mb-6 text-primary break-words animate-in fade-in slide-in-from-bottom-4 duration-700">
                  {en ? "News" : "Новости"}
                </h1>
                <p className="text-xl md:text-2xl text-foreground/70 leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
                  {en ? "Company news and updates" : "Актуальные события и новости компании"}
                </p>
                <div className="mt-6 h-0.5 w-24 mx-auto bg-primary animate-in fade-in duration-700 delay-300" />
              </div>

              <NewsClient />
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}
