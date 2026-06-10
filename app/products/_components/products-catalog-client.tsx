"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { CATALOG_WARMUP_PATHS } from "@/lib/catalog-warmup"
import { getCategoryImageUrl } from "@/lib/category-image"
import { CatalogCategoryCard } from "@/app/products/_components/catalog-category-card"

interface Category {
  id: string
  name: string
  description?: string
  image?: string
  subcategories?: Array<{
    id: string
    name: string
    slug?: string
  }>
}

interface ProductsCatalogClientProps {
  categories: Category[]
}

export function ProductsCatalogClient({ categories }: ProductsCatalogClientProps) {
  const { t } = useLanguage()
  const router = useRouter()
  const catalogCategories = categories.filter((c) => c.id !== "custom-abs")

  useEffect(() => {
    for (const category of catalogCategories) {
      router.prefetch(`/products/${category.id}`)
    }
    for (const path of CATALOG_WARMUP_PATHS) {
      router.prefetch(path)
    }
  }, [router])

  return (
    <div className="min-h-screen bg-transparent">
      <section className="pt-28 pb-4 sm:pt-32 sm:pb-6">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-4 text-center sm:mb-6">
            <h1 className="text-h1 mb-3 text-primary sm:mb-4">
              {t("homePage.catalog.title")}
            </h1>
            <p className="text-body max-w-3xl mx-auto">
              {t("homePage.catalog.description")}
            </p>
            <div className="mt-6 h-0.5 w-24 mx-auto bg-primary" />
          </div>
        </div>
      </section>

      <section className="pt-2 pb-16 sm:pt-4 sm:pb-20">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
            {catalogCategories.map((category) => {
              const categoryName =
                t(`homePage.catalog.categories.${category.id}`) || category.name
              const categoryDescription =
                t(`homePage.catalog.categoryDescriptions.${category.id}`) ||
                category.description
              const subcategories = category.subcategories?.map((sub) => ({
                id: sub.id,
                name: t(`homePage.catalog.subcategories.${sub.id}`) || sub.name,
              }))

              return (
                <CatalogCategoryCard
                  key={category.id}
                  categoryId={category.id}
                  categoryName={categoryName}
                  categoryDescription={categoryDescription}
                  imageSrc={getCategoryImageUrl(category.id, category.image, categoryName)}
                  sectionsLabel={t("homePage.catalog.sections")}
                  readMoreLabel={t("homePage.catalog.readMore")}
                  moreLabel={t("homePage.catalog.more")}
                  subcategories={subcategories}
                />
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
