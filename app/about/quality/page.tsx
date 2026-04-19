import type { Metadata } from "next"
import { Footer } from "@/components/footer"
import { Award, CheckCircle, FileCheck, FlaskConical, Shield, Download, FileText } from "lucide-react"
import Link from "next/link"
import { BackgroundPaths } from "@/components/ui/background-paths"
import { CertificatesCarousel } from "./certificates-carousel"

export const metadata: Metadata = {
  title: "Политика качества",
  description:
    "Система менеджмента качества АО «Пластик»: политика, принципы ISO, лабораторный контроль АБС и полистирола, сертификаты.",
  alternates: { canonical: "/about/quality" },
}

const principles = [
  {
    title: "Ориентация на потребителя",
    description: "Понимание и выполнение требований заказчика, постоянное повышение его удовлетворённости.",
  },
  {
    title: "Лидерство руководства",
    description: "Руководство обеспечивает единство целей, создаёт условия для вовлечения сотрудников в достижение целей качества.",
  },
  {
    title: "Процессный подход",
    description: "Управление деятельностью и соответствующими ресурсами как процессами для повышения результативности.",
  },
  {
    title: "Постоянное улучшение",
    description: "Непрерывное совершенствование системы менеджмента качества и производственных процессов.",
  },
]

const qualitySteps = [
  {
    icon: FileCheck,
    title: "Входной контроль сырья",
    description: "Проверка поступающего сырья по физико-химическим показателям в аккредитованной лаборатории.",
  },
  {
    icon: FlaskConical,
    title: "Контроль в процессе производства",
    description: "Операционный контроль параметров технологических процессов и промежуточная оценка качества.",
  },
  {
    icon: Shield,
    title: "Приёмочные испытания",
    description: "Испытания готовой продукции на соответствие ГОСТ, ТУ и требованиям заказчиков.",
  },
  {
    icon: Award,
    title: "Внешние аудиты",
    description: "Регулярные аудиты органами по сертификации для подтверждения соответствия ISO и ГОСТ.",
  },
]

const certificates = [
  {
    href: "/docs/quality/sertifikat-SMK-2026.jpg",
    image: "/docs/quality/sertifikat-SMK-2026.jpg",
    title: "Сертификат системы менеджмента качества (СМК)",
    description: "Соответствие ISO 9001, действителен до 2026 г.",
  },
  {
    href: "/docs/quality/ISO_2020.jpg",
    image: "/docs/quality/ISO_2020.jpg",
    title: "Сертификат соответствия ISO 9001",
    description: "Система менеджмента качества (2020).",
  },
  {
    href: "/docs/quality/СВИДЕТЕЛЬСТВО.jpg",
    image: "/docs/quality/СВИДЕТЕЛЬСТВО.jpg",
    title: "Свидетельство о соответствии",
    description: "Подтверждение соответствия продукции установленным требованиям.",
  },
  {
    href: "/docs/quality/Диплом_АБС.jpg",
    image: "/docs/quality/Диплом_АБС.jpg",
    title: "Диплом в области АБС-пластиков",
    description: "Признание достижений в производстве и качестве АБС-пластиков.",
  },
  {
    href: "/docs/quality/Kaski1.jpg",
    image: "/docs/quality/Kaski1.jpg",
    title: "Сертификат на продукцию (СИЗ)",
    description: "Соответствие средств индивидуальной защиты требованиям безопасности.",
  },
]

const docLinks = [
  {
    href: "/docs/Sertifikat-GOST-R-ISO-14001-2016_2023.pdf",
    label: "Сертификат системы экологического менеджмента ГОСТ Р ИСО 14001-2016 (2023)",
  },
]

const standardsList = [
  "ISO 9001-2008 — Системы менеджмента качества",
  "ГОСТ ISO 9001:2011 — Системы менеджмента качества (национальный стандарт)",
  "ISO 14001:2015 — Системы экологического менеджмента",
  "Сертификаты соответствия ГОСТ на продукцию",
]

export default function QualityPage() {
  return (
    <>
      <BackgroundPaths />
      <div className="min-h-screen bg-transparent">
        {/* Hero — выделенный заголовок как на вакансиях */}
        <section className="pt-32 pb-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto mb-16 text-center">
              <h1 className="text-6xl md:text-7xl font-bold mb-6 text-[#1e3a8a] dark:text-[#3b82f6] animate-in fade-in slide-in-from-bottom-4 duration-700">
                Менеджмент качества и сертификация
              </h1>
              <p className="text-xl md:text-2xl text-foreground/70 leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
                Системы качества и соответствие международным стандартам
              </p>
              <div className="mt-6 h-0.5 w-24 mx-auto bg-[#1e3a8a] dark:bg-[#3b82f6] animate-in fade-in duration-700 delay-300" />
            </div>
          </div>
        </section>

      {/* Подробное описание СМК */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <article className="bg-card rounded-2xl border border-border p-8 md:p-10 shadow-sm mb-16 text-lg md:text-xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-foreground">Система менеджмента качества (СМК)</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                На нашем заводе действует система менеджмента качества, сертифицированная на соответствие ISO 9001-2008 и ГОСТ ISO 9001:2011. Компания регулярно проходит аудиты и подтверждает соответствие продукции всем необходимым стандартам. Основа качества изделий из полимерных материалов — сырьё, используемое для их изготовления, и его свойства.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                АО «Пластик» внедрило и поддерживает систему менеджмента качества в соответствии с международными и национальными стандартами. Это позволяет гарантировать стабильное качество стирола, полистирола, АБС-пластиков и готовых изделий, а также повышать удовлетворённость потребителей и эффективность процессов.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                В основе СМК лежит цикл «Планирование — Выполнение — Проверка — Действие» (PDCA): мы планируем процессы и цели в области качества, выполняем их с контролем, проводим внутренние и внешние аудиты и корректирующие действия, после чего совершенствуем систему.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Политика в области качества является частью общей стратегии компании и доводится до всех сотрудников; за её реализацию отвечает руководство и уполномоченные по качеству.
              </p>
            </article>

            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-foreground">Принципы менеджмента качества</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-16">
              {principles.map((item, index) => (
                <div key={index} className="flex items-start gap-3 bg-card rounded-xl p-6 border border-border hover:shadow-md transition-all">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] dark:from-[#2563eb] dark:to-[#60a5fa] flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
                    <CheckCircle className="w-6 h-6 text-white flex-shrink-0" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-foreground">Как мы обеспечиваем качество</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-16">
              {qualitySteps.map((step, index) => (
                <div key={index} className="bg-secondary/50 rounded-xl p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                    <step.icon className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Сертификаты — галерея с подписями */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3 text-center text-foreground">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] dark:from-[#2563eb] dark:to-[#60a5fa] flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
                <Award className="w-7 h-7 text-white" />
              </div>
              Наши сертификаты
            </h2>
            <p className="text-muted-foreground mb-10">
              Документы, подтверждающие соответствие системы менеджмента качества и экологического менеджмента международным и национальным стандартам. Нажмите на документ для просмотра или скачивания.
            </p>

            <div className="mb-12 px-2 md:px-12">
              <CertificatesCarousel certificates={certificates} />
            </div>

            <div className="bg-muted/30 rounded-2xl border border-border p-6 mb-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 flex items-center justify-center gap-2 text-center text-foreground">
                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                </div>
                Дополнительные документы
              </h3>
              <ul className="space-y-3">
                {docLinks.map((doc, index) => (
                  <li key={index}>
                    <Link
                      href={doc.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 hover:bg-primary/5 hover:border-primary/30 transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-muted/80 transition-colors">
                        <Download className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {doc.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card rounded-2xl border border-border p-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 flex items-center justify-center gap-2 text-center text-foreground">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-muted-foreground" />
                </div>
                Соответствие стандартам
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {standardsList.map((standard, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <span className="text-muted-foreground">{standard}</span>
                  </div>
                ))}
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
