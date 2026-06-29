"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import {
  getCatalogSubcategoryDescription,
  getCatalogSubcategoryLabel,
} from "@/lib/catalog-translations"
import { getPublicSubcategorySlug } from "@/lib/catalog-slugs"
import { CustomOrderForm } from "@/app/products/_components/custom-order-form"
import { AbsShimmerCard } from "@/app/products/_components/abs-shimmer-card"
import { cn } from "@/lib/utils"

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
    veshalki: '/images/xoztov/veshalki-card.png',
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
  const { t, lang } = useLanguage()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [pendingHref, setPendingHref] = useState<string | null>(null)
  const locale = lang === "en" ? "en" : "ru"
  const categoryLabel = t(`homePage.catalog.categories.${categoryId}`) || categoryId
  const orderCommentPrefix = useMemo(() => {
    const lead = t("homePage.catalog.emptyCategoryInquiryOrderPrefix")
    return lead ? `${lead}: ${categoryLabel}` : `Заявка по каталогу: ${categoryLabel}`
  }, [t, categoryLabel])

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {subcategories.map((subcategory) => {
            const imageSrc =
              getSubcategoryImage(subcategory.id, subcategory.slug) ||
              subcategory.image ||
              "/placeholder.svg"
            const subcategoryHref = `/products/${categoryId}/${getPublicSubcategorySlug(categoryId, subcategory)}`
            const subcategoryTitle = getCatalogSubcategoryLabel(
              subcategory.id,
              subcategory.slug,
              subcategory.name,
              locale
            )
            const subcategoryDescription =
              getCatalogSubcategoryDescription(
                subcategory.id,
                subcategory.slug,
                subcategory.description,
                locale
              ) ?? ""
            
            const useFastNav = categoryId === "hoztovary" || categoryId === "machine-parts"
            const isNavigating = isPending && pendingHref === subcategoryHref

            return (
            <Link
              key={subcategory.id}
              href={subcategoryHref}
              prefetch={useFastNav}
              onMouseEnter={() => router.prefetch(subcategoryHref)}
              onFocus={() => router.prefetch(subcategoryHref)}
              onTouchStart={() => router.prefetch(subcategoryHref)}
              onClick={
                useFastNav
                  ? (event) => {
                      event.preventDefault()
                      setPendingHref(subcategoryHref)
                      startTransition(() => router.push(subcategoryHref))
                    }
                  : undefined
              }
              aria-busy={isNavigating}
              className={cn(
                "subcategory-card group relative h-64 sm:h-72 rounded-3xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300",
                isNavigating && "pointer-events-none scale-[0.99] border-primary/40 opacity-95"
              )}
            >
              <div className="absolute inset-0">
                <div className="absolute inset-0 overflow-hidden">
                  {imageSrc && (
                    <img
                      src={imageSrc}
                      alt={subcategory.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/15 to-transparent md:from-black/55 md:via-black/10 md:to-transparent transition-opacity duration-300 md:group-hover:from-background/95 md:group-hover:via-background/15" />
              </div>

              <div className="relative z-10 flex h-full flex-col justify-end p-4 sm:p-5">
                <div className="rounded-xl border border-white/50 bg-white/92 px-3.5 py-3 shadow-sm backdrop-blur-sm transition-all duration-300 md:border-white/25 md:bg-transparent md:shadow-none md:backdrop-blur-0 md:group-hover:border-white/60 md:group-hover:bg-white/95 md:group-hover:shadow-md md:group-hover:backdrop-blur-sm sm:px-4 sm:py-3.5">
                  <h3 className="text-base font-bold leading-snug text-foreground transition-colors duration-300 md:text-white md:drop-shadow-sm md:group-hover:text-primary sm:text-lg text-balance break-words">
                    {subcategoryTitle}
                  </h3>
                  {subcategoryDescription && subcategory.id !== "abs-custom" && (
                    <p className="mt-1 text-xs leading-snug text-muted-foreground line-clamp-2 transition-colors duration-300 md:text-white/90 md:drop-shadow-sm md:group-hover:text-muted-foreground sm:text-sm">
                      {subcategoryDescription}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-1.5 font-semibold text-primary transition-all duration-300 group-hover:gap-2 md:text-white md:group-hover:text-primary">
                    <span className="text-xs sm:text-sm">{t("homePage.catalog.readMore")}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 sm:h-4 sm:w-4" />
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

