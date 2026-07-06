import type { Metadata } from "next"
import { Footer } from "@/components/footer"
import { Award, Download, Shield, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { pageOpenGraph } from "@/lib/seo/page-metadata"

export const metadata: Metadata = {
  title: "Сертификаты и стандарты",
  description:
    "Сертификаты качества АО «Пластик»: ISO 9001, ISO 14001, ГОСТ Р, ТР ТС. Подтверждение соответствия продукции и систем менеджмента.",
  alternates: { canonical: "/certificates" },
  openGraph: pageOpenGraph({
    title: "Сертификаты и стандарты",
    description:
      "Сертификаты качества АО «Пластик»: ISO 9001, ISO 14001, ГОСТ Р, ТР ТС. Подтверждение соответствия продукции и систем менеджмента.",
    path: "/certificates",
  }),
}

const certificates = [
  {
    title: "ISO 9001:2015",
    description: "Система менеджмента качества",
    year: "2023",
  },
  {
    title: "ISO 14001:2015",
    description: "Система экологического менеджмента",
    year: "2023",
  },
  {
    title: "ГОСТ Р",
    description: "Соответствие национальным стандартам",
    year: "2024",
  },
  {
    title: "ТР ТС",
    description: "Технический регламент Таможенного союза",
    year: "2024",
  },
]

const standards = [
  "ГОСТ 12.1.007-76 - Вредные вещества",
  "ГОСТ 15.309-98 - Испытания и приёмка продукции",
  "ГОСТ Р ИСО 9001-2015 - Системы менеджмента качества",
  "ГОСТ 12.3.002-2014 - Процессы производственные",
  "ТР ТС 019/2011 - Безопасность средств индивидуальной защиты",
  "ТР ТС 021/2011 - О безопасности пищевой продукции",
]

export default function CertificatesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-secondary to-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Award className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground">Сертификаты</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
            Наша продукция соответствует всем международным и национальным стандартам качества
          </p>
        </div>
      </section>

      {/* Certificates Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-10">Действующие сертификаты</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {certificates.map((cert, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 group text-center"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6 group-hover:bg-primary/20 transition-colors">
                  <Shield className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{cert.title}</h3>
                <p className="text-muted-foreground mb-4">{cert.description}</p>
                <span className="inline-block bg-secondary px-3 py-1 rounded-full text-sm font-medium text-foreground">
                  {cert.year}
                </span>
                <Button variant="ghost" className="w-full mt-4 group-hover:bg-primary/10">
                  <Download className="mr-2 w-4 h-4" />
                  Скачать
                </Button>
              </div>
            ))}
          </div>

          {/* Standards */}
          <div className="bg-secondary rounded-2xl p-8 lg:p-12">
            <h2 className="text-3xl font-bold text-foreground mb-8">Соответствие стандартам</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {standards.map((standard, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{standard}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quality Assurance */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-8">Гарантия качества</h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12">
              Мы гарантируем высочайшее качество нашей продукции благодаря строгому контролю на всех этапах производства
              и соответствию международным стандартам.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card rounded-2xl p-6">
                <div className="text-4xl font-bold text-primary mb-2">100%</div>
                <p className="text-muted-foreground">Контроль качества</p>
              </div>
              <div className="bg-card rounded-2xl p-6">
                <div className="text-4xl font-bold text-primary mb-2">50+</div>
                <p className="text-muted-foreground">Сертификатов</p>
              </div>
              <div className="bg-card rounded-2xl p-6">
                <div className="text-4xl font-bold text-primary mb-2">65+</div>
                <p className="text-muted-foreground">Лет опыта</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
