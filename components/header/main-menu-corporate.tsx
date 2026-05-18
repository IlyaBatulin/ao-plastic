"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { AnimatePresence } from "framer-motion"
import { useTranslation } from "@/lib/i18n"
import { UnifiedMegaMenu } from "./unified-mega-menu"
import corporateMenuData from "@/data/menu-corporate.json"

interface MainMenuCorporateProps {
  onMenuOpenChange?: (isOpen: boolean) => void
  /** В основной шапке (при скролле) — всегда тёмный текст, чтобы не было белого на белом */
  useDarkText?: boolean
}

export function MainMenuCorporate({ onMenuOpenChange, useDarkText = false }: MainMenuCorporateProps = {}) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const navHoverRef = useRef(false) // Флаг, что курсор над навигацией
  const menuHoverRef = useRef(false) // Флаг, что курсор над меню
  const { lang } = useTranslation()
  const CLOSE_DELAY_MS = 550

  // Обработка наведения на пункт меню
  const handleMouseEnter = (itemLabel: string) => {
    // Очищаем таймер закрытия
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    
    // Если меню уже открыто, просто переключаем содержимое
    if (activeDropdown) {
      setActiveDropdown(itemLabel)
      return
    }
    
    // Открываем меню
    setActiveDropdown(itemLabel)
    onMenuOpenChange?.(true)
  }

  // Обработка ухода с пункта меню
  const handleMouseLeave = () => {
    // Если курсор не над навигацией и не над меню, закрываем
    if (!navHoverRef.current && !menuHoverRef.current) {
      closeTimeoutRef.current = setTimeout(() => {
        if (!navHoverRef.current && !menuHoverRef.current) {
          setActiveDropdown(null)
          onMenuOpenChange?.(false)
        }
      }, CLOSE_DELAY_MS)
    }
  }

  // Обработка входа в область навигации
  const handleNavEnter = () => {
    navHoverRef.current = true
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
  }

  // Обработка выхода из области навигации
  const handleNavLeave = () => {
    navHoverRef.current = false
    if (!menuHoverRef.current) {
      closeTimeoutRef.current = setTimeout(() => {
        setActiveDropdown(null)
        onMenuOpenChange?.(false)
      }, CLOSE_DELAY_MS)
    }
  }

  // Обработка входа в меню - отменяем закрытие
  const handleMenuEnter = () => {
    menuHoverRef.current = true
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
  }

  // Обработка выхода из меню
  const handleMenuLeave = () => {
    menuHoverRef.current = false
    if (!navHoverRef.current) {
      closeTimeoutRef.current = setTimeout(() => {
        setActiveDropdown(null)
        onMenuOpenChange?.(false)
      }, CLOSE_DELAY_MS)
    }
  }

  // Определяем цвета: в hero — белый текст на видео; в основной шапке (useDarkText) — всегда тёмный
  const isMenuOpen = activeDropdown !== null
  const useWhiteColors = !useDarkText && !isMenuOpen
  
  const textColorClass = useWhiteColors
    ? "text-white hover:text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" 
    : "text-foreground hover:text-primary"
  const dropdownColorClass = useWhiteColors
    ? "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
    : "text-primary"

  return (
    <>
      <nav 
        className="hidden lg:flex flex-1 min-w-0 items-center justify-center gap-6 xl:gap-8"
        onMouseEnter={handleNavEnter}
        onMouseLeave={handleNavLeave}
      >
        {corporateMenuData.map((item) => {
          const label = (lang === "en" && item.labelEn ? item.labelEn : item.label) || item.label
          const hasDropdown = item.type === "mega" || item.type === "catalog"
          const isDropdownActive = activeDropdown === item.label

          return (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => hasDropdown && handleMouseEnter(item.label)}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href={item.href}
                prefetch={false}
                className={`whitespace-nowrap text-sm font-semibold tracking-wider uppercase px-4 py-2.5 transition-all duration-300 relative ${
                  isDropdownActive ? dropdownColorClass : textColorClass
                }`}
                style={{ 
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  letterSpacing: '0.08em'
                }}
              >
                <span className="relative z-10">{label}</span>
                {isDropdownActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-current opacity-30 transition-all duration-300" />
                )}
              </Link>
            </div>
          )
        })}
      </nav>

      {/* Единое мега-меню с плавными переходами */}
      <AnimatePresence mode="wait">
        {isMenuOpen && activeDropdown && (
          <div
            onMouseEnter={handleMenuEnter}
            onMouseLeave={handleMenuLeave}
          >
            <UnifiedMegaMenu 
              isOpen={isMenuOpen} 
              activeItem={activeDropdown} 
              onClose={() => {
                navHoverRef.current = false
                menuHoverRef.current = false
                setActiveDropdown(null)
                onMenuOpenChange?.(false)
              }} 
            />
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
