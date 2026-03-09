import { Footer } from "@/components/footer"
import { BackgroundPaths } from "@/components/ui/background-paths"
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
    <>
      <BackgroundPaths />
      <div className="min-h-screen bg-transparent">
        <section className="pt-32 pb-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="mb-16 text-center">
                <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[#1e3a8a] dark:text-[#3b82f6]">
                  Экструзия пластика
                </h1>
                <p className="text-xl md:text-2xl text-foreground/70 leading-relaxed">
                  Современные технологии экструзии для производства высококачественных полимерных материалов
                </p>
                <div className="mt-6 h-0.5 w-24 mx-auto bg-[#1e3a8a] dark:bg-[#3b82f6]" />
              </div>

              <div className="grid lg:grid-cols-2 gap-12 mb-12">
                <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
                  <h2 className="text-2xl font-bold mb-6 text-[#1e3a8a] dark:text-[#3b82f6] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1e3a8a]/10 dark:bg-[#3b82f6]/10 flex items-center justify-center">
                      <Settings className="w-5 h-5 text-[#1e3a8a] dark:text-[#3b82f6]" />
                    </div>
                    Технология производства
                  </h2>
                  <p className="text-foreground/90 leading-relaxed mb-6">
                    Наше предприятие оснащено современными экструзионными линиями, которые позволяют производить
                    полимерные материалы высочайшего качества. Процесс экструзии полностью автоматизирован и
                    контролируется на всех этапах.
                  </p>
                  <div className="space-y-3">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-[#1e3a8a] dark:text-[#3b82f6] flex-shrink-0" />
                        <span className="text-foreground/90">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative h-96 rounded-2xl overflow-hidden border border-border shadow-sm">
                  <Image src="/images/factory-2.jpg" alt="Экструзионное производство" fill className="object-cover" />
                </div>
              </div>

              <div className="bg-[#1e3a8a]/5 dark:bg-[#3b82f6]/10 rounded-2xl border border-border p-8">
                <h2 className="text-2xl font-bold mb-6 text-[#1e3a8a] dark:text-[#3b82f6] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1e3a8a]/20 dark:bg-[#3b82f6]/20 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-[#1e3a8a] dark:text-[#3b82f6]" />
                  </div>
                  Преимущества нашего производства
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-card rounded-xl p-6 border border-border">
                    <h3 className="font-semibold mb-2 text-[#1e3a8a] dark:text-[#3b82f6]">Высокая производительность</h3>
                    <p className="text-sm text-muted-foreground">До 50 000 тонн продукции в год</p>
                  </div>
                  <div className="bg-card rounded-xl p-6 border border-border">
                    <h3 className="font-semibold mb-2 text-[#1e3a8a] dark:text-[#3b82f6]">Контроль качества</h3>
                    <p className="text-sm text-muted-foreground">Проверка на каждом этапе производства</p>
                  </div>
                  <div className="bg-card rounded-xl p-6 border border-border">
                    <h3 className="font-semibold mb-2 text-[#1e3a8a] dark:text-[#3b82f6]">Гибкость</h3>
                    <p className="text-sm text-muted-foreground">Производство по индивидуальным спецификациям</p>
                  </div>
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
