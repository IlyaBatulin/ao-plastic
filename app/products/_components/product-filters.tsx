"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { parseSpecNumberRange } from "@/lib/product-specs"
import { useLanguage } from "@/contexts/language-context"
import { formatSpecKey } from "@/lib/formatters"

type FilterValues = {
  densityMin?: number
  densityMax?: number
  fractionMin?: number
  fractionMax?: number
  application?: string[]
  grade?: string[]
  apparentDensityMin?: number
  apparentDensityMax?: number
  expansionMin?: number
  expansionMax?: number
  relativeViscosityMin?: number
  relativeViscosityMax?: number
  stress?: number
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

function collectApplications(specs: Record<string, unknown>): string[] {
  const raw = specs.Применение
  if (Array.isArray(raw)) {
    return raw.filter((item): item is string => typeof item === "string" && item.length > 0)
  }
  if (typeof raw === "string" && raw.trim()) {
    return raw.split(",").map((item) => item.trim()).filter(Boolean)
  }
  return []
}

type Product = {
  id: string
  name: string
  specifications: any
}

export function ProductFilters({
  products,
  categoryId,
  onFilterChange,
}: {
  products: Product[]
  categoryId?: string
  onFilterChange: (filtered: Product[]) => void
}) {
  const [filters, setFilters] = useState<FilterValues>({})
  const [isOpen, setIsOpen] = useState(false)
  const isPolystyrene = categoryId === "polystyrene"
  const { t, lang } = useLanguage()
  const specLang = lang === "en" ? "en" : "ru"
  const spec = (key: string) => formatSpecKey(key, specLang)
  const filterTitle = t("homePage.catalog.productFilters.title") || (specLang === "en" ? "Filters" : "Фильтры")
  const resetLabel = t("homePage.catalog.productFilters.reset") || (specLang === "en" ? "Reset" : "Сбросить")
  const fromLabel = t("homePage.catalog.productFilters.from") || (specLang === "en" ? "From" : "От")
  const toLabel = t("homePage.catalog.productFilters.to") || (specLang === "en" ? "To" : "До")

  const polystyreneFilterOptions = useMemo(() => {
    if (!isOpen) {
      return {
        applications: [] as string[],
        grades: [] as string[],
        apparentDensityMin: 0,
        apparentDensityMax: 50,
        expansionMin: 0,
        expansionMax: 80,
        relativeViscosityMin: 0,
        relativeViscosityMax: 5,
        hasApparentDensity: false,
        hasExpansion: false,
        hasRelativeViscosity: false,
      }
    }

    const applications = new Set<string>()
    const grades = new Set<string>()
    const apparentDensities: number[] = []
    const expansions: number[] = []
    const viscosities: number[] = []

    products.forEach((product) => {
      const specs = typeof product.specifications === "string"
        ? JSON.parse(product.specifications)
        : product.specifications || {}

      collectApplications(specs).forEach((app) => applications.add(app))

      if (specs.Марка) {
        grades.add(String(specs.Марка))
      }

      const apparentDensity = parseSpecNumberRange(specs.Кажущаяся_плотность_кг_м3)
      if (apparentDensity) {
        apparentDensities.push(apparentDensity.min, apparentDensity.max)
      }

      const expansion = parseSpecNumberRange(specs["Коэффициент вспенивания"])
      if (expansion) {
        expansions.push(expansion.min, expansion.max)
      }

      const viscosity = parseSpecNumberRange(specs.Относительная_вязкость)
      if (viscosity) {
        viscosities.push(viscosity.min, viscosity.max)
      }
    })

    const dens = apparentDensities.filter((d) => Number.isFinite(d))
    const exp = expansions.filter((e) => Number.isFinite(e))
    const visc = viscosities.filter((v) => Number.isFinite(v))

    return {
      applications: Array.from(applications).sort(),
      grades: Array.from(grades).sort((a, b) => a.localeCompare(b, "ru")),
      apparentDensityMin: dens.length ? Math.min(...dens) : 0,
      apparentDensityMax: dens.length ? Math.max(...dens) : 50,
      expansionMin: exp.length ? Math.min(...exp) : 0,
      expansionMax: exp.length ? Math.max(...exp) : 80,
      relativeViscosityMin: visc.length ? Math.min(...visc) : 0,
      relativeViscosityMax: visc.length ? Math.max(...visc) : 5,
      hasApparentDensity: dens.length > 0,
      hasExpansion: exp.length > 0,
      hasRelativeViscosity: visc.length > 0 && visc.some((v) => v > 0),
    }
  }, [products, isOpen])

  // Извлекаем уникальные значения для фильтров АБС
  const filterOptions = useMemo(() => {
    if (!isOpen) {
      return {
        applications: [] as string[],
        densityMin: 0,
        densityMax: 100,
        fractionMin: 0,
        fractionMax: 3,
        mfrMin: 0,
        mfrMax: 30,
        elongationMin: 0,
        elongationMax: 50,
        impactStrengthMin: 0,
        impactStrengthMax: 50,
        tensileStrengthMin: 0,
        tensileStrengthMax: 500,
        vicaTempMin: 0,
        vicaTempMax: 120,
        glossMin: 0,
        glossMax: 100,
      }
    }

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

      collectApplications(specs).forEach((app) => applications.add(app))

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
  }, [products, isOpen])

  const filteredPolystyreneProducts = useMemo(() => {
    return products.filter((product) => {
      const specs = typeof product.specifications === "string"
        ? JSON.parse(product.specifications)
        : product.specifications || {}

      if (filters.grade && filters.grade.length > 0) {
        const grade = specs.Марка ? String(specs.Марка) : ""
        if (!filters.grade.includes(grade)) return false
      }

      if (filters.application && filters.application.length > 0) {
        const productApplications = collectApplications(specs)
        const hasMatch = filters.application.some((app) => productApplications.includes(app))
        if (!hasMatch) return false
      }

      if (filters.apparentDensityMin !== undefined || filters.apparentDensityMax !== undefined) {
        const range = parseSpecNumberRange(specs.Кажущаяся_плотность_кг_м3)
        if (!range) return false
        if (filters.apparentDensityMin !== undefined && range.max < filters.apparentDensityMin) return false
        if (filters.apparentDensityMax !== undefined && range.min > filters.apparentDensityMax) return false
      }

      if (filters.expansionMin !== undefined || filters.expansionMax !== undefined) {
        const range = parseSpecNumberRange(specs["Коэффициент вспенивания"])
        if (!range) return false
        if (filters.expansionMin !== undefined && range.max < filters.expansionMin) return false
        if (filters.expansionMax !== undefined && range.min > filters.expansionMax) return false
      }

      if (filters.relativeViscosityMin !== undefined || filters.relativeViscosityMax !== undefined) {
        const range = parseSpecNumberRange(specs.Относительная_вязкость)
        if (!range) return false
        if (filters.relativeViscosityMin !== undefined && range.max < filters.relativeViscosityMin) return false
        if (filters.relativeViscosityMax !== undefined && range.min > filters.relativeViscosityMax) return false
      }

      return true
    })
  }, [products, filters])

  // Функция фильтрации АБС
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

      if (filters.application && filters.application.length > 0) {
        const productApplications = collectApplications(specs)
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

  const effectiveFilteredProducts = isPolystyrene ? filteredPolystyreneProducts : filteredProducts
  const lastFilteredIdsRef = useRef<string>("")

  useEffect(() => {
    const ids = effectiveFilteredProducts.map((product) => product.id).join("|")
    if (ids === lastFilteredIdsRef.current) return
    lastFilteredIdsRef.current = ids
    onFilterChange(effectiveFilteredProducts)
  }, [effectiveFilteredProducts, onFilterChange])

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (isPolystyrene) {
      if (filters.grade && filters.grade.length > 0) count++
      if (filters.application && filters.application.length > 0) count++
      if (filters.apparentDensityMin !== undefined || filters.apparentDensityMax !== undefined) count++
      if (filters.expansionMin !== undefined || filters.expansionMax !== undefined) count++
      if (filters.relativeViscosityMin !== undefined || filters.relativeViscosityMax !== undefined) count++
      return count
    }
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
  }, [filters, isPolystyrene])

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

  const toggleGrade = (grade: string) => {
    setFilters((prev) => {
      const current = prev.grade || []
      const updated = current.includes(grade)
        ? current.filter((g) => g !== grade)
        : [...current, grade]
      return { ...prev, grade: updated.length > 0 ? updated : undefined }
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
          <span className="font-medium">{filterTitle}</span>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </button>

        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground">
            <X className="w-4 h-4 mr-2" />
            {resetLabel}
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
          {isPolystyrene ? (
            <>
              {polystyreneFilterOptions.grades.length > 0 && (
                <div>
                  <label className="text-sm font-semibold mb-2 block">{spec("Марка")}</label>
                  <div className="flex flex-wrap gap-2">
                    {polystyreneFilterOptions.grades.map((grade) => {
                      const isSelected = filters.grade?.includes(grade)
                      return (
                        <Button
                          key={grade}
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleGrade(grade)}
                          className="text-xs"
                        >
                          {grade}
                        </Button>
                      )
                    })}
                  </div>
                </div>
              )}

              {polystyreneFilterOptions.applications.length > 0 && (
                <div>
                  <label className="text-sm font-semibold mb-2 block">{spec("Применение")}</label>
                  <div className="flex flex-wrap gap-2">
                    {polystyreneFilterOptions.applications.map((app) => {
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
              )}

              {polystyreneFilterOptions.hasApparentDensity &&
                polystyreneFilterOptions.apparentDensityMin !== polystyreneFilterOptions.apparentDensityMax && (
                <div>
                  <label className="text-sm font-semibold mb-2 block">{spec("Кажущаяся_плотность_кг_м3")}</label>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">{fromLabel}</label>
                      <Input
                        type="number"
                        inputMode="decimal"
                        placeholder={polystyreneFilterOptions.apparentDensityMin?.toString()}
                        value={filters.apparentDensityMin ?? ""}
                        onChange={(e) => {
                          const v = e.target.value
                          setFilters((prev) => ({
                            ...prev,
                            apparentDensityMin: v === "" ? undefined : Number(v),
                          }))
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">{toLabel}</label>
                      <Input
                        type="number"
                        inputMode="decimal"
                        placeholder={polystyreneFilterOptions.apparentDensityMax?.toString()}
                        value={filters.apparentDensityMax ?? ""}
                        onChange={(e) => {
                          const v = e.target.value
                          setFilters((prev) => ({
                            ...prev,
                            apparentDensityMax: v === "" ? undefined : Number(v),
                          }))
                        }}
                      />
                    </div>
                  </div>
                  <Slider
                    value={[
                      filters.apparentDensityMin ?? polystyreneFilterOptions.apparentDensityMin,
                      filters.apparentDensityMax ?? polystyreneFilterOptions.apparentDensityMax,
                    ]}
                    min={polystyreneFilterOptions.apparentDensityMin}
                    max={polystyreneFilterOptions.apparentDensityMax}
                    step={1}
                    onValueChange={([min, max]) =>
                      setFilters((prev) => ({ ...prev, apparentDensityMin: min, apparentDensityMax: max }))
                    }
                  />
                </div>
              )}

              {polystyreneFilterOptions.hasExpansion &&
                polystyreneFilterOptions.expansionMin !== polystyreneFilterOptions.expansionMax && (
                <div>
                  <label className="text-sm font-semibold mb-2 block">{spec("Коэффициент вспенивания")}</label>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">{fromLabel}</label>
                      <Input
                        type="number"
                        inputMode="decimal"
                        placeholder={polystyreneFilterOptions.expansionMin?.toString()}
                        value={filters.expansionMin ?? ""}
                        onChange={(e) => {
                          const v = e.target.value
                          setFilters((prev) => ({
                            ...prev,
                            expansionMin: v === "" ? undefined : Number(v),
                          }))
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">{toLabel}</label>
                      <Input
                        type="number"
                        inputMode="decimal"
                        placeholder={polystyreneFilterOptions.expansionMax?.toString()}
                        value={filters.expansionMax ?? ""}
                        onChange={(e) => {
                          const v = e.target.value
                          setFilters((prev) => ({
                            ...prev,
                            expansionMax: v === "" ? undefined : Number(v),
                          }))
                        }}
                      />
                    </div>
                  </div>
                  <Slider
                    value={[
                      filters.expansionMin ?? polystyreneFilterOptions.expansionMin,
                      filters.expansionMax ?? polystyreneFilterOptions.expansionMax,
                    ]}
                    min={polystyreneFilterOptions.expansionMin}
                    max={polystyreneFilterOptions.expansionMax}
                    step={1}
                    onValueChange={([min, max]) =>
                      setFilters((prev) => ({ ...prev, expansionMin: min, expansionMax: max }))
                    }
                  />
                </div>
              )}

              {polystyreneFilterOptions.hasRelativeViscosity &&
                polystyreneFilterOptions.relativeViscosityMin !== polystyreneFilterOptions.relativeViscosityMax && (
                <div>
                  <label className="text-sm font-semibold mb-2 block">{spec("Относительная_вязкость")}</label>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">{fromLabel}</label>
                      <Input
                        type="number"
                        inputMode="decimal"
                        step="0.01"
                        placeholder={polystyreneFilterOptions.relativeViscosityMin?.toString()}
                        value={filters.relativeViscosityMin ?? ""}
                        onChange={(e) => {
                          const v = e.target.value
                          setFilters((prev) => ({
                            ...prev,
                            relativeViscosityMin: v === "" ? undefined : Number(v),
                          }))
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">{toLabel}</label>
                      <Input
                        type="number"
                        inputMode="decimal"
                        step="0.01"
                        placeholder={polystyreneFilterOptions.relativeViscosityMax?.toString()}
                        value={filters.relativeViscosityMax ?? ""}
                        onChange={(e) => {
                          const v = e.target.value
                          setFilters((prev) => ({
                            ...prev,
                            relativeViscosityMax: v === "" ? undefined : Number(v),
                          }))
                        }}
                      />
                    </div>
                  </div>
                  <Slider
                    value={[
                      filters.relativeViscosityMin ?? polystyreneFilterOptions.relativeViscosityMin,
                      filters.relativeViscosityMax ?? polystyreneFilterOptions.relativeViscosityMax,
                    ]}
                    min={polystyreneFilterOptions.relativeViscosityMin}
                    max={polystyreneFilterOptions.relativeViscosityMax}
                    step={0.01}
                    onValueChange={([min, max]) =>
                      setFilters((prev) => ({
                        ...prev,
                        relativeViscosityMin: Number(min.toFixed(2)),
                        relativeViscosityMax: Number(max.toFixed(2)),
                      }))
                    }
                  />
                </div>
              )}
            </>
          ) : (
            <>
          {/* Плотность */}
          <div>
            <label className="text-sm font-semibold mb-2 block">{spec("Плотность_кг_м3")}</label>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">{fromLabel}</label>
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
                <label className="text-xs text-muted-foreground mb-1 block">{toLabel}</label>
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
            <label className="text-sm font-semibold mb-2 block">{spec("Фракция, мм")}</label>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">{fromLabel}</label>
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
                <label className="text-xs text-muted-foreground mb-1 block">{toLabel}</label>
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
            <label className="text-sm font-semibold mb-2 block">{spec("Применение")}</label>
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
              <label className="text-sm font-semibold mb-2 block">{spec("Показатель_текучести_расплава_MFR_г_10мин")}</label>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">{fromLabel}</label>
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
                  <label className="text-xs text-muted-foreground mb-1 block">{toLabel}</label>
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
              <label className="text-sm font-semibold mb-2 block">{spec("Относительное_удлинение_при_разрыве_проц")}</label>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">{fromLabel}</label>
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
                  <label className="text-xs text-muted-foreground mb-1 block">{toLabel}</label>
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
              <label className="text-sm font-semibold mb-2 block">{spec("Ударная_вязкость_по_Изоду_кДж_м2")}</label>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">{fromLabel}</label>
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
                  <label className="text-xs text-muted-foreground mb-1 block">{toLabel}</label>
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
              <label className="text-sm font-semibold mb-2 block">{spec("Предел_текучести_при_растяжении_МПа")}</label>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">{fromLabel}</label>
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
                  <label className="text-xs text-muted-foreground mb-1 block">{toLabel}</label>
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
              <label className="text-sm font-semibold mb-2 block">{spec("Температура_размягчения_по_Вика_градС")}</label>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">{fromLabel}</label>
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
                  <label className="text-xs text-muted-foreground mb-1 block">{toLabel}</label>
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
              <label className="text-sm font-semibold mb-2 block">{spec("Блеск_проц")}</label>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">{fromLabel}</label>
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
                  <label className="text-xs text-muted-foreground mb-1 block">{toLabel}</label>
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
            </>
          )}
        </div>
      )}

      {activeFiltersCount > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {isPolystyrene && filters.grade && filters.grade.length > 0 ? (
            <Badge variant="secondary" className="text-xs">
              {spec("Марка")}: {filters.grade.join(", ")}
            </Badge>
          ) : null}
          {isPolystyrene &&
          (filters.apparentDensityMin !== undefined || filters.apparentDensityMax !== undefined) ? (
            <Badge variant="secondary" className="text-xs">
              {spec("Кажущаяся_плотность_кг_м3")}: {filters.apparentDensityMin ?? "min"} - {filters.apparentDensityMax ?? "max"}
              {specLang === "en" ? " kg/m³" : " кг/м³"}
            </Badge>
          ) : null}
          {isPolystyrene && (filters.expansionMin !== undefined || filters.expansionMax !== undefined) ? (
            <Badge variant="secondary" className="text-xs">
              {spec("Коэффициент вспенивания")}: {filters.expansionMin ?? "min"} - {filters.expansionMax ?? "max"}
            </Badge>
          ) : null}
          {isPolystyrene &&
          (filters.relativeViscosityMin !== undefined || filters.relativeViscosityMax !== undefined) ? (
            <Badge variant="secondary" className="text-xs">
              {spec("Относительная_вязкость")}: {filters.relativeViscosityMin ?? "min"} - {filters.relativeViscosityMax ?? "max"}
            </Badge>
          ) : null}
          {!isPolystyrene && (filters.densityMin !== undefined || filters.densityMax !== undefined) ? (
            <Badge variant="secondary" className="text-xs">
              {spec("Плотность_кг_м3")}: {filters.densityMin ?? "min"} - {filters.densityMax ?? "max"}
              {specLang === "en" ? " kg/m³" : " кг/м³"}
            </Badge>
          ) : null}
          {!isPolystyrene && (filters.fractionMin !== undefined || filters.fractionMax !== undefined) ? (
            <Badge variant="secondary" className="text-xs">
              {spec("Фракция, мм")}: {filters.fractionMin ?? "min"} - {filters.fractionMax ?? "max"}
              {specLang === "en" ? " mm" : " мм"}
            </Badge>
          ) : null}
          {filters.application && filters.application.length > 0 ? (
            <Badge variant="secondary" className="text-xs">
              {spec("Применение")}: {isPolystyrene ? filters.application.join(", ") : filters.application.length}
            </Badge>
          ) : null}
          {!isPolystyrene && (filters.mfrMin !== undefined || filters.mfrMax !== undefined) ? (
            <Badge variant="secondary" className="text-xs">
              MFR: {filters.mfrMin ?? "min"} - {filters.mfrMax ?? "max"}
              {specLang === "en" ? " g/10 min" : " г/10 мин"}
            </Badge>
          ) : null}
          {!isPolystyrene && (filters.elongationMin !== undefined || filters.elongationMax !== undefined) ? (
            <Badge variant="secondary" className="text-xs">
              {spec("Относительное_удлинение_при_разрыве_проц")}: {filters.elongationMin ?? "min"} - {filters.elongationMax ?? "max"}%
            </Badge>
          ) : null}
          {!isPolystyrene && (filters.impactStrengthMin !== undefined || filters.impactStrengthMax !== undefined) ? (
            <Badge variant="secondary" className="text-xs">
              {spec("Ударная_вязкость_по_Изоду_кДж_м2")}: {filters.impactStrengthMin ?? "min"} - {filters.impactStrengthMax ?? "max"}
            </Badge>
          ) : null}
          {!isPolystyrene && (filters.tensileStrengthMin !== undefined || filters.tensileStrengthMax !== undefined) ? (
            <Badge variant="secondary" className="text-xs">
              {spec("Предел_текучести_при_растяжении_МПа")}: {filters.tensileStrengthMin ?? "min"} - {filters.tensileStrengthMax ?? "max"}
            </Badge>
          ) : null}
          {!isPolystyrene && (filters.vicaTempMin !== undefined || filters.vicaTempMax !== undefined) ? (
            <Badge variant="secondary" className="text-xs">
              {spec("Температура_размягчения_по_Вика_градС")}: {filters.vicaTempMin ?? "min"} - {filters.vicaTempMax ?? "max"}
            </Badge>
          ) : null}
          {!isPolystyrene && (filters.glossMin !== undefined || filters.glossMax !== undefined) ? (
            <Badge variant="secondary" className="text-xs">
              {spec("Блеск_проц")}: {filters.glossMin ?? "min"} - {filters.glossMax ?? "max"}%
            </Badge>
          ) : null}
        </div>
      )}
    </div>
  )
}

