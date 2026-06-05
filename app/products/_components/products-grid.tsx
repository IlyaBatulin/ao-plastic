"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"
import { formatSpecKey, formatSpecValue } from "@/lib/formatters"
import { useLanguage } from "@/contexts/language-context"
import { resolveProductDisplay } from "@/lib/product-en"
import { resolveProductImageUrl } from "@/lib/product-image"
import { getCardSpecEntries } from "@/lib/product-specs"
import { ProductCardPlasticLogo } from "./product-card-plastic-logo"
import { getProductPathSegment } from "@/lib/catalog-product"

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
  const { lang, t } = useLanguage()
  const router = useRouter()

  // ДМС (литьевые и экструзионные) — карточки сразу видимы, без анимации при скролле
  const isDms = categoryId === "machine-parts"

  useEffect(() => {
    if (isDms) return

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
  }, [products, isDms])

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground text-lg">
          {t("homePage.catalog.productList.emptySubcategory") || "В этой подкатегории пока нет товаров"}
        </p>
      </div>
    )
  }

  return (
    <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product, index) => {
        const specs = typeof product.specifications === "string"
          ? JSON.parse(product.specifications)
          : product.specifications || {}
        const cardSpecEntries = getCardSpecEntries(specs, categoryId)

        const { name: displayName, description: displayDescription } = resolveProductDisplay(
          {
            id: String(product.id),
            name: product.name,
            description: product.description,
            slug: product.slug,
            brand: product.brand,
            specifications: specs,
          },
          lang === "en" ? "en" : "ru",
          { categoryId, subcategoryId }
        )
        const imageUrl = resolveProductImageUrl(String(product.id), product.image)
        const productPathSegment = getProductPathSegment(product)
        const productHref = categoryId && subcategoryId
          ? `/products/${categoryId}/${subcategoryId}/${encodeURIComponent(productPathSegment)}`
          : "#"

        const handleAddToCart = () => {
          const isHouseholdProduct = categoryId === "hoztovary"
          const packageQuantity = isHouseholdProduct
            ? (product.package_quantity || specs["Количество в упаковке"] || specs["package_quantity"] || 1)
            : undefined

          addItem({
            productId: product.id,
            productName: displayName,
            productImage: imageUrl,
            categoryId: categoryId || "",
            subcategoryId: subcategoryId,
            quantity: 1,
            isPackages: isHouseholdProduct,
            packageQuantity: isHouseholdProduct
              ? typeof packageQuantity === "number"
                ? packageQuantity
                : parseInt(String(packageQuantity || 1), 10)
              : undefined,
          })

          const unit = isHouseholdProduct ? "уп" : "т"
          toast({
            title: "Товар добавлен в корзину",
            description: `${displayName}: 1 ${unit}${isHouseholdProduct && packageQuantity && packageQuantity > 1 ? ` (${packageQuantity} шт/уп)` : ""}`,
            className: "border-primary/40 bg-primary text-primary-foreground",
          })
        }

        return (
          <div
            key={product.id}
            className="product-card group relative bg-card rounded-3xl overflow-hidden border border-border/50 hover:border-primary/50 flex flex-col"
            style={isDms ? undefined : {
              opacity: 0,
              transform: "translateY(30px)",
              transition: "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <Link
              href={productHref}
              prefetch={productHref !== "#"}
              onMouseEnter={() => {
                if (productHref !== "#") router.prefetch(productHref)
              }}
              onTouchStart={() => {
                if (productHref !== "#") router.prefetch(productHref)
              }}
              className="block flex-1"
            >
              <div className="relative h-64 bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent z-10" />
                <Image
                  src={imageUrl}
                  alt={displayName}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <ProductCardPlasticLogo imageSrc={imageUrl} />
              </div>

              <div className="p-6 pb-4">
                <h3 className="text-xl font-bold mb-2 transition-colors duration-300 group-hover:text-primary">
                  {displayName}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-2">
                  {displayDescription}
                </p>

                {cardSpecEntries.length > 0 && (
                  <div className="space-y-2">
                    {cardSpecEntries.slice(0, 3).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 text-sm">
                        <span className="min-w-0 text-muted-foreground leading-snug">
                          {formatSpecKey(key, lang === "en" ? "en" : "ru")}:
                        </span>
                        <span className="max-w-[7rem] text-right font-semibold leading-snug break-words">
                          {formatSpecValue(key, value)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Link>

            <div className="px-6 pb-6 pt-0">
              <Button
                type="button"
                className="w-full group/btn bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white transition-all duration-300 hover:shadow-lg hover:shadow-primary/50"
                onClick={handleAddToCart}
              >
                Заказать
                <ArrowLeft className="w-4 h-4 ml-2 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </Button>
            </div>

            <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
            </div>

            <div
              className="absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"
              style={{ boxShadow: "0 20px 40px rgba(30, 58, 138, 0.15)" }}
            />
          </div>
        )
      })}
    </div>
  )
}

