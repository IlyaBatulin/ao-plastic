import { Footer } from "@/components/footer"
import Image from "next/image"
import { Zap, Settings, CheckCircle } from "lucide-react"

const features = [
  "Современное экструзионное оборудование",
  "Автоматизированный контроль качества",
  "Производство гранул различных размеров",
  "Высокая производительность",
  "Энергоэффективные технологии",
  "Соответствие международным стандартам",
]

export default function ExtrusionPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="pt-32 pb-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-5xl font-bold mb-8">Экструзия пластика</h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12">
              Современные технологии экструзии для производства высококачественных полимерных материалов
            </p>

            <div className="grid lg:grid-cols-2 gap-12 mb-12">
              <div>
                <h2 className="text-3xl font-semibold mb-6 flex items-center gap-3">
                  <Settings className="w-8 h-8 text-primary" />
                  Технология производства
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Наше предприятие оснащено современными экструзионными линиями, которые позволяют производить
                  полимерные материалы высочайшего качества. Процесс экструзии полностью автоматизирован и
                  контролируется на всех этапах.
                </p>
                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative h-96 rounded-2xl overflow-hidden">
                <Image src="/images/factory-2.jpg" alt="Экструзионное производство" fill className="object-cover" />
              </div>
            </div>

            <div className="bg-secondary/50 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                <Zap className="w-7 h-7 text-primary" />
                Преимущества нашего производства
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Высокая производительность</h3>
                  <p className="text-sm text-muted-foreground">До 50 000 тонн продукции в год</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Контроль качества</h3>
                  <p className="text-sm text-muted-foreground">Проверка на каждом этапе производства</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Гибкость</h3>
                  <p className="text-sm text-muted-foreground">Производство по индивидуальным спецификациям</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
