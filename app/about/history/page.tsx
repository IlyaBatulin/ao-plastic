import { Footer } from "@/components/footer"

const milestones = [
  { year: "1959", event: "Основание предприятия АО 'Пластик' в г. Узловая Тульской области" },
  { year: "1970", event: "Запуск производства суспензионных полистиролов" },
  { year: "1985", event: "Расширение производства АБС-пластиков" },
  { year: "2000", event: "Модернизация производственных линий" },
  { year: "2008", event: "Получение сертификата ISO 9001-2008" },
  { year: "2011", event: "Сертификация по ГОСТ ISO 9001:2011" },
  { year: "2015", event: "Запуск производства вспенивающегося полистирола шести марок" },
  { year: "2020", event: "Внедрение новых технологий экструзии и литья АБС-пластиков" },
  { year: "2024", event: "Лидер химической индустрии России в сегменте АБС-пластиков" },
]

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="pt-32 pb-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-12">История компании</h1>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary/20" />

              {/* Timeline items */}
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div key={index} className="relative pl-20 group">
                    {/* Timeline dot */}
                    <div className="absolute left-6 top-2 w-5 h-5 rounded-full bg-primary border-4 border-background group-hover:scale-125 transition-transform" />

                    <div className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-all">
                      <span className="text-2xl font-bold text-primary">{milestone.year}</span>
                      <p className="text-lg text-foreground mt-2">{milestone.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
