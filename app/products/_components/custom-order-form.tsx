"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { LEGAL_DOCUMENTS } from "@/lib/legal-documents"
import { useLanguage } from "@/contexts/language-context"

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
  const { lang } = useLanguage()
  const isEn = lang === "en"
  const resolvedCommentLabel = isEn && commentLabel === "Описание заказа / Комментарий" ? "Order details / Comments" : commentLabel
  const resolvedCommentPlaceholder = isEn && commentPlaceholder.startsWith("Опишите,")
    ? "Describe the ABS plastic products you require, including specifications, quantity, delivery schedule and any other requirements..."
    : commentPlaceholder
  const resolvedCommentHint = isEn && commentHint.startsWith("Укажите тип")
    ? "Specify the product type, dimensions, quantity, colour and any special requirements"
    : commentHint
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [consentAccepted, setConsentAccepted] = useState(false)
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
        title: isEn ? "Validation error" : "Ошибка валидации",
        description: isEn
          ? "Please fill in required fields (name and phone)"
          : "Пожалуйста, заполните обязательные поля (имя и телефон)",
        variant: "destructive",
      })
      return
    }

    const phoneDigits = formData.customerPhone.replace(/\D/g, "")
    if (phoneDigits.length < 10) {
      toast({
        title: isEn ? "Invalid phone number" : "Некорректный телефон",
        description: isEn
          ? "Please enter a valid phone number"
          : "Пожалуйста, укажите корректный номер телефона",
        variant: "destructive",
      })
      return
    }

    if (formData.customerEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail.trim())) {
      toast({
        title: isEn ? "Invalid email" : "Некорректный email",
        description: isEn
          ? "Please enter a valid email address"
          : "Пожалуйста, укажите корректный email",
        variant: "destructive",
      })
      return
    }

    if (!consentAccepted) {
      toast({
        title: isEn ? "Consent required" : "Требуется согласие",
        description: isEn
          ? "You must agree to personal data processing"
          : "Необходимо согласиться на обработку персональных данных",
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
            ? `${isEn && orderCommentPrefix === "Заявка об АБС пластике на заказ" ? "Custom ABS plastic manufacturing request" : orderCommentPrefix}\n\n${formData.comment.trim()}`
            : isEn && orderCommentPrefix === "Заявка об АБС пластике на заказ" ? "Custom ABS plastic manufacturing request" : orderCommentPrefix,
          payload: {
            orderType,
            source,
          },
        }),
      })

      const result = await response.json()

      if (result.ok) {
        toast({
          title: isEn ? "Request sent!" : "Заявка отправлена!",
          description: isEn ? "We will contact you shortly" : "Мы свяжемся с вами в ближайшее время",
        })
        setFormData({
          customerName: "",
          customerPhone: "",
          customerEmail: "",
          comment: "",
        })
        setConsentAccepted(false)
      } else {
        toast({
          title: isEn ? "Error" : "Ошибка",
          description: result.error || (isEn ? "Failed to send request" : "Не удалось отправить заявку"),
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: isEn ? "Error" : "Ошибка",
        description: isEn ? "Failed to send request" : "Не удалось отправить заявку",
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
          {isEn ? "Your name" : "Ваше имя"} <span className="text-destructive">*</span>
        </label>
        <Input
          value={formData.customerName}
          onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
          required
          placeholder={isEn ? "John Smith" : "Иван Иванов"}
          className="h-12"
        />
      </div>

      <div>
        <label className="text-sm font-semibold mb-2 block">
          {isEn ? "Phone" : "Телефон"} <span className="text-destructive">*</span>
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
        <label className="text-sm font-semibold mb-2 block">{resolvedCommentLabel}</label>
        <Textarea
          value={formData.comment}
          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
          placeholder={resolvedCommentPlaceholder}
          rows={6}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground mt-2">{resolvedCommentHint}</p>
      </div>

      <div className="flex items-start gap-2">
        <Checkbox
          id="consent-custom-order"
          checked={consentAccepted}
          onCheckedChange={(checked) => setConsentAccepted(checked === true)}
          required
          className="mt-1"
        />
        <label htmlFor="consent-custom-order" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
          {isEn ? "I agree to the " : "Я согласен(а) с "}
          <Link
            href={LEGAL_DOCUMENTS.personalDataConsentPage}
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {isEn ? "personal data processing consent" : "согласием на обработку персональных данных"}
          </Link>{" "}
          {isEn ? " and the " : " и "}
          <Link
            href={LEGAL_DOCUMENTS.privacyPolicyPage}
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {isEn ? "privacy policy" : "политикой конфиденциальности"}
          </Link>
        </label>
      </div>

      <Button type="submit" className="w-full h-14 text-lg" disabled={isSubmitting || !consentAccepted}>
        {isSubmitting ? (isEn ? "Sending..." : "Отправка...") : (isEn ? "Submit request" : "Отправить заявку")}
      </Button>
    </form>
  )
}

