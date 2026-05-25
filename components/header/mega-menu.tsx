"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { resolveProductDisplay } from "@/lib/product-en"
import productsData from "@/data/products.json"

export function MegaMenu() {
  const filteredCategories = productsData.categories.filter((cat) => cat.id !== 'dispersion')
  const [activeCategory, setActiveCategory] = useState<string | null>(filteredCategories[0]?.id || null)
  const { t, lang } = useLanguage()

  const activeCategoryData = filteredCategories.find((cat) => cat.id === activeCategory)

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute top-full left-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl w-[800px]"
    >
      <div className="grid grid-cols-2 gap-0">
        {/* Left: Categories */}
        <div className="border-r border-gray-100 p-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 px-3">
            {t("homePage.catalog.categoriesLabel")}
          </h3>
          <div className="space-y-1">
            {productsData.categories
              .filter((category) => category.id !== 'dispersion')
              .map((category) => {
              const categoryName = t(`homePage.catalog.categories.${category.id}`) || category.name
              return (
                <Link
                  key={category.id}
                  href={`/products/${category.id}`}
                  onMouseEnter={() => setActiveCategory(category.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-150 flex items-center justify-between group ${
                    activeCategory === category.id
                      ? "bg-blue-50 text-blue-700 font-medium border-l-4 border-blue-600"
                      : "hover:bg-blue-50/50 text-foreground"
                  }`}
                >
                  <span className="line-clamp-1">{categoryName}</span>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${activeCategory === category.id ? "translate-x-1" : "group-hover:translate-x-1"}`}
                  />
                </Link>
              )
            })}
          </div>
        </div>

        {/* Right: Subcategories/Products */}
        <div className="p-4 pr-3 overflow-hidden">
          <AnimatePresence mode="wait">
            {activeCategoryData && (
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  {t(`homePage.catalog.categories.${activeCategoryData.id}`) || activeCategoryData.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                  {t(`homePage.catalog.categoryDescriptions.${activeCategoryData.id}`) ||
                    activeCategoryData.description}
                </p>

                {activeCategoryData.subcategories && activeCategoryData.subcategories.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                      {t("homePage.catalog.subcategoriesLabel")}
                    </p>
                    {activeCategoryData.subcategories.map((sub) => {
                      const subcategoryName = t(`homePage.catalog.subcategories.${sub.id}`) || sub.name
                      return (
                        <Link
                          key={sub.id}
                          href={`/products/${activeCategoryData.id}/${sub.slug}`}
                          className="block px-3 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary rounded-lg transition-all duration-150"
                        >
                          {subcategoryName}
                        </Link>
                      )
                    })}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                      {t("homePage.catalog.productsLabel")}
                    </p>
                    {activeCategoryData.products?.slice(0, 5).map((product) => {
                      const { name: productLabel } = resolveProductDisplay(
                        {
                          id: product.id,
                          name: product.name,
                          description: product.description,
                        },
                        lang === "en" ? "en" : "ru"
                      )
                      return (
                      <Link
                        key={product.id}
                        href={`/products/${activeCategoryData.id}`}
                        className="block px-3 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary rounded-lg transition-all duration-150"
                      >
                        {productLabel}
                      </Link>
                    )})}
                  </div>
                )}

                <Link
                  href={`/products/${activeCategoryData.id}`}
                  className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  {t("homePage.catalog.viewAll")}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
