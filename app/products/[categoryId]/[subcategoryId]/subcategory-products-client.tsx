"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export function SubcategoryProducts({ products }: { products: any[] }) {
  const gridRef = useRef<HTMLDivElement>(null)

  // Анимация появления карточек при скролле
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in")
          }
        })
      },
      { threshold: 0.1 }
    )

    const cards = gridRef.current?.querySelectorAll(".product-card")
    cards?.forEach((card) => observer.observe(card))

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
        const specs = typeof product.specifications === 'string' 
          ? JSON.parse(product.specifications) 
          : product.specifications || {}

        return (
          <div
            key={product.id}
            className="product-card group relative bg-card rounded-3xl overflow-hidden border-2 border-border hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:-translate-y-2 opacity-0"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            {/* Image with gradient overlay */}
            <div className="relative h-64 bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent z-10" />
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-4 right-4 z-20 bg-primary/10 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary">
                NEW
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{product.name}</h3>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed line-clamp-2">{product.description}</p>

              {/* Specifications */}
              {Object.keys(specs).length > 0 && (
                <div className="space-y-2 mb-6">
                  {Object.entries(specs).slice(0, 3).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{key}:</span>
                      <span className="font-semibold">{String(value)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Button */}
              <Button className="w-full group/btn bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white transition-all duration-300 hover:shadow-lg hover:shadow-primary/50">
                Заказать
                <ArrowLeft className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Hover effect border */}
            <div className="absolute inset-0 rounded-3xl border-2 border-primary/0 group-hover:border-primary/30 transition-colors duration-500 pointer-events-none" />
          </div>
        )
      })}
    </div>
  )
}

