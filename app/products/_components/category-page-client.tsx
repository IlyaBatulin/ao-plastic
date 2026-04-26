"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Footer } from "@/components/footer"
import { CategoryHero } from "@/app/products/_components/category-hero"
import { SubcategoriesGrid } from "@/app/products/_components/subcategories-grid"
import { AbsInjectionInfo } from "@/app/products/_components/abs-injection-info"
import { AbsExtrusionInfo } from "@/app/products/_components/abs-extrusion-info"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { KorsNormTable } from "@/app/products/_components/kors-norm-table"
import {
  BENTOL_NORM_ROWS,
  BENTOL_TU_LABEL,
  KORS_NORM_ROWS,
  KORS_TU_LABEL,
} from "@/lib/kors-bentol-norms"

const korsStoryParent = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
}

const korsStoryChild = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
}

interface CategoryPageClientProps {
  categoryId: string
  category: {
    id: string
    name: string
    description?: string
    image?: string
  }
  subcategories: Array<{
    id: string
    slug: string
    name: string
    description?: string
    image?: string | null
  }>
  hasVideo: boolean
  videoSrc?: string
}

export function CategoryPageClient({
  categoryId,
  category,
  subcategories,
  hasVideo,
  videoSrc,
}: CategoryPageClientProps) {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [contactFormData, setContactFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [consentAccepted, setConsentAccepted] = useState(false)
  
  // Получаем переведенное название категории
  const categoryName = t(`homePage.catalog.categories.${categoryId}`) || category.name
  const backLabel = t("homePage.catalog.backToCatalog") || "Назад к каталогу"
  const isStyrene = categoryId === 'styrene'
  const isKors = categoryId === 'kors'
  const isAbs = categoryId === 'abs'

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <CategoryHero
        title={categoryName}
        description={
          t(`homePage.catalog.categoryDescriptions.${categoryId}`) || category.description
        }
        backHref="/products"
        backLabel={backLabel}
        hasVideo={hasVideo}
        videoSrc={videoSrc}
        imageSrc={category.image}
      />

      {/* Subcategories Grid - скрываем для стирола и КОРС */}
      {!isStyrene && !isKors && <SubcategoriesGrid categoryId={categoryId} subcategories={subcategories} />}

      {/* АБС: описание литьевых и экструзионных марок — на странице категории, под подкатегориями */}
      {isAbs && (
        <section className="border-t border-border bg-muted/30 py-16 lg:py-20">
          <div className="container mx-auto max-w-7xl px-4 lg:px-8">
            <header className="mb-10 text-center">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground lg:text-3xl">
                О марках АБС-пластика
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground leading-relaxed">
                Кратко о литьевых марках (термопластавтоматы) и экструзионных (листы и профили). Каталог позиций — в
                подкатегориях выше.
              </p>
            </header>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-stretch">
              <AbsInjectionInfo />
              <AbsExtrusionInfo />
            </div>
          </div>
        </section>
      )}

      {/* Стирол: описание с фото, таблица по ГОСТ */}
      {isStyrene && (
        <section className="py-16 lg:py-20 bg-secondary/30">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              className="mx-auto mb-16 grid max-w-6xl grid-cols-1 items-start gap-x-10 gap-y-8 lg:grid-cols-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.12 }}
              variants={korsStoryParent}
            >
              <motion.div variants={korsStoryChild} className="col-span-full">
                <h2 className="text-balance text-3xl font-bold tracking-tight text-[#1e3a8a] sm:text-4xl lg:text-5xl dark:text-[#60a5fa]">
                  Стирол
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#1e3a8a]/85 sm:text-lg dark:text-blue-100/85">
                  Мономер для производства полистирола, сополимеров и синтетического каучука — основа многих полимерных
                  материалов, которые вы знаете по каталогу АО «Пластик».
                </p>
                <div className="mt-8 h-1 w-28 rounded-full bg-[#1e3a8a] dark:bg-[#60a5fa]" />
              </motion.div>
              <motion.div
                variants={korsStoryChild}
                className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-muted/30 shadow-md"
              >
                <Image
                  src="/images/styrolmain.png"
                  alt="Стирол марки СДЭБ — прозрачная жидкость, производство АО «Пластик»"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </motion.div>
              <motion.div variants={korsStoryChild} className="space-y-5">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-foreground">Стирол (винилбензол)</span> — жидкий ароматический
                  углеводород и главный строительный блок для цепочки полимеров: вспенивающийся и экструзионный полистирол,
                  АБС-пластики, стирол-бутадиен-стирольные и стирол-содержащие каучуки, латексы и другие продукты глубокой
                  переработки.
                </p>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Высокая химическая чистота мономера напрямую влияет на стабильность полимеризации и качество конечного
                  изделия: от листов и профилей до деталей машиностроения и товаров народного потребления. Поэтому на
                  предприятии поддерживают строгий контроль показателей по нормативной документации и условия хранения и
                  отгрузки продукции.
                </p>
                <div className="rounded-xl border border-border/80 bg-card/80 px-4 py-4 shadow-sm dark:bg-card/50">
                  <p className="text-lg font-semibold text-foreground">СТИРОЛ, марка СДЭБ</p>
                  <p className="mt-1 text-sm text-muted-foreground">ГОСТ 10003-90 «Стирол», Изменение №1</p>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    Марка соответствует требованиям к стиролу высшего сорта по показателям внешнего вида, массовой доле
                    основного вещества и примесей — см. таблицу ниже.
                  </p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="mx-auto max-w-6xl"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <h3 className="mb-6 text-balance text-2xl font-bold tracking-tight text-[#1e3a8a] sm:text-3xl dark:text-[#60a5fa]">
                Норма по НТД — Высший сорт
              </h3>
              <div className="overflow-x-auto rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">ОКП 24 14930120</p>
              </div>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#1e3a5f] text-white">
                    <th className="py-4 px-6 text-left font-semibold border border-gray-300">№ п/п</th>
                    <th className="py-4 px-6 text-left font-semibold border border-gray-300">Наименование показателей</th>
                    <th className="py-4 px-6 text-left font-semibold border border-gray-300">Ед. измерения</th>
                    <th className="py-4 px-6 text-left font-semibold border border-gray-300">Норма по НТД</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b border-gray-200">
                    <td className="py-4 px-6 border border-gray-300">1</td>
                    <td className="py-4 px-6 border border-gray-300">Внешний вид</td>
                    <td className="py-4 px-6 border border-gray-300 text-center">—</td>
                    <td className="py-4 px-6 border border-gray-300">Прозрачная однородная жидкость без механических примесей и нерастворенной влаги</td>
                  </tr>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <td className="py-4 px-6 border border-gray-300">2</td>
                    <td className="py-4 px-6 border border-gray-300">Массовая доля стирола, не менее</td>
                    <td className="py-4 px-6 border border-gray-300 text-center">%</td>
                    <td className="py-4 px-6 border border-gray-300">99,80</td>
                  </tr>
                  <tr className="bg-white border-b border-gray-200">
                    <td className="py-4 px-6 border border-gray-300">3</td>
                    <td className="py-4 px-6 border border-gray-300">Массовая доля дивинилбензола, не более</td>
                    <td className="py-4 px-6 border border-gray-300 text-center">%</td>
                    <td className="py-4 px-6 border border-gray-300">0,0005</td>
                  </tr>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <td className="py-4 px-6 border border-gray-300">4</td>
                    <td className="py-4 px-6 border border-gray-300">Массовая доля карбонильных соединений в пересчете на бензальдегид, не более</td>
                    <td className="py-4 px-6 border border-gray-300 text-center">%</td>
                    <td className="py-4 px-6 border border-gray-300">0,01</td>
                  </tr>
                  <tr className="bg-white border-b border-gray-200">
                    <td className="py-4 px-6 border border-gray-300">5</td>
                    <td className="py-4 px-6 border border-gray-300">Массовая доля перекисных соединений в пересчете на активный кислород, не более</td>
                    <td className="py-4 px-6 border border-gray-300 text-center">%</td>
                    <td className="py-4 px-6 border border-gray-300">0,0005</td>
                  </tr>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <td className="py-4 px-6 border border-gray-300">6</td>
                    <td className="py-4 px-6 border border-gray-300">Массовая доля полимера, не более</td>
                    <td className="py-4 px-6 border border-gray-300 text-center">%</td>
                    <td className="py-4 px-6 border border-gray-300">0,001</td>
                  </tr>
                  <tr className="bg-white border-b border-gray-200">
                    <td className="py-4 px-6 border border-gray-300">7</td>
                    <td className="py-4 px-6 border border-gray-300">Массовая доля фенилацетилена, не более</td>
                    <td className="py-4 px-6 border border-gray-300 text-center">%</td>
                    <td className="py-4 px-6 border border-gray-300">0,01</td>
                  </tr>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <td className="py-4 px-6 border border-gray-300">8</td>
                    <td className="py-4 px-6 border border-gray-300">Массовая доля стабилизатора пара-трет-бутилпирокатехина, в пределах</td>
                    <td className="py-4 px-6 border border-gray-300 text-center">%</td>
                    <td className="py-4 px-6 border border-gray-300">0,0005-0,0010</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="py-4 px-6 border border-gray-300">9</td>
                    <td className="py-4 px-6 border border-gray-300">Цветность по платиново-кобальтовой шкале, не более</td>
                    <td className="py-4 px-6 border border-gray-300 text-center">ед. Хазена</td>
                    <td className="py-4 px-6 border border-gray-300">10</td>
                  </tr>
                </tbody>
              </table>
              </div>
            </motion.div>
            <motion.div
              className="mt-10 flex justify-center"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <Button
                onClick={() => setIsContactFormOpen(true)}
                className="h-14 bg-gradient-to-r from-primary to-primary/80 px-8 text-lg hover:from-primary/90 hover:to-primary/70"
              >
                Связаться с нами
              </Button>
            </motion.div>
          </div>
        </section>
      )}

      {/* КОРС — описание, нормы по ТУ и кнопка «Связаться с нами» */}
      {isKors && (
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              className="mx-auto mb-16 grid max-w-6xl grid-cols-1 items-start gap-x-10 gap-y-8 lg:grid-cols-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.12 }}
              variants={korsStoryParent}
            >
              <motion.div variants={korsStoryChild} className="col-span-full">
                <h2 className="text-balance text-3xl font-bold tracking-tight text-[#1e3a8a] sm:text-4xl lg:text-5xl dark:text-[#60a5fa]">
                  КОРС
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#1e3a8a]/85 sm:text-lg dark:text-blue-100/85">
                  Кубовый остаток ректификации стирола — побочный продукт производства стирола, используемый как топливо,
                  растворитель и компонент промышленных материалов.
                </p>
                <div className="mt-8 h-1 w-28 rounded-full bg-[#1e3a8a] dark:bg-[#60a5fa]" />
              </motion.div>
              <motion.div
                variants={korsStoryChild}
                className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-muted/30 shadow-md"
              >
                <Image
                  src="/ПРЕВЬЮ/колбы/корс_1.jpeg"
                  alt="КОРС — кубовый остаток ректификации стирола"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </motion.div>
              <motion.div variants={korsStoryChild} className="space-y-5">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  КОРС — Кубовый остаток ректификации стирола. Является побочным продуктом производства стирола.
                </p>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Применяется в качестве топлива в некоторых современных системах отопления и котлах. КОРС является
                  растворителем и используется в качестве компонента в различных видах промышленного производства.
                </p>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Основное применение – получение пленкообразующих материалов. Также остатки кубовые ректификации стирола
                  применяют для повышения механической прочности и снижения электризуемости покрытий для пола на основе
                  каучука. Применяют КОРС для пропитки древесины и ДВП, что позволяет повысить ряд технических
                  характеристик материала: его влагостойкость, прочность, долговечность.
                </p>
                <p className="text-base text-muted-foreground">
                  Качество КОРС от АО «Пластик» соответствует ТУ 2415-038-05762341-2012, изм. 1,2,3.
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              className="mb-16"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="mb-6 text-balance text-2xl font-bold tracking-tight text-[#1e3a8a] sm:text-3xl dark:text-[#60a5fa]">
                Норма по НТД — КОРС
              </h2>
              <KorsNormTable tuLabel={KORS_TU_LABEL} rows={KORS_NORM_ROWS} />
            </motion.div>

            <motion.div
              className="mx-auto mb-16 grid max-w-6xl grid-cols-1 items-start gap-x-10 gap-y-8 lg:grid-cols-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.12 }}
              variants={korsStoryParent}
            >
              <motion.div variants={korsStoryChild} className="col-span-full">
                <h2 className="text-balance text-3xl font-bold tracking-tight text-[#1e3a8a] sm:text-4xl lg:text-5xl dark:text-[#60a5fa]">
                  Бентол
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#1e3a8a]/85 sm:text-lg dark:text-blue-100/85">
                  Фракция бензол-толуольная — продукт переработки, используемый как технологическое сырьё и растворитель в
                  серии отраслей промышленности.
                </p>
                <div className="mt-8 h-1 w-28 rounded-full bg-[#1e3a8a] dark:bg-[#60a5fa]" />
              </motion.div>
              <motion.div
                variants={korsStoryChild}
                className="relative aspect-[3/4] w-full max-w-md overflow-hidden rounded-2xl border border-border bg-muted/40 shadow-md lg:max-w-none"
              >
                <Image
                  src="/images/bentol.png"
                  alt="Бентол — фракция бензол-толуольная, лабораторная бутыль 500 мл"
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </motion.div>
              <motion.div variants={korsStoryChild} className="space-y-5">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Бентол представляет собой жидкую углеводородную смесь (в первую очередь бензола и толуола) с
                  регламентированным по нормативной документации составом и физико-химическими показателями. Продукт
                  применяется как растворитель и компонент сырьевых смесей при изготовлении лаков, красок, эмалей и
                  связующих в лакокрасочной отрасли, а также в производстве каучуков, клеев и других органических синтезов,
                  где требуется контролируемое содержание ароматических углеводородов.
                </p>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  В зависимости от технологической цепочки заказчика Бентол может использоваться для регулирования
                  вязкости лакокрасочных материалов, ускорения высыхания плёночных покрытий и как участник рецептур при
                  переработке полимеров и резинотехнических изделий. Поставка осуществляется с соблюдением требований к
                  маркировке, упаковке и безопасной транспортировке химической продукции.
                </p>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  АО «Пластик» обеспечивает стабильное качество партий: показатели фракции соответствуют утверждённым нормам
                  по ТУ, что подтверждается входным контролем сырья и приёмочными испытаниями готовой продукции.
                </p>
                <p className="text-base text-muted-foreground">
                  Продукция «Бентол» АО «Пластик» соответствует {BENTOL_TU_LABEL}.
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <h3 className="mb-6 text-balance text-2xl font-bold tracking-tight text-[#1e3a8a] sm:text-3xl dark:text-[#60a5fa]">
                Норма по НТД — Бентол
              </h3>
              <KorsNormTable tuLabel={BENTOL_TU_LABEL} rows={BENTOL_NORM_ROWS} />
            </motion.div>

            <motion.div
              className="mt-8 flex justify-center"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <Button
                onClick={() => setIsContactFormOpen(true)}
                className="h-14 bg-gradient-to-r from-primary to-primary/80 px-8 text-lg hover:from-primary/90 hover:to-primary/70"
              >
                Связаться с нами
              </Button>
            </motion.div>
          </div>
        </section>
      )}

      {/* Contact Form Dialog */}
      <Dialog open={isContactFormOpen} onOpenChange={setIsContactFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Связаться с нами</DialogTitle>
            <DialogDescription>
              Заполните форму, и мы свяжемся с вами в ближайшее время
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              
              if (!consentAccepted) {
                toast({
                  title: "Требуется согласие",
                  description: "Необходимо согласиться на обработку персональных данных",
                  variant: "destructive",
                  duration: 3000,
                })
                return
              }
              
              setIsSubmitting(true)

              try {
                const response = await fetch("/api/contact-messages", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    source: "contacts",
                    ...contactFormData,
                    message: `Запрос по категории: ${category.name}\n\n${contactFormData.message || "Интерес к продукции"}`,
                  }),
                })

                if (response.ok) {
                  toast({
                    title: "Сообщение отправлено",
                    description: "Ваше сообщение отправлено и будет рассмотрено в ближайшее время. Мы свяжемся с вами по указанным контактам.",
                    duration: 5000,
                  })
                  setContactFormData({ name: "", email: "", phone: "", message: "" })
                  setConsentAccepted(false)
                  setIsContactFormOpen(false)
                } else {
                  const error = await response.json()
                  toast({
                    title: "Ошибка отправки",
                    description: error.error || "Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте еще раз.",
                    variant: "destructive",
                    duration: 5000,
                  })
                }
              } catch (error) {
                console.error("Ошибка:", error)
                toast({
                  title: "Ошибка отправки",
                  description: "Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте еще раз.",
                  variant: "destructive",
                  duration: 5000,
                })
              } finally {
                setIsSubmitting(false)
              }
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Имя <span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                required
                value={contactFormData.name}
                onChange={(e) => setContactFormData({ ...contactFormData, name: e.target.value })}
                placeholder="Ваше имя"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                id="email"
                type="email"
                required
                value={contactFormData.email}
                onChange={(e) => setContactFormData({ ...contactFormData, email: e.target.value })}
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                Телефон
              </label>
              <Input
                id="phone"
                type="tel"
                value={contactFormData.phone}
                onChange={(e) => setContactFormData({ ...contactFormData, phone: e.target.value })}
                placeholder="+7 (___) ___-__-__"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Сообщение <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="message"
                required
                value={contactFormData.message}
                onChange={(e) => setContactFormData({ ...contactFormData, message: e.target.value })}
                placeholder="Ваше сообщение"
                rows={4}
              />
            </div>
            <div className="flex items-start gap-2">
              <Checkbox
                id="consent"
                checked={consentAccepted}
                onCheckedChange={(checked) => setConsentAccepted(checked === true)}
              />
              <label htmlFor="consent" className="text-sm text-muted-foreground cursor-pointer">
                Я согласен на обработку персональных данных <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsContactFormOpen(false)}
                className="flex-1"
              >
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "Отправка..." : "Отправить"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}

