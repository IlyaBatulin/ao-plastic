import { Footer } from "@/components/footer"
import { Award, CheckCircle } from "lucide-react"

const certificates = ["ISO 9001-2008", "ГОСТ ISO 9001:2011", "ISO 14001:2015", "Сертификаты соответствия ГОСТ"]

export default function QualityPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="pt-32 pb-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-8">Менеджмент качества и сертификация</h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12">
              На нашем заводе действует система менеджмента качества, сертифицированная на предмет соответствия ISO 9001-2008 и ГОСТ ISO 9001:2011. Компания регулярно проходит аудиты и подтверждает соответствие продукции всем необходимым стандартам качества. Основа качества изделий из полимерных материалов – сырье, используемое для их изготовления, и его свойства.
            </p>

            <div className="bg-secondary/50 rounded-2xl p-8 mb-12">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                <Award className="w-8 h-8 text-primary" />
                Наши сертификаты
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {certificates.map((cert, index) => (
                  <div key={index} className="flex items-center gap-3 bg-background rounded-lg p-4">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="font-medium">{cert}</span>
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
