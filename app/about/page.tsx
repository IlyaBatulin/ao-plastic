import type { Metadata } from "next"
import { Footer } from "@/components/footer"
import { DeliveryMap } from "@/sections/delivery-map"
import { StatsCounter } from "@/components/stats-counter"
import { Award, Target, Users, Zap } from "lucide-react"

export const metadata: Metadata = {
  title: "О компании",
  description:
    "АО «Пластик» с 1959 года: история завода в Узловой, масштабы производства полимеров и пластмасс, ценности компании, география поставок АБС, полистирола и изделий по России и на экспорт.",
  alternates: { canonical: "/about" },
}

const values = [
  {
    icon: Target,
    title: "Качество",
    description: "Строгий контроль на всех этапах производства",
  },
  {
    icon: Zap,
    title: "Инновации",
    description: "Внедрение передовых технологий",
  },
  {
    icon: Users,
    title: "Команда",
    description: "Профессиональные специалисты",
  },
  {
    icon: Award,
    title: "Надёжность",
    description: "Более 65 лет на рынке",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[min(62vh,720px)] overflow-hidden flex flex-col justify-end pt-32 pb-16 md:pb-20 lg:pb-24">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/about-hero-production-winter.png"
            alt="Производственные колонны АО «Пластик», зима"
            className="w-full h-full object-cover object-center scale-[1.02]"
            loading="eager"
            fetchPriority="high"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/45 to-black/70"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30"
            aria-hidden
          />
        </div>

        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 z-[1] h-28 sm:h-36 bg-gradient-to-t from-secondary to-transparent"
          aria-hidden
        />

        <div className="relative z-10 container mx-auto px-4 lg:px-8 max-w-5xl">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.28em] text-white/80 mb-4 drop-shadow-md">
            АО «Пластик» · с 1959 года
          </p>
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white text-balance leading-[1.05] tracking-tight mb-6 [text-shadow:0_2px_40px_rgba(0,0,0,0.45)]"
          >
            О компании
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/95 max-w-3xl leading-relaxed font-medium [text-shadow:0_1px_24px_rgba(0,0,0,0.4)]">
            Создаём будущее пластиковой индустрии — от Узловой в Россию и на экспорт
          </p>
          <div
            className="mt-10 h-1 w-20 rounded-full bg-gradient-to-r from-primary to-white/50"
            aria-hidden
          />
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <StatsCounter end={1959} prefix="" />
              <p className="text-muted-foreground mt-2">Год основания</p>
            </div>
            <div className="text-center">
              <StatsCounter end={1000} suffix="+" />
              <p className="text-muted-foreground mt-2">Сотрудников</p>
            </div>
            <div className="text-center">
              <StatsCounter end={1000} suffix="+" />
              <p className="text-muted-foreground mt-2">Довольных клиентов</p>
            </div>
            <div className="text-center">
              <StatsCounter end={150} suffix="+ тыс. тонн" />
              <p className="text-muted-foreground mt-2">Продукции в год</p>
            </div>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-balance text-[#1e3a8a] dark:text-[#3b82f6]">Наша история</h2>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground">АО «Пластик»</strong> было основано в 1959 году в г. Узловая
                  Тульской области. За более чем 65 лет работы мы прошли путь от небольшого завода до лидера химической
                  индустрии России в сегменте АБС-пластиков.
                </p>
                <p>
                  Наше предприятие непрерывно развивается, осваивая новые направления и постоянно модернизируясь.
                  Сегодня мы производим вспенивающийся полистирол шести марок, экструзионные и литьевые марки
                  АБС-пластиков, а также различные изделия из пластмасс.
                </p>
                <p>
                  Наша продукция поставляется по всей России и экспортируется в страны ближнего и дальнего зарубежья,
                  используется в автомобилестроении, электронике, строительстве и других отраслях промышленности.
                  Производство и оптовый склад находятся в 200 км от Москвы, вблизи трассы М4, с собственными
                  подъездными путями к ж/д узлу Узловая2.
                </p>
              </div>
            </div>

            <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden">
              <img src="/images/factory-3.jpg" alt="История компании" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-bold mb-16 text-center text-balance text-[#1e3a8a] dark:text-[#3b82f6]">Наши ценности</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-card rounded-2xl p-8 text-center group hover:shadow-xl transition-all">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6 group-hover:bg-primary/20 transition-colors">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-balance text-[#1e3a8a] dark:text-[#3b82f6]">Наша миссия</h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Производить высококачественное полимерное сырье, отвечающее современным стандартам качества, обеспечивая
              инновационные решения для промышленности и способствуя устойчивому развитию отрасли.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="bg-card rounded-2xl p-6 border-2 border-primary/10">
                <h3 className="text-2xl font-bold text-primary mb-2">Качество</h3>
                <p className="text-muted-foreground">ISO 9001-2008 и ГОСТ ISO 9001:2011</p>
              </div>
              <div className="bg-card rounded-2xl p-6 border-2 border-primary/10">
                <h3 className="text-2xl font-bold text-primary mb-2">Ассортимент</h3>
                <p className="text-muted-foreground">6 марок полистирола, АБС-пластики</p>
              </div>
              <div className="bg-card rounded-2xl p-6 border-2 border-primary/10">
                <h3 className="text-2xl font-bold text-primary mb-2">Логистика</h3>
                <p className="text-muted-foreground">200 км от Москвы, М4, ж/д узел</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* География поставок */}
      <DeliveryMap />

      <Footer />
    </div>
  )
}
