"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { MainMenuCorporate } from "./main-menu-corporate"
import { LanguageSwitcher } from "./language-switcher"
import { OrderButton } from "./order-button"
import { MobileMenu } from "./mobile-menu"
import { Menu, X, ShoppingCart, UserRound } from "lucide-react"
import { usePathname } from "next/navigation"
import { useCart } from "@/contexts/cart-context"
import { Badge } from "@/components/ui/badge"

const HOME_SCROLL_THRESHOLD = 50

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { itemCount } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > HOME_SCROLL_THRESHOLD)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const isHomePage = pathname === "/"
  const showHomeHeader = isHomePage && isScrolled

  useEffect(() => {
    if (!showHomeHeader) {
      setIsMobileMenuOpen(false)
    }
  }, [showHomeHeader])

  return (
    <>
    <header
        className={`${
          isHomePage ? "fixed inset-x-0 top-0" : "sticky top-0"
        } ${
          isMobileMenuOpen 
            ? "z-[110]" 
            : "z-[100]"
        } ${
          isScrolled || !isHomePage 
            ? "bg-white/95 backdrop-blur-lg shadow-sm border-b border-gray-100/50" 
            : "backdrop-blur-none"
        } ${
          isHomePage
            ? showHomeHeader
              ? "pointer-events-auto visible translate-y-0 opacity-100"
              : "pointer-events-none invisible -translate-y-full opacity-0"
            : "opacity-100 translate-y-0"
        }`}
    >
      <nav 
        className={`flex w-full items-center justify-between gap-2 lg:gap-4 max-w-[1440px] mx-auto px-4 lg:px-8 py-4 ${
          isScrolled || !isHomePage ? "" : "lg:py-6"
        }`}
      >
        {/* Logo — прозрачный фон */}
        <Link href="/" prefetch={false} className="flex items-center gap-2 lg:gap-3 group flex-shrink-0 min-w-fit">
          <div className="relative h-16 w-16 flex-shrink-0 bg-transparent transition-transform duration-300 group-hover:scale-110 sm:h-16 sm:w-16 lg:h-20 lg:w-20" style={{ background: 'transparent' }}>
            <Image
              src="/images/logo123.png"
              alt="АО Пластик"
              fill
              sizes="80px"
              className={`object-contain ${isScrolled || !isHomePage ? "" : "brightness-0 invert"}`}
              priority
            />
          </div>
        </Link>

        {/* Desktop Menu */}
        <MainMenuCorporate useDarkText />

        {/* Right Controls */}
        <div className="hidden lg:flex items-center gap-1.5 xl:gap-3 flex-shrink-0 min-w-fit">
          <LanguageSwitcher />
          <Link href="/account" aria-label="Личный кабинет" title="Личный кабинет" className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-white text-foreground transition hover:border-primary/40 hover:text-primary">
            <UserRound className="h-4.5 w-4.5" />
          </Link>
          <OrderButton />
        </div>

        {/* Mobile Controls */}
        <div className="flex lg:hidden items-center gap-2 sm:gap-3 flex-shrink-0 ml-auto">
          <Link href="/account" className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border/60 bg-white text-foreground shadow-sm" aria-label="Личный кабинет">
            <UserRound className="h-5 w-5" />
          </Link>
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
            type="button"
            data-mobile-menu-trigger
            className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-2xl border border-border/60 bg-white/10 backdrop-blur-sm text-foreground transition-all duration-200 shadow-sm active:scale-95 hover:bg-white/20 touch-manipulation"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-label={isMobileMenuOpen ? "Закрыть каталог" : "Открыть каталог"}
            aria-pressed={isMobileMenuOpen}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
      </nav>

      </header>
      
      {/* Mobile Menu - вне header для правильного z-index */}
      <MobileMenu isOpen={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen} />
    </>
  )
}
