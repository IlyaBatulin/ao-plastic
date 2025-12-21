"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
import { useCart } from "@/contexts/cart-context"
import { ShoppingCart } from "lucide-react"

interface HeroOrderButtonProps {
  isMenuOpen?: boolean
}

export function HeroOrderButton({ isMenuOpen = false }: HeroOrderButtonProps) {
  const { t } = useLanguage()
  const { itemCount } = useCart()

  return (
    <Button
      asChild
      size="lg"
      className="relative flex-shrink-0 whitespace-nowrap rounded-xl bg-[#0046FF] px-0 text-white font-semibold transition-all duration-300 hover:scale-105 hover:bg-[#0033CC] hover:shadow-lg hover:shadow-[#0046FF]/30 text-base px-5 py-3"
    >
      <Link href="/cart" className="flex items-center gap-2 px-4 py-2">
        <ShoppingCart className="w-5 h-5 xl:w-6 xl:h-6 flex-shrink-0" />
        <span className="text-sm xl:text-base">{t("cart") || "Корзина"}</span>
        {itemCount > 0 && (
          <Badge className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 min-w-[1.5rem] h-[1.5rem] flex items-center justify-center text-xs">
            {itemCount}
          </Badge>
        )}
      </Link>
    </Button>
  )
}

