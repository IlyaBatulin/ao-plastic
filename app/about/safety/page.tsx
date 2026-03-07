import { Footer } from "@/components/footer"
import { BackgroundPaths } from "@/components/ui/background-paths"
import { Shield, Leaf, HardHat, FileText, Download } from "lucide-react"
import Link from "next/link"

const documents = [
  {
    href: "/docs/Sertifikat-GOST-R-ISO-14001-2016_2023.pdf",
    label: "Сертификат системы экологического менеджмента ГОСТ Р ИСО 14001-2016 (2023)",
  },
  {
    href: "/docs/quality/sertifikat-SMK-2026.jpg",
    label: "Сертификат системы менеджмента качества (действителен до 2026 г.)",
  },
  {
    href: "/docs/quality/ISO_2020.jpg",
    label: "Сертификат соответствия ISO (2020)",
  },
]

export default function SafetyPage() {
  return (
    <>
      <BackgroundPaths />
      <div className="min-h-screen bg-transparent">
        <section className="pt-32 pb-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Выделенный заголовок */}
            <div className="mb-16 text-center">
              <h1 className="text-6xl md:text-7xl font-bold mb-6 text-[#1e3a8a] dark:text-[#3b82f6] animate-in fade-in slide-in-from-bottom-4 duration-700">
                Охрана труда и экология
              </h1>
              <p className="text-xl md:text-2xl text-foreground/70 leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
                АО «Пластик» считает экологическую безопасность, охрану здоровья человека и окружающей среды неотъемлемой частью своей деятельности и одним из приоритетов.
              </p>
              <div className="mt-6 h-0.5 w-24 mx-auto bg-[#1e3a8a] dark:bg-[#3b82f6] animate-in fade-in duration-700 delay-300" />
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-16">
              <div className="bg-card rounded-xl p-6 text-center hover:shadow-lg transition-all">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] mb-4">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Безопасность труда</h3>
                <p className="text-muted-foreground text-sm">Соблюдение всех норм охраны труда</p>
              </div>
              <div className="bg-card rounded-xl p-6 text-center hover:shadow-lg transition-all">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-500 mb-4">
                  <Leaf className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Экология</h3>
                <p className="text-muted-foreground text-sm">Минимизация воздействия на окружающую среду</p>
              </div>
              <div className="bg-card rounded-xl p-6 text-center hover:shadow-lg transition-all">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 mb-4">
                  <HardHat className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Обучение</h3>
                <p className="text-muted-foreground text-sm">Регулярное обучение персонала</p>
              </div>
            </div>

            {/* Экологическая политика — полный текст */}
            <article className="bg-card rounded-2xl border border-border p-8 md:p-10 shadow-sm mb-16">
              <h2 className="text-2xl font-bold mb-6">Экологическая политика АО «Пластик»</h2>

              <p className="text-muted-foreground leading-relaxed mb-6">
                АО «Пластик» — химическое предприятие, производящее стирол, АБС-пластик, полистирол, сепараторы, пластмассы в первичных формах и из вторично переработанных пластмасс в изделия. Основная цель предприятия — непрерывный рост капитализации, максимальная эффективность бизнеса и лидерство в химическом производстве при обеспечении экологической безопасности.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                АО «Пластик» считает экологическую безопасность, охрану здоровья человека и окружающей среды неотъемлемым элементом своей деятельности и приоритетом, в связи с чем настоящая Экологическая политика является составной частью миссии и стратегии развития АО «Пластик».
              </p>

              <h3 className="text-xl font-semibold mb-4">Основные цели Экологической политики АО «Пластик»</h3>
              <ul className="space-y-3 text-muted-foreground leading-relaxed mb-8 list-disc pl-6">
                <li>Внедрение передовых научных разработок и технологий для повышения полезного использования сырья с максимальным выходом продукции.</li>
                <li>Приоритет запланированных и реализуемых действий и мероприятий по предупреждению воздействия на окружающую среду перед мерами по ликвидации последствий такого воздействия.</li>
                <li>Достижение уровня экологической безопасности, соответствующего лучшим показателям ведущих нефтехимических компаний.</li>
                <li>Снижение выбросов и сбросов загрязняющих веществ, уменьшение объёмов отходов при росте объёмов производства за счёт внедрения новых экологически безопасных технологий, оборудования, материалов и совершенствования автоматизации технологических процессов.</li>
                <li>Повышение экологической безопасности производственных объектов и работ, снижение негативного воздействия на окружающую среду за счёт повышения надёжности технологического оборудования, обеспечения его безопасной и безаварийной эксплуатации.</li>
                <li>Повышение эффективности производственного контроля и экологического мониторинга на основе внедрения современных информационных технологий и методов технической диагностики.</li>
                <li>Информирование и ведение активного диалога с заинтересованными сторонами, общественностью и населением по вопросам деятельности предприятия в области экологической безопасности.</li>
                <li>Соблюдение природоохранного законодательства Российской Федерации, развитие сотрудничества с государственными и региональными законодательными и исполнительными органами в области охраны окружающей среды, а также расширение международного сотрудничества в создании экологически чистых, эффективных и экономически выгодных технологий и оборудования.</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4">Обязательства АО «Пластик»</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">Для достижения указанных целей АО «Пластик» принимает на себя следующие обязательства:</p>
              <ul className="space-y-3 text-muted-foreground leading-relaxed mb-8 list-disc pl-6">
                <li>Принимать и выполнять решения с обязательным учётом экологических аспектов планируемой деятельности, выпускаемой продукции и оказываемых услуг.</li>
                <li>Оценивать экологические аспекты, последовательно разрабатывать и внедрять мероприятия по их снижению и компенсации причинённого экологическими аспектами ущерба.</li>
                <li>Соблюдать применимые законодательные требования и иные требования, которые предприятие само определило в отношении управления экологическими аспектами своей деятельности.</li>
                <li>Планировать и реализовывать мероприятия по совершенствованию системы экологического менеджмента, снижению воздействия на окружающую среду, предупреждению аварий и смягчению их последствий.</li>
                <li>Модернизировать действующее технологическое оборудование и совершенствовать производственные технологические схемы с учётом ресурсосберегающих и малоотходных технологий.</li>
                <li>Обеспечивать вовлечённость всех работников в деятельность по экологическому менеджменту путём систематического обучения, повышения компетентности и мотивации.</li>
                <li>Требовать от подрядчиков, выполняющих работы от имени АО «Пластик», соблюдения законодательных норм и внутренних требований АО «Пластик».</li>
              </ul>

              <p className="text-muted-foreground leading-relaxed">
                Реализация целей настоящей политики обеспечивается персональной ответственностью руководства и каждого работника АО «Пластик».
              </p>
            </article>

            {/* Документы */}
            <div className="bg-muted/30 rounded-2xl border border-border p-8">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <FileText className="w-7 h-7 text-primary" />
                Документы
              </h2>
              <p className="text-muted-foreground mb-6">
                Сертификаты и документы в области охраны труда, экологии и менеджмента качества.
              </p>
              <ul className="space-y-4">
                {documents.map((doc, index) => (
                  <li key={index}>
                    <Link
                      href={doc.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 hover:bg-primary/5 hover:border-primary/30 transition-colors group"
                    >
                      <Download className="w-5 h-5 text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {doc.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

        <Footer />
      </div>
    </>
  )
}
