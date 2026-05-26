"use client"

import Link from "next/link"
import { Warehouse, MapPinned } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { Footer } from "@/components/footer"

const nizhnyPartners = [
  {
    id: "trastPolimer",
    contacts: ["https://www.trast-polimer.ru", "trastnnov@mail.ru"],
    phones: ["+7 (831) 270-41-04", "+7 (831) 270-86-59"],
  },
  {
    id: "kraftPolimer",
    contacts: ["https://www.trast-polimer.ru", "trastnnov@mail.ru"],
    phones: ["+7 (831) 270-86-59", "+7 (831) 222-15-94", "+7 (831) 222-59-85"],
  },
] as const

export default function DealersPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/15 via-background to-background min-h-[60vh] flex items-center">
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
        <div className="container mx-auto px-4 lg:px-8 pt-28 pb-20 relative z-10">
          <div className="max-w-4xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
              <Warehouse className="w-4 h-4" />
              {t("dealersPage.badge")}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary leading-tight">
              {t("dealersPage.title")}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("dealersPage.description")}
            </p>
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <MapPinned className="w-4 h-4" />
              {t("dealersPage.location")}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
            <div className="rounded-3xl border border-border bg-card p-8 shadow-sm space-y-6">
              <h2 className="text-3xl font-bold text-foreground">
                {t("dealersPage.sectionTitle")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("dealersPage.sectionDescription")}
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                {nizhnyPartners.map((partner) => (
                  <div key={partner.id} className="rounded-2xl border border-border/60 bg-background p-5 space-y-3">
                    <h3 className="text-lg font-semibold text-foreground">{t(`dealersPage.partners.${partner.id}`)}</h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      {partner.contacts.map((contact) => (
                        <p key={contact}>
                          <Link
                            href={contact.startsWith("http") ? contact : `mailto:${contact}`}
                            className="text-primary hover:underline"
                            target={contact.startsWith("http") ? "_blank" : undefined}
                            rel={contact.startsWith("http") ? "noopener noreferrer" : undefined}
                          >
                            {contact}
                          </Link>
                        </p>
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      {partner.phones.map((phone) => (
                        <p key={phone}>{phone}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm flex items-center justify-center">
              <img
                src="/images/dillerlogo.jpg"
                alt={t("dealersPage.logoAlt")}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

