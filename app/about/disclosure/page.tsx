import type { Metadata } from "next"
import { Footer } from "@/components/footer"
import { BackgroundPaths } from "@/components/ui/background-paths"
import { FileText, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Раскрытие информации",
  description:
    "Раскрытие информации АО «Пластик»: годовые отчёты, финансовая отчётность, устав и документы для акционеров.",
  alternates: { canonical: "/about/disclosure" },
}

const documents = [
  { title: "Годовой отчет 2024", size: "2.5 MB", type: "PDF" },
  { title: "Финансовая отчетность 2024", size: "1.8 MB", type: "PDF" },
  { title: "Устав компании", size: "850 KB", type: "PDF" },
  { title: "Аудиторское заключение 2024", size: "1.2 MB", type: "PDF" },
]

export default function DisclosurePage() {
  return (
    <>
      <BackgroundPaths />
      <div className="min-h-screen bg-transparent">
        <section className="pt-32 pb-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="mb-16 text-center">
                <h1 className="text-5xl md:text-6xl font-bold mb-6 text-primary">
                  Раскрытие информации
                </h1>
                <p className="text-xl md:text-2xl text-foreground/70 leading-relaxed">
                  Документы и отчетность компании доступны для ознакомления
                </p>
                <div className="mt-6 h-0.5 w-24 mx-auto bg-primary" />
              </div>

              <div className="space-y-4">
                {documents.map((doc, index) => (
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
                      Скачать
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
