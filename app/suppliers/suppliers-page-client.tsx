"use client"

import Link from "next/link"
import { Building2, ExternalLink, FileText, Mail, PackageSearch, Phone, ArrowRight } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

const ETP_TENDERS_LINK =
  "https://new.etpgpb.ru/procedures/?procedure[customers][10280]=" +
  encodeURIComponent('АО "ПЛАСТИК"') +
  "&procedure[stage][0]=accepting&procedure[stage][1]=commission&procedure[regions][0]=" +
  encodeURIComponent("Тульская область")

const tekSnabContact = {
  title: "ООО «ТЭК-СНАБ»",
  description: "Оперативные закупки сырья и вспомогательных материалов",
  phones: ["+7 (910) 704-63-75"],
  emails: ["info@tek-snab.ru"],
  address: "119361, г. Москва, муниципальный округ Очаково-Матвеевское вн.тер.г., ул. Лобачевского, д. 41, ПОМЕЩ. 6 ЭТАЖ 1 ОФИС 102Б",
}

export function SuppliersPageClient() {
  const { t } = useLanguage()

  // Шаги с ключами для переводов
  const steps = [
    {
      icon: <FileText className="w-6 h-6 text-primary" />,
      key: "step1",
    },
    {
      icon: <Mail className="w-6 h-6 text-primary" />,
      key: "step2",
    },
    {
      icon: <Phone className="w-6 h-6 text-primary" />,
      key: "step3",
    },
  ]
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/15 via-background to-background min-h-[50vh] flex items-center">
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
          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
              <PackageSearch className="w-4 h-4" />
              {t("suppliersPage.badge")}
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold text-primary leading-tight">
              {t("suppliersPage.title")}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              {t("suppliersPage.description")}
            </p>
          </div>
        </div>
      </section>

      {/* Contacts */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-baseline justify-between flex-wrap gap-6 mb-10">
            <div>
              <h2 className="text-3xl font-bold text-foreground">{t("suppliersPage.contacts.title")}</h2>
              <p className="mt-2 text-muted-foreground max-w-2xl">
                {t("suppliersPage.contacts.description")}
              </p>
            </div>
            <Link
              href="/contacts"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              {t("suppliersPage.contacts.fullContactsLink")}
              <Building2 className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Контактная информация */}
            <div className="rounded-3xl border border-border bg-card p-8 shadow-sm space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{tekSnabContact.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-2">{tekSnabContact.description}</p>
                </div>
              </div>
              
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    {t("suppliersPage.contacts.phone")}
                  </p>
                  {tekSnabContact.phones.map((phone) => (
                    <p key={phone} className="text-muted-foreground">{phone}</p>
                  ))}
                </div>
                
                <div>
                  <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    {t("suppliersPage.contacts.email")}
                  </p>
                  {tekSnabContact.emails.map((email) => (
                    <p key={email}>
                      <Link href={`mailto:${email}`} className="text-primary hover:underline">
                        {email}
                      </Link>
                    </p>
                  ))}
                </div>
                
                <div>
                  <p className="font-semibold text-foreground mb-2">{t("suppliersPage.contacts.address")}</p>
                  <p className="text-muted-foreground leading-relaxed">{tekSnabContact.address}</p>
                </div>
              </div>
            </div>

            {/* Яндекс карта */}
            <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="relative h-full min-h-[400px]">
                <iframe
                  src="https://yandex.ru/map-widget/v1/?ll=37.471380%2C55.689065&pt=37.471380%2C55.689065&z=16"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allowFullScreen={true}
                  title={t("suppliersPage.contacts.mapTitle")}
                  className="absolute inset-0 rounded-3xl"
                  style={{ minHeight: '400px' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Тендеры на ЭТП ГПБ */}
      <section className="py-20 bg-muted/30" id="etp-tenders">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-foreground">{t("suppliersPage.etpTenders.title")}</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                {t("suppliersPage.etpTenders.description")}
              </p>
            </div>
            <a
              href={ETP_TENDERS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:self-start lg:self-auto"
            >
              {t("suppliersPage.etpTenders.openOnEtp")}
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* How to become supplier */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">{t("suppliersPage.howToBecome.title")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("suppliersPage.howToBecome.subtitle")}
            </p>
          </div>
          
          <div className="relative">
            {/* Desktop: горизонтальный flow с стрелками */}
            <div className="hidden lg:flex items-center justify-between gap-4 relative">
              {steps.map((step, index) => (
                <div key={step.key} className="flex items-center gap-4 flex-1">
                  <div className="flex-1 h-full">
                    <div className="rounded-3xl border border-border bg-card p-8 shadow-sm space-y-6 hover:shadow-md transition-all duration-300 hover:border-primary/30 group h-full flex flex-col">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors mb-2">
                        {step.icon}
                      </div>
                      
                      <h3 className="text-xl font-bold text-foreground">{t(`suppliersPage.howToBecome.steps.${step.key}.title`)}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed flex-1">{t(`suppliersPage.howToBecome.steps.${step.key}.description`)}</p>
                    </div>
                  </div>
                  
                  {/* Стрелка между этапами (не показываем после последнего) */}
                  {index < steps.length - 1 && (
                    <div className="flex items-center justify-center px-2 flex-shrink-0">
                      <ArrowRight className="w-6 h-6 text-primary/60" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile/Tablet: вертикальный flow со стрелками */}
            <div className="lg:hidden space-y-6">
              {steps.map((step, index) => (
                <div key={step.key} className="relative">
                  <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4 hover:shadow-md transition-all duration-300 h-full flex flex-col">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        {step.icon}
                      </div>
                      <h3 className="text-lg font-bold text-foreground">{t(`suppliersPage.howToBecome.steps.${step.key}.title`)}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">{t(`suppliersPage.howToBecome.steps.${step.key}.description`)}</p>
                  </div>
                  
                  {/* Стрелка вниз между этапами (не показываем после последнего) */}
                  {index < steps.length - 1 && (
                    <div className="flex items-center justify-center py-2">
                      <ArrowRight className="w-6 h-6 text-primary/60 rotate-90" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
