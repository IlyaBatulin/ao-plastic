"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ArrowRight, Calendar } from "lucide-react"
import newsData from "@/data/news.json"
import { useLanguage } from "@/contexts/language-context"

export function News() {
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
    <section ref={sectionRef} className="py-12 lg:py-16 pt-8 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">{t("homePage.news.title")}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("homePage.news.description")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {newsData.news.map((item, index) => (
            <Card
              key={item.id}
              className={`group hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden ${
                isVisible ? "animate-in fade-in slide-in-from-bottom-4" : "opacity-0"
              }`}
              style={{ animationDelay: `${index * 150}ms`, animationFillMode: "both" }}
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(item.date).toLocaleDateString(lang === "en" ? "en-US" : "ru-RU")}
                </div>
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">{item.title}</h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{item.excerpt}</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" asChild className="group/btn">
                  <Link href={`/news/${item.id}`}>
                    {t("homePage.news.readMore")}
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg" variant="outline" className="group bg-transparent">
            <Link href="/news">
              {t("homePage.news.allNews")}
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
