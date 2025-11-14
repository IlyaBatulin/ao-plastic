"use client"

import { useState, useMemo, useEffect } from "react"
import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"

type FilterValues = {
  densityMin?: number
  densityMax?: number
  fractionMin?: number
  fractionMax?: number
  application?: string[]
  stress?: number
  // Новые фильтры для АБС
  mfrMin?: number
  mfrMax?: number
  elongationMin?: number
  elongationMax?: number
  impactStrengthMin?: number
  impactStrengthMax?: number
  tensileStrengthMin?: number
  tensileStrengthMax?: number
  vicaTempMin?: number
  vicaTempMax?: number
  glossMin?: number
  glossMax?: number
}

type Product = {
  id: string
  name: string
  specifications: any
}

export function ProductFilters({
  products,
  onFilterChange,
}: {
  products: Product[]
  onFilterChange: (filtered: Product[]) => void
}) {
  const [filters, setFilters] = useState<FilterValues>({})
  const [isOpen, setIsOpen] = useState(false)

  // Извлекаем уникальные значения для фильтров
  const filterOptions = useMemo(() => {
    const applications = new Set<string>()
    const densities: number[] = []
    const fractions: number[] = []
    const mfrs: number[] = []
    const elongations: number[] = []
    const impactStrengths: number[] = []
    const tensileStrengths: number[] = []
    const vicaTemps: number[] = []
    const glosses: number[] = []

    products.forEach((product) => {
      const specs = typeof product.specifications === "string"
        ? JSON.parse(product.specifications)
        : product.specifications || {}

      // Применение
      if (specs.Применение && Array.isArray(specs.Применение)) {
        specs.Применение.forEach((app: string) => applications.add(app))
      }

      // Плотность
      if (specs.Плотность_кг_м3) {
        densities.push(specs.Плотность_кг_м3)
      }
      if (specs.Плотность_кг_м3_мин) {
        densities.push(specs.Плотность_кг_м3_мин)
      }
      if (specs.Плотность_кг_м3_макс) {
        densities.push(specs.Плотность_кг_м3_макс)
      }

      // Фракция
      if (specs.Фракция_мин !== null && specs.Фракция_мин !== undefined) {
        fractions.push(specs.Фракция_мин)
      }
      if (specs.Фракция_макс !== null && specs.Фракция_макс !== undefined) {
        fractions.push(specs.Фракция_макс)
      }

      // Показатель текучести расплава (MFR)
      if (specs.Показатель_текучести_расплава_MFR_г_10мин !== null && specs.Показатель_текучести_расплава_MFR_г_10мин !== undefined) {
        mfrs.push(specs.Показатель_текучести_расплава_MFR_г_10мин)
      }

      // Относительное удлинение при разрыве
      if (specs.Относительное_удлинение_при_разрыве_проц !== null && specs.Относительное_удлинение_при_разрыве_проц !== undefined) {
        elongations.push(specs.Относительное_удлинение_при_разрыве_проц)
      }

      // Ударная вязкость по Изоду
      if (specs.Ударная_вязкость_по_Изоду_кДж_м2 !== null && specs.Ударная_вязкость_по_Изоду_кДж_м2 !== undefined) {
        impactStrengths.push(specs.Ударная_вязкость_по_Изоду_кДж_м2)
      }

      // Предел текучести при растяжении
      if (specs.Предел_текучести_при_растяжении_МПа !== null && specs.Предел_текучести_при_растяжении_МПа !== undefined) {
        tensileStrengths.push(specs.Предел_текучести_при_растяжении_МПа)
      }

      // Температура размягчения по Вика
      if (specs.Температура_размягчения_по_Вика_градС !== null && specs.Температура_размягчения_по_Вика_градС !== undefined) {
        vicaTemps.push(specs.Температура_размягчения_по_Вика_градС)
      }

      // Блеск
      if (specs.Блеск_проц !== null && specs.Блеск_проц !== undefined) {
        glosses.push(specs.Блеск_проц)
      }
    })

    const dens = densities.filter((d) => Number.isFinite(d))
    const frs = fractions.filter((f) => Number.isFinite(f))
    const mfrVals = mfrs.filter((m) => Number.isFinite(m))
    const elongVals = elongations.filter((e) => Number.isFinite(e))
    const impactVals = impactStrengths.filter((i) => Number.isFinite(i))
    const tensileVals = tensileStrengths.filter((t) => Number.isFinite(t))
    const vicaVals = vicaTemps.filter((v) => Number.isFinite(v))
    const glossVals = glosses.filter((g) => Number.isFinite(g))

    return {
      applications: Array.from(applications).sort(),
      densityMin: dens.length ? Math.min(...dens) : 0,
      densityMax: dens.length ? Math.max(...dens) : 100,
      fractionMin: frs.length ? Math.min(...frs) : 0,
      fractionMax: frs.length ? Math.max(...frs) : 3,
      mfrMin: mfrVals.length ? Math.min(...mfrVals) : 0,
      mfrMax: mfrVals.length ? Math.max(...mfrVals) : 30,
      elongationMin: elongVals.length ? Math.min(...elongVals) : 0,
      elongationMax: elongVals.length ? Math.max(...elongVals) : 50,
      impactStrengthMin: impactVals.length ? Math.min(...impactVals) : 0,
      impactStrengthMax: impactVals.length ? Math.max(...impactVals) : 50,
      tensileStrengthMin: tensileVals.length ? Math.min(...tensileVals) : 0,
      tensileStrengthMax: tensileVals.length ? Math.max(...tensileVals) : 500,
      vicaTempMin: vicaVals.length ? Math.min(...vicaVals) : 0,
      vicaTempMax: vicaVals.length ? Math.max(...vicaVals) : 120,
      glossMin: glossVals.length ? Math.min(...glossVals) : 0,
      glossMax: glossVals.length ? Math.max(...glossVals) : 100,
    }
  }, [products])

  // Функция фильтрации
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const specs = typeof product.specifications === "string"
        ? JSON.parse(product.specifications)
        : product.specifications || {}

      // Фильтр по плотности
      if (filters.densityMin !== undefined || filters.densityMax !== undefined) {
        const density = specs.Плотность_кг_м3
        const densityMin = specs.Плотность_кг_м3_мин ?? density
        const densityMax = specs.Плотность_кг_м3_макс ?? density

        if (filters.densityMin !== undefined && densityMax < filters.densityMin) return false
        if (filters.densityMax !== undefined && densityMin > filters.densityMax) return false
      }

      // Фильтр по фракции
      if (filters.fractionMin !== undefined || filters.fractionMax !== undefined) {
        const fractionMin = specs.Фракция_мин
        const fractionMax = specs.Фракция_макс

        if (fractionMin !== null && fractionMax !== null) {
          if (filters.fractionMin !== undefined && fractionMax < filters.fractionMin) return false
          if (filters.fractionMax !== undefined && fractionMin > filters.fractionMax) return false
        }
      }

      // Фильтр по применению
      if (filters.application && filters.application.length > 0) {
        const productApplications = specs.Применение || []
        const hasMatch = filters.application.some((app) => productApplications.includes(app))
        if (!hasMatch) return false
      }

      // Фильтр по показателю текучести расплава (MFR)
      if (filters.mfrMin !== undefined || filters.mfrMax !== undefined) {
        const mfr = specs.Показатель_текучести_расплава_MFR_г_10мин
        if (mfr === null || mfr === undefined) return false
        if (filters.mfrMin !== undefined && mfr < filters.mfrMin) return false
        if (filters.mfrMax !== undefined && mfr > filters.mfrMax) return false
      }

      // Фильтр по относительному удлинению при разрыве
      if (filters.elongationMin !== undefined || filters.elongationMax !== undefined) {
        const elongation = specs.Относительное_удлинение_при_разрыве_проц
        if (elongation === null || elongation === undefined) return false
        if (filters.elongationMin !== undefined && elongation < filters.elongationMin) return false
        if (filters.elongationMax !== undefined && elongation > filters.elongationMax) return false
      }

      // Фильтр по ударной вязкости по Изоду
      if (filters.impactStrengthMin !== undefined || filters.impactStrengthMax !== undefined) {
        const impactStrength = specs.Ударная_вязкость_по_Изоду_кДж_м2
        if (impactStrength === null || impactStrength === undefined) return false
        if (filters.impactStrengthMin !== undefined && impactStrength < filters.impactStrengthMin) return false
        if (filters.impactStrengthMax !== undefined && impactStrength > filters.impactStrengthMax) return false
      }

      // Фильтр по пределу текучести при растяжении
      if (filters.tensileStrengthMin !== undefined || filters.tensileStrengthMax !== undefined) {
        const tensileStrength = specs.Предел_текучести_при_растяжении_МПа
        if (tensileStrength === null || tensileStrength === undefined) return false
        if (filters.tensileStrengthMin !== undefined && tensileStrength < filters.tensileStrengthMin) return false
        if (filters.tensileStrengthMax !== undefined && tensileStrength > filters.tensileStrengthMax) return false
      }

      // Фильтр по температуре размягчения по Вика
      if (filters.vicaTempMin !== undefined || filters.vicaTempMax !== undefined) {
        const vicaTemp = specs.Температура_размягчения_по_Вика_градС
        if (vicaTemp === null || vicaTemp === undefined) return false
        if (filters.vicaTempMin !== undefined && vicaTemp < filters.vicaTempMin) return false
        if (filters.vicaTempMax !== undefined && vicaTemp > filters.vicaTempMax) return false
      }

      // Фильтр по блеску
      if (filters.glossMin !== undefined || filters.glossMax !== undefined) {
        const gloss = specs.Блеск_проц
        if (gloss === null || gloss === undefined) return false
        if (filters.glossMin !== undefined && gloss < filters.glossMin) return false
        if (filters.glossMax !== undefined && gloss > filters.glossMax) return false
      }

      return true
    })
  }, [products, filters])

  // Обновляем результаты при изменении фильтров
  useEffect(() => {
    onFilterChange(filteredProducts)
  }, [filteredProducts, onFilterChange])

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.densityMin !== undefined || filters.densityMax !== undefined) count++
    if (filters.fractionMin !== undefined || filters.fractionMax !== undefined) count++
    if (filters.application && filters.application.length > 0) count++
    if (filters.mfrMin !== undefined || filters.mfrMax !== undefined) count++
    if (filters.elongationMin !== undefined || filters.elongationMax !== undefined) count++
    if (filters.impactStrengthMin !== undefined || filters.impactStrengthMax !== undefined) count++
    if (filters.tensileStrengthMin !== undefined || filters.tensileStrengthMax !== undefined) count++
    if (filters.vicaTempMin !== undefined || filters.vicaTempMax !== undefined) count++
    if (filters.glossMin !== undefined || filters.glossMax !== undefined) count++
    return count
  }, [filters])

  const resetFilters = () => {
    setFilters({})
  }

  const toggleApplication = (app: string) => {
    setFilters((prev) => {
      const current = prev.application || []
      const updated = current.includes(app)
        ? current.filter((a) => a !== app)
        : [...current, app]
      return { ...prev, application: updated.length > 0 ? updated : undefined }
    })
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:border-primary/50 transition-colors bg-card"
        >
          <Filter className="w-4 h-4" />
          <span className="font-medium">Фильтры</span>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </button>

        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground">
            <X className="w-4 h-4 mr-2" />
            Сбросить
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
          {/* Плотность */}
          <div>
            <label className="text-sm font-semibold mb-2 block">Плотность, кг/м³</label>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">От</label>
                <Input
                  type="number"
                  inputMode="decimal"
                  placeholder={filterOptions.densityMin?.toString()}
                  value={filters.densityMin ?? ""}
                  onChange={(e) => {
                    const v = e.target.value
                    setFilters((prev) => ({ ...prev, densityMin: v === "" ? undefined : Number(v) }))
                  }}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">До</label>
                <Input
                  type="number"
                  inputMode="decimal"
                  placeholder={filterOptions.densityMax?.toString()}
                  value={filters.densityMax ?? ""}
                  onChange={(e) => {
                    const v = e.target.value
                    setFilters((prev) => ({ ...prev, densityMax: v === "" ? undefined : Number(v) }))
                  }}
                />
              </div>
            </div>
            <Slider
              value={[
                filters.densityMin ?? filterOptions.densityMin,
                filters.densityMax ?? filterOptions.densityMax,
              ]}
              min={filterOptions.densityMin}
              max={filterOptions.densityMax}
              step={1}
              onValueChange={([min, max]) =>
                setFilters((prev) => ({ ...prev, densityMin: min, densityMax: max }))
              }
            />
          </div>

          {/* Фракция */}
          <div>
            <label className="text-sm font-semibold mb-2 block">Фракция, мм</label>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">От</label>
                <Input
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  placeholder={filterOptions.fractionMin?.toString()}
                  value={filters.fractionMin ?? ""}
                  onChange={(e) => {
                    const v = e.target.value
                    setFilters((prev) => ({ ...prev, fractionMin: v === "" ? undefined : Number(v) }))
                  }}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">До</label>
                <Input
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  placeholder={filterOptions.fractionMax?.toString()}
                  value={filters.fractionMax ?? ""}
                  onChange={(e) => {
                    const v = e.target.value
                    setFilters((prev) => ({ ...prev, fractionMax: v === "" ? undefined : Number(v) }))
                  }}
                />
              </div>
            </div>
            <Slider
              value={[
                filters.fractionMin ?? filterOptions.fractionMin,
                filters.fractionMax ?? filterOptions.fractionMax,
              ]}
              min={filterOptions.fractionMin}
              max={filterOptions.fractionMax}
              step={0.1}
              onValueChange={([min, max]) =>
                setFilters((prev) => ({ ...prev, fractionMin: Number(min.toFixed(1)), fractionMax: Number(max.toFixed(1)) }))
              }
            />
          </div>

          {/* Применение */}
          <div>
            <label className="text-sm font-semibold mb-2 block">Применение</label>
            <div className="flex flex-wrap gap-2">
              {filterOptions.applications.map((app) => {
                const isSelected = filters.application?.includes(app)
                return (
                  <Button
                    key={app}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleApplication(app)}
                    className="text-xs"
                  >
                    {app}
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Показатель текучести расплава (MFR) */}
          {(filterOptions.mfrMin !== filterOptions.mfrMax) && (
            <div>
              <label className="text-sm font-semibold mb-2 block">Показатель текучести расплава (MFR), г/10 мин</label>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">От</label>
                  <Input
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    placeholder={filterOptions.mfrMin?.toString()}
                    value={filters.mfrMin ?? ""}
                    onChange={(e) => {
                      const v = e.target.value
                      setFilters((prev) => ({ ...prev, mfrMin: v === "" ? undefined : Number(v) }))
                    }}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">До</label>
                  <Input
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    placeholder={filterOptions.mfrMax?.toString()}
                    value={filters.mfrMax ?? ""}
                    onChange={(e) => {
                      const v = e.target.value
                      setFilters((prev) => ({ ...prev, mfrMax: v === "" ? undefined : Number(v) }))
                    }}
                  />
                </div>
              </div>
              <Slider
                value={[
                  filters.mfrMin ?? filterOptions.mfrMin,
                  filters.mfrMax ?? filterOptions.mfrMax,
                ]}
                min={filterOptions.mfrMin}
                max={filterOptions.mfrMax}
                step={0.1}
                onValueChange={([min, max]) =>
                  setFilters((prev) => ({ ...prev, mfrMin: Number(min.toFixed(1)), mfrMax: Number(max.toFixed(1)) }))
                }
              />
            </div>
          )}

          {/* Относительное удлинение при разрыве */}
          {(filterOptions.elongationMin !== filterOptions.elongationMax) && (
            <div>
              <label className="text-sm font-semibold mb-2 block">Относительное удлинение при разрыве, %</label>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">От</label>
                  <Input
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    placeholder={filterOptions.elongationMin?.toString()}
                    value={filters.elongationMin ?? ""}
                    onChange={(e) => {
                      const v = e.target.value
                      setFilters((prev) => ({ ...prev, elongationMin: v === "" ? undefined : Number(v) }))
                    }}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">До</label>
                  <Input
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    placeholder={filterOptions.elongationMax?.toString()}
                    value={filters.elongationMax ?? ""}
                    onChange={(e) => {
                      const v = e.target.value
                      setFilters((prev) => ({ ...prev, elongationMax: v === "" ? undefined : Number(v) }))
                    }}
                  />
                </div>
              </div>
              <Slider
                value={[
                  filters.elongationMin ?? filterOptions.elongationMin,
                  filters.elongationMax ?? filterOptions.elongationMax,
                ]}
                min={filterOptions.elongationMin}
                max={filterOptions.elongationMax}
                step={0.1}
                onValueChange={([min, max]) =>
                  setFilters((prev) => ({ ...prev, elongationMin: Number(min.toFixed(1)), elongationMax: Number(max.toFixed(1)) }))
                }
              />
            </div>
          )}

          {/* Ударная вязкость по Изоду */}
          {(filterOptions.impactStrengthMin !== filterOptions.impactStrengthMax) && (
            <div>
              <label className="text-sm font-semibold mb-2 block">Ударная вязкость по Изоду, кДж/м²</label>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">От</label>
                  <Input
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    placeholder={filterOptions.impactStrengthMin?.toString()}
                    value={filters.impactStrengthMin ?? ""}
                    onChange={(e) => {
                      const v = e.target.value
                      setFilters((prev) => ({ ...prev, impactStrengthMin: v === "" ? undefined : Number(v) }))
                    }}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">До</label>
                  <Input
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    placeholder={filterOptions.impactStrengthMax?.toString()}
                    value={filters.impactStrengthMax ?? ""}
                    onChange={(e) => {
                      const v = e.target.value
                      setFilters((prev) => ({ ...prev, impactStrengthMax: v === "" ? undefined : Number(v) }))
                    }}
                  />
                </div>
              </div>
              <Slider
                value={[
                  filters.impactStrengthMin ?? filterOptions.impactStrengthMin,
                  filters.impactStrengthMax ?? filterOptions.impactStrengthMax,
                ]}
                min={filterOptions.impactStrengthMin}
                max={filterOptions.impactStrengthMax}
                step={0.1}
                onValueChange={([min, max]) =>
                  setFilters((prev) => ({ ...prev, impactStrengthMin: Number(min.toFixed(1)), impactStrengthMax: Number(max.toFixed(1)) }))
                }
              />
            </div>
          )}

          {/* Предел текучести при растяжении */}
          {(filterOptions.tensileStrengthMin !== filterOptions.tensileStrengthMax) && (
            <div>
              <label className="text-sm font-semibold mb-2 block">Предел текучести при растяжении, МПа</label>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">От</label>
                  <Input
                    type="number"
                    inputMode="decimal"
                    step="1"
                    placeholder={filterOptions.tensileStrengthMin?.toString()}
                    value={filters.tensileStrengthMin ?? ""}
                    onChange={(e) => {
                      const v = e.target.value
                      setFilters((prev) => ({ ...prev, tensileStrengthMin: v === "" ? undefined : Number(v) }))
                    }}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">До</label>
                  <Input
                    type="number"
                    inputMode="decimal"
                    step="1"
                    placeholder={filterOptions.tensileStrengthMax?.toString()}
                    value={filters.tensileStrengthMax ?? ""}
                    onChange={(e) => {
                      const v = e.target.value
                      setFilters((prev) => ({ ...prev, tensileStrengthMax: v === "" ? undefined : Number(v) }))
                    }}
                  />
                </div>
              </div>
              <Slider
                value={[
                  filters.tensileStrengthMin ?? filterOptions.tensileStrengthMin,
                  filters.tensileStrengthMax ?? filterOptions.tensileStrengthMax,
                ]}
                min={filterOptions.tensileStrengthMin}
                max={filterOptions.tensileStrengthMax}
                step={1}
                onValueChange={([min, max]) =>
                  setFilters((prev) => ({ ...prev, tensileStrengthMin: min, tensileStrengthMax: max }))
                }
              />
            </div>
          )}

          {/* Температура размягчения по Вика */}
          {(filterOptions.vicaTempMin !== filterOptions.vicaTempMax) && (
            <div>
              <label className="text-sm font-semibold mb-2 block">Температура размягчения по Вика, °C</label>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">От</label>
                  <Input
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    placeholder={filterOptions.vicaTempMin?.toString()}
                    value={filters.vicaTempMin ?? ""}
                    onChange={(e) => {
                      const v = e.target.value
                      setFilters((prev) => ({ ...prev, vicaTempMin: v === "" ? undefined : Number(v) }))
                    }}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">До</label>
                  <Input
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    placeholder={filterOptions.vicaTempMax?.toString()}
                    value={filters.vicaTempMax ?? ""}
                    onChange={(e) => {
                      const v = e.target.value
                      setFilters((prev) => ({ ...prev, vicaTempMax: v === "" ? undefined : Number(v) }))
                    }}
                  />
                </div>
              </div>
              <Slider
                value={[
                  filters.vicaTempMin ?? filterOptions.vicaTempMin,
                  filters.vicaTempMax ?? filterOptions.vicaTempMax,
                ]}
                min={filterOptions.vicaTempMin}
                max={filterOptions.vicaTempMax}
                step={0.1}
                onValueChange={([min, max]) =>
                  setFilters((prev) => ({ ...prev, vicaTempMin: Number(min.toFixed(1)), vicaTempMax: Number(max.toFixed(1)) }))
                }
              />
            </div>
          )}

          {/* Блеск */}
          {(filterOptions.glossMin !== filterOptions.glossMax && filterOptions.glossMax > 0) && (
            <div>
              <label className="text-sm font-semibold mb-2 block">Блеск, %</label>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">От</label>
                  <Input
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    placeholder={filterOptions.glossMin?.toString()}
                    value={filters.glossMin ?? ""}
                    onChange={(e) => {
                      const v = e.target.value
                      setFilters((prev) => ({ ...prev, glossMin: v === "" ? undefined : Number(v) }))
                    }}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">До</label>
                  <Input
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    placeholder={filterOptions.glossMax?.toString()}
                    value={filters.glossMax ?? ""}
                    onChange={(e) => {
                      const v = e.target.value
                      setFilters((prev) => ({ ...prev, glossMax: v === "" ? undefined : Number(v) }))
                    }}
                  />
                </div>
              </div>
              <Slider
                value={[
                  filters.glossMin ?? filterOptions.glossMin,
                  filters.glossMax ?? filterOptions.glossMax,
                ]}
                min={filterOptions.glossMin}
                max={filterOptions.glossMax}
                step={0.1}
                onValueChange={([min, max]) =>
                  setFilters((prev) => ({ ...prev, glossMin: Number(min.toFixed(1)), glossMax: Number(max.toFixed(1)) }))
                }
              />
            </div>
          )}
        </div>
      )}

      {activeFiltersCount > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.densityMin !== undefined || filters.densityMax !== undefined ? (
            <Badge variant="secondary" className="text-xs">
              Плотность: {filters.densityMin ?? "min"} - {filters.densityMax ?? "max"} кг/м³
            </Badge>
          ) : null}
          {filters.fractionMin !== undefined || filters.fractionMax !== undefined ? (
            <Badge variant="secondary" className="text-xs">
              Фракция: {filters.fractionMin ?? "min"} - {filters.fractionMax ?? "max"} мм
            </Badge>
          ) : null}
          {filters.application && filters.application.length > 0 ? (
            <Badge variant="secondary" className="text-xs">
              Применение: {filters.application.length}
            </Badge>
          ) : null}
          {filters.mfrMin !== undefined || filters.mfrMax !== undefined ? (
            <Badge variant="secondary" className="text-xs">
              MFR: {filters.mfrMin ?? "min"} - {filters.mfrMax ?? "max"} г/10 мин
            </Badge>
          ) : null}
          {filters.elongationMin !== undefined || filters.elongationMax !== undefined ? (
            <Badge variant="secondary" className="text-xs">
              Удлинение: {filters.elongationMin ?? "min"} - {filters.elongationMax ?? "max"}%
            </Badge>
          ) : null}
          {filters.impactStrengthMin !== undefined || filters.impactStrengthMax !== undefined ? (
            <Badge variant="secondary" className="text-xs">
              Ударная вязкость: {filters.impactStrengthMin ?? "min"} - {filters.impactStrengthMax ?? "max"} кДж/м²
            </Badge>
          ) : null}
          {filters.tensileStrengthMin !== undefined || filters.tensileStrengthMax !== undefined ? (
            <Badge variant="secondary" className="text-xs">
              Предел текучести: {filters.tensileStrengthMin ?? "min"} - {filters.tensileStrengthMax ?? "max"} МПа
            </Badge>
          ) : null}
          {filters.vicaTempMin !== undefined || filters.vicaTempMax !== undefined ? (
            <Badge variant="secondary" className="text-xs">
              Температура Вика: {filters.vicaTempMin ?? "min"} - {filters.vicaTempMax ?? "max"}°C
            </Badge>
          ) : null}
          {filters.glossMin !== undefined || filters.glossMax !== undefined ? (
            <Badge variant="secondary" className="text-xs">
              Блеск: {filters.glossMin ?? "min"} - {filters.glossMax ?? "max"}%
            </Badge>
          ) : null}
        </div>
      )}
    </div>
  )
}

