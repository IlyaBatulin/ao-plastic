"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export type CustomOrderFormProps = {
  categoryId?: string
  /** `null` — заявка только по категории; не указано — подкатегория abs-custom (как раньше) */
  subcategoryId?: string | null
  orderCommentPrefix?: string
  orderType?: string
  source?: string
  commentPlaceholder?: string
  commentLabel?: string
  commentHint?: string
}

export function CustomOrderForm({
  categoryId = "abs",
  subcategoryId,
  orderCommentPrefix = "Заявка об АБС пластике на заказ",
  orderType = "custom_abs",
  source = "abs-custom-page",
  commentPlaceholder = "Опишите, какие изделия из АБС-пластика вам необходимы, их характеристики, количество, сроки изготовления и другие требования...",
  commentLabel = "Описание заказа / Комментарий",
  commentHint = "Укажите тип изделия, размеры, количество, цвет, особые требования и другие детали",
}: CustomOrderFormProps = {}) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    comment: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.customerName.trim() || !formData.customerPhone.trim()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните обязательные поля (имя и телефон)",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    const resolvedSubcategoryId =
      subcategoryId === null ? undefined : subcategoryId !== undefined ? subcategoryId : "abs-custom"
    const orderItem: { categoryId: string; quantity: number; subcategoryId?: string } = {
      categoryId,
      quantity: 1,
    }
    if (resolvedSubcategoryId) {
      orderItem.subcategoryId = resolvedSubcategoryId
    }

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [orderItem],
          customerName: formData.customerName.trim(),
          customerPhone: formData.customerPhone.trim(),
          customerEmail: formData.customerEmail.trim() || undefined,
          comment: formData.comment.trim()
            ? `${orderCommentPrefix}\n\n${formData.comment.trim()}`
            : orderCommentPrefix,
          payload: {
            orderType,
            source,
          },
        }),
      })

      const result = await response.json()

      if (result.ok) {
        toast({
          title: "Заявка отправлена!",
          description: "Мы свяжемся с вами в ближайшее время",
        })
        setFormData({
          customerName: "",
          customerPhone: "",
          customerEmail: "",
          comment: "",
        })
      } else {
        toast({
          title: "Ошибка",
          description: result.error || "Не удалось отправить заявку",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось отправить заявку",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="text-sm font-semibold mb-2 block">
          Ваше имя <span className="text-destructive">*</span>
        </label>
        <Input
          value={formData.customerName}
          onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
          required
          placeholder="Иван Иванов"
          className="h-12"
        />
      </div>

      <div>
        <label className="text-sm font-semibold mb-2 block">
          Телефон <span className="text-destructive">*</span>
        </label>
        <Input
          type="tel"
          value={formData.customerPhone}
          onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
          required
          placeholder="+7 (999) 123-45-67"
          className="h-12"
        />
      </div>

      <div>
        <label className="text-sm font-semibold mb-2 block">Email</label>
        <Input
          type="email"
          value={formData.customerEmail}
          onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
          placeholder="example@mail.ru"
          className="h-12"
        />
      </div>

      <div>
        <label className="text-sm font-semibold mb-2 block">{commentLabel}</label>
        <Textarea
          value={formData.comment}
          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
          placeholder={commentPlaceholder}
          rows={6}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground mt-2">{commentHint}</p>
      </div>

      <Button type="submit" className="w-full h-14 text-lg" disabled={isSubmitting}>
        {isSubmitting ? "Отправка..." : "Отправить заявку"}
      </Button>
    </form>
  )
}

