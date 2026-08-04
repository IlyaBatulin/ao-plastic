"use client"

import dynamic from "next/dynamic"
import { Footer } from "@/components/footer"
import { CategoryHero } from "@/app/products/_components/category-hero"
import { SubcategoriesGrid } from "@/app/products/_components/subcategories-grid"
import { useLanguage } from "@/contexts/language-context"
import { getCategoryImageUrl } from "@/lib/category-image"
import { AbsCatalogShowcase, type AbsShowcaseGroup } from "@/app/products/_components/abs-catalog-showcase"

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

const PvcModifierCategorySection = dynamic(
  () =>
    import("@/app/products/_components/pvc-modifier-category-section").then((m) => ({
      default: m.PvcModifierCategorySection,
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
  absGroups?: AbsShowcaseGroup[]
}

export function CategoryPageClient({
  categoryId,
  category,
  subcategories,
  hasVideo,
  videoSrc,
  absGroups = [],
}: CategoryPageClientProps) {
  const { t } = useLanguage()

  const categoryName = t(`homePage.catalog.categories.${categoryId}`) || category.name
  const backLabel = t("homePage.catalog.backToCatalog") || "Назад к каталогу"
  const isStyrene = categoryId === "styrene"
  const isKors = categoryId === "kors"
  const isAbs = categoryId === "abs"
  const isPvcModifier = categoryId === "pvc-modifier"

  return (
    <div className="min-h-screen">
      {isAbs ? (
        <AbsCatalogShowcase
          title={categoryName}
          description={t(`homePage.catalog.categoryDescriptions.${categoryId}`) || category.description}
          videoSrc={videoSrc}
          imageSrc={getCategoryImageUrl(categoryId, category.image, categoryName)}
          groups={absGroups}
          backLabel={backLabel}
        />
      ) : (
        <CategoryHero
          title={categoryName}
          description={t(`homePage.catalog.categoryDescriptions.${categoryId}`) || category.description}
          backHref="/products"
          backLabel={backLabel}
          hasVideo={hasVideo}
          videoSrc={videoSrc}
          imageSrc={getCategoryImageUrl(categoryId, category.image, categoryName)}
          categoryId={categoryId}
        />
      )}

      {!isAbs && !isStyrene && !isKors && !isPvcModifier && (
        <SubcategoriesGrid categoryId={categoryId} subcategories={subcategories} />
      )}

      {isAbs && <AbsCategorySection />}
      {isStyrene && <StyreneCategorySection categoryName={categoryName} />}
      {isKors && <KorsCategorySection categoryName={category.name} />}
      {isPvcModifier && <PvcModifierCategorySection categoryName={categoryName} />}

      <Footer />
    </div>
  )
}
