"use client"

import { use } from "react"
import { Footer } from "@/components/footer"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useMemo, useState } from "react"
import Image from "next/image"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { LEGAL_DOCUMENTS } from "@/lib/legal-documents"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"
import type { NextPageProps } from "@/lib/next-page-props"

export default function CartPage({ params, searchParams }: NextPageProps) {
  use(params ?? Promise.resolve({}))
  use(searchParams ?? Promise.resolve({}))
  const { items, removeItem, updateQuantity, clearCart } = useCart()
  const { toast } = useToast()
  const { t } = useLanguage()
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [comment, setComment] = useState("")
  const [requestedDeliveryDate, setRequestedDeliveryDate] = useState("")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [consentAccepted, setConsentAccepted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [inputs, setInputs] = useState<Record<string, string>>({})

  // Один товар с разными цветами — разные позиции, поэтому ключ включает цвет
  const lineKey = (productId: string, colorCode?: string) => `${productId}::${colorCode ?? ""}`

  const getInputValue = (productId: string, quantity: number, colorCode?: string) => {
    return inputs[lineKey(productId, colorCode)] ?? quantity.toString()
  }

  const setInputValue = (productId: string, value: string, colorCode?: string) => {
    setInputs((prev) => ({ ...prev, [lineKey(productId, colorCode)]: value }))
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (items.length === 0) {
      toast({
        title: t("cartPage.emptyTitle"),
        description: t("cartPage.emptyToastDescription"),
        variant: "destructive",
      })
      return
    }

    if (!customerName.trim() || !customerPhone.trim()) {
      toast({
        title: t("cartPage.validationErrorTitle"),
        description: t("cartPage.validationErrorDescription"),
        variant: "destructive",
      })
      return
    }

    const phoneDigits = customerPhone.replace(/\D/g, "")
    if (phoneDigits.length < 10) {
      toast({
        title: t("cartPage.invalidPhoneTitle"),
        description: t("cartPage.invalidPhoneDescription"),
        variant: "destructive",
      })
      return
    }

    if (customerEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())) {
      toast({
        title: t("cartPage.invalidEmailTitle"),
        description: t("cartPage.invalidEmailDescription"),
        variant: "destructive",
      })
      return
    }

    if (!consentAccepted) {
      toast({
        title: t("cartPage.consentRequiredTitle"),
        description: t("cartPage.consentRequiredDescription"),
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            categoryId: item.categoryId,
            subcategoryId: item.subcategoryId,
            quantity: item.quantity,
            price: item.price,
            isPackages: item.isPackages,
            packageQuantity: item.packageQuantity,
            colorCode: item.colorCode,
          })),
          customerName,
          customerPhone,
          customerEmail,
          comment,
          requestedDeliveryDate,
          deliveryAddress,
        }),
      })

      const result = await response.json()

      if (result.ok) {
        clearCart()
        setCustomerName("")
        setCustomerPhone("")
        setCustomerEmail("")
        setComment("")
        setConsentAccepted(false)
        setOrderPlaced(true)
      } else {
        toast({
          title: t("cartPage.errorTitle"),
          description: result.error || t("cartPage.orderFailed"),
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: t("cartPage.errorTitle"),
        description: t("cartPage.orderSendFailed"),
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background">
        <section className="flex min-h-screen items-center justify-center px-4">
          <div className="mx-auto w-full max-w-3xl rounded-3xl border border-primary/20 bg-card p-8 text-center shadow-sm md:p-12">
            <h1 className="text-3xl font-bold text-primary md:text-5xl">
              {t("cartPage.thankYouTitle")}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground md:text-xl">
              {t("cartPage.thankYouDescription")}
            </p>
            <div className="mt-8">
              <Button asChild size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                <Link href="/products">{t("cartPage.backToShopping")}</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background overflow-x-hidden">
        <section className="pt-24 md:pt-32 pb-12 md:pb-20">
          <div className="w-full mx-auto px-3 sm:px-4 lg:px-8 max-w-[1440px]">
            <div className="text-center py-12 md:py-20">
              <ShoppingBag className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 text-muted-foreground/30" />
              <h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 px-4">{t("cartPage.emptyTitle")}</h1>
              <p className="text-base md:text-xl text-muted-foreground mb-6 md:mb-8 px-4">
                {t("cartPage.emptyDescription")}
              </p>
              <Button asChild size="lg" className="bg-gradient-to-r from-primary to-primary/80 h-11 md:h-12">
                <Link href="/products">{t("cartPage.goToCatalog")}</Link>
              </Button>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <section className="pt-24 md:pt-32 pb-12 md:pb-20">
        <div className="w-full mx-auto px-3 sm:px-4 lg:px-8 max-w-[1440px]">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-12">{t("cart")}</h1>

          <div className="grid lg:grid-cols-3 gap-4 md:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3 md:space-y-4">
              {items.map((item, index) => (
                <div
                  key={`${item.productId}-${item.subcategoryId ?? ""}-${index}`}
                  className="bg-card rounded-2xl md:rounded-3xl p-3 sm:p-4 md:p-6 border border-border shadow-sm flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 group"
                >
                  {/* Product Image */}
                  <div className="relative w-full sm:w-24 md:w-32 h-32 sm:h-24 md:h-32 rounded-xl md:rounded-2xl overflow-hidden flex-shrink-0">
                    <Image
                      src={item.productImage || "/placeholder.svg"}
                      alt={item.productName}
                      fill
                      sizes="(max-width: 640px) 100vw, 128px"
                      className="object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 line-clamp-2">{item.productName}</h3>
                    {item.colorCode && (
                      <div className="inline-flex items-center gap-2 mb-2 px-2.5 py-1 rounded-full bg-muted border border-border">
                        <span className="text-xs text-muted-foreground">{t("cartPage.ralColor")}</span>
                        <span className="text-xs font-semibold text-foreground">{item.colorCode}</span>
                      </div>
                    )}
                    
                    {/* Quantity Controls */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 mt-3 md:mt-4">
                      <div className="flex items-center gap-2 border border-border rounded-lg px-2 sm:px-3 py-2 flex-1 sm:flex-none">
                        <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                          {item.isPackages || item.categoryId === 'hoztovary' ? t("productPage.packages") : t("productPage.tons")}
                        </span>
                        <input
                          type="text"
                          inputMode={(item.isPackages || item.categoryId === 'hoztovary') ? "numeric" : "decimal"}
                          className="w-full sm:w-20 md:w-24 bg-transparent outline-none text-center font-semibold text-sm md:text-base"
                          value={getInputValue(item.productId, item.quantity, item.colorCode)}
                          onFocus={(e) => {
                            if (e.currentTarget.value === "0") e.currentTarget.select()
                          }}
                          onChange={(e) => {
                            const prev = getInputValue(item.productId, item.quantity, item.colorCode)
                            let v = e.target.value
                            
                            const isHousehold = item.isPackages || item.categoryId === 'hoztovary'
                            
                            if (isHousehold) {
                              // Для упаковок - только целые числа, запрещаем точку и запятую
                              const valid = /^\d*$/.test(v)
                              if (!valid && v !== "") return
                              if (prev === "0" && /^\d$/.test(v)) {
                                v = String(parseInt(v, 10))
                              }
                            } else {
                              // Для тонн - с десятичными
                              v = v.replace(",", ".")
                              const valid = /^\d*(?:\.\d{0,3})?$/.test(v)
                              if (!valid && v !== "") return
                              if (prev === "0" && /^\d$/.test(v)) {
                                v = String(parseInt(v, 10))
                              }
                            }
                            setInputValue(item.productId, v, item.colorCode)
                          }}
                          onBlur={() => {
                            const raw = getInputValue(item.productId, item.quantity, item.colorCode)
                            const isHousehold = item.isPackages || item.categoryId === 'hoztovary'
                            const n = sanitizeQuantity(raw, isHousehold)
                            const clamped = n <= 0 ? (isHousehold ? 1 : 0.001) : n
                            setInputValue(item.productId, clamped.toString(), item.colorCode)
                            updateQuantity(item.productId, clamped, item.colorCode)
                          }}
                        />
                      </div>
                      {(item.isPackages || item.categoryId === 'hoztovary') && item.packageQuantity && item.packageQuantity > 1 && (
                        <span className="text-xs text-muted-foreground">
                          {String(t("cartPage.packageInfo"))
                            .replace("{count}", String(item.packageQuantity))
                            .replace("{total}", String(item.quantity * item.packageQuantity))}
                        </span>
                      )}
                      {(item.isPackages || item.categoryId === 'hoztovary') && (!item.packageQuantity || item.packageQuantity === 1) && (
                        <span className="text-xs text-muted-foreground">
                          {t("cartPage.packageInfoSingle")}
                        </span>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full sm:w-auto"
                        onClick={() => {
                          removeItem(item.productId, item.colorCode)
                          toast({
                            title: t("cartPage.itemRemoved"),
                            description: `${item.productName}`,
                          })
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        {t("cartPage.remove")}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Form */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 border border-border shadow-sm lg:sticky lg:top-32">
                <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">{t("cartPage.checkoutTitle")}</h2>

                <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                  <div>
                    <label className="text-xs sm:text-sm font-semibold mb-1.5 md:mb-2 block">{t("cartPage.nameLabel")}</label>
                    <Input
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      placeholder={t("cartPage.namePlaceholder")}
                      className="h-10 md:h-11"
                    />
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm font-semibold mb-1.5 md:mb-2 block">{t("cartPage.phoneLabel")}</label>
                    <Input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                      placeholder={t("cartPage.phonePlaceholder")}
                      className="h-10 md:h-11"
                    />
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm font-semibold mb-1.5 md:mb-2 block">{t("cartPage.emailLabel")}</label>
                    <Input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder={t("cartPage.emailPlaceholder")}
                      className="h-10 md:h-11"
                    />
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm font-semibold mb-1.5 md:mb-2 block">Желаемая дата поставки</label>
                    <Input type="date" min={new Date().toISOString().slice(0, 10)} value={requestedDeliveryDate} onChange={(e) => setRequestedDeliveryDate(e.target.value)} className="h-10 md:h-11" />
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm font-semibold mb-1.5 md:mb-2 block">Адрес поставки</label>
                    <Input value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} placeholder="Город, улица, склад" className="h-10 md:h-11" />
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm font-semibold mb-1.5 md:mb-2 block">{t("cartPage.commentLabel")}</label>
                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={t("cartPage.commentPlaceholder")}
                      rows={3}
                      className="text-sm md:text-base resize-none"
                    />
                  </div>

                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="consent-cart"
                      checked={consentAccepted}
                      onCheckedChange={(checked) => setConsentAccepted(checked === true)}
                      required
                      className="mt-1"
                    />
                    <label htmlFor="consent-cart" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                      {t("cartPage.consentPrefix")}{" "}
                      <Link
                        href={LEGAL_DOCUMENTS.personalDataConsentPage}
                        className="text-primary hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t("cartPage.consentPersonalData")}
                      </Link>{" "}
                      {t("cartPage.consentAnd")}{" "}
                      <Link
                        href={LEGAL_DOCUMENTS.privacyPolicyPage}
                        className="text-primary hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t("cartPage.consentPrivacy")}
                      </Link>
                    </label>
                  </div>

                  <div className="pt-3 md:pt-4 border-t border-border">
                    <div className="flex justify-between items-center mb-2 md:mb-4">
                      <span className="text-xs sm:text-sm text-muted-foreground">{t("cartPage.itemsLabel")}</span>
                      <span className="font-semibold text-sm sm:text-base">{items.length}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4 md:mb-6">
                      <span className="text-xs sm:text-sm text-muted-foreground">{t("cartPage.totalLabel")}</span>
                      <span className="text-xl md:text-2xl font-bold">
                        {items.reduce((sum, item) => sum + item.quantity, 0).toFixed(3)}
                      </span>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-11 md:h-12 text-base md:text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                      disabled={isSubmitting || !consentAccepted}
                    >
                      {isSubmitting ? t("common.submitting") : t("cartPage.submitOrder")}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

