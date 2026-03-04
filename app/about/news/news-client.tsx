"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Newspaper, Calendar, ChevronRight } from "lucide-react"

interface NewsItem {
  id: number
  title: string
  slug: string | null
  excerpt: string | null
  content: string | null
  image_url: string | null
  video_url: string | null
  published_at: string | null
  is_active: boolean
  created_at: string
}

export function NewsClient() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/news")
      .then((res) => res.ok ? res.json() : [])
      .then(setNews)
      .catch(() => setNews([]))
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Загрузка новостей...</p>
      </div>
    )
  }

  if (news.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-xl border border-border">
        <Newspaper className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Пока нет новостей</p>
        <p className="text-sm text-muted-foreground mt-2">Следите за обновлениями</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {news.map((item) => {
        const href = `/about/news/${item.slug || item.id}`
        return (
          <Link key={item.id} href={href}>
            <article className="bg-card rounded-xl p-6 border border-border hover:shadow-lg hover:border-primary/30 transition-all group">
              <div className="flex items-start gap-4">
                {item.image_url ? (
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                    <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Newspaper className="w-6 h-6 text-primary" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="w-4 h-4" />
                    {item.published_at
                      ? new Date(item.published_at).toLocaleDateString("ru-RU", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : new Date(item.created_at).toLocaleDateString("ru-RU", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  {(item.excerpt || item.content) && (
                    <p className="text-muted-foreground mb-2">
                      {item.excerpt ||
                        (() => {
                          const text = (item.content || "").replace(/<[^>]*>/g, "")
                          return text.length > 300 ? text.slice(0, 300) + "…" : text
                        })()}
                    </p>
                  )}
                  <span className="inline-flex items-center text-sm text-primary font-medium">
                    Читать полностью
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </span>
                </div>
              </div>
            </article>
          </Link>
        )
      })}
    </div>
  )
}
