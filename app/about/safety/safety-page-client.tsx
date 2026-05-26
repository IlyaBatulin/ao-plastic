"use client"

import { Footer } from "@/components/footer"
import { BackgroundPaths } from "@/components/ui/background-paths"
import { Shield, Leaf, HardHat, FileText, Download } from "lucide-react"
import Link from "next/link"
import { useLocalizedContent } from "@/lib/use-localized-content"
import { safetyPageContent } from "@/data/about-pages/safety"

const cardIcons = [Shield, Leaf, HardHat] as const

export function SafetyPageClient() {
  const page = useLocalizedContent(safetyPageContent)

  return (
    <>
      <BackgroundPaths />
      <div className="min-h-screen bg-transparent">
        <section className="pt-32 pb-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="mb-16 text-center">
                <h1 className="text-6xl md:text-7xl font-bold mb-6 text-primary animate-in fade-in slide-in-from-bottom-4 duration-700">
                  {page.heroTitle}
                </h1>
                <p className="text-xl md:text-2xl text-foreground/70 leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
                  {page.heroSubtitle}
                </p>
                <div className="mt-6 h-0.5 w-24 mx-auto bg-primary animate-in fade-in duration-700 delay-300" />
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-16">
                {page.cards.map((card, index) => {
                  const Icon = cardIcons[index] ?? Shield
                  const gradient =
                    index === 1
                      ? "from-emerald-600 to-teal-500"
                      : index === 2
                        ? "from-amber-500 to-orange-500"
                        : "from-primary to-blue-600"
                  return (
                    <div key={card.title} className="bg-card rounded-xl p-6 text-center hover:shadow-lg transition-all">
                      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} mb-4`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                      <p className="text-muted-foreground text-sm">{card.description}</p>
                    </div>
                  )
                })}
              </div>

              <article className="bg-card rounded-2xl border border-border p-8 md:p-10 shadow-sm mb-16">
                <h2 className="text-2xl font-bold mb-6">{page.policyTitle}</h2>
                {page.policyIntro.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="text-muted-foreground leading-relaxed mb-6">
                    {paragraph}
                  </p>
                ))}

                <h3 className="text-xl font-semibold mb-4">{page.goalsTitle}</h3>
                <ul className="space-y-3 text-muted-foreground leading-relaxed mb-8 list-disc pl-6">
                  {page.goals.map((goal) => (
                    <li key={goal.slice(0, 40)}>{goal}</li>
                  ))}
                </ul>

                <h3 className="text-xl font-semibold mb-4">{page.commitmentsTitle}</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">{page.commitmentsIntro}</p>
                <ul className="space-y-3 text-muted-foreground leading-relaxed mb-8 list-disc pl-6">
                  {page.commitments.map((item) => (
                    <li key={item.slice(0, 40)}>{item}</li>
                  ))}
                </ul>

                <p className="text-muted-foreground leading-relaxed">{page.policyClosing}</p>
              </article>

              <div className="bg-muted/30 rounded-2xl border border-border p-8">
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <FileText className="w-7 h-7 text-primary" />
                  {page.documentsTitle}
                </h2>
                <p className="text-muted-foreground mb-6">{page.documentsIntro}</p>
                <ul className="space-y-4">
                  {page.documents.map((doc) => (
                    <li key={doc.href}>
                      <Link
                        href={doc.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 hover:bg-primary/5 hover:border-primary/30 transition-colors group"
                      >
                        <Download className="w-5 h-5 text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                        <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {doc.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}
