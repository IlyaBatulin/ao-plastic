"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MapPin, Phone } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/hooks/use-toast"

export function Contact() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "homepage",
          ...formData,
        }),
      })

      if (response.ok) {
        toast({
          title: "Сообщение отправлено",
          description: "Ваше сообщение отправлено и будет рассмотрено в ближайшее время. Мы свяжемся с вами по указанным контактам.",
          duration: 5000,
        })
        setFormData({ name: "", email: "", phone: "", message: "" })
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
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <section id="contact" className="py-24 lg:py-32 bg-secondary">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">{t("homePage.contact.title")}</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {t("homePage.contact.description")}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Form */}
          <div className="bg-background rounded-2xl p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  {t("homePage.contact.form.name")}
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t("homePage.contact.form.namePlaceholder")}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  {t("homePage.contact.form.email")}
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t("homePage.contact.form.emailPlaceholder")}
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                  {t("homePage.contact.form.phone")}
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t("homePage.contact.form.phonePlaceholder")}
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  {t("homePage.contact.form.message")}
                </label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t("homePage.contact.form.messagePlaceholder")}
                  rows={5}
                />
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Отправка..." : t("homePage.contact.form.submit")}
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-background rounded-2xl p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{t("homePage.contact.address.title")}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    301600, Тульская область,
                    <br />
                    г. Узловая, ул. Тульская, д. 1
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-background rounded-2xl p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{t("homePage.contact.phone.title")}</h3>
                  <p className="text-muted-foreground">+7 (495) 201-03-33</p>
                </div>
              </div>
            </div>

            <div className="bg-background rounded-2xl p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{t("homePage.contact.email.title")}</h3>
                  <p className="text-muted-foreground">info@oaplastic.ru</p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-muted rounded-2xl overflow-hidden h-64">
              <iframe
                src="https://yandex.ru/map-widget/v1/?ll=38.165000,53.977000&z=15&l=map"
                width="100%"
                height="100%"
                frameBorder="0"
                title={t("homePage.contact.mapTitle")}
                className="grayscale"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
