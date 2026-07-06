"use client"

import { useState } from "react"
import { Footer } from "@/components/footer"
import { BackgroundPaths } from "@/components/ui/background-paths"
import { FileText, Download, ChevronDown, FolderOpen } from "lucide-react"
import { useLocalizedContent } from "@/lib/use-localized-content"
import {
  disclosureHero,
  disclosureSections,
  type DisclosureDocument,
} from "@/data/about-pages/disclosure"

function formatSize(bytes?: number): string {
  if (!bytes || bytes <= 0) return ""
  const kb = bytes / 1024
  if (kb < 1024) return `${Math.max(1, Math.round(kb))} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

function DocumentRow({ doc, download }: { doc: DisclosureDocument; download: string }) {
  const meta = [doc.fileType, formatSize(doc.size)].filter(Boolean).join(" • ")
  return (
    <a
      href={doc.file}
      target="_blank"
      rel="noopener noreferrer"
      download
      className="group flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm sm:gap-4"
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
        <FileText className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-snug text-foreground break-words sm:text-base">
          {doc.title}
        </p>
        {meta ? <p className="mt-0.5 text-xs text-muted-foreground">{meta}</p> : null}
      </div>
      <span className="flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-primary/30 px-3 py-1.5 text-xs font-semibold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline">{download}</span>
      </span>
    </a>
  )
}

export function DisclosurePageClient() {
  const t = useLocalizedContent(disclosureHero)
  const [openKey, setOpenKey] = useState<string | null>(null)

  const toggle = (key: string) => setOpenKey((cur) => (cur === key ? null : key))

  return (
    <>
      <BackgroundPaths />
      <div className="min-h-screen bg-transparent">
        <section className="pt-32 pb-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mx-auto max-w-5xl">
              {/* Hero */}
              <div className="mb-12 text-center">
                <h1 className="mb-4 text-h1 text-primary">
                  {t.heroTitle}
                </h1>
                <p className="text-lg leading-relaxed text-foreground/70 sm:text-xl">
                  {t.heroSubtitle}
                </p>
                <div className="mx-auto mt-6 h-0.5 w-24 bg-primary" />
                <p className="mx-auto mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                  {t.note}
                </p>
              </div>

              {/* Sections */}
              <div className="space-y-10">
                {disclosureSections.map((section, sIdx) => (
                  <section key={sIdx} className="rounded-2xl border border-border bg-card/40 p-5 sm:p-7">
                    <h2 className="mb-5 flex items-start gap-3 text-xl font-bold text-foreground sm:text-2xl">
                      <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-sm text-primary-foreground">
                        {sIdx + 1}
                      </span>
                      <span className="break-words">{section.title}</span>
                    </h2>

                    {/* Документы верхнего уровня */}
                    {section.docs.length > 0 && (
                      <div className="mb-4 space-y-2.5">
                        {section.docs.map((doc, dIdx) => (
                          <DocumentRow key={dIdx} doc={doc} download={t.download} />
                        ))}
                      </div>
                    )}

                    {/* Подразделы (сворачиваемые) */}
                    {section.subsections.length > 0 && (
                      <div className="space-y-3">
                        {section.subsections.map((sub, subIdx) => {
                          const key = `${sIdx}-${subIdx}`
                          const isOpen = openKey === key
                          return (
                            <div
                              key={key}
                              className="overflow-hidden rounded-xl border border-border bg-background/50"
                            >
                              <button
                                type="button"
                                onClick={() => toggle(key)}
                                aria-expanded={isOpen}
                                className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-primary/5"
                              >
                                <FolderOpen className="h-5 w-5 flex-shrink-0 text-primary" />
                                <span className="min-w-0 flex-1 break-words text-sm font-semibold text-foreground sm:text-base">
                                  {sub.title}
                                </span>
                                <span className="flex-shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                  {sub.docs.length}
                                </span>
                                <ChevronDown
                                  className={`h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform duration-300 ${
                                    isOpen ? "rotate-180" : ""
                                  }`}
                                />
                              </button>
                              {isOpen && (
                                <div className="space-y-2.5 border-t border-border px-3 py-3 sm:px-4">
                                  {sub.docs.map((doc, dIdx) => (
                                    <DocumentRow key={dIdx} doc={doc} download={t.download} />
                                  ))}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </section>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}
