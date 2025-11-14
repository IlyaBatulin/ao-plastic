"use client"

import { useEffect } from "react"
import { Footer } from "@/components/footer"
import { Target, Leaf, TrendingUp, Users, Award, Shield } from "lucide-react"

const values = [
  {
    title: "Качество продукции",
    subtitle: "ISO 9001-2008 и ГОСТ ISO 9001:2011",
    icon: Award,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
  },
  {
    title: "Широкий ассортимент",
    subtitle: "6 марок вспенивающегося полистирола, АБС-пластики",
    icon: Target,
    color: "from-cyan-500 to-blue-600",
    bgColor: "bg-cyan-50",
    textColor: "text-cyan-600",
  },
  {
    title: "Доступные цены",
    subtitle: "Прямые поставки от производителя",
    icon: TrendingUp,
    color: "from-blue-600 to-indigo-500",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
  },
  {
    title: "Техническая поддержка",
    subtitle: "Полный комплекс услуг по работе с клиентом",
    icon: Shield,
    color: "from-indigo-500 to-blue-500",
    bgColor: "bg-indigo-50",
    textColor: "text-indigo-600",
  },
]

export default function MissionPage() {
  useEffect(() => {
    // Простая fade-in анимация при загрузке
    if (typeof window !== "undefined" && window.IntersectionObserver) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("opacity-100", "translate-y-0")
              entry.target.classList.remove("opacity-0", "translate-y-4")
            }
          })
        },
        { threshold: 0.1 }
      )

      const cards = document.querySelectorAll(".mission-card")
      cards.forEach((card) => observer.observe(card))

      return () => {
        cards.forEach((card) => observer.unobserve(card))
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <section className="pt-32 pb-24 bg-gradient-to-b from-blue-50/50 via-background to-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold mb-6 text-balance bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Миссия компании
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed text-pretty">
                Производить высококачественное полимерное сырье, отвечающее современным стандартам качества, обеспечивая инновационные решения для промышленности и способствуя устойчивому развитию отрасли.
              </p>
            </div>

            <div className="space-y-6">
              {values.map((value, index) => {
                const Icon = value.icon
                return (
                  <div
                    key={index}
                    data-index={index}
                    className={`mission-card ${value.bgColor} rounded-2xl p-8 border-2 border-white/50 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] opacity-0 translate-y-4`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start gap-6">
                      <div className={`flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-2xl font-bold mb-2 ${value.textColor}`}>{value.title}</h3>
                        <p className="text-muted-foreground font-medium mb-3">{value.subtitle}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Наша компания стремится к достижению высочайших стандартов в области производства пластиковых
                          изделий, обеспечивая качество и надежность на каждом этапе.
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
