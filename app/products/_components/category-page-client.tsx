"use client"

import { Footer } from "@/components/footer"
import { CategoryHero } from "@/app/products/_components/category-hero"
import { SubcategoriesGrid } from "@/app/products/_components/subcategories-grid"
import { useLanguage } from "@/contexts/language-context"

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
  
  // Получаем переведенное название категории
  const categoryName = t(`homePage.catalog.categories.${categoryId}`) || category.name
  const backLabel = t("homePage.catalog.backToCatalog") || "Назад к каталогу"

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

      {/* Subcategories Grid */}
      <SubcategoriesGrid categoryId={categoryId} subcategories={subcategories} />

      {/* ABS Tech Specs moved to bottom of category page */}
      {categoryId === "abs" && (
        <section className="py-20 bg-muted/20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="rounded-3xl border border-border bg-card p-8 lg:p-12 shadow-sm">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Технические характеристики АБС</h2>
              <p className="text-muted-foreground mb-8 max-w-3xl">
                Обобщённые свойства АБС-пластиков. Конкретные значения зависят от марки и назначения (литьё/экструзия).
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-border p-6 bg-background">
                  <h3 className="font-semibold mb-3">Физико‑механические</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>Плотность: ~ 1.03 – 1.06 г/см³</li>
                    <li>Температура размягчения: ~ 95 – 110°C</li>
                    <li>Ударная вязкость (изм. по Изоду): высокая</li>
                    <li>Прочность при изгибе: 60 – 90 МПа</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-border p-6 bg-background">
                  <h3 className="font-semibold mb-3">Переработка</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>ПТР (200°C/5кг): 3 – 20 г/10 мин</li>
                    <li>Темп. переработки: 190 – 240°C</li>
                    <li>Литьё под давлением / Экструзия</li>
                    <li>Поставка: гранулы, мешки 25 кг</li>
                  </ul>
                </div>
              </div>
              {/* Табличное фото характеристик */}
              <div className="mt-8 rounded-2xl overflow-hidden border border-border bg-background">
                <div className="relative">
                  <img
                    src="/images/abskhar.png"
                    alt="Таблица технических характеристик АБС"
                    className="w-full h-auto block"
                    loading="lazy"
                  />
                </div>
                <div className="px-4 py-3 text-xs text-muted-foreground bg-muted/30">
                  Иллюстрация: сводная таблица типовых характеристик АБС. Реальные значения см. в карточках марок.
                </div>
              </div>
              <div className="mt-6 text-sm text-muted-foreground">
                Для точных характеристик откройте нужную подкатегорию (литьевые, экструзионные) и карточки марок.
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}

