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
        </div>
      </div>
      )}
    </>
  )
}

