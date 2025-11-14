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
        <div className="flex lg:hidden items-center gap-3 flex-shrink-0">
          {/* Mobile Cart Button */}
          <Link
            href="/cart"
            className="relative p-2.5 hover:bg-primary/10 rounded-lg transition-colors"
            aria-label="Корзина"
          >
            <ShoppingCart className="w-6 h-6" />
            {itemCount > 0 && (
              <Badge className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 min-w-[1.25rem] h-[1.25rem] flex items-center justify-center text-[10px] px-1">
                {itemCount}
              </Badge>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="p-2.5 hover:bg-primary/10 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  )
}
