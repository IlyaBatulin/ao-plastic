import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { BackgroundPaths } from "@/components/ui/background-paths"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar } from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import { sanitizeHtml } from "@/lib/sanitize-html"
import { ArticleJsonLd } from "@/components/seo/article-json-ld"

interface NewsDetailPageProps {
  params: Promise<{ slugOrId: string }>
}

async function getNews(slugOrId: string) {
  const supabase = createClient()
  const isNumeric = /^\d+$/.test(slugOrId)

  let query = supabase.from("news").select("*").eq("is_active", true)
  query = isNumeric ? query.eq("id", parseInt(slugOrId, 10)) : query.eq("slug", slugOrId)

  const { data, error } = await query.single()
  if (error || !data) return null
  return data
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const { slugOrId } = await params
  const item = await getNews(slugOrId)
  if (!item) {
    return { title: "Новость" }
  }
  const desc =
    typeof item.excerpt === "string" && item.excerpt.trim()
      ? item.excerpt.replace(/<[^>]+>/g, "").slice(0, 160)
      : `${item.title} — новости АО «Пластик».`
  return {
    title: item.title,
    description: desc,
    alternates: {
      canonical: `/about/news/${item.slug || item.id}`,
    },
    openGraph: {
      title: item.title,
      description: desc,
      url: `/about/news/${item.slug || item.id}`,
      images: item.image_url ? [{ url: item.image_url }] : undefined,
    },
  }
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slugOrId } = await params
  const item = await getNews(slugOrId)

  if (!item) notFound()

  const publishedDate = item.published_at
    ? new Date(item.published_at).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null

  const newsPath = `/about/news/${item.slug || item.id}`
  const plainExcerpt =
    typeof item.excerpt === "string" && item.excerpt.trim()
      ? item.excerpt.replace(/<[^>]+>/g, "").slice(0, 300)
      : null

  return (
    <>
      <ArticleJsonLd
        title={item.title}
        description={plainExcerpt}
        imageUrl={item.image_url}
        publishedAt={item.published_at}
        updatedAt={item.updated_at}
        urlPath={newsPath}
      />
      <BackgroundPaths />
      <div className="min-h-screen bg-transparent">
        <section className="pt-32 pb-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <Link href="/about/news">
                <Button variant="ghost" size="sm" className="mb-8 -ml-2">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  К списку новостей
                </Button>
              </Link>

              <article className="bg-card rounded-xl border border-border p-8 md:p-10">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Calendar className="w-4 h-4" />
                  {publishedDate || "Без даты"}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                  {item.title}
                </h1>
                {item.video_url && (() => {
                  const u = (item.video_url as string).trim()
                  const ytMatch = u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
                  const vimeoMatch = u.match(/vimeo\.com\/(?:video\/)?(\d+)/)
                  const embedUrl = ytMatch
                    ? `https://www.youtube.com/embed/${ytMatch[1]}`
                    : vimeoMatch
                      ? `https://player.vimeo.com/video/${vimeoMatch[1]}`
                      : null
                  return embedUrl ? (
                    <div className="aspect-video max-w-2xl rounded-xl overflow-hidden border border-border mb-6">
                      <iframe
                        src={embedUrl}
                        title={item.title ? `Видео: ${item.title}` : "Видео к новости"}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : null
                })()}
                {item.image_url && (
                  <div className="mb-6 rounded-xl overflow-hidden border border-border max-w-2xl">
                    <img
                      src={item.image_url}
                      alt={item.title ? `Иллюстрация к новости: ${item.title}` : "Иллюстрация к новости"}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}
                {item.excerpt && (
                  <p className="text-lg text-muted-foreground mb-6">{item.excerpt}</p>
                )}
                {item.content && (
                  <div
                    className="news-content prose prose-lg dark:prose-invert max-w-none [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:text-lg [&_h3]:font-medium [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:border-l-4 [&_blockquote]:border-muted-foreground [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:rounded [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.content) }}
                  />
                )}
              </article>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}
