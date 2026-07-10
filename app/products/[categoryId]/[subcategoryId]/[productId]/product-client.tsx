"use client"

import { useMemo, useState, useEffect } from "react"
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
import { stripHiddenSpecs } from "@/lib/product-specs"
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
import { KorsNormTable } from "@/app/products/_components/kors-norm-table"
import { KORS_PAGE_KEYS } from "@/lib/kors-bentol-en"
import {
  getStyreneNormRows,
  STYRENE_OKP_LABEL,
  STYRENE_PAGE_KEYS,
} from "@/lib/styrene-category-i18n"
import { scrollPageToTop } from "@/lib/scroll-to-top"

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
  const { addItem } = useCart()
  const { toast } = useToast()
  const { t, lang } = useLanguage()
  const formK = "contactsPage.form"
  const styreneK = STYRENE_PAGE_KEYS
  const normTableCols = {
    colNo: t(KORS_PAGE_KEYS.normColNo),
    colName: t(KORS_PAGE_KEYS.normColName),
    colUnit: t(KORS_PAGE_KEYS.normColUnit),
    colValue: t(KORS_PAGE_KEYS.normColValue),
  }

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

  useEffect(() => {
    scrollPageToTop()
    const timer = window.setTimeout(() => scrollPageToTop(), 120)
    return () => window.clearTimeout(timer)
  }, [product.id])

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

  const specifications = useMemo(() => {
    let specs: Record<string, unknown> = {}
    if (product.specifications) {
      if (typeof product.specifications === "string") {
        try {
          specs = JSON.parse(product.specifications)
        } catch {
          specs = {}
        }
      } else {
        specs = product.specifications
      }
    }
    return stripHiddenSpecs(specs)
  }, [product.specifications])

  const detailSections = Array.isArray(product.detailSections) ? product.detailSections : []

  // Для экструзионных изделий скрываем блок "ключевые фичи" и оставляем только описание/характеристики
  const isExtrusionProduct =
    isMachinePartsExtrusion(categoryId, subcategoryId)

  return (
    <div className="min-h-screen">
      {/* Breadcrumbs */}
      <section className="pt-32 pb-8 bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="container mx-auto px-4 lg:px-8">
          <Link
            href={`/products/${categoryId}/${subcategoryId}`}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>{t("productPage.backToSubcategory")}</span>
          </Link>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="flex h-[28rem] w-full items-center justify-center overflow-hidden bg-white sm:h-[32rem] lg:h-full lg:min-h-[500px]">
              <Image
                src={productImageUrl}
                alt={displayName}
                width={800}
                height={1000}
                className="h-full w-full object-contain"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-center">
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
                    <span className="text-sm">{t("productPage.highQuality")}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm">{t("productPage.certifiedProduct")}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Truck className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm">{t("productPage.deliveryRussia")}</span>
                  </div>
                </div>
              )}

              {/* RAL Color Picker — только для АБС-пластиков */}
              {isAbsProduct && (
                <div className="mb-6 p-4 rounded-2xl border border-border bg-muted/30">
                  <p className="text-sm font-semibold mb-3 text-foreground">
                    {t("productPage.ralColor")}
                    <span className="ml-1 text-xs font-normal text-muted-foreground">
                      {t("productPage.ralOptional")}
                    </span>
                  </p>
                  <RalColorPicker
                    selected={selectedRalColor}
                    onChange={setSelectedRalColor}
                  />
                  {selectedRalColor && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {t("productPage.ralOrderNote")}{" "}
                      <span className="font-semibold text-foreground">{selectedRalColor.code}</span> — {selectedRalColor.name}
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 border border-border rounded-lg px-2 py-1">
                  <span className="text-sm text-muted-foreground">
                    {isHouseholdProduct ? t("productPage.packages") : t("productPage.tons")}
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
                    ({packageQuantity} {t("productPage.pcsPerPack")})
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
                    const unit = isHouseholdProduct ? t("productPage.unitPack") : t("productPage.unitTons")
                    const formatted = isHouseholdProduct ? n.toString() : n.toFixed(3)
                    const colorInfo =
                      isAbsProduct && selectedRalColor
                        ? `, ${t("productPage.colorLabel")} ${selectedRalColor.code}`
                        : ""
                    toast({
                      title: t("productPage.addedToCart"),
                      description: `${displayName}: ${formatted} ${unit}${isHouseholdProduct && packageQuantity > 1 ? ` (${n * packageQuantity} ${t("productPage.unitPcs")})` : ""}${colorInfo}`,
                      className: "border-primary/40 bg-primary text-primary-foreground",
                    })
                  }}
                >
                  {t("productPage.orderProduct")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {detailSections.length > 0 && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid gap-6">
              {detailSections.map((section: any) => (
                <article
                  key={section.title}
                  className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-8"
                >
                  <h2 className="mb-5 text-2xl font-bold text-primary lg:text-3xl">
                    {section.title}
                  </h2>
                  <div
                    className={
                      section.image
                        ? "grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start"
                        : ""
                    }
                  >
                    <div className="space-y-4 text-base leading-relaxed text-muted-foreground lg:text-lg">
                      {section.paragraphs?.map((paragraph: string) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                      {section.items?.length > 0 && (
                        <ul className="list-disc space-y-2 pl-6">
                          {section.items.map((item: string) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      )}
                      {section.after?.map((paragraph: string) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                    {section.image && (
                      <div
                        className={`relative min-h-64 overflow-hidden rounded-2xl border border-border shadow-sm lg:min-h-80 ${
                          section.imageBackground === "black" ? "bg-black" : "bg-muted"
                        }`}
                      >
                        <Image
                          src={section.image}
                          alt={section.imageAlt ?? section.title}
                          fill
                          sizes="(min-width: 1024px) 22rem, 100vw"
                          className={section.imageFit === "contain" ? "object-contain" : "object-cover"}
                        />
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Specifications */}
      {Object.keys(specifications).length > 0 && (
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-bold mb-8">{t("productPage.specificationsTitle")}</h2>
            <div className="bg-card rounded-3xl p-8 shadow-sm border border-border">
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(specifications).map(([key, value]) => (
                  <div key={key} className="flex flex-col border-b border-border pb-4 last:border-0">
                    <span className="text-sm font-semibold text-muted-foreground mb-1">
                      {formatSpecKey(key, lang === "en" ? "en" : "ru", value)}
                    </span>
                    <span className="text-lg font-medium">
                      {formatSpecValue(key, value, lang === "en" ? "en" : "ru")}
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
            <h2 className="text-3xl lg:text-4xl font-bold mb-8">{t(styreneK.normTitle)}</h2>
            <KorsNormTable
              tuLabel={STYRENE_OKP_LABEL}
              rows={getStyreneNormRows(lang === "en" ? "en" : "ru")}
              {...normTableCols}
            />
            <div className="mt-8 flex justify-center">
              <Button
                onClick={() => setIsContactFormOpen(true)}
                className="text-lg h-14 px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                {t(styreneK.contactUs)}
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Contact Form Dialog */}
      <Dialog open={isContactFormOpen} onOpenChange={setIsContactFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t("contactUs")}</DialogTitle>
            <DialogDescription>{t("productPage.contactDialogDescription")}</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              
              if (!consentAccepted) {
                toast({
                  title: t(`${formK}.toastConsentRequiredTitle`),
                  description: t(`${formK}.toastConsentRequiredDescription`),
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
                    message: `${t("productPage.productInquiryPrefix")} ${displayName}\n\n${contactFormData.message || t("productPage.productInterestDefault")}`,
                  }),
                })

                if (response.ok) {
                  toast({
                    title: t(`${formK}.toastSuccessTitle`),
                    description: t(`${formK}.toastSuccessDescription`),
                    duration: 5000,
                  })
                  setContactFormData({ name: "", email: "", phone: "", message: "" })
                  setConsentAccepted(false)
                  setIsContactFormOpen(false)
                } else {
                  const error = await response.json()
                  toast({
                    title: t(`${formK}.toastErrorTitle`),
                    description: error.error || t(`${formK}.toastErrorDescription`),
                    variant: "destructive",
                    duration: 5000,
                  })
                }
              } catch (error) {
                console.error("Ошибка:", error)
                toast({
                  title: t(`${formK}.toastErrorTitle`),
                  description: t(`${formK}.toastErrorDescription`),
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
                {t(`${formK}.name`)} <span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                required
                value={contactFormData.name}
                onChange={(e) => setContactFormData({ ...contactFormData, name: e.target.value })}
                placeholder={t(`${formK}.namePlaceholder`)}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                {t(`${formK}.email`)} <span className="text-red-500">*</span>
              </label>
              <Input
                id="email"
                type="email"
                required
                value={contactFormData.email}
                onChange={(e) => setContactFormData({ ...contactFormData, email: e.target.value })}
                placeholder={t(`${formK}.emailPlaceholder`)}
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                {t(`${formK}.phone`)}
              </label>
              <Input
                id="phone"
                type="tel"
                value={contactFormData.phone}
                onChange={(e) => setContactFormData({ ...contactFormData, phone: e.target.value })}
                placeholder={t(`${formK}.phonePlaceholder`)}
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                {t(`${formK}.message`)} <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="message"
                required
                value={contactFormData.message}
                onChange={(e) => setContactFormData({ ...contactFormData, message: e.target.value })}
                placeholder={t(`${formK}.messagePlaceholder`)}
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
                {t(`${formK}.consentPrefix`)}{" "}
                {t(`${formK}.consentPersonalData`)}{" "}
                <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsContactFormOpen(false)}
                className="flex-1"
              >
                {t("productPage.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? t(`${formK}.submitting`) : t(`${formK}.submit`)}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}

