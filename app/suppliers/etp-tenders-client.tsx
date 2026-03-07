"use client"

import { useState, useEffect } from "react"
import { ExternalLink, Gavel, Calendar, Building2, Loader2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface EtpTenderItem {
  title: string
  link: string
  pubDate: string
}

const ETP_LINK = "https://new.etpgpb.ru/procedures"

export function EtpTendersClient() {
  const { t } = useLanguage()
  const [items, setItems] = useState<EtpTenderItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTenders() {
      try {
        const res = await fetch("/api/etp-tenders")
        const data = await res.json()
        if (res.ok && Array.isArray(data.items)) {
          setItems(data.items)
        } else {
          setError(data.error ?? null)
        }
      } catch {
        setError("Не удалось загрузить тендеры")
      } finally {
        setIsLoading(false)
      }
    }
    fetchTenders()
  }, [])

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-border bg-card/80 p-10 sm:p-12 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary mb-4">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <p className="text-muted-foreground font-medium">{t("suppliersPage.etpTenders.loading")}</p>
        <p className="text-sm text-muted-foreground/80 mt-1">Электронная торговая площадка Газпромбанка</p>
      </div>
    )
  }

  if (error || items.length === 0) {
    return (
      <div className="rounded-3xl border border-border bg-gradient-to-b from-card to-card/80 p-10 sm:p-12 text-center shadow-sm">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-5">
          <Gavel className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">{t("suppliersPage.etpTenders.noTenders")}</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
          Актуальные закупки АО «Пластик» появятся здесь, когда будут опубликованы на площадке.
        </p>
        <a
          href={ETP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
        >
          {t("suppliersPage.etpTenders.openOnEtp")}
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Платформа и счётчик */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-2">
          <Building2 className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">ЭТП ГПБ</span>
          <span className="text-xs text-muted-foreground">
            {items.length} {items.length === 1 ? "процедура" : items.length < 5 ? "процедуры" : "процедур"}
          </span>
        </div>
        <a
          href={ETP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
        >
          Все процедуры на площадке
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Список тендеров */}
      <div className="grid gap-4 sm:gap-5">
        {items.map((item, idx) => (
          <article
            key={idx}
            className="group rounded-3xl border border-border bg-card/80 p-6 sm:p-7 shadow-sm hover:shadow-md hover:border-primary/25 transition-all duration-200"
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary/90 mb-3">
                  <Gavel className="w-4 h-4 flex-shrink-0" />
                  <span>Тендер на ЭТП ГПБ</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground leading-snug line-clamp-3 group-hover:text-primary/90 transition-colors">
                  {item.title}
                </h3>
                {item.pubDate && (
                  <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-muted/60 px-3 py-1.5 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <time dateTime={item.pubDate}>
                      {new Date(item.pubDate).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </time>
                  </div>
                )}
              </div>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm flex-shrink-0 w-full lg:w-auto"
              >
                Участвовать
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </article>
        ))}
      </div>

      <div className="pt-2 text-center">
        <a
          href={ETP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          Перейти на new.etpgpb.ru
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  )
}
