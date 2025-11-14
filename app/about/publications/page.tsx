import { Footer } from "@/components/footer"
import { FileText, Calendar } from "lucide-react"

const publications = [
  {
    title: "Инновации в производстве АБС-пластиков",
    date: "2025-09-15",
    journal: "Журнал 'Пластмассы'",
    description: "Статья о новых технологиях производства ударопрочных АБС-пластиков",
  },
  {
    title: "Экологические аспекты переработки полистирола",
    date: "2025-08-20",
    journal: "Экология производства",
    description: "Исследование методов переработки и утилизации полистирольных отходов",
  },
  {
    title: "Применение стирол-акриловых дисперсий в строительстве",
    date: "2025-07-10",
    journal: "Строительные материалы",
    description: "Обзор применения дисперсий в производстве лакокрасочных материалов",
  },
]

export default function PublicationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="pt-32 pb-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-12">Публикации</h1>

            <div className="space-y-6">
              {publications.map((pub, index) => (
                <div key={index} className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{pub.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(pub.date).toLocaleDateString("ru-RU")}
                        </span>
                        <span>{pub.journal}</span>
                      </div>
                      <p className="text-muted-foreground">{pub.description}</p>
                    </div>
                  </div>
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
