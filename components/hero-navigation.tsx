"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { MainMenuCorporate } from "./header/main-menu-corporate"
import { HeroLanguageSwitcher } from "./hero-language-switcher"
import { HeroOrderButton } from "./hero-order-button"
import { MobileMenu } from "./header/mobile-menu"
import { Menu, X, ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { Badge } from "@/components/ui/badge"

const SCROLL_HIDE_THRESHOLD = 50 // сначала шапка героя полностью уходит

export function HeroNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)
  const [isHiddenByScroll, setIsHiddenByScroll] = useState(false)
  const { itemCount } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setIsHiddenByScroll(window.scrollY > SCROLL_HIDE_THRESHOLD)
    }
    window.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <nav 
        className={`absolute top-0 left-0 right-0 w-full transition-all duration-300 ${
          isHiddenByScroll ? "opacity-0 pointer-events-none" : ""
        } ${
          isMobileMenuOpen 
            ? "z-[110]" 
            : isMegaMenuOpen 
              ? "z-[100]" 
              : "z-[100]"
        } ${
          isMegaMenuOpen 
            ? "bg-white shadow-sm" 
            : "bg-transparent"
        } duration-300`}
        style={isMegaMenuOpen ? { backgroundColor: '#ffffff' } : { backgroundColor: 'transparent' }}
      >
      <div className="flex w-full items-center justify-between gap-2 lg:gap-4 max-w-[1440px] mx-auto px-4 lg:px-8 py-4 lg:py-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 lg:gap-4 group flex-shrink-0 min-w-fit">
          <div className="relative h-20 w-20 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 sm:h-20 sm:w-20 lg:h-24 lg:w-24">
            <Image
              src="/images/logo123.png"
              alt="АО Пластик"
              fill
              className={`object-contain transition-all duration-300 ${isMegaMenuOpen ? "" : "brightness-0 invert"}`}
              priority
            />
          </div>
        </Link>

        {/* Desktop Menu */}
        <MainMenuCorporate onMenuOpenChange={setIsMegaMenuOpen} />

        {/* Right Controls */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-4 flex-shrink-0 min-w-fit">
          <HeroLanguageSwitcher isMenuOpen={isMegaMenuOpen} />
          <HeroOrderButton isMenuOpen={isMegaMenuOpen} />
        </div>

        {/* Mobile Controls */}
        <div className="flex lg:hidden items-center gap-3 sm:gap-4 flex-shrink-0 ml-auto">
          {/* Mobile Cart Button */}
          <Link
            href="/cart"
            className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border border-white/30 bg-white/10 backdrop-blur-sm text-white transition-all duration-200 shadow-sm active:scale-95 hover:bg-white/20"
            aria-label="Корзина"
          >
            <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7" />
            {itemCount > 0 && (
              <Badge className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 min-w-[1.5rem] h-[1.5rem] flex items-center justify-center text-xs px-1">
                {itemCount}
              </Badge>
            )}
          </Link>

          {/* Catalog Button - прозрачная как корзина */}
          <button
            className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border border-white/30 bg-white/10 backdrop-blur-sm text-white transition-all duration-200 shadow-sm active:scale-95 hover:bg-white/20"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Закрыть каталог" : "Открыть каталог"}
            aria-pressed={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6 sm:w-7 sm:h-7" /> : <Menu className="w-6 h-6 sm:w-7 sm:h-7" />}
          </button>
        </div>
      </div>

      </nav>
      
      {/* Mobile Menu - вне навигации для правильного z-index */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  )
}

