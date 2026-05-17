import type { Metadata } from "next"
import { Footer } from "@/components/footer"
import { BackgroundPaths } from "@/components/ui/background-paths"
import Image from "next/image"
import { Zap, Settings, CheckCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Экструзионное производство",
  description:
    "Экструзия полимеров на АО «Пластик»: оборудование, контроль качества гранул и профилей, стандарты производства.",
  alternates: { canonical: "/about/extrusion" },
}

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
        <section className="pt-32 pb-28 lg:pb-32">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="mb-16 text-center lg:mb-20">
                <h1 className="mb-6 text-h1 text-primary">
                  Экструзия пластика
                </h1>
                <p className="mx-auto max-w-4xl text-xl leading-relaxed text-foreground/70 md:text-2xl lg:text-3xl">
                  Современные технологии экструзии для производства высококачественных полимерных материалов
                </p>
                <div className="mt-6 h-0.5 w-24 mx-auto bg-primary" />
              </div>

              <div className="mb-14 grid gap-10 lg:mb-16 lg:grid-cols-12 lg:items-stretch lg:gap-12">
                <div className="rounded-2xl border border-border bg-card p-8 shadow-sm lg:col-span-5 lg:p-10">
                  <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-primary lg:mb-8 lg:text-3xl">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Settings className="w-5 h-5 text-primary" />
                    </div>
                    Технология производства
                  </h2>
                  <p className="mb-7 text-base leading-relaxed text-foreground/90 lg:text-lg">
                    Наше предприятие оснащено современными экструзионными линиями, которые позволяют производить
                    полимерные материалы высочайшего качества. Процесс экструзии полностью автоматизирован и
                    контролируется на всех этапах.
                  </p>
                  <div className="space-y-4">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-foreground/90 lg:text-lg">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative h-[430px] overflow-hidden rounded-2xl border border-border shadow-sm lg:col-span-7 lg:h-full lg:min-h-[620px]">
                  <Image
                    src="/prevyu/fasad/furs0066.jpeg"
                    alt="Экструзионное производство"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    quality={100}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-primary/5 p-8 lg:p-10">
                <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-primary lg:text-3xl">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  Преимущества нашего производства
                </h2>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="rounded-xl border border-border bg-card p-7">
                    <h3 className="mb-2 text-lg font-semibold text-primary">Высокая производительность</h3>
                    <p className="text-base text-muted-foreground">До 50 000 тонн продукции в год</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-7">
                    <h3 className="mb-2 text-lg font-semibold text-primary">Контроль качества</h3>
                    <p className="text-base text-muted-foreground">Проверка на каждом этапе производства</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-7">
                    <h3 className="mb-2 text-lg font-semibold text-primary">Гибкость</h3>
                    <p className="text-base text-muted-foreground">Производство по индивидуальным спецификациям</p>
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
