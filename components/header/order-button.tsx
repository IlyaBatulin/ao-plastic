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
      variant="brand"
      className="relative flex-shrink-0 whitespace-nowrap px-0 font-semibold transition-all duration-300 border border-primary/20"
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
