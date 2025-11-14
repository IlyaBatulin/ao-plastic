"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"
import { formatSpecKey, formatSpecValue } from "@/lib/formatters"

export default function ProductsGrid({ 
  products, 
  categoryId, 
  subcategoryId 
}: { 
  products: any[]
  categoryId?: string
  subcategoryId?: string
}) {
  const gridRef = useRef<HTMLDivElement>(null)
  const { addItem } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const card = entry.target as HTMLElement
            card.style.opacity = '1'
            card.style.transform = 'translateY(0)'
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.05, rootMargin: "80px" }
    )

    const cards = gridRef.current?.querySelectorAll(".product-card")
    cards?.forEach((card, index) => {
      const cardElement = card as HTMLElement
      cardElement.style.transitionDelay = `${index * 80}ms`
      observer.observe(card)
    })

    return () => observer.disconnect()
  }, [products])

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground text-lg">В этой подкатегории пока нет товаров</p>
      </div>
    )
  }

  return (
    <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product, index) => {
        const specs = typeof product.specifications === "string"
          ? JSON.parse(product.specifications)
          : product.specifications || {}

        return (
          <Link
            key={product.id}
            href={categoryId && subcategoryId ? `/products/${categoryId}/${subcategoryId}/${product.id}` : '#'}
            className="product-card group relative bg-card rounded-3xl overflow-hidden border border-border/50 hover:border-primary/50"
            style={{
              opacity: 0,
              transform: 'translateY(30px)',
              transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Product Image */}
            <div className="relative h-64 bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent z-10" />
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute top-4 right-4 z-20 bg-primary/10 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary">
                NEW
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 transition-colors duration-300 group-hover:text-primary">
                {product.name}
              </h3>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-2">
                {product.description}
              </p>

              {Object.keys(specs).length > 0 && (
                <div className="space-y-2 mb-4">
                  {Object.entries(specs).slice(0, 3).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{formatSpecKey(key)}:</span>
                      <span className="font-semibold">{formatSpecValue(key, value)}</span>
                    </div>
                  ))}
                </div>
              )}

              <Button 
                className="w-full group/btn bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white transition-all duration-300 hover:shadow-lg hover:shadow-primary/50"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  
                  const isHouseholdProduct = categoryId === 'hoztovary'
                  const packageQuantity = isHouseholdProduct 
                    ? (product.package_quantity || specs['Количество в упаковке'] || specs['package_quantity'] || 1)
                    : undefined
                  
                  addItem({
                    productId: product.id,
                    productName: product.name,
                    productImage: product.image,
                    categoryId: categoryId || '',
                    subcategoryId: subcategoryId,
                    quantity: 1,
                    isPackages: isHouseholdProduct,
                    packageQuantity: isHouseholdProduct ? (typeof packageQuantity === 'number' ? packageQuantity : parseInt(String(packageQuantity || 1), 10)) : undefined,
                  })
                  
                  const unit = isHouseholdProduct ? 'уп' : 'т'
                  toast({
                    title: "Товар добавлен в корзину",
                    description: `${product.name}: 1 ${unit}${isHouseholdProduct && packageQuantity && packageQuantity > 1 ? ` (${packageQuantity} шт/уп)` : ''}`,
                  })
                }}
              >
                Заказать
                <ArrowLeft className="w-4 h-4 ml-2 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </Button>
            </div>

            {/* Hover Glow Effect */}
            <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
            </div>

            {/* Shadow on hover */}
            <div className="absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" style={{ boxShadow: '0 20px 40px rgba(0, 70, 255, 0.15)' }} />
          </Link>
        )
      })}
    </div>
  )
}

