"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, Package, Truck, X } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Footer } from "@/components/footer"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"
import { formatSpecKey, formatSpecValue } from "@/lib/formatters"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RalColorPicker, type RalColor } from "@/components/ral-color-picker"
import { useLanguage } from "@/contexts/language-context"
import { resolveProductDisplay } from "@/lib/product-en"
import { isMachinePartsExtrusion } from "@/lib/catalog-slugs"
import { resolveProductImageUrl } from "@/lib/product-image"

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
  const { lang } = useLanguage()

  // Определяем тип товара
  const isHouseholdProduct = categoryId === 'hoztovary'
  const isStyrene = categoryId === 'styrene' || 
                    category?.id === 'styrene' || 
                    category?.name?.toLowerCase().includes('стирол') ||
                    product.name?.toLowerCase().includes('стирол') ||
                    product.category_id === 'styrene'
  const packageQuantity = product.package_quantity || product.quantity_in_pack || 1
  
  const isAbsProduct = categoryId === "abs"
  const [selectedRalColor, setSelectedRalColor] = useState<RalColor | null>(null)
  const [quantityInput, setQuantityInput] = useState<string>("1")
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [contactFormData, setContactFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [consentAccepted, setConsentAccepted] = useState(false)

  const { name: displayName, description: displayDescription } = resolveProductDisplay(
    {
      id: String(product.id),
      name: product.name,
      description: product.description,
      slug: product.slug,
      brand: product.brand,
      specifications: product.specifications,
    },
    lang === "en" ? "en" : "ru",
    { categoryId, subcategoryId }
  )
  const productImageUrl = resolveProductImageUrl(String(product.id), product.image, category?.image)

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

  // Для экструзионных изделий скрываем блок "ключевые фичи" и оставляем только описание/характеристики
  const isExtrusionProduct =
    isMachinePartsExtrusion(categoryId, subcategoryId)

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
                src={productImageUrl}
                alt={displayName}
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
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">{displayName}</h1>

              {displayDescription && (
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  {displayDescription}
                </p>
              )}

              {/* Key Features: для экструзионных изделий не показываем маркетинговые пункты */}
              {!isExtrusionProduct && (
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
              )}

              {/* RAL Color Picker — только для АБС-пластиков */}
              {isAbsProduct && (
                <div className="mb-6 p-4 rounded-2xl border border-border bg-muted/30">
                  <p className="text-sm font-semibold mb-3 text-foreground">
                    Цвет RAL
                    <span className="ml-1 text-xs font-normal text-muted-foreground">(необязательно)</span>
                  </p>
                  <RalColorPicker
                    selected={selectedRalColor}
                    onChange={setSelectedRalColor}
                  />
                  {selectedRalColor && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Будет указан в заказе: <span className="font-semibold text-foreground">{selectedRalColor.code}</span> — {selectedRalColor.name}
                    </p>
                  )}
                </div>
              )}

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
                      productName: displayName,
                      productImage: productImageUrl,
                      categoryId: categoryId,
                      subcategoryId: subcategoryId,
                      quantity: n,
                      isPackages: isHouseholdProduct,
                      packageQuantity: isHouseholdProduct ? packageQuantity : undefined,
                      colorCode: isAbsProduct && selectedRalColor ? selectedRalColor.code : undefined,
                    })
                    const unit = isHouseholdProduct ? 'уп' : 'т'
                    const formatted = isHouseholdProduct ? n.toString() : n.toFixed(3)
                    const colorInfo = isAbsProduct && selectedRalColor ? `, цвет: ${selectedRalColor.code}` : ''
                    toast({
                      title: "Товар добавлен в корзину",
                      description: `${displayName}: ${formatted} ${unit}${isHouseholdProduct && packageQuantity > 1 ? ` (${n * packageQuantity} шт)` : ''}${colorInfo}`,
                      className: "border-primary/40 bg-primary text-primary-foreground",
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
                    <span className="text-sm font-semibold text-muted-foreground mb-1">
                      {formatSpecKey(key, lang === "en" ? "en" : "ru")}
                    </span>
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

      {/* Styrene Specifications Table */}
      {isStyrene && (
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-bold mb-8">Норма по НТД - Высший сорт</h2>
            <div className="bg-card rounded-3xl p-8 shadow-sm border border-border overflow-x-auto">
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">ОКП 24 14930120</p>
              </div>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#1e3a5f] text-white">
                    <th className="py-4 px-6 text-left font-semibold border border-gray-300">№ п/п</th>
                    <th className="py-4 px-6 text-left font-semibold border border-gray-300">Наименование показателей</th>
                    <th className="py-4 px-6 text-left font-semibold border border-gray-300">Ед. измерения</th>
                    <th className="py-4 px-6 text-left font-semibold border border-gray-300">Норма по НТД</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b border-gray-200">
                    <td className="py-4 px-6 border border-gray-300">1</td>
                    <td className="py-4 px-6 border border-gray-300">Внешний вид</td>
                    <td className="py-4 px-6 border border-gray-300 text-center">—</td>
                    <td className="py-4 px-6 border border-gray-300">Прозрачная однородная жидкость без механических примесей и нерастворенной влаги</td>
                  </tr>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <td className="py-4 px-6 border border-gray-300">2</td>
                    <td className="py-4 px-6 border border-gray-300">Массовая доля стирола, не менее</td>
                    <td className="py-4 px-6 border border-gray-300 text-center">%</td>
                    <td className="py-4 px-6 border border-gray-300">99,80</td>
                  </tr>
                  <tr className="bg-white border-b border-gray-200">
                    <td className="py-4 px-6 border border-gray-300">3</td>
                    <td className="py-4 px-6 border border-gray-300">Массовая доля дивинилбензола, не более</td>
                    <td className="py-4 px-6 border border-gray-300 text-center">%</td>
                    <td className="py-4 px-6 border border-gray-300">0,0005</td>
                  </tr>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <td className="py-4 px-6 border border-gray-300">4</td>
                    <td className="py-4 px-6 border border-gray-300">Массовая доля карбонильных соединений в пересчете на бензальдегид, не более</td>
                    <td className="py-4 px-6 border border-gray-300 text-center">%</td>
                    <td className="py-4 px-6 border border-gray-300">0,01</td>
                  </tr>
                  <tr className="bg-white border-b border-gray-200">
                    <td className="py-4 px-6 border border-gray-300">5</td>
                    <td className="py-4 px-6 border border-gray-300">Массовая доля перекисных соединений в пересчете на активный кислород, не более</td>
                    <td className="py-4 px-6 border border-gray-300 text-center">%</td>
                    <td className="py-4 px-6 border border-gray-300">0,0005</td>
                  </tr>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <td className="py-4 px-6 border border-gray-300">6</td>
                    <td className="py-4 px-6 border border-gray-300">Массовая доля полимера, не более</td>
                    <td className="py-4 px-6 border border-gray-300 text-center">%</td>
                    <td className="py-4 px-6 border border-gray-300">0,001</td>
                  </tr>
                  <tr className="bg-white border-b border-gray-200">
                    <td className="py-4 px-6 border border-gray-300">7</td>
                    <td className="py-4 px-6 border border-gray-300">Массовая доля фенилацетилена, не более</td>
                    <td className="py-4 px-6 border border-gray-300 text-center">%</td>
                    <td className="py-4 px-6 border border-gray-300">0,01</td>
                  </tr>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <td className="py-4 px-6 border border-gray-300">8</td>
                    <td className="py-4 px-6 border border-gray-300">Массовая доля стабилизатора пара-трет-бутилпирокатехина, в пределах</td>
                    <td className="py-4 px-6 border border-gray-300 text-center">%</td>
                    <td className="py-4 px-6 border border-gray-300">0,0005-0,0010</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="py-4 px-6 border border-gray-300">9</td>
                    <td className="py-4 px-6 border border-gray-300">Цветность по платиново-кобальтовой шкале, не более</td>
                    <td className="py-4 px-6 border border-gray-300 text-center">ед. Хазена</td>
                    <td className="py-4 px-6 border border-gray-300">10</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-8 flex justify-center">
              <Button
                onClick={() => setIsContactFormOpen(true)}
                className="text-lg h-14 px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                Связаться с нами
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Contact Form Dialog */}
      <Dialog open={isContactFormOpen} onOpenChange={setIsContactFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Связаться с нами</DialogTitle>
            <DialogDescription>
              Заполните форму, и мы свяжемся с вами в ближайшее время
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              
              if (!consentAccepted) {
                toast({
                  title: "Требуется согласие",
                  description: "Необходимо согласиться на обработку персональных данных",
                  variant: "destructive",
                  duration: 3000,
                })
                return
              }
              
              setIsSubmitting(true)

              try {
                const response = await fetch("/api/contact-messages", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    source: "contacts",
                    ...contactFormData,
                    message: `Запрос по продукту: ${displayName}\n\n${contactFormData.message || "Интерес к продукции"}`,
                  }),
                })

                if (response.ok) {
                  toast({
                    title: "Сообщение отправлено",
                    description: "Ваше сообщение отправлено и будет рассмотрено в ближайшее время. Мы свяжемся с вами по указанным контактам.",
                    duration: 5000,
                  })
                  setContactFormData({ name: "", email: "", phone: "", message: "" })
                  setConsentAccepted(false)
                  setIsContactFormOpen(false)
                } else {
                  const error = await response.json()
                  toast({
                    title: "Ошибка отправки",
                    description: error.error || "Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте еще раз.",
                    variant: "destructive",
                    duration: 5000,
                  })
                }
              } catch (error) {
                console.error("Ошибка:", error)
                toast({
                  title: "Ошибка отправки",
                  description: "Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте еще раз.",
                  variant: "destructive",
                  duration: 5000,
                })
              } finally {
                setIsSubmitting(false)
              }
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Имя <span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                required
                value={contactFormData.name}
                onChange={(e) => setContactFormData({ ...contactFormData, name: e.target.value })}
                placeholder="Ваше имя"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                id="email"
                type="email"
                required
                value={contactFormData.email}
                onChange={(e) => setContactFormData({ ...contactFormData, email: e.target.value })}
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                Телефон
              </label>
              <Input
                id="phone"
                type="tel"
                value={contactFormData.phone}
                onChange={(e) => setContactFormData({ ...contactFormData, phone: e.target.value })}
                placeholder="+7 (___) ___-__-__"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Сообщение <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="message"
                required
                value={contactFormData.message}
                onChange={(e) => setContactFormData({ ...contactFormData, message: e.target.value })}
                placeholder="Ваше сообщение"
                rows={4}
              />
            </div>
            <div className="flex items-start gap-2">
              <Checkbox
                id="consent"
                checked={consentAccepted}
                onCheckedChange={(checked) => setConsentAccepted(checked === true)}
              />
              <label htmlFor="consent" className="text-sm text-muted-foreground cursor-pointer">
                Я согласен на обработку персональных данных <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsContactFormOpen(false)}
                className="flex-1"
              >
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "Отправка..." : "Отправить"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}

