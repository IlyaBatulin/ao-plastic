"use client"

import { useState, useMemo } from "react"
import { Search, SlidersHorizontal, Sparkles, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import ProductsGrid from "./products-grid"
import { ProductFilters } from "./product-filters"
import { Input } from "@/components/ui/input"

type Product = {
  id: string
  name: string
  description?: string
  image?: string
  specifications: any
  [key: string]: any
}

export function FilteredProductsSection({ 
  products, 
  categoryId, 
  subcategoryId 
}: { 
  products: Product[]
  categoryId?: string
  subcategoryId?: string
}) {
  const { t } = useLanguage()
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)
  
  // Для хозяйственных товаров скрываем фильтры и таблицу сравнения
  const isHouseholdCategory = categoryId === 'hoztovary'
  // Специальная логика для экструзионных изделий ДМС
  const isExtrusionSubcategory = categoryId === "machine-parts" && subcategoryId === "parts-extrusion"

  // Для экструзии не показываем стандартные фильтры и сравнительные таблицы ABS/ПС
  const showFilters = !isHouseholdCategory && !isExtrusionSubcategory
  const showComparisonTable = false

  // ----- Фильтры для экструзионных изделий (тип + поиск) -----
  const [extrusionSearch, setExtrusionSearch] = useState("")
  const [extrusionSelectedTypes, setExtrusionSelectedTypes] = useState<string[]>([])

  const extrusionTypeKey = "Тип изделия"

  const extrusionTypeOptions = useMemo(() => {
    if (!isExtrusionSubcategory) return []
    const set = new Set<string>()
    products.forEach((p) => {
      const specs = typeof p.specifications === "string"
        ? JSON.parse(p.specifications)
        : p.specifications || {}
      const specType =
        (specs[extrusionTypeKey] as string | undefined) ?? (specs.type as string | undefined)
      if (specType) set.add(specType)
    })
    return Array.from(set).sort((a, b) => a.localeCompare(b, "ru"))
  }, [isExtrusionSubcategory, products])

  const extrusionFilteredProducts = useMemo(() => {
    if (!isExtrusionSubcategory) return products

    const q = extrusionSearch.trim().toLowerCase()

    return products.filter((p) => {
      const specs = typeof p.specifications === "string"
        ? JSON.parse(p.specifications)
        : p.specifications || {}
      const t =
        (specs[extrusionTypeKey] as string | undefined) ??
        (specs.type as string | undefined) ??
        ""

      if (extrusionSelectedTypes.length > 0 && !extrusionSelectedTypes.includes(t)) {
        return false
      }

      if (q) {
        const name = p.name?.toLowerCase() || ""
        const desc = p.description?.toLowerCase() || ""
        const specHaystack = Object.values(specs)
          .map((v) => (v != null ? String(v) : ""))
          .join(" ")
          .toLowerCase()
        return name.includes(q) || desc.includes(q) || specHaystack.includes(q)
      }

      return true
    })
  }, [isExtrusionSubcategory, products, extrusionSearch, extrusionSelectedTypes, extrusionTypeKey])

  const effectiveProducts = isExtrusionSubcategory ? extrusionFilteredProducts : filteredProducts

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">
          {t("homePage.catalog.productList.sectionTitle") || "Товары в этой категории"}
        </h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>
            {effectiveProducts.length}{" "}
            {t("homePage.catalog.productList.countSuffix") || "товаров"}
          </span>
        </div>
      </div>

      {/* Фильтры для экструзионных изделий ДМС */}
      {isExtrusionSubcategory && (
        <div className="mb-8 space-y-5">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder={
                t("homePage.catalog.productList.extrusionSearchPlaceholder") ||
                "Поиск по названию или шифру изделия..."
              }
              value={extrusionSearch}
              onChange={(e) => setExtrusionSearch(e.target.value)}
              className="h-12 rounded-2xl border-border/80 bg-card/60 pl-11 pr-4 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/30"
            />
          </div>

          {extrusionTypeOptions.length > 0 && (
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card/80 via-card/60 to-muted/20 p-1 shadow-sm">
              <div className="rounded-[0.9rem] bg-background/40 p-4 sm:p-5 backdrop-blur-sm">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <SlidersHorizontal className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="text-sm font-semibold tracking-tight text-foreground">
                        {t("homePage.catalog.productList.extrusionTypeLabel") || "Тип изделия"}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {t("homePage.catalog.productList.extrusionTypeHint") ||
                          "Можно выбрать несколько типов"}
                      </p>
                    </div>
                  </div>
                  {extrusionSelectedTypes.length > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="shrink-0 gap-1.5 text-muted-foreground hover:text-foreground"
                      onClick={() => setExtrusionSelectedTypes([])}
                    >
                      <X className="h-3.5 w-3.5" />
                      {t("homePage.catalog.productList.extrusionTypeReset") || "Сбросить"}
                    </Button>
                  )}
                </div>
                <div className="flex max-h-[200px] flex-wrap gap-2 overflow-y-auto pr-0.5 [scrollbar-gutter:stable]">
                  {extrusionTypeOptions.map((typeOption) => {
                    const active = extrusionSelectedTypes.includes(typeOption)
                    return (
                      <button
                        key={typeOption}
                        type="button"
                        onClick={() =>
                          setExtrusionSelectedTypes((prev) =>
                            prev.includes(typeOption)
                              ? prev.filter((x) => x !== typeOption)
                              : [...prev, typeOption]
                          )
                        }
                        className={cn(
                          "inline-flex min-h-9 max-w-full items-center rounded-full border px-3.5 py-1.5 text-left text-sm font-medium transition-all duration-200",
                          active
                            ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/25"
                            : "border-border/80 bg-card/50 text-foreground hover:border-primary/40 hover:bg-muted/50"
                        )}
                      >
                        <span className="whitespace-normal break-words text-balance">{typeOption}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {showFilters && (
        <ProductFilters products={products} onFilterChange={setFilteredProducts} />
      )}

      <ProductsGrid 
        products={effectiveProducts} 
        categoryId={categoryId}
        subcategoryId={subcategoryId}
      />

      {/* Таблица характеристик и применения (только для промышленных товаров) */}
      {showComparisonTable && (
        <div className="mt-12">
        <h3 className="text-2xl font-bold mb-6">Сравнительная таблица характеристик</h3>
        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
          {subcategoryId === 'ps-psv-s' || subcategoryId === 'psv-s' ? (
            // Специальная таблица для ПСВ-С
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="py-4 px-4 text-left font-semibold sticky left-0 bg-muted/50 z-10">Марка</th>
                  <th className="py-4 px-4 text-left font-semibold">Массовая доля частиц основной фракции, %</th>
                  <th className="py-4 px-4 text-left font-semibold">Массовая доля остатка на сите 1,6 мм, %</th>
                  <th className="py-4 px-4 text-left font-semibold">Массовая доля остатка на сите 1,4 мм, %</th>
                  <th className="py-4 px-4 text-left font-semibold">Массовая доля остатка на сите 3,2 мм, %</th>
                  <th className="py-4 px-4 text-left font-semibold">Массовая доля остатка на сите 0,9 мм, %</th>
                  <th className="py-4 px-4 text-left font-semibold">Массовая доля частиц, прошедших через сито 0,4 мм, %</th>
                  <th className="py-4 px-4 text-left font-semibold">Массовая доля свободного стирола, %</th>
                  <th className="py-4 px-4 text-left font-semibold">Массовая доля остаточного стирола, %</th>
                  <th className="py-4 px-4 text-left font-semibold">Потеря массы при сушке, %</th>
                  <th className="py-4 px-4 text-left font-semibold">Относительная вязкость</th>
                  <th className="py-4 px-4 text-left font-semibold">Кажущаяся плотность, кг/м³</th>
                  <th className="py-4 px-4 text-left font-semibold">Разрушающее напряжение при статическом изгибе, кг/см² (МПа)</th>
                  <th className="py-4 px-4 text-left font-semibold">Горючесть - время самовоспламенения, сек</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => {
                  const specs = typeof p.specifications === "string" ? JSON.parse(p.specifications) : p.specifications || {}
                  const brand = specs.Марка || specs.Фракция || p.name
                  const mainFraction = specs.Массовая_доля_частиц_основной_фракции_проц ?? "—"
                  const residue16 = specs.Массовая_доля_остатка_на_сите_1_6_мм_проц ?? "—"
                  const residue14 = specs.Массовая_доля_остатка_на_сите_1_4_мм_проц ?? "—"
                  const residue32 = specs.Массовая_доля_остатка_на_сите_3_2_мм_проц ?? "—"
                  const residue09 = specs.Массовая_доля_остатка_на_сите_0_9_мм_проц ?? "—"
                  const passed04 = specs.Массовая_доля_частиц_прошедших_через_сито_0_4_мм_проц ?? "—"
                  const freeStyrene = specs.Массовая_доля_свободного_стирола_проц ?? "—"
                  const residualStyrene = specs.Массовая_доля_остаточного_стирола_проц ?? "—"
                  const massLoss = specs.Потеря_массы_при_сушке_проц ?? "—"
                  const relativeViscosity = specs.Относительная_вязкость ?? "—"
                  const apparentDensity = specs.Кажущаяся_плотность_кг_м3 ?? "—"
                  const breakingStressKg = specs.Разрушающее_напряжение_при_статическом_изгибе_кг_см2
                  const breakingStressMpa = specs.Разрушающее_напряжение_при_статическом_изгибе_МПа
                  const breakingStress = breakingStressKg && breakingStressMpa 
                    ? `${breakingStressKg} (${breakingStressMpa})`
                    : (breakingStressKg || breakingStressMpa || "—")
                  const flammability = specs.Горючесть_время_самовоспламенения_сек ?? "—"
                  
                  return (
                    <tr key={p.id} className="border-b border-border/60 hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-4 font-semibold sticky left-0 bg-card z-10 border-r border-border/60">{brand}</td>
                      <td className="py-4 px-4">{mainFraction}</td>
                      <td className="py-4 px-4">{residue16}</td>
                      <td className="py-4 px-4">{residue14}</td>
                      <td className="py-4 px-4">{residue32}</td>
                      <td className="py-4 px-4">{residue09}</td>
                      <td className="py-4 px-4">{passed04}</td>
                      <td className="py-4 px-4">{freeStyrene}</td>
                      <td className="py-4 px-4">{residualStyrene}</td>
                      <td className="py-4 px-4">{massLoss}</td>
                      <td className="py-4 px-4">{relativeViscosity}</td>
                      <td className="py-4 px-4">{apparentDensity}</td>
                      <td className="py-4 px-4">{breakingStress}</td>
                      <td className="py-4 px-4">{flammability}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            // Стандартная таблица для других товаров
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="py-4 px-4 text-left font-semibold sticky left-0 bg-muted/50 z-10">Марка</th>
                  <th className="py-4 px-4 text-left font-semibold">Плотность, кг/м³</th>
                  <th className="py-4 px-4 text-left font-semibold">Усадка, %</th>
                  <th className="py-4 px-4 text-left font-semibold">ПТР (MFR), г/10 мин</th>
                  <th className="py-4 px-4 text-left font-semibold">Удлинение при разрыве, %</th>
                  <th className="py-4 px-4 text-left font-semibold">Ударная вязкость по Изоду, кДж/м²</th>
                  <th className="py-4 px-4 text-left font-semibold">Предел текучести при растяжении, МПа</th>
                  <th className="py-4 px-4 text-left font-semibold">Температура размягчения по Вика, °C</th>
                  <th className="py-4 px-4 text-left font-semibold">Блеск, %</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => {
                  const specs = typeof p.specifications === "string" ? JSON.parse(p.specifications) : p.specifications || {}
                  const brand = specs.Марка || p.name
                  const density = specs.Плотность || (specs.Плотность_кг_м3 ? `${specs.Плотность_кг_м3}` : "—")
                  const shrinkage = specs.Усадка || specs.Усадка_проц || "—"
                  const mfr = specs["Показатель текучести расплава (MFR)"] || (specs.Показатель_текучести_расплава_MFR_г_10мин ? `${specs.Показатель_текучести_расплава_MFR_г_10мин}` : "—")
                  const elongation = specs["Относительное удлинение при разрыве"] || (specs.Относительное_удлинение_при_разрыве_проц ? `${specs.Относительное_удлинение_при_разрыве_проц}` : "—")
                  const impactStrength = specs["Ударная вязкость по Изоду"] || (specs.Ударная_вязкость_по_Изоду_кДж_м2 ? `${specs.Ударная_вязкость_по_Изоду_кДж_м2}` : "—")
                  const tensileStrength = specs["Предел текучести при растяжении"] || (specs.Предел_текучести_при_растяжении_МПа ? `${specs.Предел_текучести_при_растяжении_МПа}` : "—")
                  const vicaTemp = specs["Температура размягчения по Вика"] || (specs.Температура_размягчения_по_Вика_градС ? `${specs.Температура_размягчения_по_Вика_градС}` : "—")
                  const gloss = specs.Блеск || (specs.Блеск_проц ? `${specs.Блеск_проц}` : "—")
                  
                  return (
                    <tr key={p.id} className="border-b border-border/60 hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-4 font-semibold sticky left-0 bg-card z-10 border-r border-border/60">{brand}</td>
                      <td className="py-4 px-4">{density}</td>
                      <td className="py-4 px-4">{shrinkage}</td>
                      <td className="py-4 px-4">{mfr}</td>
                      <td className="py-4 px-4">{elongation}</td>
                      <td className="py-4 px-4">{impactStrength}</td>
                      <td className="py-4 px-4">{tensileStrength}</td>
                      <td className="py-4 px-4">{vicaTemp}</td>
                      <td className="py-4 px-4">{gloss}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
      )}
    </>
  )
}

