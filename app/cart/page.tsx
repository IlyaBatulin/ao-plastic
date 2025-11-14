"use client"

import { Footer } from "@/components/footer"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useMemo, useState } from "react"
import Image from "next/image"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCart()
  const { toast } = useToast()
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [inputs, setInputs] = useState<Record<string, string>>({})

  const getInputValue = (productId: string, quantity: number) => {
    return inputs[productId] ?? quantity.toString()
  }

  const setInputValue = (productId: string, value: string) => {
    setInputs((prev) => ({ ...prev, [productId]: value }))
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
        title: "Корзина пуста",
        description: "Добавьте товары в корзину",
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
          })),
          customerName,
          customerPhone,
          customerEmail,
          comment,
        }),
      })

      const result = await response.json()

      if (result.ok) {
        toast({
          title: "Заказ оформлен!",
          description: "Мы свяжемся с вами в ближайшее время",
        })
        clearCart()
        setCustomerName("")
        setCustomerPhone("")
        setCustomerEmail("")
        setComment("")
      } else {
        toast({
          title: "Ошибка",
          description: result.error || "Не удалось оформить заказ",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось отправить заказ",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background overflow-x-hidden">
        <section className="pt-24 md:pt-32 pb-12 md:pb-20">
          <div className="w-full mx-auto px-3 sm:px-4 lg:px-8 max-w-[1440px]">
            <div className="text-center py-12 md:py-20">
              <ShoppingBag className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 text-muted-foreground/30" />
              <h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 px-4">Корзина пуста</h1>
              <p className="text-base md:text-xl text-muted-foreground mb-6 md:mb-8 px-4">
                Добавьте товары из каталога
              </p>
              <Button asChild size="lg" className="bg-gradient-to-r from-primary to-primary/80 h-11 md:h-12">
                <Link href="/products">Перейти в каталог</Link>
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
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-12">Корзина</h1>

          <div className="grid lg:grid-cols-3 gap-4 md:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3 md:space-y-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="bg-card rounded-2xl md:rounded-3xl p-3 sm:p-4 md:p-6 border border-border shadow-sm flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 group"
                >
                  {/* Product Image */}
                  <div className="relative w-full sm:w-24 md:w-32 h-32 sm:h-24 md:h-32 rounded-xl md:rounded-2xl overflow-hidden flex-shrink-0">
                    <Image
                      src={item.productImage || "/placeholder.svg"}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 line-clamp-2">{item.productName}</h3>
                    
                    {/* Quantity Controls */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 mt-3 md:mt-4">
                      <div className="flex items-center gap-2 border border-border rounded-lg px-2 sm:px-3 py-2 flex-1 sm:flex-none">
                        <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                          {item.isPackages || item.categoryId === 'hoztovary' ? 'Упаковки:' : 'Тонны:'}
                        </span>
                        <input
                          type="text"
                          inputMode={(item.isPackages || item.categoryId === 'hoztovary') ? "numeric" : "decimal"}
                          className="w-full sm:w-20 md:w-24 bg-transparent outline-none text-center font-semibold text-sm md:text-base"
                          value={getInputValue(item.productId, item.quantity)}
                          onFocus={(e) => {
                            if (e.currentTarget.value === "0") e.currentTarget.select()
                          }}
                          onChange={(e) => {
                            const prev = getInputValue(item.productId, item.quantity)
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
                            setInputValue(item.productId, v)
                          }}
                          onBlur={() => {
                            const raw = getInputValue(item.productId, item.quantity)
                            const isHousehold = item.isPackages || item.categoryId === 'hoztovary'
                            const n = sanitizeQuantity(raw, isHousehold)
                            const clamped = n <= 0 ? (isHousehold ? 1 : 0.001) : n
                            setInputValue(item.productId, clamped.toString())
                            updateQuantity(item.productId, clamped)
                          }}
                        />
                      </div>
                      {(item.isPackages || item.categoryId === 'hoztovary') && item.packageQuantity && item.packageQuantity > 1 && (
                        <span className="text-xs text-muted-foreground">
                          ({item.packageQuantity} шт/уп, всего {item.quantity * item.packageQuantity} шт)
                        </span>
                      )}
                      {(item.isPackages || item.categoryId === 'hoztovary') && (!item.packageQuantity || item.packageQuantity === 1) && (
                        <span className="text-xs text-muted-foreground">
                          (1 шт/уп)
                        </span>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full sm:w-auto"
                        onClick={() => {
                          removeItem(item.productId)
                          toast({
                            title: "Товар удален",
                            description: `${item.productName}`,
                          })
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Удалить
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Form */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 border border-border shadow-sm lg:sticky lg:top-32">
                <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Оформление заказа</h2>
                
                <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                  <div>
                    <label className="text-xs sm:text-sm font-semibold mb-1.5 md:mb-2 block">Ваше имя *</label>
                    <Input
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      placeholder="Иван Иванов"
                      className="h-10 md:h-11"
                    />
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm font-semibold mb-1.5 md:mb-2 block">Телефон *</label>
                    <Input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                      placeholder="+7 (999) 123-45-67"
                      className="h-10 md:h-11"
                    />
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm font-semibold mb-1.5 md:mb-2 block">Email</label>
                    <Input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="example@mail.ru"
                      className="h-10 md:h-11"
                    />
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm font-semibold mb-1.5 md:mb-2 block">Комментарий</label>
                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Дополнительная информация к заказу"
                      rows={3}
                      className="text-sm md:text-base resize-none"
                    />
                  </div>

                  <div className="pt-3 md:pt-4 border-t border-border">
                    <div className="flex justify-between items-center mb-2 md:mb-4">
                      <span className="text-xs sm:text-sm text-muted-foreground">Позиций:</span>
                      <span className="font-semibold text-sm sm:text-base">{items.length}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4 md:mb-6">
                      <span className="text-xs sm:text-sm text-muted-foreground">Итого (т):</span>
                      <span className="text-xl md:text-2xl font-bold">
                        {items.reduce((sum, item) => sum + item.quantity, 0).toFixed(3)}
                      </span>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-11 md:h-12 text-base md:text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Отправка..." : "Оформить заказ"}
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

