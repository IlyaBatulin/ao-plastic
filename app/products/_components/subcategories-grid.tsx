"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { useEffect, useMemo, useRef } from "react"
import { useLanguage } from "@/contexts/language-context"
import { getCatalogSubcategoryTranslationKey } from "@/lib/catalog-translations"
import { getPublicSubcategorySlug } from "@/lib/catalog-slugs"
import { CustomOrderForm } from "@/app/products/_components/custom-order-form"
import { AbsShimmerCard } from "@/app/products/_components/abs-shimmer-card"

// Вспомогательная функция для получения изображения подкатегории
function getSubcategoryImage(subcategoryId: string, slug?: string): string | null {
  const imageMap: Record<string, string> = {
    // Полистирол
    'ps-psv-s': '/images/polystyrene-psv-l-card.png',  // ПСВ-С теперь с фото ПСВ-Л
    'ps-psv-l': '/images/polystyrene-pse-card.png',    // ПСВ-Л теперь с фото ПСЭ-1
    'ps-pse': '/images/polystyrene-psv-s-card.png',    // ПСЭ-1 теперь с фото ПСВ-С
    // АБС-пластики
    'abs-injection': '/images/absiplast-main.png',
    'abs-extrusion': '/images/absiplast-main.png',
    'abs-custom': '/images/abs-custom/abs-production-materials.png',
    // Хозтовары
    'vedra-tazy': '/images/xoztov/vedra-main.jpeg',
    // Детали машиностроения (литьё / экструзия — как на главной карточке категории)
    'injection-parts': '/images/litmain.jpeg',
    'parts-injection': '/images/litmain.jpeg',
    injection: '/images/litmain.jpeg',
    'extrusion-parts': '/images/machine-main.png',
    'parts-extrusion': '/images/machine-main.png',
    extrusion: '/images/machine-main.png',
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
  const router = useRouter()

  const categoryLabel = t(`homePage.catalog.categories.${categoryId}`) || categoryId
  const orderCommentPrefix = useMemo(() => {
    const lead = t("homePage.catalog.emptyCategoryInquiryOrderPrefix")
    return lead ? `${lead}: ${categoryLabel}` : `Заявка по каталогу: ${categoryLabel}`
  }, [t, categoryLabel])

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
      <section className="w-full py-16">
        <div className="mx-auto w-full max-w-[1920px] px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20 2xl:px-24">
          <AbsShimmerCard>
            <CustomOrderForm
              categoryId={categoryId}
              subcategoryId={null}
              orderCommentPrefix={orderCommentPrefix}
              orderType="category_inquiry"
              source={`catalog-category-empty:${categoryId}`}
              commentLabel={t("homePage.catalog.emptyCategoryCommentLabel")}
              commentPlaceholder={t("homePage.catalog.emptyCategoryCommentPlaceholder")}
              commentHint={t("homePage.catalog.emptyCategoryCommentHint")}
            />
          </AbsShimmerCard>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 -mt-20 relative z-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {subcategories.map((subcategory) => {
            const imageSrc = subcategory.image || getSubcategoryImage(subcategory.id, subcategory.slug) || "/placeholder.svg"
            const subcategoryHref = `/products/${categoryId}/${getPublicSubcategorySlug(categoryId, subcategory)}`
            
            return (
            <Link
              key={subcategory.id}
              href={subcategoryHref}
              prefetch
              onMouseEnter={() => router.prefetch(subcategoryHref)}
              onTouchStart={() => router.prefetch(subcategoryHref)}
              className="subcategory-card group relative h-72 sm:h-80 rounded-3xl overflow-hidden border border-border/50 hover:border-primary/50"
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
              <div className="relative h-full flex flex-col justify-between p-5 sm:p-7 z-10">
                {/* Title and CTA - единый блок без разделения */}
                <div className="mt-auto -mx-2 flex min-h-[11.75rem] flex-col rounded-xl border border-white/50 bg-white/95 p-4 sm:p-5 shadow-sm backdrop-blur-sm">
                  <h3 className="mb-3 text-xl font-bold transition-colors duration-300 group-hover:text-primary sm:text-2xl text-balance break-words">
                    {t(`homePage.catalog.subcategories.${getCatalogSubcategoryTranslationKey(subcategory.slug)}`) ||
                      subcategory.name}
                  </h3>
                  {subcategory.description && subcategory.id !== "abs-custom" && (
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                      {subcategory.description}
                    </p>
                  )}
                  {/* CTA внутри того же блока без границы */}
                  <div className="mt-auto flex items-center gap-2 text-primary font-semibold transition-all duration-300 group-hover:gap-3">
                    <span className="text-sm sm:text-base">{t("homePage.catalog.readMore")}</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
              </div>

              {/* Shadow on hover */}
              <div className="absolute inset-0 rounded-3xl shadow-lg opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" style={{ boxShadow: '0 20px 40px rgba(30, 58, 138, 0.15)' }} />
            </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

