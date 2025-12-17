"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence } from "framer-motion"
import { useTranslation } from "@/lib/i18n"
import { CorporateMegaMenu } from "./corporate-mega-menu"
import { CorporateMenuSection } from "./corporate-menu-section"
import corporateMenuData from "@/data/menu-corporate.json"

interface MainMenuCorporateProps {
  onMenuOpenChange?: (isOpen: boolean) => void
}

export function MainMenuCorporate({ onMenuOpenChange }: MainMenuCorporateProps = {}) {
  const pathname = usePathname()
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const openTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { lang } = useTranslation()

  const handleMouseEnter = (label: string) => {
    // Очищаем таймер закрытия
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }

    // Задержка открытия ~120ms
    openTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(label)
      onMenuOpenChange?.(true)
    }, 120)
  }

  const handleMouseLeave = () => {
    // Очищаем таймер открытия
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current)
      openTimeoutRef.current = null
    }

    // Задержка закрытия ~200ms
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
      onMenuOpenChange?.(false)
    }, 200)
  }

  const handleClose = () => {
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current)
      openTimeoutRef.current = null
    }
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setActiveDropdown(null)
    onMenuOpenChange?.(false)
  }

  useEffect(() => {
    return () => {
      if (openTimeoutRef.current) {
        clearTimeout(openTimeoutRef.current)
      }
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [])

  // Определяем цвета в зависимости от того, открыто ли меню
  // Если меню открыто - темные цвета, если нет - белые (для прозрачного фона)
  const isMenuOpen = activeDropdown !== null
  const isHomePage = pathname === "/"
  
  // Для главной страницы используем белые цвета, если меню закрыто
  const useWhiteColors = isHomePage && !isMenuOpen
  const textColorClass = useWhiteColors
    ? "text-white hover:text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" 
    : "text-foreground hover:text-primary"
  const activeColorClass = useWhiteColors
    ? "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
    : "text-primary"

  return (
    <nav className="hidden lg:flex flex-1 min-w-0 items-center justify-center gap-6 xl:gap-8">
      {corporateMenuData.map((item) => {
        const label = (lang === "en" && item.labelEn ? item.labelEn : item.label) || item.label
        const isActive =
          pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

        return (
          <div
            key={item.label}
            className="relative"
            onMouseEnter={() => (item.type === "mega" || item.type === "catalog") && handleMouseEnter(item.label)}
            onMouseLeave={handleMouseLeave}
          >
            {item.type === "catalog" ? (
              <>
                <Link
                  href={item.href}
                  className={`whitespace-nowrap text-sm font-semibold tracking-wider uppercase px-3 py-2 transition-colors duration-200 ${
                    isActive ? activeColorClass : textColorClass
                  }`}
                >
                  {label}
                </Link>
                <AnimatePresence>
                  {activeDropdown === item.label && (
                    <div
                      onMouseEnter={() => {
                        // Отменяем закрытие при наведении на меню
                        if (closeTimeoutRef.current) {
                          clearTimeout(closeTimeoutRef.current)
                          closeTimeoutRef.current = null
                        }
                        handleMouseEnter(item.label)
                      }}
                      onMouseLeave={(e) => {
                        // Проверяем, что курсор действительно покинул область меню
                        const relatedTarget = e.relatedTarget as HTMLElement
                        const megaMenu = document.querySelector('[class*="fixed"][class*="z-[110]"]') as HTMLElement
                        if (!megaMenu?.contains(relatedTarget)) {
                          handleMouseLeave()
                        }
                      }}
                    >
                      <CorporateMegaMenu isOpen={true} onClose={handleClose} />
                    </div>
                  )}
                </AnimatePresence>
              </>
            ) : item.type === "mega" && item.sections ? (
              <>
                <Link
                  href={item.href}
                  className={`whitespace-nowrap text-sm font-semibold tracking-wider uppercase px-3 py-2 transition-colors duration-200 ${
                    isActive ? activeColorClass : textColorClass
                  }`}
                >
                  {label}
                </Link>
                <AnimatePresence>
                  {activeDropdown === item.label && (
                    <div
                      onMouseEnter={() => handleMouseEnter(item.label)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <CorporateMenuSection sections={item.sections} isOpen={true} onClose={handleClose} />
                    </div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <Link
                href={item.href}
                className={`whitespace-nowrap text-sm font-semibold tracking-wider uppercase px-3 py-2 transition-colors duration-200 ${
                  isActive ? activeColorClass : textColorClass
                }`}
              >
                {label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}

