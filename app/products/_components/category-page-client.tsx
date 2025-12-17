"use client"

import { Footer } from "@/components/footer"
import { CategoryHero } from "@/app/products/_components/category-hero"
import { SubcategoriesGrid } from "@/app/products/_components/subcategories-grid"
import { useLanguage } from "@/contexts/language-context"

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
  
  // Получаем переведенное название категории
  const categoryName = t(`homePage.catalog.categories.${categoryId}`) || category.name
  const backLabel = t("homePage.catalog.backToCatalog") || "Назад к каталогу"

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <CategoryHero
        title={categoryName}
        description={category.description}
        backHref="/products"
        backLabel={backLabel}
        hasVideo={hasVideo}
        videoSrc={videoSrc}
        imageSrc={category.image}
      />

      {/* Subcategories Grid */}
      <SubcategoriesGrid categoryId={categoryId} subcategories={subcategories} />

      <Footer />
    </div>
  )
}

