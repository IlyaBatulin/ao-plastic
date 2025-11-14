import { Footer } from "@/components/footer"
import { Shield, Leaf, HardHat } from "lucide-react"

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="pt-32 pb-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-8">Охрана труда и экология</h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12">
              АО 'Пластик' уделяет особое внимание безопасности труда и охране окружающей среды. Все производственные процессы соответствуют экологическим стандартам, а персонал регулярно проходит обучение по охране труда и промышленной безопасности.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card rounded-xl p-6 text-center hover:shadow-lg transition-all">
                <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Безопасность труда</h3>
                <p className="text-muted-foreground text-sm">Соблюдение всех норм охраны труда</p>
              </div>
              <div className="bg-card rounded-xl p-6 text-center hover:shadow-lg transition-all">
                <Leaf className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Экология</h3>
                <p className="text-muted-foreground text-sm">Минимизация воздействия на окружающую среду</p>
              </div>
              <div className="bg-card rounded-xl p-6 text-center hover:shadow-lg transition-all">
                <HardHat className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Обучение</h3>
                <p className="text-muted-foreground text-sm">Регулярное обучение персонала</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
