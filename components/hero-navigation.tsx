"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { MainMenuCorporate } from "./header/main-menu-corporate"
import { HeroLanguageSwitcher } from "./hero-language-switcher"
import { HeroOrderButton } from "./hero-order-button"
import { MobileMenu } from "./header/mobile-menu"
import { Menu, X, ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { Badge } from "@/components/ui/badge"

export function HeroNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)
  const { itemCount } = useCart()

  return (
    <>
      <nav 
        className={`absolute top-0 left-0 right-0 w-full transition-all duration-300 ${
          isMobileMenuOpen 
            ? "z-[110]" 
            : isMegaMenuOpen 
              ? "z-[100]" 
              : "z-[100]"
        } ${
          isMegaMenuOpen 
            ? "bg-white shadow-sm" 
            : "bg-transparent"
        }`}
        style={isMegaMenuOpen ? { backgroundColor: '#ffffff' } : { backgroundColor: 'transparent' }}
      >
      <div className="flex w-full items-center justify-between gap-2 lg:gap-4 max-w-[1440px] mx-auto px-4 lg:px-8 py-4 lg:py-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 lg:gap-4 group flex-shrink-0 min-w-fit">
          <div className="relative w-20 h-20 sm:w-18 sm:h-18 lg:w-20 lg:h-20 xl:w-24 xl:h-24 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
            <Image src="/images/logo.png" alt="АО Пластик" fill className="object-contain" priority />
          </div>
          <div className="hidden sm:flex flex-col min-w-fit">
            <span className={`font-bold text-base lg:text-lg xl:text-xl leading-tight whitespace-nowrap transition-colors duration-300 ${
              isMegaMenuOpen 
                ? "text-foreground" 
                : "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            }`}>
              АО Пластик
            </span>
            <span className={`text-sm leading-tight whitespace-nowrap hidden xl:block transition-colors duration-300 ${
              isMegaMenuOpen 
                ? "text-muted-foreground" 
                : "text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]"
            }`}>
              Узловая
            </span>
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

