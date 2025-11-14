"use client"

import type React from "react"

import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Building2, MapPin, Phone, ShoppingCart, Truck } from "lucide-react"
import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/hooks/use-toast"

export default function ContactsPage() {
  const { t } = useLanguage()
  const { toast } = useToast()

  // Направления продаж с ключами для переводов
  const salesDirections = [
    { key: "abs", phone: "+7 (495) 201-03-33 доб.116", email: "info@td-plastic.ru" },
    { key: "polystyrene", phone: "+7 (495) 201-03-33 доб.108", email: "info@td-plastic.ru" },
    { key: "machineParts", phone: "+7 (487) 412-43-06, +7 (487) 312-48-99; +7 (495) 201-03-33 доб.206", email: "info@td-plastic.ru" },
    { key: "absFilament", phone: "+7 (487) 312-43-06, +7 (487) 312-48-32", email: "info@td-plastic.ru" },
    { key: "cors", phone: "+7 (487) 312-48-32", email: "info@td-plastic.ru" },
    { key: "liquidation", phone: "+7 (487) 312-48-32", email: "info@td-plastic.ru" },
    { key: "consumerGoods", phone: "+7 (495) 201-03-33 доб.119", email: "tnp@td-plastic.ru" },
  ]
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
          source: "contacts",
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

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-16 bg-gradient-to-b from-secondary to-background min-h-[40vh] flex items-center">
        {/* Анимированное голубоватое переливание - один большой элемент */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Один большой анимированный градиент для эффекта переливания */}
          <div 
            className="absolute inset-0 animate-blue-flow"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.35) 0%, rgba(147, 197, 253, 0.28) 30%, rgba(96, 165, 250, 0.22) 50%, rgba(147, 197, 253, 0.15) 70%, transparent 100%)',
              backgroundSize: '180% 180%',
              filter: 'blur(70px)',
            }}
          />
        </div>
        {/* Градиентный overlay для мягкости */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/8 via-transparent to-background" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6">{t("contactsPage.title")}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
            {t("contactsPage.description")}
          </p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-8">{t("contactsPage.ourContacts")}</h2>

              <div className="space-y-10 mb-14">
                <div className="grid gap-8">
                  <div className="rounded-3xl border border-border p-6 bg-card/60 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between flex-wrap gap-3">
                          <h3 className="font-semibold text-foreground text-lg">{t("contactsPage.production.title")}</h3>
                          <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary uppercase tracking-wide">
                            {t("contactsPage.production.badge")}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed mt-2">
                          301600, Тульская область, г. Узловая, ул. Тульская, 1
                        </p>
                        <div className="mt-4 grid sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div>
                            <p className="font-semibold text-foreground">{t("contactsPage.production.reception")}</p>
                            <p>+7 (487) 312-47-31</p>
                            <p>info@uzlplast.ru</p>
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{t("contactsPage.production.correspondence")}</p>
                            <p>post@uzlplast.ru</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-border p-6 bg-card/60 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between flex-wrap gap-3">
                          <h3 className="font-semibold text-foreground text-lg">{t("contactsPage.sales.title")}</h3>
                          <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary uppercase tracking-wide">
                            {t("contactsPage.sales.badge")}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed mt-2">
                          119361, Москва, ул. Лобачевского, д. 41, помещение 6, этаж 1, офис 102А
                        </p>
                        <div className="mt-4 grid sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div>
                            <p className="font-semibold text-foreground">{t("contactsPage.sales.mainContacts")}</p>
                            <p>+7 (495) 201-03-33</p>
                            <p>info@td-plastic.ru</p>
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{t("contactsPage.sales.ordersEmail")}</p>
                            <p>sales@td-plastic.ru</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-border p-6 bg-card/60 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between flex-wrap gap-3">
                          <h3 className="font-semibold text-foreground text-lg">{t("contactsPage.procurement.title")}</h3>
                          <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary uppercase tracking-wide">
                            {t("contactsPage.procurement.badge")}
                          </span>
                        </div>
                        <div className="mt-4 text-sm text-muted-foreground">
                          <div>
                            <p className="font-semibold text-foreground">ООО «ТЭК-СНАБ»</p>
                            <p>+7 (910) 704-63-75</p>
                            <p>info@tek-snab.ru</p>
                            <p className="mt-2 text-xs leading-relaxed">119361, г. Москва, муниципальный округ Очаково-Матвеевское вн.тер.г., ул. Лобачевского, д. 41, ПОМЕЩ. 6 ЭТАЖ 1 ОФИС 102Б</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-border p-6 bg-card/60 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <ShoppingCart className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between flex-wrap gap-3">
                          <h3 className="font-semibold text-foreground text-lg">{t("contactsPage.salesByDirection.title")}</h3>
                          <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary uppercase tracking-wide">
                            {t("contactsPage.salesByDirection.badge")}
                          </span>
                        </div>
                        <div className="mt-4 grid sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
                          {salesDirections.map((item) => (
                            <div key={item.key} className="border border-border/60 rounded-2xl p-4">
                              <p className="font-semibold text-foreground mb-2">{t(`contactsPage.salesByDirection.directions.${item.key}`)}</p>
                              <p>{item.phone}</p>
                              <p>{item.email}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Contact Form */}
            <div className="bg-card rounded-2xl p-8 shadow-sm space-y-8 h-fit lg:sticky lg:top-32">
              <h2 className="text-3xl font-bold text-foreground mb-8">{t("contactsPage.form.title")}</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    {t("contactsPage.form.name")} *
                  </label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t("contactsPage.form.namePlaceholder")}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    {t("contactsPage.form.email")} *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t("contactsPage.form.emailPlaceholder")}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    {t("contactsPage.form.phone")}
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder={t("contactsPage.form.phonePlaceholder")}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    {t("contactsPage.form.message")} *
                  </label>
                  <Textarea
                    id="message"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={t("contactsPage.form.messagePlaceholder")}
                    rows={6}
                  />
                </div>

                <Button type="submit" size="lg" className="w-full transition-transform hover:scale-105" disabled={isSubmitting}>
                  {isSubmitting ? "Отправка..." : t("contactsPage.form.submit")}
                </Button>
              </form>

              <div className="space-y-6">
                <div className="relative h-72 rounded-2xl overflow-hidden border border-border shadow-sm">
                  <iframe
                    src="https://yandex.ru/map-widget/v1/?um=constructor%3A5d18be196ff0a84370e071c7752c40474852add841531929eb32903e2e85abf6&amp;source=constructor"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allowFullScreen={true}
                    title={t("contactsPage.mapTitle")}
                  />
                </div>
                <div className="rounded-2xl border border-border p-6 bg-card/60 shadow-sm space-y-6">
                  <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                    {t("contactsPage.workingHours.title")}
                  </h3>
                  <div className="grid gap-4 text-sm text-muted-foreground">
                    <div>
                      <p className="font-semibold text-foreground mb-1">{t("contactsPage.workingHours.production")}</p>
                      <p>{t("contactsPage.workingHours.productionHours")}</p>
                      <p>{t("contactsPage.workingHours.weekend")}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">{t("contactsPage.workingHours.salesOffice")}</p>
                      <p>{t("contactsPage.workingHours.salesHours")}</p>
                      <p>{t("contactsPage.workingHours.weekend")}</p>
                    </div>
                  </div>
                  <div className="rounded-xl border border-dashed border-primary/40 bg-primary/5 p-4 text-sm text-primary">
                    {t("contactsPage.workingHours.unifiedPhone")} <br />
                    <span className="font-semibold text-foreground">+7 (495) 201-03-33</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
