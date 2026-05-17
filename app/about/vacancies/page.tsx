import type { Metadata } from "next"
import { Footer } from "@/components/footer"
import { VacanciesSwitcher } from "./vacancies-switcher"
import { BackgroundPaths } from "@/components/ui/background-paths"

export const metadata: Metadata = {
  title: "Вакансии",
  description:
    "Вакансии АО «Пластик» в Узловой и регионах: работа на химическом производстве, инженерные и производственные специальности.",
  alternates: { canonical: "/about/vacancies" },
}

export default function VacanciesPage() {
  return (
    <>
      <BackgroundPaths />
      
      <div className="min-h-screen bg-transparent">
        <section className="pt-32 pb-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {/* Выделенный заголовок */}
              <div className="mb-16 text-center">
                <h1 className="text-6xl md:text-7xl font-bold mb-6 text-primary animate-in fade-in slide-in-from-bottom-4 duration-700">
                  Вакансии
                </h1>
                <p className="text-xl md:text-2xl text-foreground/70 leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
                  Присоединяйтесь к команде профессионалов
                </p>
                <div className="mt-6 h-0.5 w-24 mx-auto bg-primary animate-in fade-in duration-700 delay-300" />
              </div>

              <VacanciesSwitcher />
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}
