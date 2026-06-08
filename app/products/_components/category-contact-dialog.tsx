"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

interface CategoryContactDialogProps {
  categoryName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CategoryContactDialog({
  categoryName,
  open,
  onOpenChange,
}: CategoryContactDialogProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [contactFormData, setContactFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [consentAccepted, setConsentAccepted] = useState(false)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                  message: `Запрос по категории: ${categoryName}\n\n${contactFormData.message || "Интерес к продукции"}`,
                }),
              })

              if (response.ok) {
                toast({
                  title: "Сообщение отправлено",
                  description:
                    "Ваше сообщение отправлено и будет рассмотрено в ближайшее время. Мы свяжемся с вами по указанным контактам.",
                  duration: 5000,
                })
                setContactFormData({ name: "", email: "", phone: "", message: "" })
                setConsentAccepted(false)
                onOpenChange(false)
              } else {
                const error = await response.json()
                toast({
                  title: "Ошибка отправки",
                  description:
                    error.error ||
                    "Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте еще раз.",
                  variant: "destructive",
                  duration: 5000,
                })
              }
            } catch (error) {
              console.error("Ошибка:", error)
              toast({
                title: "Ошибка отправки",
                description:
                  "Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте еще раз.",
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
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Отправка..." : "Отправить"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
