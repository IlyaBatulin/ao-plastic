import { Footer } from "@/components/footer"
import { Scale, Heart, Handshake, Shield } from "lucide-react"

const principles = [
  {
    icon: Scale,
    title: "Честность и прозрачность",
    description: "Мы ведем бизнес открыто и честно, соблюдая все законы и нормативные требования",
  },
  {
    icon: Heart,
    title: "Уважение к людям",
    description: "Мы ценим каждого сотрудника и создаем комфортные условия для работы и развития",
  },
  {
    icon: Handshake,
    title: "Партнерство",
    description: "Мы строим долгосрочные отношения с клиентами и поставщиками на основе взаимного доверия",
  },
  {
    icon: Shield,
    title: "Ответственность",
    description: "Мы несем ответственность за качество продукции и воздействие на окружающую среду",
  },
]

export default function EthicsPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="pt-32 pb-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-8">Кодекс корпоративной этики</h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12">
              Наш кодекс этики определяет принципы и стандарты поведения, которыми руководствуются все сотрудники
              компании
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {principles.map((principle, index) => (
                <div key={index} className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-all">
                  <principle.icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3">{principle.title}</h3>
                  <p className="text-muted-foreground">{principle.description}</p>
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
