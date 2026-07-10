"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ArrowRight, Calendar, Newspaper } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { SectionHeading } from "@/components/section-heading"

interface NewsItem {
  id: number
  title: string
  excerpt: string | null
  image_url: string | null
  published_at: string | null
  slug: string | null
}

interface NewsProps {
  items?: NewsItem[]
}

export function News({ items = [] }: NewsProps) {
  const { t, lang } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-12 lg:py-16 pt-8">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading
          title={t("homePage.news.title")}
          subtitle={t("homePage.news.description")}
          className="mb-8 lg:mb-10"
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
          {items.length > 0 ? (
            items.map((item, index) => (
              <Card
                key={item.id}
                className={`transition-all duration-300 overflow-hidden ${
                  isVisible ? "animate-in fade-in slide-in-from-bottom-4" : "opacity-0"
                }`}
                style={{ animationDelay: `${index * 150}ms`, animationFillMode: "both" }}
              >
                <div className="relative h-64 overflow-hidden bg-muted">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Newspaper className="w-20 h-20 text-muted-foreground/50" />
                    </div>
                  )}
                </div>
                <CardHeader className="p-6 pb-2">
                  <div className="flex items-center gap-2 text-base text-muted-foreground mb-2">
                    <Calendar className="w-4 h-4" />
                    {item.published_at
                      ? new Date(item.published_at).toLocaleDateString(lang === "en" ? "en-US" : "ru-RU", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : ""}
                  </div>
                  <h3 className="text-2xl font-semibold leading-tight">{item.title}</h3>
                </CardHeader>
                <CardContent className="px-6 py-4">
                  <p className="text-muted-foreground text-base line-clamp-4">
                    {item.excerpt || ""}
                  </p>
                </CardContent>
                <CardFooter className="p-6 pt-2">
                  <Button variant="ghost" asChild className="group/btn">
                    <Link href={`/about/news/${item.slug || item.id}`}>
                      {t("homePage.news.readMore")}
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              {t("homePage.news.empty")}
            </div>
          )}
        </div>

        <div className="text-center">
          <Button asChild size="lg" variant="outline" className="group bg-transparent">
            <Link href="/about/news">
              {t("homePage.news.allNews")}
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
