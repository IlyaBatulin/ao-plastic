"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "@/lib/i18n"
import { getCategoryName } from "@/lib/catalog-translations"
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
      
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("categories")
        .select("id, name, slug")
        .eq("is_active", true)
        .order("sort", { ascending: true })

      if (!categoriesError && categoriesData && categoriesData.length > 0) {
        const categoriesWithSubs = await Promise.all(
          categoriesData.map(async (cat) => {
            const { data: subcatsData } = await supabase
              .from("subcategories")
              .select("id, name, slug")
              .eq("category_id", cat.id)
              .eq("is_active", true)
              .order("sort", { ascending: true })

            return {
              id: cat.id,
              name: cat.name,
              slug: cat.slug || cat.id,
              subcategories: (subcatsData || []).filter(
                (sub: any) => !(cat.id === "abs" && (sub.id === "abs-specs" || sub.slug === "abs-specs"))
              ),
            }
          })
        )

        categoriesCache = categoriesWithSubs
        return categoriesWithSubs
      } else {
        const jsonCategories = productsData.categories
          .filter((cat) => cat.id !== 'dispersion')
          .map((cat) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.id,
            subcategories: (cat.subcategories || [])
              .filter((sub: any) => !(cat.id === "abs" && (sub.id === "abs-specs" || sub.slug === "abs-specs")))
              .map((sub) => ({
                id: sub.id,
                name: sub.name,
                slug: sub.slug,
              })),
          }))
        categoriesCache = jsonCategories
        return jsonCategories
      }
    } catch (error) {
      console.error("Error loading categories:", error)
      const jsonCategories = productsData.categories
        .filter((cat) => cat.id !== 'dispersion')
        .map((cat) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.id,
          subcategories: (cat.subcategories || [])
            .filter((sub: any) => !(cat.id === "abs" && (sub.id === "abs-specs" || sub.slug === "abs-specs")))
            .map((sub) => ({
              id: sub.id,
              name: sub.name,
              slug: sub.slug,
            })),
        }))
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
    return productsData.categories
      .filter((cat) => cat.id !== 'dispersion')
      .map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.id,
        subcategories: (cat.subcategories || [])
          .filter((sub: any) => !(cat.id === "abs" && (sub.id === "abs-specs" || sub.slug === "abs-specs")))
          .map((sub) => ({
            id: sub.id,
            name: sub.name,
            slug: sub.slug,
          })),
      }))
  })
  const [loading, setLoading] = useState(!categoriesCache)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    
    const updatePosition = () => {
      const nav = document.querySelector('nav[class*="absolute"], header nav') as HTMLElement
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
    // Каталог продукции
    const columnsCount = Math.min(4, Math.max(3, Math.ceil(categories.length / 8)))
    const itemsPerColumn = Math.ceil(categories.length / columnsCount)
    const columns: Category[][] = []

    for (let i = 0; i < columnsCount; i++) {
      columns.push(categories.slice(i * itemsPerColumn, (i + 1) * itemsPerColumn))
    }

    if (loading && categories.length === 0) {
      content = (
        <div className="text-center py-12">
          <div className="text-sm text-muted-foreground font-light tracking-wide" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
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
                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}
                    onClick={onClose}
                  >
                    {getCategoryName(category.id, lang === "en" ? "en" : "ru") || category.name}
                  </Link>
                  {category.subcategories && category.subcategories.length > 0 && (
                    <div className="flex flex-col gap-3 pl-1 border-l-2 border-transparent group-hover:border-primary/20 transition-colors duration-300">
                      {category.subcategories
                        .filter((subcategory) => !(category.id === "abs" && (subcategory.id === "abs-specs" || subcategory.slug === "abs-specs")))
                        .map((subcategory) => (
                          <Link
                            key={subcategory.id}
                            href={`/products/${category.slug}/${subcategory.slug}`}
                            prefetch={false}
                            className="text-sm text-gray-700 hover:text-gray-900 transition-all duration-300 leading-relaxed hover:translate-x-2 inline-block"
                            style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 400 }}
                            onClick={onClose}
                          >
                            {getCategoryName(subcategory.id, lang === "en" ? "en" : "ru") || getCategoryName(subcategory.slug, lang === "en" ? "en" : "ru") || subcategory.name}
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

    for (let i = 0; i < columnsCount; i++) {
      columns.push(activeMenuItem.sections.slice(i * itemsPerColumn, (i + 1) * itemsPerColumn))
    }

    // Проверяем, это ли меню "Партнерство" для центрирования
    const isPartnership = activeMenuItem.label === "Партнерство" || activeMenuItem.labelEn === "Partnership"

    content = (
      <div
        className={`grid gap-16 ${isPartnership ? 'justify-items-center' : ''}`}
        style={{
          gridTemplateColumns: isPartnership 
            ? `repeat(${activeMenuItem.sections.length}, auto)` 
            : `repeat(${columnsCount}, 1fr)`,
        }}
      >
        {columns.map((column, colIndex) => (
          <div key={colIndex} className={`flex flex-col gap-10 ${isPartnership ? 'items-center text-center' : ''}`}>
            {column.map((section, sectionIndex) => (
              <div key={sectionIndex} className={`flex flex-col gap-4 group ${isPartnership ? 'items-center' : ''}`}>
                <h3 
                  className="text-base font-semibold text-gray-900 tracking-tight mb-1"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '-0.01em', fontWeight: 600 }}
                >
                  {lang === "en" && section.titleEn ? section.titleEn : section.title}
                </h3>
                <div className={`flex flex-col gap-3 ${isPartnership ? '' : 'pl-1 border-l-2 border-transparent group-hover:border-primary/20'} transition-colors duration-300`}>
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
                        style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 400 }}
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
      className="fixed left-0 right-0 w-full z-[110] backdrop-blur-xl"
      style={{ 
        top: `${topOffset}px`,
        background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%)',
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
