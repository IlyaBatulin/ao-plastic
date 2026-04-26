"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Package } from "lucide-react"
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
  const catalogCategories = categories.filter((c) => c.id !== "custom-abs")

  return (
    <div className="min-h-screen bg-transparent">
      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-10 text-center">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-balance text-[#1e3a8a] dark:text-[#3b82f6]">
              {t("homePage.catalog.title")}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t("homePage.catalog.description")}
            </p>
            <div className="mt-6 h-0.5 w-24 mx-auto bg-[#1e3a8a] dark:bg-[#3b82f6]" />
          </div>
        </div>
      </section>

      {/* Product Categories Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {catalogCategories.map((category: Category) => {
              const categoryName = t(`homePage.catalog.categories.${category.id}`) || category.name
              const categoryDescription =
                t(`homePage.catalog.categoryDescriptions.${category.id}`) || category.description
              return (
                <Link
                  key={category.id}
                  href={`/products/${category.id}`}
                  className="group relative flex h-full min-h-0 flex-col bg-card rounded-3xl overflow-hidden border-2 border-border hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:-translate-y-2"
                >
                  {/* Image */}
                  <div className="relative h-56 shrink-0 overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10 pointer-events-none" />
                    <Image
                      src={
                        category.id === "abs"
                          ? "/images/absiplast_main.png"
                          : category.id === "kors"
                            ? "/images/kors_bentol_main.png"
                            : category.id === "styrene"
                              ? "/images/styrolmain.png"
                              : category.id === "polystyrene"
                                ? "/images/polist_main.png"
                                : category.id === "hoztovary"
                                  ? "/images/hoztov_main.png"
                                  : category.id === "machine-parts"
                                    ? "/images/machine_main.png"
                                    : category.image ||
                                        `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(categoryName)}`
                      }
                      alt={categoryName}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  {/* Content — flex-1 + CTA внизу, чтобы «Подробнее» был на одной линии в ряду */}
                  <div className="flex min-h-0 flex-1 flex-col p-8">
                    <div className="min-h-0 flex-1">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                          <Package className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors text-balance">
                            {categoryName}
                          </h3>
                          {categoryDescription ? (
                            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
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

