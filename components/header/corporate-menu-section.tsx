"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useTranslation } from "@/lib/i18n"

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

interface CorporateMenuSectionProps {
  sections: MenuSection[]
  isOpen: boolean
  onClose: () => void
}

export function CorporateMenuSection({ sections, isOpen, onClose }: CorporateMenuSectionProps) {
  const { lang } = useTranslation()
  const [topOffset, setTopOffset] = useState(0)

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
    window.addEventListener('resize', updatePosition)
    return () => window.removeEventListener('resize', updatePosition)
  }, [isOpen])

  if (!isOpen) return null

  // Определяем количество колонок (3-4)
  const columnsCount = Math.min(4, Math.max(3, sections.length))
  const itemsPerColumn = Math.ceil(sections.length / columnsCount)
  const columns: MenuSection[][] = []

  for (let i = 0; i < columnsCount; i++) {
    columns.push(sections.slice(i * itemsPerColumn, (i + 1) * itemsPerColumn))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="fixed left-0 right-0 w-full bg-white shadow-lg z-[110]"
      style={{ top: `${topOffset}px`, backgroundColor: '#ffffff' }}
      onMouseLeave={onClose}
    >
      <div className="max-w-[1400px] mx-auto px-8 py-12">
        <div
          className="grid gap-12"
          style={{
            gridTemplateColumns: `repeat(${columnsCount}, 1fr)`,
          }}
        >
          {columns.map((column, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-8">
              {column.map((section, sectionIndex) => (
                <div key={sectionIndex} className="flex flex-col gap-3">
                  {/* Заголовок секции */}
                  <h3 className="text-base font-semibold text-foreground">
                    {lang === "en" && section.titleEn ? section.titleEn : section.title}
                  </h3>

                  {/* Пункты меню */}
                  <div className="flex flex-col gap-2.5">
                    {section.items.map((item, itemIndex) => {
                      const label = lang === "en" && item.labelEn ? item.labelEn : item.label
                      const isExternal = item.href.startsWith("http") || item.href.endsWith(".pdf")

                      return (
                        <Link
                          key={itemIndex}
                          href={item.href}
                          target={isExternal ? "_blank" : undefined}
                          rel={isExternal ? "noopener noreferrer" : undefined}
                          className="text-sm text-muted-foreground hover:text-foreground hover:underline transition-all duration-150 leading-relaxed"
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
      </div>
    </motion.div>
  )
}

