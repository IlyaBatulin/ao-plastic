"use client"

import { useState } from "react"
import Image from "next/image"
import { Footer } from "@/components/footer"
import { CategoryHero } from "@/app/products/_components/category-hero"
import { SubcategoriesGrid } from "@/app/products/_components/subcategories-grid"
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

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <CategoryHero
        title={categoryName}
        description={category.description}
        backHref="/products"
        backLabel={backLabel}
        hasVideo={hasVideo}
        videoSrc={videoSrc}
        imageSrc={category.image}
      />

      {/* Subcategories Grid - скрываем для стирола и КОРС */}
      {!isStyrene && !isKors && <SubcategoriesGrid categoryId={categoryId} subcategories={subcategories} />}

      {/* Styrene Specifications Table */}
      {isStyrene && (
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 lg:px-8">
            {/* Описание стирола */}
            <div className="mb-12 max-w-4xl mx-auto">
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Стирол используется для производства полистирола, АБС-пластиков, стиролсодержащих каучуков и латексов.
              </p>
              <div className="space-y-2 mb-8">
                <h3 className="text-2xl font-semibold text-foreground">СТИРОЛ, марка СДЭБ</h3>
                <p className="text-base text-muted-foreground">ГОСТ 10003-90 «Стирол», Изменение №1</p>
              </div>
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold mb-8">Норма по НТД - Высший сорт</h2>
            <div className="bg-card rounded-3xl p-8 shadow-sm border border-border overflow-x-auto">
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
            <div className="mt-8 flex justify-center">
              <Button
                onClick={() => setIsContactFormOpen(true)}
                className="text-lg h-14 px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                Связаться с нами
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* КОРС — описание, нормы по ТУ и кнопка «Связаться с нами» */}
      {isKors && (
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mb-10 flex justify-center">
              <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden border border-border shadow-md">
                <Image
                  src="/ПРЕВЬЮ/колбы/корс_1.jpeg"
                  alt="КОРС — кубовый остаток ректификации стирола"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 28rem"
                />
              </div>
            </div>
            <div className="mb-12 max-w-4xl mx-auto">
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                КОРС — Кубовый остаток ректификации стирола. Является побочным продуктом производства стирола.
              </p>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Применяется в качестве топлива в некоторых современных системах отопления и котлах. КОРС является растворителем и используется в качестве компонента в различных видах промышленного производства.
              </p>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Основное применение – получение пленкообразующих материалов. Также остатки кубовые ректификации стирола применяют для повышения механической прочности и снижения электризуемости покрытий для пола на основе каучука. Применяют КОРС для пропитки древесины и ДВП, что позволяет повысить ряд технических характеристик материала: его влагостойкость, прочность, долговечность.
              </p>
              <div className="space-y-2 mb-8">
                <p className="text-base text-muted-foreground">
                  Качество КОРС от ОАО «Пластик» соответствует ТУ 2415-038-05762341-2012, изм. 1,2,3.
                </p>
              </div>
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold mb-8">Норма по НТД</h2>
            <div className="bg-card rounded-3xl p-8 shadow-sm border border-border overflow-x-auto">
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">ТУ 2415-038-05762341-2012, изм. 1,2,3</p>
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
                    <td className="py-4 px-6 border border-gray-300">Вязкая жидкость от светло-желтого до темно-бурого цвета</td>
                  </tr>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <td className="py-4 px-6 border border-gray-300">2</td>
                    <td className="py-4 px-6 border border-gray-300">Плотность при 20 °С, не менее</td>
                    <td className="py-4 px-6 border border-gray-300 text-center">г/см³</td>
                    <td className="py-4 px-6 border border-gray-300">0,940</td>
                  </tr>
                  <tr className="bg-white border-b border-gray-200">
                    <td className="py-4 px-6 border border-gray-300">3</td>
                    <td className="py-4 px-6 border border-gray-300">Динамическая вязкость при 80 °С, не более</td>
                    <td className="py-4 px-6 border border-gray-300 text-center">мПа·с (сПз)</td>
                    <td className="py-4 px-6 border border-gray-300">10</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="py-4 px-6 border border-gray-300">4</td>
                    <td className="py-4 px-6 border border-gray-300">Массовая доля стирола, не более</td>
                    <td className="py-4 px-6 border border-gray-300 text-center">%</td>
                    <td className="py-4 px-6 border border-gray-300">30,0</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-8 flex justify-center">
              <Button
                onClick={() => setIsContactFormOpen(true)}
                className="text-lg h-14 px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                Связаться с нами
              </Button>
            </div>
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

