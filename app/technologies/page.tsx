import { Footer } from "@/components/footer"
import { Beaker, Cog, Leaf, Shield } from "lucide-react"

const technologies = [
  {
    icon: Beaker,
    title: "Полимеризация",
    description:
      "Современные технологии суспензионной и эмульсионной полимеризации для производства высококачественных полимеров",
    features: ["Автоматизированный контроль", "Высокая чистота продукта", "Энергоэффективность"],
  },
  {
    icon: Cog,
    title: "Экструзия",
    description:
      "Высокоточное экструзионное оборудование для производства гранул и профилей с заданными характеристиками",
    features: ["Точность размеров", "Однородность продукта", "Высокая производительность"],
  },
  {
    icon: Shield,
    title: "Контроль качества",
    description:
      "Многоступенчатая система контроля качества на всех этапах производства с использованием современного оборудования",
    features: ["Лабораторные испытания", "Сертификация продукции", "Соответствие ГОСТ и ISO"],
  },
  {
    icon: Leaf,
    title: "Экологичность",
    description:
      "Внедрение экологически чистых технологий и систем очистки для минимизации воздействия на окружающую среду",
    features: ["Очистка выбросов", "Переработка отходов", "Энергосбережение"],
  },
]

const timeline = [
  {
    year: "1959",
    title: "Основание завода",
    description: "Начало производства полистирола",
  },
  {
    year: "1975",
    title: "Модернизация",
    description: "Внедрение новых технологий полимеризации",
  },
  {
    year: "1990",
    title: "Расширение",
    description: "Запуск производства АБС-пластиков",
  },
  {
    year: "2005",
    title: "Автоматизация",
    description: "Внедрение автоматизированных систем управления",
  },
  {
    year: "2015",
    title: "Сертификация",
    description: "Получение сертификата ISO 9001",
  },
  {
    year: "2024",
    title: "Инновации",
    description: "Внедрение экологичных технологий",
  },
]

export default function TechnologiesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/images/factory-1.jpg" alt="Технологии" className="w-full h-full object-cover" loading="eager" fetchPriority="high" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
        </div>

        <div className="relative z-10 container mx-auto px-4 lg:px-8">
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 text-balance">Технологии производства</h1>
          <p className="text-xl text-white/90 max-w-3xl leading-relaxed">
            Современное оборудование и передовые технологии для производства высококачественных пластиков
          </p>
        </div>
      </section>

      {/* Technologies Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {technologies.map((tech, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6 group-hover:bg-primary/20 transition-colors">
                  <tech.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">{tech.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">{tech.description}</p>
                <ul className="space-y-2">
                  {tech.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-16 text-center">
            История технологического развития
          </h2>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div key={index} className="flex gap-8 group">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold group-hover:scale-110 transition-transform">
                      {item.year}
                    </div>
                    {index < timeline.length - 1 && <div className="w-0.5 flex-1 bg-border mt-4" />}
                  </div>
                  <div className="flex-1 pb-8">
                    <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Production Process */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-16 text-center">Процесс производства</h2>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="relative h-64 lg:h-96 rounded-2xl overflow-hidden">
              <img src="/images/factory-1.jpg" alt="Этап 1" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <div>
                  <div className="text-4xl font-bold text-white mb-2">01</div>
                  <h3 className="text-xl font-semibold text-white">Подготовка сырья</h3>
                </div>
              </div>
            </div>

            <div className="relative h-64 lg:h-96 rounded-2xl overflow-hidden">
              <img src="/images/factory-2.jpg" alt="Этап 2" className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <div>
                  <div className="text-4xl font-bold text-white mb-2">02</div>
                  <h3 className="text-xl font-semibold text-white">Полимеризация</h3>
                </div>
              </div>
            </div>

            <div className="relative h-64 lg:h-96 rounded-2xl overflow-hidden">
              <img src="/images/factory-3.jpg" alt="Этап 3" className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <div>
                  <div className="text-4xl font-bold text-white mb-2">03</div>
                  <h3 className="text-xl font-semibold text-white">Контроль качества</h3>
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
