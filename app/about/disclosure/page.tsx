import { Footer } from "@/components/footer"
import { FileText, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

const documents = [
  { title: "Годовой отчет 2024", size: "2.5 MB", type: "PDF" },
  { title: "Финансовая отчетность 2024", size: "1.8 MB", type: "PDF" },
  { title: "Устав компании", size: "850 KB", type: "PDF" },
  { title: "Аудиторское заключение 2024", size: "1.2 MB", type: "PDF" },
]

export default function DisclosurePage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="pt-32 pb-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-8">Раскрытие информации</h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12">
              Документы и отчетность компании доступны для ознакомления
            </p>

            <div className="space-y-4">
              {documents.map((doc, index) => (
                <div
                  key={index}
                  className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{doc.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {doc.type} • {doc.size}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
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
  )
}
