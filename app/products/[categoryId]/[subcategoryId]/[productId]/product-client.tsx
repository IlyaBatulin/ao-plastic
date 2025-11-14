"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, Package, Truck } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"
import { formatSpecKey, formatSpecValue } from "@/lib/formatters"

type ProductPageClientProps = {
  product: any
  category: any
  subcategory: any
  categoryId: string
  subcategoryId: string
}

export function ProductPageClient({
  product,
  category,
  subcategory,
  categoryId,
  subcategoryId,
}: ProductPageClientProps) {
  const imgRef = useRef<HTMLDivElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)
  const specsRef = useRef<HTMLDivElement>(null)
  const { addItem } = useCart()
  const { toast } = useToast()
  
  // Определяем тип товара
  const isHouseholdProduct = categoryId === 'hoztovary'
  const packageQuantity = product.package_quantity || product.quantity_in_pack || 1
  
  const [quantityInput, setQuantityInput] = useState<string>("1")

  const sanitizeQuantity = (value: string, isPackages: boolean = false): number => {
    if (isPackages) {
      // Для упаковок - только целые числа, убираем все нецифровые символы
      const digitsOnly = value.replace(/\D/g, "")
      const num = parseInt(digitsOnly, 10)
      return Number.isNaN(num) ? 0 : Math.max(0, num)
    }
    // Для тонн - до 3 знаков после запятой
    const normalized = value.replace(",", ".")
    const num = parseFloat(normalized)
    if (Number.isNaN(num)) return 0
    return Math.max(0, Number(num.toFixed(3)))
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement
            el.style.opacity = '1'
            el.style.transform = 'translateY(0)'
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: "50px" }
    )

    if (imgRef.current) observer.observe(imgRef.current)
    if (infoRef.current) observer.observe(infoRef.current)
    if (specsRef.current) observer.observe(specsRef.current)

    return () => observer.disconnect()
  }, [])

  // Обрабатываем specifications
  let specifications: any = {}
  if (product.specifications) {
    if (typeof product.specifications === "string") {
      try {
        specifications = JSON.parse(product.specifications)
      } catch {
        specifications = {}
      }
    } else {
      specifications = product.specifications
    }
  }
  
  // Удаляем штрихкод из specifications (не должен отображаться)
  const { Штрихкод, штрихкод, barcode, ...cleanSpecs } = specifications
  specifications = cleanSpecs

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumbs */}
      <section className="pt-32 pb-8 bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="container mx-auto px-4 lg:px-8">
          <Link
            href={`/products/${categoryId}/${subcategoryId}`}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Назад к подкатегории</span>
          </Link>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div
              ref={imgRef}
              className="relative h-96 lg:h-full min-h-[500px] rounded-3xl overflow-hidden border border-border shadow-lg"
              style={{
                opacity: 0,
                transform: 'translateY(30px)',
                transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <Image
                src={product.image || category?.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Product Info */}
            <div
              ref={infoRef}
              className="flex flex-col justify-center"
              style={{
                opacity: 0,
                transform: 'translateY(30px)',
                transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: '200ms',
              }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">{product.name}</h1>

              {product.description && (
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Key Features */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm">Высокое качество</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm">Сертифицированная продукция</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm">Доставка по всей России</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 border border-border rounded-lg px-2 py-1">
                  <span className="text-sm text-muted-foreground">
                    {isHouseholdProduct ? 'Упаковки:' : 'Тонны:'}
                  </span>
                  <input
                    type="number"
                    inputMode={isHouseholdProduct ? "numeric" : "decimal"}
                    step={isHouseholdProduct ? "1" : "0.001"}
                    min={isHouseholdProduct ? "1" : "0.001"}
                    className="w-24 bg-transparent outline-none text-center font-semibold"
                    value={quantityInput}
                    onFocus={(e) => {
                      if (e.currentTarget.value === "0") {
                        e.currentTarget.select()
                      }
                    }}
                    onChange={(e) => {
                      const prev = quantityInput
                      let v = e.target.value
                      
                      if (isHouseholdProduct) {
                        // Для упаковок - только целые числа
                        const valid = /^\d*$/.test(v)
                        if (!valid && v !== "") return
                        // убираем ведущий 0: 0 -> 1 (замена)
                        if (prev === "0" && /^\d$/.test(v)) {
                          v = String(parseInt(v, 10))
                        }
                      } else {
                        // Для тонн - только цифры, одна точка/запятая, до 3 знаков после
                        v = v.replace(",", ".")
                        const valid = /^\d*(?:\.\d{0,3})?$/.test(v)
                        if (!valid && v !== "") return
                        // убираем ведущий 0: 0 -> 1 (замена)
                        if (prev === "0" && /^\d$/.test(v)) {
                          v = String(parseInt(v, 10))
                        }
                      }
                      setQuantityInput(v)
                    }}
                    onBlur={() => {
                      const n = sanitizeQuantity(quantityInput, isHouseholdProduct)
                      const clamped = n <= 0 ? (isHouseholdProduct ? 1 : 0.001) : n
                      setQuantityInput(clamped.toString())
                    }}
                  />
                </div>
                {isHouseholdProduct && (
                  <span className="text-xs text-muted-foreground">
                    ({packageQuantity} шт/уп)
                  </span>
                )}
                <Button 
                  className="flex-1 text-lg h-14 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  onClick={() => {
                    const n = sanitizeQuantity(quantityInput, isHouseholdProduct)
                    if (!n || n <= 0) return
                    addItem({
                      productId: product.id,
                      productName: product.name,
                      productImage: product.image,
                      categoryId: categoryId,
                      subcategoryId: subcategoryId,
                      quantity: n,
                      isPackages: isHouseholdProduct,
                      packageQuantity: isHouseholdProduct ? packageQuantity : undefined,
                    })
                    const unit = isHouseholdProduct ? 'уп' : 'т'
                    const formatted = isHouseholdProduct ? n.toString() : n.toFixed(3)
                    toast({
                      title: "Товар добавлен в корзину",
                      description: `${product.name}: ${formatted} ${unit}${isHouseholdProduct && packageQuantity > 1 ? ` (${n * packageQuantity} шт)` : ''}`,
                    })
                  }}
                >
                  Заказать товар
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specifications */}
      {Object.keys(specifications).length > 0 && (
        <section
          ref={specsRef}
          className="py-16 bg-secondary/30"
          style={{
            opacity: 0,
            transform: 'translateY(30px)',
            transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            transitionDelay: '400ms',
          }}
        >
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-bold mb-8">Характеристики</h2>
            <div className="bg-card rounded-3xl p-8 shadow-sm border border-border">
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(specifications).map(([key, value]) => (
                  <div key={key} className="flex flex-col border-b border-border pb-4 last:border-0">
                    <span className="text-sm font-semibold text-muted-foreground mb-1">{formatSpecKey(key)}</span>
                    <span className="text-lg font-medium">
                      {formatSpecValue(key, value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}

