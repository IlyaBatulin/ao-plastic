"use client"

import { useState } from "react"
import { Footer } from "@/components/footer"
import { BackgroundPaths } from "@/components/ui/background-paths"
import { Shield, Leaf, HardHat, FileText, Download, ChevronDown } from "lucide-react"
import { useLocalizedContent } from "@/lib/use-localized-content"
import {
  safetyPageContent,
  safetyDocumentSections,
  type SafetyDocument,
} from "@/data/about-pages/safety"

const cardIcons = [Shield, Leaf, HardHat] as const

function formatSize(bytes?: number): string {
  if (!bytes || bytes <= 0) return ""
  const kb = bytes / 1024
  if (kb < 1024) return `${Math.max(1, Math.round(kb))} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

function DocumentRow({ doc, download }: { doc: SafetyDocument; download: string }) {
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

export function SafetyPageClient() {
  const page = useLocalizedContent(safetyPageContent)
  const [openKey, setOpenKey] = useState<string | null>("1")

  const toggle = (key: string) => setOpenKey((cur) => (cur === key ? null : key))

  return (
    <>
      <BackgroundPaths />
      <div className="min-h-screen bg-transparent">
        <section className="pt-32 pb-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mx-auto max-w-5xl">
              <div className="mb-16 text-center">
                <h1 className="mb-6 animate-in text-h1 text-primary fade-in slide-in-from-bottom-4 duration-700 break-words">
                  {page.heroTitle}
                </h1>
                <p className="animate-in text-xl leading-relaxed text-foreground/70 fade-in slide-in-from-bottom-5 duration-700 delay-200 md:text-2xl">
                  {page.heroSubtitle}
                </p>
                <div className="mx-auto mt-6 h-0.5 w-24 animate-in bg-primary fade-in duration-700 delay-300" />
              </div>

              <div className="mb-16 grid gap-6 md:grid-cols-3">
                {page.cards.map((card, index) => {
                  const Icon = cardIcons[index] ?? Shield
                  const gradient =
                    index === 1
                      ? "from-emerald-600 to-teal-500"
                      : index === 2
                        ? "from-amber-500 to-orange-500"
                        : "from-primary to-blue-600"
                  return (
                    <div key={card.title} className="rounded-xl bg-card p-6 text-center transition-all hover:shadow-lg">
                      <div
                        className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${gradient}`}
                      >
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <h3 className="mb-2 text-lg font-semibold">{card.title}</h3>
                      <p className="text-sm text-muted-foreground">{card.description}</p>
                    </div>
                  )
                })}
              </div>

              <article className="mb-16 rounded-2xl border border-border bg-card p-8 shadow-sm md:p-10">
                <h2 className="mb-6 text-2xl font-bold">{page.policyTitle}</h2>
                {page.policyIntro.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="mb-6 leading-relaxed text-muted-foreground">
                    {paragraph}
                  </p>
                ))}

                <h3 className="mb-4 text-xl font-semibold">{page.goalsTitle}</h3>
                <ul className="mb-8 list-disc space-y-3 pl-6 leading-relaxed text-muted-foreground">
                  {page.goals.map((goal) => (
                    <li key={goal.slice(0, 40)}>{goal}</li>
                  ))}
                </ul>

                <h3 className="mb-4 text-xl font-semibold">{page.commitmentsTitle}</h3>
                <p className="mb-4 leading-relaxed text-muted-foreground">{page.commitmentsIntro}</p>
                <ul className="mb-8 list-disc space-y-3 pl-6 leading-relaxed text-muted-foreground">
                  {page.commitments.map((item) => (
                    <li key={item.slice(0, 40)}>{item}</li>
                  ))}
                </ul>

                <p className="leading-relaxed text-muted-foreground">{page.policyClosing}</p>
              </article>

              <div className="rounded-2xl border border-border bg-muted/30 p-6 sm:p-8">
                <h2 className="mb-2 flex items-center gap-2 text-2xl font-bold">
                  <FileText className="h-7 w-7 text-primary" />
                  {page.documentsTitle}
                </h2>
                <p className="mb-8 text-muted-foreground">{page.documentsIntro}</p>

                <div className="space-y-4">
                  {safetyDocumentSections.map((section, sIdx) => {
                    const key = String(sIdx)
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
                          className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-primary/5 sm:px-5"
                        >
                          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-sm text-primary-foreground">
                            {sIdx + 1}
                          </span>
                          <span className="min-w-0 flex-1 break-words text-sm font-semibold text-foreground sm:text-base">
                            {section.title}
                          </span>
                          <span className="flex-shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            {section.docs.length}
                          </span>
                          <ChevronDown
                            className={`h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform duration-300 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="space-y-2.5 border-t border-border px-3 py-4 sm:px-4">
                            {section.intro ? (
                              <p className="mb-1 px-1 text-sm italic text-muted-foreground">{section.intro}</p>
                            ) : null}
                            {section.docs.map((doc, dIdx) => (
                              <DocumentRow key={dIdx} doc={doc} download={page.download} />
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}
