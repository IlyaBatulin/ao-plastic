import { Footer } from "@/components/footer"
import { VacanciesClient } from "./vacancies-client"

export default function VacanciesPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="pt-32 pb-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-8">Вакансии</h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12">
              Присоединяйтесь к команде профессионалов
            </p>

            <VacanciesClient />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
