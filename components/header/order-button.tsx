"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
import { useCart } from "@/contexts/cart-context"
import { ShoppingCart } from "lucide-react"

export function OrderButton() {
  const { t } = useLanguage()
  const { itemCount } = useCart()

  return (
    <Button
      asChild
      size="lg"
      className="relative flex-shrink-0 whitespace-nowrap rounded-xl bg-blue-600 px-0 text-white font-semibold transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30"
    >
      <Link href="/cart" className="flex items-center gap-1.5 xl:gap-2 px-3 xl:px-4">
        <ShoppingCart className="w-4 h-4 xl:w-5 xl:h-5 flex-shrink-0" />
        <span className="text-[13px] xl:text-sm">{t("cart") || "Корзина"}</span>
        {itemCount > 0 && (
          <Badge className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 min-w-[1.5rem] h-[1.5rem] flex items-center justify-center text-xs">
            {itemCount}
          </Badge>
        )}
      </Link>
    </Button>
  )
}
