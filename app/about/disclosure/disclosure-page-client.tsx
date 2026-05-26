"use client"

import { Footer } from "@/components/footer"
import { BackgroundPaths } from "@/components/ui/background-paths"
import { FileText, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLocalizedContent } from "@/lib/use-localized-content"
import { disclosurePageContent } from "@/data/about-pages/disclosure"

export function DisclosurePageClient() {
  const page = useLocalizedContent(disclosurePageContent)

  return (
    <>
      <BackgroundPaths />
      <div className="min-h-screen bg-transparent">
        <section className="pt-32 pb-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="mb-16 text-center">
                <h1 className="text-5xl md:text-6xl font-bold mb-6 text-primary">{page.heroTitle}</h1>
                <p className="text-xl md:text-2xl text-foreground/70 leading-relaxed">{page.heroSubtitle}</p>
                <div className="mt-6 h-0.5 w-24 mx-auto bg-primary" />
              </div>

              <div className="space-y-4">
                {page.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="bg-card rounded-xl p-6 border border-border hover:shadow-lg hover:border-primary/30 transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{doc.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {doc.type} • {doc.size}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-primary/30 text-primary hover:bg-primary/10"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {page.download}
                    </Button>
                  </div>
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
