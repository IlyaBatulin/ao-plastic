"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Search } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { resolveProductDisplay } from "@/lib/product-en"
import { getCatalogCategoryLabel } from "@/lib/catalog-translations"

interface Product {
  id: string
  name: string
  brand?: string
  description?: string
  image?: string
  category_id: string
  subcategory_id?: string
  specifications?: any
}

interface ProductsPreviewProps {
  products: Product[]
  allProducts: Product[]
  subcategories: { [key: string]: { slug: string; name: string } }
  categories: { [key: string]: { name: string } }
}

export function ProductsPreview({ products, allProducts, subcategories, categories }: ProductsPreviewProps) {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")

  // Фильтруем товары по поисковому запросу из всего каталога
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return []
    }

    const query = searchQuery.toLowerCase().trim()
    
    // Проверяем, что есть товары для поиска
    if (!allProducts || !Array.isArray(allProducts) || allProducts.length === 0) {
      return []
    }

    // Сначала проверяем, совпадает ли запрос с началом названия категории
    const matchingCategoryIds: string[] = []
    Object.entries(categories).forEach(([categoryId, categoryInfo]) => {
      const categoryName = categoryInfo?.name?.toLowerCase() || ""
      // Проверяем, начинается ли название категории с запроса
      if (categoryName.startsWith(query)) {
        matchingCategoryIds.push(categoryId)
      }
    })

    // Если запрос совпадает с категорией - показываем товары из этой категории
    if (matchingCategoryIds.length > 0) {
      const productsFromMatchingCategories = allProducts.filter((product) => {
        if (!product) return false
        return matchingCategoryIds.includes(product.category_id)
      })
      return productsFromMatchingCategories.slice(0, 12)
    }

    // Если запрос НЕ совпадает с категорией - ищем только по названиям товаров
    const results = allProducts.filter((product) => {
      if (!product) return false
      
      const name = product.name?.toLowerCase() || ""
      const brand = product.brand?.toLowerCase() || ""
      const description = product.description?.toLowerCase() || ""
      
      // Ищем только по названию, марке и описанию товара (не по категории)
      return (
        name.includes(query) ||
        brand.includes(query) ||
        description.includes(query)
      )
    })

    return results.slice(0, 12) // Ограничиваем до 12 результатов
  }, [allProducts, searchQuery, categories])

  // Товары для отображения: либо из поиска, либо базовые
  const displayProducts = searchQuery.trim() ? searchResults : products

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">{t("homePage.products.title")}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            {t("homePage.products.description")}
          </p>

          {/* Поисковая строка */}
          <div className="max-w-3xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("homePage.products.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-12 pr-4 text-lg rounded-2xl border-2 border-border focus:border-primary transition-colors bg-background"
            />
          </div>
        </div>

        {/* Результаты поиска или базовые товары */}
        {searchQuery.trim() && (
          <div className="mb-6 text-center">
            <p className="text-muted-foreground">
              {searchResults.length > 0 ? (
                <>{t("homePage.products.foundProducts")} <span className="font-semibold text-foreground">{searchResults.length}</span></>
              ) : (
                <>{t("homePage.products.catalogSearch")} <span className="font-semibold text-foreground">{allProducts?.length || 0}</span> {t("homePage.products.productsInDatabase")}</>
              )}
            </p>
          </div>
        )}
        
        {displayProducts.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {displayProducts.map((product) => {
              const specs = typeof product.specifications === "string"
                ? JSON.parse(product.specifications)
                : product.specifications || {}

              // Определяем ссылку на товар
              const subcategory = product.subcategory_id ? subcategories[product.subcategory_id] : null
              const categoryName = getCatalogCategoryLabel(
                product.category_id,
                categories[product.category_id]?.name || "",
                lang === "en" ? "en" : "ru"
              )
              const { name: displayName, description: displayDescription } = resolveProductDisplay(
                {
                  id: String(product.id),
                  name: product.name,
                  description: product.description,
                },
                lang === "en" ? "en" : "ru"
              )
              
              const productLink = subcategory
                ? `/products/${product.category_id}/${subcategory.slug}/${product.id}`
                : `/products/${product.category_id}`

              return (
                <Link
                  key={product.id}
                  href={productLink}
                  className="group relative bg-card rounded-3xl overflow-hidden border border-border/50 hover:border-primary/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  {/* Product Image */}
                  <div className="relative h-64 bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent z-10" />
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={displayName}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 z-20 bg-primary/10 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary">
                      {categoryName}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 transition-colors duration-300 group-hover:text-primary">
                      {displayName}
                    </h3>
                    {displayDescription && (
                      <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-2">
                        {displayDescription}
                      </p>
                    )}

                    {Object.keys(specs).length > 0 && (
                      <div className="space-y-2 mb-4">
                        {Object.entries(specs).slice(0, 3).map(([key, value]) => {
                          // Форматируем значение: если массив - объединяем через запятую
                          let formattedValue = value
                          if (Array.isArray(value)) {
                            formattedValue = value.join(", ")
                          } else if (typeof value === "string" || typeof value === "number") {
                            formattedValue = String(value)
                          } else {
                            formattedValue = String(value)
                          }

                          // Переводим ключи на русский язык
                          const keyTranslations: { [key: string]: string } = {
                            "Application": "Применение",
                            "Применение": "Применение",
                            "Тип": "Тип",
                            "Type": "Тип",
                            "Марка": "Марка",
                            "Grade": "Марка",
                            "Packaging": "Упаковка",
                            "Упаковка": "Упаковка",
                            "Granule size": "Размер гранул",
                            "Размер гранул": "Размер гранул",
                          }

                          const displayKey = keyTranslations[key] || key

                          return (
                            <div key={key} className="flex items-start justify-between text-sm gap-2">
                              <span className="text-muted-foreground flex-shrink-0">{displayKey}:</span>
                              <span className="font-semibold text-right break-words">{formattedValue}</span>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    <div className="flex items-center text-primary font-semibold text-sm group-hover:gap-2 transition-all">
                      {t("homePage.products.readMore")}
                      <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              )
              })}
            </div>
          </>
        ) : searchQuery.trim() ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              {t("homePage.products.noResults")} &quot;{searchQuery}&quot; {t("homePage.products.nothingFound")}
            </p>
            <Button
              variant="outline"
              onClick={() => setSearchQuery("")}
              className="mt-4"
            >
              {t("homePage.products.clearSearch")}
            </Button>
          </div>
        ) : null}

        {/* View All Button */}
        <div className="text-center">
          <Button asChild size="lg" className="group">
            <Link href="/products">
              {t("homePage.products.viewAll")}
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
