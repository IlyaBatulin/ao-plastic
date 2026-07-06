"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "@/lib/i18n"
import { getCatalogCategoryLabel, getCatalogSubcategoryLabel } from "@/lib/catalog-translations"
import { getPublicSubcategorySlug } from "@/lib/catalog-slugs"
import { sortCatalogCategories } from "@/lib/catalog-category-order"
import { createClient } from "@/utils/supabase/client"
import productsData from "@/data/products.json"
import corporateMenuData from "@/data/menu-corporate.json"

interface Category {
  id: string
  name: string
  slug: string
  subcategories?: Array<{
    id: string
    name: string
    slug: string
  }>
}

interface MenuItem {
  label: string
  labelEn?: string
  href: string
}

interface MenuSection {
  title: string
  titleEn?: string
  items: MenuItem[]
}

interface UnifiedMegaMenuProps {
  isOpen: boolean
  activeItem: string | null
  onClose: () => void
}

// Кэш для категорий
let categoriesCache: Category[] | null = null
let categoriesCachePromise: Promise<Category[]> | null = null

const CLIENT_CATALOG_TIMEOUT_MS = 5_000

async function withClientTimeout<T>(promise: PromiseLike<T>, ms: number): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  try {
    return await Promise.race([
      Promise.resolve(promise),
      new Promise<T>((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error("catalog timeout")), ms)
      }),
    ])
  } finally {
    if (timeoutId) clearTimeout(timeoutId)
  }
}

const mapJsonSubcategories = (category: any) =>
  (category?.subcategories || [])
    .filter((sub: any) => !(category.id === "abs" && (sub.id === "abs-specs" || sub.slug === "abs-specs")))
    .map((sub: any) => ({
      id: sub.id,
      name: sub.name,
      slug: sub.slug,
    }))

const getJsonCategories = (): Category[] =>
  sortCatalogCategories(
    productsData.categories
      .filter((cat) => cat.id !== "dispersion")
      .map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.id,
        subcategories: mapJsonSubcategories(cat),
      }))
  )

const getJsonSubcategories = (categoryId: string) => {
  const fallbackCategory = productsData.categories.find((cat) => cat.id === categoryId)
  return mapJsonSubcategories(fallbackCategory)
}

export const loadCategoriesCached = async (): Promise<Category[]> => {
  if (categoriesCachePromise) {
    return categoriesCachePromise
  }

  if (categoriesCache) {
    return categoriesCache
  }

  categoriesCachePromise = (async () => {
    try {
      const supabase = createClient()
      
      const { data: categoriesData, error: categoriesError } = await withClientTimeout(
        supabase
          .from("categories")
          .select("id, name, slug")
          .eq("is_active", true)
          .order("sort", { ascending: true }),
        CLIENT_CATALOG_TIMEOUT_MS
      )

      if (!categoriesError && categoriesData && categoriesData.length > 0) {
        const filteredCategories = categoriesData.filter((cat: any) => cat.id !== 'dispersion')
        const { data: allSubcatsData, error: allSubcatsError } = await withClientTimeout(
          supabase
            .from("subcategories")
            .select("id, name, slug, category_id")
            .eq("is_active", true)
            .order("sort", { ascending: true }),
          CLIENT_CATALOG_TIMEOUT_MS
        )

        const subcatsByCategory = new Map<string, Array<{ id: string; name: string; slug: string }>>()
        if (!allSubcatsError && allSubcatsData) {
          for (const sub of allSubcatsData) {
            const catId = String(sub.category_id)
            if (!subcatsByCategory.has(catId)) {
              subcatsByCategory.set(catId, [])
            }
            subcatsByCategory.get(catId)!.push({
              id: sub.id,
              name: sub.name,
              slug: sub.slug,
            })
          }
        }

        const categoriesWithSubs = filteredCategories.map((cat: any) => {
          const fallbackSubcategories = getJsonSubcategories(cat.id)
          const loadedSubcategories = (subcatsByCategory.get(cat.id) || []).filter(
            (sub) => !(cat.id === "abs" && (sub.id === "abs-specs" || sub.slug === "abs-specs"))
          )

          return {
            id: cat.id,
            name: cat.name,
            slug: cat.slug || cat.id,
            subcategories:
              allSubcatsError || loadedSubcategories.length === 0
                ? fallbackSubcategories
                : loadedSubcategories,
          }
        })

        categoriesCache = sortCatalogCategories(categoriesWithSubs)
        return categoriesCache
      } else {
        const jsonCategories = getJsonCategories()
        categoriesCache = jsonCategories
        return jsonCategories
      }
    } catch {
      const jsonCategories = getJsonCategories()
      categoriesCache = jsonCategories
      return jsonCategories
    } finally {
      categoriesCachePromise = null
    }
  })()

  return categoriesCachePromise
}

export function UnifiedMegaMenu({ isOpen, activeItem, onClose }: UnifiedMegaMenuProps) {
  const { lang } = useTranslation()
  const [topOffset, setTopOffset] = useState(0)
  const [categories, setCategories] = useState<Category[]>(() => {
    if (categoriesCache) {
      return categoriesCache
    }
    return getJsonCategories()
  })
  const [loading, setLoading] = useState(!categoriesCache)
  const menuRef = useRef<HTMLDivElement>(null)
  const MENU_HEADER_OVERLAP_PX = 3

  useEffect(() => {
    if (!isOpen) return
    
    const updatePosition = () => {
      // Меряем именно тот nav, внутри которого смонтировано это меню:
      // на главной есть второй (скрытый) header, и глобальный querySelector
      // находил его первым, из-за чего меню ложилось на top:0 поверх навигации.
      const nav = menuRef.current?.closest("nav") as HTMLElement | null
      if (nav) {
        const rect = nav.getBoundingClientRect()
        setTopOffset(rect.bottom)
      } else {
        setTopOffset(96)
      }
    }
    
    updatePosition()
    window.addEventListener('scroll', updatePosition, { passive: true })
    window.addEventListener('resize', updatePosition)
    return () => {
      window.removeEventListener('scroll', updatePosition)
      window.removeEventListener('resize', updatePosition)
    }
  }, [isOpen])

  useEffect(() => {
    if (categoriesCache) {
      setLoading(false)
      return
    }

    loadCategoriesCached().then((loadedCategories) => {
      setCategories(loadedCategories)
      setLoading(false)
    })
  }, [])

  if (!isOpen || !activeItem) return null

  // Находим активный пункт меню
  const activeMenuItem = corporateMenuData.find(
    (item) => item.label === activeItem || (lang === "en" && item.labelEn === activeItem)
  )

  if (!activeMenuItem) return null

  // Рендерим содержимое
  let content = null

  if (activeMenuItem.type === "catalog") {
    // Левый: основные категории. Центр: только Товары. Правый: ДМС, ПВХ-модификатор, КОРС.
    // Категория custom-abs в выпадающем меню не показываем (доступна подкатегория abs/abs-custom в разделе АБС).
    const rightColumnIds = ["machine-parts", "pvc-modifier", "kors"]
    const centerColumnIds = ["hoztovary"]
    const excludedFromMegaMenuIds = ["custom-abs"]
    const rightColumnCategories = rightColumnIds
      .map((id) => categories.find((c) => c.id === id))
      .filter((c): c is Category => !!c)
    const centerColumnCategories = centerColumnIds
      .map((id) => categories.find((c) => c.id === id))
      .filter((c): c is Category => !!c)
    const leftColumnCategories = categories.filter(
      (c) =>
        !excludedFromMegaMenuIds.includes(c.id) &&
        !rightColumnIds.includes(c.id) &&
        !centerColumnIds.includes(c.id)
    )

    const columnsCount = 3
    const columns: Category[][] = [
      leftColumnCategories,
      centerColumnCategories,
      rightColumnCategories,
    ]

    if (loading && categories.length === 0) {
      content = (
        <div className="text-center py-12">
          <div className="text-sm text-muted-foreground font-light tracking-wide">
            Загрузка...
          </div>
        </div>
      )
    } else {
      content = (
        <div
          className="grid gap-16"
          style={{
            gridTemplateColumns: `repeat(${columnsCount}, 1fr)`,
          }}
        >
          {columns.map((column, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-10">
              {column.map((category) => (
                <div key={category.id} className="flex flex-col gap-4 group">
                  <Link
                    href={`/products/${category.slug}`}
                    prefetch={false}
                    className="text-lg font-semibold text-gray-900 hover:text-primary transition-all duration-300 tracking-tight group-hover:translate-x-1 inline-block"
                    onClick={onClose}
                  >
                    {getCatalogCategoryLabel(category.id, category.name, lang === "en" ? "en" : "ru")}
                  </Link>
                  {category.subcategories && category.subcategories.length > 0 && (
                    <div className="flex flex-col gap-3 pl-1 border-l-2 border-transparent group-hover:border-primary/20 transition-colors duration-300">
                      {category.subcategories
                        .filter((subcategory) => !(category.id === "abs" && (subcategory.id === "abs-specs" || subcategory.slug === "abs-specs")))
                        .map((subcategory) => (
                          <Link
                            key={subcategory.id}
                            href={`/products/${category.slug}/${getPublicSubcategorySlug(category.id, subcategory)}`}
                            prefetch={false}
                            className="text-sm text-gray-700 hover:text-gray-900 transition-all duration-300 leading-relaxed hover:translate-x-2 inline-block"
                            onClick={onClose}
                          >
                            {getCatalogSubcategoryLabel(
                              subcategory.id,
                              subcategory.slug,
                              subcategory.name,
                              lang === "en" ? "en" : "ru"
                            )}
                          </Link>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )
    }
  } else if (activeMenuItem.type === "mega" && activeMenuItem.sections) {
    // Меню с секциями
    const columnsCount = Math.min(4, Math.max(3, activeMenuItem.sections.length))
    const itemsPerColumn = Math.ceil(activeMenuItem.sections.length / columnsCount)
    const columns: MenuSection[][] = []
    const isPartnership = activeMenuItem.label === "Партнерство" || activeMenuItem.labelEn === "Partnership"

    for (let i = 0; i < columnsCount; i++) {
      columns.push(activeMenuItem.sections.slice(i * itemsPerColumn, (i + 1) * itemsPerColumn))
    }

    content = (
      <div
        className={`grid gap-16 ${isPartnership ? "justify-items-center" : ""}`}
        style={{
          gridTemplateColumns: `repeat(${columnsCount}, 1fr)`,
        }}
      >
        {columns.map((column, colIndex) => (
          <div key={colIndex} className={`flex flex-col gap-10 ${isPartnership ? "items-center" : ""}`}>
            {column.map((section, sectionIndex) => (
              <div key={sectionIndex} className={`flex flex-col gap-4 group ${isPartnership ? "w-fit" : ""}`}>
                <h3
                  className={`text-base font-semibold text-gray-900 tracking-[-0.01em] mb-1 ${isPartnership ? "text-center" : ""}`}
                >
                  {lang === "en" && section.titleEn ? section.titleEn : section.title}
                </h3>
                <div
                  className={`flex flex-col gap-3 transition-colors duration-300 ${
                    isPartnership
                      ? "items-center text-center"
                      : "pl-1 border-l-2 border-transparent group-hover:border-primary/20"
                  }`}
                >
                  {section.items.map((item, itemIndex) => {
                    const label = lang === "en" && item.labelEn ? item.labelEn : item.label
                    const isExternal = item.href.startsWith("http") || item.href.endsWith(".pdf")

                    return (
                      <Link
                        key={itemIndex}
                        href={item.href}
                        prefetch={false}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        className="text-sm text-gray-700 hover:text-gray-900 transition-all duration-300 leading-relaxed hover:translate-x-2 inline-block"
                        onClick={onClose}
                      >
                        {label}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="fixed left-0 right-0 w-full z-[110] bg-white"
      style={{ 
        top: `${Math.max(0, topOffset - MENU_HEADER_OVERLAP_PX)}px`,
        boxShadow: '0 20px 60px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)'
      }}
    >
      <div className="max-w-[1400px] mx-auto px-10 py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeItem}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
          >
            {content}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
