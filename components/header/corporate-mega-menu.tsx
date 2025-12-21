"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "@/lib/i18n"
import { createClient } from "@/utils/supabase/client"
import productsData from "@/data/products.json"

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

interface CorporateMegaMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function CorporateMegaMenu({ isOpen, onClose }: CorporateMegaMenuProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [topOffset, setTopOffset] = useState(0)
  const menuRef = useRef<HTMLDivElement>(null)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { lang } = useTranslation()

  useEffect(() => {
    if (!isOpen) return
    
    const updatePosition = () => {
      // Ищем HeroNavigation на главной странице или обычный header на других страницах
      const nav = document.querySelector('nav[class*="absolute"], header nav') as HTMLElement
      if (nav) {
        const rect = nav.getBoundingClientRect()
        setTopOffset(rect.bottom)
      } else {
        setTopOffset(96) // Fallback
      }
    }
    
    updatePosition()
    // Обновляем позицию при скролле, но не закрываем меню
    window.addEventListener('scroll', updatePosition, { passive: true })
    window.addEventListener('resize', updatePosition)
    return () => {
      window.removeEventListener('scroll', updatePosition)
      window.removeEventListener('resize', updatePosition)
    }
  }, [isOpen])

  useEffect(() => {
    // Загружаем категории из Supabase или используем fallback
    const loadCategories = async () => {
      try {
        const supabase = createClient()
        
        // Сначала получаем категории
        const { data: categoriesData, error: categoriesError } = await supabase
          .from("categories")
          .select("id, name, slug")
          .eq("is_active", true)
          .order("sort", { ascending: true })

        if (!categoriesError && categoriesData && categoriesData.length > 0) {
          // Затем получаем подкатегории для каждой категории
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
                // Исключаем "Технические характеристики АБС" (abs-specs) для категории АБС
                subcategories: (subcatsData || []).filter(
                  (sub: any) => !(cat.id === "abs" && (sub.id === "abs-specs" || sub.slug === "abs-specs"))
                ),
              }
            })
          )

          setCategories(categoriesWithSubs)
        } else {
          // Fallback на JSON
          const jsonCategories = productsData.categories
            .filter((cat) => cat.id !== 'dispersion')
            .map((cat) => ({
              id: cat.id,
              name: cat.name,
              slug: cat.id,
              // Исключаем "Технические характеристики АБС" (abs-specs) для категории АБС
              subcategories: (cat.subcategories || [])
                .filter((sub: any) => !(cat.id === "abs" && (sub.id === "abs-specs" || sub.slug === "abs-specs")))
                .map((sub) => ({
                  id: sub.id,
                  name: sub.name,
                  slug: sub.slug,
                })),
            }))
          setCategories(jsonCategories)
        }
      } catch (error) {
        console.error("Error loading categories:", error)
        // Fallback на JSON
        const jsonCategories = productsData.categories
          .filter((cat) => cat.id !== 'dispersion')
          .map((cat) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.id,
            // Исключаем "Технические характеристики АБС" (abs-specs) для категории АБС
            subcategories: (cat.subcategories || [])
              .filter((sub: any) => !(cat.id === "abs" && (sub.id === "abs-specs" || sub.slug === "abs-specs")))
              .map((sub) => ({
                id: sub.id,
                name: sub.name,
                slug: sub.slug,
              })),
          }))
        setCategories(jsonCategories)
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) {
      loadCategories()
    }
  }, [isOpen])

  // Закрытие при клике вне меню
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    // Закрытие при нажатии Esc
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  // Очистка таймера при размонтировании
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [])

  if (!isOpen) return null

  // Группируем категории по колонкам (3-4 колонки)
  const columnsCount = Math.min(4, Math.max(3, Math.ceil(categories.length / 8)))
  const itemsPerColumn = Math.ceil(categories.length / columnsCount)
  const columns: Category[][] = []

  for (let i = 0; i < columnsCount; i++) {
    columns.push(categories.slice(i * itemsPerColumn, (i + 1) * itemsPerColumn))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="fixed left-0 right-0 w-full bg-white shadow-lg z-[110]"
          style={{ top: `${topOffset}px`, backgroundColor: '#ffffff' }}
          onMouseLeave={(e) => {
            // Проверяем, что курсор действительно покинул меню
            const relatedTarget = e.relatedTarget as HTMLElement | null
            if (menuRef.current && relatedTarget && relatedTarget instanceof Node) {
              if (!menuRef.current.contains(relatedTarget)) {
                // Добавляем небольшую задержку перед закрытием
                closeTimeoutRef.current = setTimeout(() => {
                  onClose()
                }, 200)
              }
            } else if (menuRef.current && !relatedTarget) {
              // Если relatedTarget null, значит курсор покинул элемент
              closeTimeoutRef.current = setTimeout(() => {
                onClose()
              }, 200)
            }
          }}
          onMouseEnter={() => {
            // Отменяем закрытие, если курсор вернулся в меню
            if (closeTimeoutRef.current) {
              clearTimeout(closeTimeoutRef.current)
              closeTimeoutRef.current = null
            }
          }}
        >
          <div className="max-w-[1400px] mx-auto px-8 py-12">
            {loading ? (
              <div className="text-center text-sm text-muted-foreground">Загрузка...</div>
            ) : (
              <div
                className="grid gap-12"
                style={{
                  gridTemplateColumns: `repeat(${columnsCount}, 1fr)`,
                }}
              >
                {columns.map((column, colIndex) => (
                  <div key={colIndex} className="flex flex-col gap-8">
                    {column.map((category) => (
                      <div key={category.id} className="flex flex-col gap-3">
                        {/* Заголовок категории */}
                        <Link
                          href={`/products/${category.slug}`}
                          className="text-base font-semibold text-foreground hover:text-primary transition-colors duration-150"
                          onClick={onClose}
                        >
                          {category.name}
                        </Link>

                        {/* Подкатегории */}
                        {category.subcategories && category.subcategories.length > 0 && (
                          <div className="flex flex-col gap-2.5">
                            {category.subcategories
                              .filter((subcategory) => !(category.id === "abs" && (subcategory.id === "abs-specs" || subcategory.slug === "abs-specs")))
                              .map((subcategory) => (
                                <Link
                                  key={subcategory.id}
                                  href={`/products/${category.slug}/${subcategory.slug}`}
                                  className="text-sm text-muted-foreground hover:text-foreground hover:underline transition-all duration-150 leading-relaxed"
                                  onClick={onClose}
                                >
                                  {subcategory.name}
                                </Link>
                              ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

