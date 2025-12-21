"use client"

import { useState, useMemo } from "react"
import { Sparkles } from "lucide-react"
import ProductsGrid from "./products-grid"
import { ProductFilters } from "./product-filters"

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
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)
  
  // Для хозяйственных товаров скрываем фильтры и таблицу сравнения
  const isHouseholdCategory = categoryId === 'hoztovary'
  const showFilters = !isHouseholdCategory
  const showComparisonTable = !isHouseholdCategory

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Товары в этой категории</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>{filteredProducts.length} товаров</span>
        </div>
      </div>

      {showFilters && (
        <ProductFilters products={products} onFilterChange={setFilteredProducts} />
      )}

      <ProductsGrid 
        products={filteredProducts} 
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
                  <th className="py-4 px-4 text-left font-semibold">Массовая доля порообразователя, %</th>
                  <th className="py-4 px-4 text-left font-semibold">Массовая доля остаточного мономера (стирол), %</th>
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
                  const blowingAgent = specs.Массовая_доля_порообразователя_проц ?? "—"
                  const residualMonomer = specs.Массовая_доля_остаточного_мономера_стирол_проц ?? "—"
                  const massLoss = specs.Потеря_массы_при_сушке_проц ?? "—"
                  const relativeViscosity = specs.Относительная_вязкость ?? "—"
                  const apparentDensity = specs.Кажущаяся_плотность_кг_м3 ?? "—"
                  const breakingStress = (specs.Разрушающее_напряжение_при_статическом_изгибе_кг_см2 || specs.Разрушающее_напряжение_при_статическом_изгибе_МПа) ?? "—"
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
                      <td className="py-4 px-4">{blowingAgent}</td>
                      <td className="py-4 px-4">{residualMonomer}</td>
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

