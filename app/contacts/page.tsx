"use client"

import type React from "react"
import { use } from "react"

import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Building2, MapPin, Phone, ShoppingCart, Truck } from "lucide-react"
import Link from "next/link"
import { LEGAL_DOCUMENTS } from "@/lib/legal-documents"
import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/hooks/use-toast"
import type { NextPageProps } from "@/lib/next-page-props"
import { FACTORY_YANDEX_MAP_EMBED_URL } from "@/lib/yandex-maps"
import { SALES_DIRECTION_CONTACTS } from "@/lib/sales-direction-contacts"
import { TEK_SNAB_CONTACTS } from "@/lib/tek-snab-contacts"

export default function ContactsPage({ params, searchParams }: NextPageProps) {
  use(params ?? Promise.resolve({}))
  use(searchParams ?? Promise.resolve({}))
  const { t } = useLanguage()
  const { toast } = useToast()

  const salesDirections = SALES_DIRECTION_CONTACTS
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [consentAccepted, setConsentAccepted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!consentAccepted) {
      toast({
        title: t("contactsPage.form.toastConsentRequiredTitle"),
        description: t("contactsPage.form.toastConsentRequiredDescription"),
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
          ...formData,
        }),
      })

      if (response.ok) {
        toast({
          title: t("contactsPage.form.toastSuccessTitle"),
          description: t("contactsPage.form.toastSuccessDescription"),
          duration: 5000,
        })
        setFormData({ name: "", email: "", phone: "", message: "" })
      } else {
        const error = await response.json()
        toast({
          title: t("contactsPage.form.toastErrorTitle"),
          description: error.error || t("contactsPage.form.toastErrorDescription"),
          variant: "destructive",
          duration: 5000,
        })
      }
    } catch (error) {
      console.error("Ошибка:", error)
      toast({
        title: t("contactsPage.form.toastErrorTitle"),
        description: t("contactsPage.form.toastErrorDescription"),
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
          <h1 className="text-5xl lg:text-6xl font-bold text-primary mb-6">{t("contactsPage.title")}</h1>
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
                          {t("contactsPage.production.address")}
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
                          {t("contactsPage.sales.address")}
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
                            <p className="font-semibold text-foreground">{t("contactsPage.procurement.companyName")}</p>
                            <p className="text-muted-foreground">{t("contactsPage.procurement.description")}</p>
                            <p className="mt-2">
                              <a href={TEK_SNAB_CONTACTS.phoneHref} className="hover:text-primary transition-colors">
                                {TEK_SNAB_CONTACTS.phone}
                              </a>
                            </p>
                            <p>
                              <a href={`mailto:${TEK_SNAB_CONTACTS.email}`} className="hover:text-primary transition-colors">
                                {TEK_SNAB_CONTACTS.email}
                              </a>
                            </p>
                            <p className="mt-2 text-xs leading-relaxed">{t("contactsPage.procurement.address")}</p>
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

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="consent-contacts"
                    checked={consentAccepted}
                    onCheckedChange={(checked) => setConsentAccepted(checked === true)}
                    required
                    className="mt-1"
                  />
                  <label htmlFor="consent-contacts" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                    {t("contactsPage.form.consentPrefix")}{" "}
                    <Link
                      href={LEGAL_DOCUMENTS.personalDataConsentPage}
                      className="text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("contactsPage.form.consentPersonalData")}
                    </Link>{" "}
                    {t("contactsPage.form.consentAnd")}{" "}
                    <Link
                      href={LEGAL_DOCUMENTS.privacyPolicyPage}
                      className="text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("contactsPage.form.consentPrivacy")}
                    </Link>
                  </label>
                </div>

                <Button type="submit" size="lg" className="w-full transition-transform hover:scale-105" disabled={isSubmitting || !consentAccepted}>
                  {isSubmitting ? t("common.submitting") : t("contactsPage.form.submit")}
                </Button>
              </form>

              <div className="space-y-6">
                <div className="relative h-72 rounded-2xl overflow-hidden border border-border shadow-sm">
                  <iframe
                    src={FACTORY_YANDEX_MAP_EMBED_URL}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
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
