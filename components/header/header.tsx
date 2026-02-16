"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { MainMenuCorporate } from "./main-menu-corporate"
import { LanguageSwitcher } from "./language-switcher"
import { OrderButton } from "./order-button"
import { MobileMenu } from "./mobile-menu"
import { Menu, X, ShoppingCart } from "lucide-react"
import { usePathname } from "next/navigation"
import { useCart } from "@/contexts/cart-context"
import { Badge } from "@/components/ui/badge"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { itemCount } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      // Сначала уходит шапка героя (50px), потом через «одно микродвижение» колесика появляется эта
      setIsScrolled(window.scrollY > 120)
    }
    window.addEventListener("scroll", handleScroll)
    handleScroll() // проверка при монтировании
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isHomePage = pathname === "/"

  const isTransparent = isHomePage && !isScrolled

  // Скрываем хедер на главной странице, чтобы видео было с самого начала
  if (isHomePage && !isScrolled) {
    return null
  }

  return (
    <>
    <header
        className={`sticky top-0 transition-all duration-300 ${
          isMobileMenuOpen 
            ? "z-[110]" 
            : "z-[100]"
        } ${
          isScrolled || !isHomePage 
            ? "bg-white/95 backdrop-blur-lg shadow-sm border-b border-gray-100/50" 
            : "backdrop-blur-none"
        }`}
        style={isTransparent ? { backgroundColor: 'transparent', background: 'transparent' } : {}}
    >
      <nav 
        className={`flex w-full items-center justify-between gap-2 lg:gap-4 max-w-[1440px] mx-auto px-4 lg:px-8 py-4 ${
          isScrolled || !isHomePage ? "" : "lg:py-6"
        }`}
        style={isTransparent ? { backgroundColor: 'transparent' } : {}}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 lg:gap-3 group flex-shrink-0 min-w-fit">
          <div className="relative w-14 h-14 sm:w-12 sm:h-12 lg:w-12 lg:h-12 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
            <Image src="/images/logo.png" alt="АО Пластик" fill className="object-contain" priority />
          </div>
          <div className="hidden sm:flex flex-col min-w-fit">
            <span className={`font-bold text-sm lg:text-base xl:text-lg leading-tight whitespace-nowrap ${
              isScrolled || !isHomePage 
                ? "text-foreground" 
                : "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            }`}>
              АО Пластик
            </span>
            <span className={`text-xs leading-tight whitespace-nowrap hidden xl:block ${
              isScrolled || !isHomePage 
                ? "text-muted-foreground" 
                : "text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]"
            }`}>
              Узловая
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <MainMenuCorporate useDarkText />

        {/* Right Controls */}
        <div className="hidden lg:flex items-center gap-1.5 xl:gap-3 flex-shrink-0 min-w-fit">
          <LanguageSwitcher />
          <OrderButton />
        </div>

        {/* Mobile Controls */}
        <div className="flex lg:hidden items-center gap-2 sm:gap-3 flex-shrink-0 ml-auto">
          {/* Mobile Cart Button */}
          <Link
            href="/cart"
            className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-2xl border border-border/60 bg-white text-foreground transition-all duration-200 shadow-sm active:scale-95"
            aria-label="Корзина"
          >
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
            {itemCount > 0 && (
              <Badge className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 min-w-[1.25rem] h-[1.25rem] flex items-center justify-center text-[10px] px-1">
                {itemCount}
              </Badge>
            )}
          </Link>

          {/* Catalog Button - прозрачная как корзина */}
          <button
            className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-2xl border border-border/60 bg-white/10 backdrop-blur-sm text-foreground transition-all duration-200 shadow-sm active:scale-95 hover:bg-white/20"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Закрыть каталог" : "Открыть каталог"}
            aria-pressed={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
      </nav>

      </header>
      
      {/* Mobile Menu - вне header для правильного z-index */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  )
}
