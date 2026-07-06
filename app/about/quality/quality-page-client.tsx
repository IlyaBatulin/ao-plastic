"use client"

import { Footer } from "@/components/footer"
import { Award, CheckCircle, FileCheck, FlaskConical, Shield, Download, FileText } from "lucide-react"
import Link from "next/link"
import { BackgroundPaths } from "@/components/ui/background-paths"
import { CertificatesCarousel } from "./certificates-carousel"
import { useLocalizedContent } from "@/lib/use-localized-content"
import { qualityPageContent } from "@/data/about-pages/quality"

const stepIcons = [FileCheck, FlaskConical, Shield, Award] as const

export function QualityPageClient() {
  const page = useLocalizedContent(qualityPageContent)

  return (
    <>
      <BackgroundPaths />
      <div className="min-h-screen bg-transparent">
        <section className="pt-32 pb-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto mb-16 text-center">
              <h1 className="text-h1 mb-6 text-primary break-words animate-in fade-in slide-in-from-bottom-4 duration-700">
                {page.heroTitle}
              </h1>
              <p className="text-xl md:text-2xl text-foreground/70 leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
                {page.heroSubtitle}
              </p>
              <div className="mt-6 h-0.5 w-24 mx-auto bg-primary animate-in fade-in duration-700 delay-300" />
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <article className="bg-card rounded-2xl border border-border p-8 md:p-10 shadow-sm mb-16 text-lg md:text-xl">
                <h2 className="text-h2 mb-6 text-center text-foreground">{page.qmsTitle}</h2>
                {page.qmsParagraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="text-muted-foreground leading-relaxed mb-6 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </article>

              <h2 className="text-h2 mb-8 text-center text-foreground">{page.principlesTitle}</h2>
              <div className="grid md:grid-cols-2 gap-6 mb-16">
                {page.principles.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 bg-card rounded-xl p-6 border border-border hover:shadow-md transition-all"
                  >
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-blue-600 dark:to-[#60a5fa] flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
                      <CheckCircle className="w-6 h-6 text-white flex-shrink-0" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <h2 className="text-h2 mb-8 text-center text-foreground">{page.stepsTitle}</h2>
              <div className="grid md:grid-cols-2 gap-6 mb-16">
                {page.qualitySteps.map((step, index) => {
                  const Icon = stepIcons[index] ?? FileCheck
                  return (
                    <div key={step.title} className="bg-secondary/50 rounded-xl p-6 flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-h2 mb-4 flex items-center justify-center gap-3 text-center text-foreground">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-blue-600 dark:to-[#60a5fa] flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
                  <Award className="w-7 h-7 text-white" />
                </div>
                {page.certificatesTitle}
              </h2>
              <p className="text-muted-foreground mb-10">{page.certificatesIntro}</p>

              <div className="mb-12 px-2 md:px-12">
                <CertificatesCarousel certificates={page.certificates} />
              </div>

              <div className="bg-muted/30 rounded-2xl border border-border p-6 mb-10">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 flex items-center justify-center gap-2 text-center text-foreground">
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                  </div>
                  {page.additionalDocsTitle}
                </h3>
                <ul className="space-y-3">
                  {page.docLinks.map((doc) => (
                    <li key={doc.href}>
                      <Link
                        href={doc.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 hover:bg-primary/5 hover:border-primary/30 transition-colors group"
                      >
                        <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-muted/80 transition-colors">
                          <Download className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {doc.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-card rounded-2xl border border-border p-8">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 flex items-center justify-center gap-2 text-center text-foreground">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-muted-foreground" />
                  </div>
                  {page.standardsTitle}
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {page.standardsList.map((standard) => (
                    <div key={standard} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                      <span className="text-muted-foreground">{standard}</span>
                    </div>
                  ))}
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
