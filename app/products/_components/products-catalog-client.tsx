"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Package } from "lucide-react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"

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
    // Явно подогреваем самые «тяжелые» разделы, чтобы переход не ощущался как «многократный клик».
    router.prefetch("/products/hoztovary")
    router.prefetch("/products/machine-parts")
  }, [router])

  return (
    <div className="min-h-screen bg-transparent">
      {/* Hero Section */}
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

      {/* Product Categories Grid */}
      <section className="pt-2 pb-16 sm:pt-4 sm:pb-20">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
            {catalogCategories.map((category: Category) => {
              const categoryName = t(`homePage.catalog.categories.${category.id}`) || category.name
              const categoryDescription =
                t(`homePage.catalog.categoryDescriptions.${category.id}`) || category.description
              return (
                <Link
                  key={category.id}
                  href={`/products/${category.id}`}
                  prefetch
                  onMouseEnter={() => router.prefetch(`/products/${category.id}`)}
                  onTouchStart={() => router.prefetch(`/products/${category.id}`)}
                  className="group relative flex h-full min-h-0 flex-col bg-card rounded-3xl overflow-hidden border-2 border-border hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:-translate-y-2"
                >
                  {/* Image */}
                  <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10 pointer-events-none" />
                    <Image
                      src={
                        category.id === "abs"
                          ? "/images/absiplast-main.png"
                          : category.id === "kors"
                            ? "/images/kors-bentol-main.png"
                            : category.id === "styrene"
                              ? "/images/styrolmain.png"
                              : category.id === "polystyrene"
                                ? "/images/polist-main.png"
                                : category.id === "hoztovary"
                                  ? "/images/hoztov-main.png"
                                  : category.id === "machine-parts"
                                    ? "/images/machine-main.png"
                                    : category.image ||
                                        `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(categoryName)}`
                      }
                      alt={categoryName}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  {/* Content — flex-1 + CTA внизу, чтобы «Подробнее» был на одной линии в ряду */}
                  <div className="flex min-h-0 flex-1 flex-col p-6 sm:p-7 lg:p-8">
                    <div className="min-h-0 flex-1">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 transition-transform duration-300 group-hover:scale-110 sm:h-12 sm:w-12">
                          <Package className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="mb-2 text-xl font-bold leading-snug text-balance hyphens-auto break-words transition-colors group-hover:text-primary sm:text-2xl">
                            {categoryName}
                          </h3>
                          {categoryDescription ? (
                            <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
                              {categoryDescription}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      {category.subcategories && category.subcategories.length > 0 && (
                        <div className="mt-6 border-t border-border pt-6">
                          <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                            {t("homePage.catalog.sections")}
                          </p>
                          <ul className="space-y-2">
                            {category.subcategories.slice(0, 3).map((sub: any) => {
                              const subcategoryName = t(`homePage.catalog.subcategories.${sub.id}`) || sub.name
                              return (
                                <li key={sub.id} className="text-sm text-muted-foreground flex items-center gap-2">
                                  <ArrowRight className="w-4 h-4 text-primary flex-shrink-0" />
                                  <span className="line-clamp-1">{subcategoryName}</span>
                                </li>
                              )
                            })}
                            {category.subcategories.length > 3 && (
                              <li className="text-sm text-primary font-medium">
                                +{category.subcategories.length - 3} {t("homePage.catalog.more")}
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="mt-auto flex items-center gap-2 pt-6 text-primary font-semibold group-hover:gap-4 transition-all">
                      {t("homePage.catalog.readMore")}
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

