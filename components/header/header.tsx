"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { MainMenu } from "./main-menu"
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
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isHomePage = pathname === "/"

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled || !isHomePage ? "bg-white/90 backdrop-blur-md shadow-md" : "bg-white/80 backdrop-blur-md shadow-sm"
      }`}
    >
      <nav className="flex w-full items-center justify-between gap-2 lg:gap-4 max-w-[1440px] mx-auto px-4 lg:px-8 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 lg:gap-3 group flex-shrink-0 min-w-fit">
          <div className="relative w-14 h-14 sm:w-12 sm:h-12 lg:w-12 lg:h-12 flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
            <Image src="/images/logo.png" alt="АО Пластик" fill className="object-contain" priority />
          </div>
          <div className="hidden sm:flex flex-col min-w-fit">
            <span className="font-bold text-sm lg:text-base xl:text-lg leading-tight text-foreground whitespace-nowrap">АО Пластик</span>
            <span className="text-xs text-muted-foreground leading-tight whitespace-nowrap hidden xl:block">Узловая</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <MainMenu />

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

          {/* Prominent Catalog Button */}
          <button
            className="flex items-center gap-2 rounded-2xl px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold uppercase tracking-wide bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-[0_4px_12px_rgba(37,99,235,0.4)] hover:shadow-[0_6px_16px_rgba(37,99,235,0.5)] transition-all duration-200 active:scale-95 z-10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Закрыть каталог" : "Открыть каталог"}
            aria-pressed={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            <span>Каталог</span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  )
}
