"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useEffect, useRef } from "react"
import { useLanguage } from "@/contexts/language-context"

// Вспомогательная функция для получения изображения подкатегории
function getSubcategoryImage(subcategoryId: string, slug?: string): string | null {
  const imageMap: Record<string, string> = {
    // Полистирол
    'ps-psv-s': '/images/polystyrene-psv-l-card.png',  // ПСВ-С теперь с фото ПСВ-Л
    'ps-psv-l': '/images/polystyrene-pse-card.png',    // ПСВ-Л теперь с фото ПСЭ-1
    'ps-pse': '/images/polystyrene-psv-s-card.png',    // ПСЭ-1 теперь с фото ПСВ-С
    // АБС-пластики
    'abs-injection': '/images/absplasric.jpeg',
    'abs-extrusion': '/images/absplasric.jpeg',
    'abs-custom': '/images/absplasric.jpeg',
    // Хозтовары
    'vedra-tazy': '/images/xoztov/vedra_main.jpeg',
  }
  
  return imageMap[subcategoryId] || imageMap[slug || ''] || null
}

type Subcategory = {
  id: string
  slug: string
  name: string
  description?: string
  image?: string | null
}

interface SubcategoriesGridProps {
  categoryId: string
  subcategories: Subcategory[]
}

export function SubcategoriesGrid({ categoryId, subcategories }: SubcategoriesGridProps) {
  const { t } = useLanguage()
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const card = entry.target as HTMLElement
            card.style.opacity = '1'
            card.style.transform = 'translateY(0)'
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.05, rootMargin: "80px" }
    )

    const cards = gridRef.current?.querySelectorAll(".subcategory-card")
    cards?.forEach((card, index) => {
      const cardElement = card as HTMLElement
      cardElement.style.transitionDelay = `${index * 80}ms`
      observer.observe(card)
    })

    return () => observer.disconnect()
  }, [subcategories])

  if (subcategories.length === 0) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="text-muted-foreground text-lg">{t("homePage.catalog.noSubcategories")}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 -mt-20 relative z-20">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="text-4xl lg:text-5xl font-bold mb-12 text-center">{t("homePage.catalog.subcategoriesTitle")}</h2>
        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {subcategories.map((subcategory, index) => {
            const imageSrc = subcategory.image || getSubcategoryImage(subcategory.id, subcategory.slug) || "/placeholder.svg"
            
            return (
            <Link
              key={subcategory.id}
              href={`/products/${categoryId}/${subcategory.slug}`}
              className="subcategory-card group relative h-80 rounded-3xl overflow-hidden border border-border/50 hover:border-primary/50"
              style={{
                opacity: 0,
                transform: 'translateY(30px)',
                transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {/* Background Image (Top Half) */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 overflow-hidden">
                  {imageSrc && (
                    <img
                      src={imageSrc}
                      alt={subcategory.name}
                      className="absolute top-0 left-0 w-full h-[50%] object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )}
                </div>
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background/95" />
              </div>

              {/* Content */}
              <div className="relative h-full flex flex-col justify-between p-4 sm:p-6 z-10">
                {/* Number Badge */}
                <div className="absolute top-4 right-4 w-14 h-14 rounded-full bg-primary/10 backdrop-blur-md border border-primary/20 flex items-center justify-center font-bold text-2xl text-primary transition-all duration-300 group-hover:bg-primary/20 group-hover:border-primary/30 group-hover:scale-110">
                  {index + 1}
                </div>

                {/* Title and CTA - единый блок без разделения */}
                <div className="mt-auto bg-white/95 backdrop-blur-sm rounded-xl p-4 -mx-2 border border-white/50 shadow-sm">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 transition-colors duration-300 group-hover:text-primary text-balance break-words">
                    {t(`homePage.catalog.subcategories.${subcategory.id}`) || subcategory.name}
                  </h3>
                  {subcategory.description && subcategory.id !== "abs-custom" && (
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                      {subcategory.description}
                    </p>
                  )}
                  {/* CTA внутри того же блока без границы */}
                  <div className="flex items-center gap-2 text-primary font-semibold transition-all duration-300 group-hover:gap-3 mt-2">
                    <span className="text-xs sm:text-sm md:text-base">{t("homePage.catalog.readMore")}</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
              </div>

              {/* Shadow on hover */}
              <div className="absolute inset-0 rounded-3xl shadow-lg opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" style={{ boxShadow: '0 20px 40px rgba(0, 70, 255, 0.15)' }} />
            </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

