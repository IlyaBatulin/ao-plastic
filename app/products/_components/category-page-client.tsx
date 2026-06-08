"use client"

import dynamic from "next/dynamic"
import { Footer } from "@/components/footer"
import { CategoryHero } from "@/app/products/_components/category-hero"
import { SubcategoriesGrid } from "@/app/products/_components/subcategories-grid"
import { useLanguage } from "@/contexts/language-context"

const AbsCategorySection = dynamic(
  () =>
    import("@/app/products/_components/abs-category-section").then((m) => ({
      default: m.AbsCategorySection,
    })),
  { ssr: true }
)

const StyreneCategorySection = dynamic(
  () =>
    import("@/app/products/_components/styrene-category-section").then((m) => ({
      default: m.StyreneCategorySection,
    })),
  { ssr: true }
)

const KorsCategorySection = dynamic(
  () =>
    import("@/app/products/_components/kors-category-section").then((m) => ({
      default: m.KorsCategorySection,
    })),
  { ssr: true }
)

interface CategoryPageClientProps {
  categoryId: string
  category: {
    id: string
    name: string
    description?: string
    image?: string
  }
  subcategories: Array<{
    id: string
    slug: string
    name: string
    description?: string
    image?: string | null
  }>
  hasVideo: boolean
  videoSrc?: string
}

export function CategoryPageClient({
  categoryId,
  category,
  subcategories,
  hasVideo,
  videoSrc,
}: CategoryPageClientProps) {
  const { t } = useLanguage()

  const categoryName = t(`homePage.catalog.categories.${categoryId}`) || category.name
  const backLabel = t("homePage.catalog.backToCatalog") || "Назад к каталогу"
  const isStyrene = categoryId === "styrene"
  const isKors = categoryId === "kors"
  const isAbs = categoryId === "abs"

  return (
    <div className="min-h-screen bg-background">
      <CategoryHero
        title={categoryName}
        description={
          t(`homePage.catalog.categoryDescriptions.${categoryId}`) || category.description
        }
        backHref="/products"
        backLabel={backLabel}
        hasVideo={hasVideo}
        videoSrc={videoSrc}
        imageSrc={category.image}
      />

      {!isStyrene && !isKors && (
        <SubcategoriesGrid categoryId={categoryId} subcategories={subcategories} />
      )}

      {isAbs && <AbsCategorySection />}
      {isStyrene && <StyreneCategorySection categoryName={categoryName} />}
      {isKors && <KorsCategorySection categoryName={category.name} />}

      <Footer />
    </div>
  )
}
