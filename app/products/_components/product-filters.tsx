"use client"

import { useEffect, useMemo, useState } from "react"
import { Filter, Minus, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { getNumericFilterRanges, matchesSpecRange, parseSpecifications } from "@/lib/product-specs"
import { useLanguage } from "@/contexts/language-context"
import { formatSpecValue } from "@/lib/formatters"

type Metric = keyof ReturnType<typeof getNumericFilterRanges>
type Selection = Partial<Record<Metric, { min?: number; max?: number }>>
type Product = { id: string; name: string; specifications: unknown }
const METRICS: { key: Metric; ru: string; en: string; step: number }[] = [
  { key: "density", ru: "Плотность, кг/м³", en: "Density, kg/m³", step: 1 },
  { key: "fraction", ru: "Размер основной фракции, мм", en: "Main fraction particle size, mm", step: 0.01 },
  { key: "mfr", ru: "Показатель текучести расплава, г/10 мин", en: "Melt flow rate, g/10 min", step: 0.1 },
  { key: "elongation", ru: "Относительное удлинение при разрыве, %", en: "Elongation at break, %", step: 1 },
  { key: "impactStrength", ru: "Ударная вязкость по Изоду, кДж/м²", en: "Izod impact strength, kJ/m²", step: 0.1 },
  { key: "tensileStrength", ru: "Предел текучести при растяжении, МПа", en: "Tensile yield strength, MPa", step: 0.1 },
  { key: "vicaTemp", ru: "Температура размягчения по Вика, °C", en: "Vicat softening temperature, °C", step: 1 },
  { key: "gloss", ru: "Блеск, %", en: "Gloss, %", step: 1 },
  { key: "apparentDensity", ru: "Кажущаяся плотность, кг/м³", en: "Apparent density, kg/m³", step: 0.1 },
  { key: "expansion", ru: "Коэффициент вспенивания", en: "Expansion ratio", step: 0.1 },
  { key: "relativeViscosity", ru: "Относительная вязкость", en: "Relative viscosity", step: 0.01 },
]

function applications(specs: Record<string, unknown>): string[] {
  const value = specs.Применение
  return (Array.isArray(value) ? value : typeof value === "string" ? value.split(",") : [])
    .filter((item): item is string => typeof item === "string")
    .map(item => item.trim()).filter(Boolean)
}

export function ProductFilters<T extends Product>({ products, categoryId, filterId, onFilterChange }: {
  products: T[]
  categoryId?: string
  filterId: string
  onFilterChange: (products: T[]) => void
}) {
  const { lang } = useLanguage()
  const en = lang === "en"
  const panelId = filterId
  const [isHydrated, setIsHydrated] = useState(false)
  useEffect(() => { setIsHydrated(true) }, [])
  const [isOpen, setIsOpen] = useState(false)
  const [ranges, setRanges] = useState<Selection>({})
  const [selectedApplications, setSelectedApplications] = useState<string[]>([])
  const [selectedGrades, setSelectedGrades] = useState<string[]>([])
  const prepared = useMemo(() => products.map(product => {
    const specs = parseSpecifications(product.specifications)
    return { product, ranges: getNumericFilterRanges(specs), applications: applications(specs), grade: String(specs.Марка ?? "") }
  }), [products])
  const options = useMemo(() => METRICS.flatMap(metric => {
    const values = prepared.flatMap(item => {
      const range = item.ranges[metric.key]
      return range ? [range.min, range.max] : []
    }).filter(Number.isFinite)
    if (!values.length) return []
    const min = Math.floor(Math.min(...values) / metric.step) * metric.step
    const max = Math.ceil(Math.max(...values) / metric.step) * metric.step
    return [{ ...metric, min: Number(min.toFixed(4)), max: Number(max.toFixed(4)) }]
  }), [prepared])
  const appOptions = useMemo(() => [...new Set(prepared.flatMap(p => p.applications))].sort(), [prepared])
  const gradeOptions = useMemo(() => categoryId === "polystyrene"
    ? [...new Set(prepared.map(p => p.grade).filter(Boolean))].sort((a, b) => a.localeCompare(b, "ru", { numeric: true })) : [], [prepared, categoryId])
  const filtered = useMemo(() => prepared.filter(item =>
    (!selectedApplications.length || selectedApplications.some(app => item.applications.includes(app))) &&
    (!selectedGrades.length || selectedGrades.includes(item.grade)) &&
    METRICS.every(({ key }) => matchesSpecRange(item.ranges[key], ranges[key]?.min, ranges[key]?.max))
  ).map(item => item.product), [prepared, ranges, selectedApplications, selectedGrades])
  useEffect(() => { onFilterChange(filtered) }, [filtered, onFilterChange])
  const activeCount = Object.values(ranges).filter(v => v.min !== undefined || v.max !== undefined).length
    + Number(selectedApplications.length > 0) + Number(selectedGrades.length > 0)
  const reset = () => { setRanges({}); setSelectedApplications([]); setSelectedGrades([]) }
  const toggle = (values: string[], value: string) => values.includes(value) ? values.filter(v => v !== value) : [...values, value]

  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <button type="button" disabled={!isHydrated} aria-expanded={isOpen} aria-controls={panelId} onClick={() => setIsOpen(open => !open)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:border-primary/50 transition-colors bg-card">
          <Filter className="w-4 h-4" /><span className="font-medium">{en ? "Filters" : "Фильтры"}</span>
          {activeCount > 0 && <Badge variant="secondary">{activeCount}</Badge>}
          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>
        {activeCount > 0 && <Button type="button" variant="ghost" size="sm" onClick={reset}><X className="w-4 h-4 mr-2" />{en ? "Reset" : "Сбросить"}</Button>}
      </div>
      {isOpen && <div id={panelId} className="bg-card border border-border rounded-2xl p-4 sm:p-6 space-y-6">
        <p className="text-sm text-muted-foreground" aria-live="polite">{(en ? "Found: " : "Найдено: ") + filtered.length + (en ? " of " : " из ") + products.length}</p>
        {gradeOptions.length > 0 && <fieldset><legend className="text-sm font-semibold mb-2">{en ? "Grade" : "Марка"}</legend>
          <div className="flex flex-wrap gap-2">{gradeOptions.map(grade => <Button type="button" key={grade} size="sm" variant={selectedGrades.includes(grade) ? "default" : "outline"}
            aria-pressed={selectedGrades.includes(grade)} onClick={() => setSelectedGrades(toggle(selectedGrades, grade))}>{String(formatSpecValue("Марка", grade, en ? "en" : "ru"))}</Button>)}</div>
        </fieldset>}
        {appOptions.length > 0 && <fieldset><legend className="text-sm font-semibold mb-2">{en ? "Application" : "Применение"}</legend>
          <div className="flex flex-wrap gap-2">{appOptions.map(app => <Button type="button" key={app} size="sm" className="h-auto whitespace-normal text-left" variant={selectedApplications.includes(app) ? "default" : "outline"}
            aria-pressed={selectedApplications.includes(app)} onClick={() => setSelectedApplications(toggle(selectedApplications, app))}>{String(formatSpecValue("Применение", app, en ? "en" : "ru"))}</Button>)}</div>
        </fieldset>}
        <div className="grid gap-6 md:grid-cols-2">
          {options.map(metric => {
            const selected = ranges[metric.key] || {}
            const invalid = selected.min !== undefined && selected.max !== undefined && selected.min > selected.max
            const label = en ? metric.en : metric.ru
            return <fieldset key={metric.key} className="min-w-0" data-filter-metric={metric.key}>
              <legend className="text-sm font-semibold mb-2">{label}</legend>
              <div className="grid grid-cols-2 gap-3 mb-3">{(["min", "max"] as const).map(bound => {
                const id = panelId + "-" + metric.key + "-" + bound
                return <div key={bound}><label htmlFor={id} className="text-xs text-muted-foreground mb-1 block">{bound === "min" ? en ? "From" : "От" : en ? "To" : "До"}</label>
                  <Input id={id} type="number" step="any" inputMode="decimal" aria-invalid={invalid}
                    aria-label={label + ": " + (bound === "min" ? en ? "from" : "от" : en ? "to" : "до")}
                    value={selected[bound] ?? ""} placeholder={String(metric[bound])} onChange={event => {
                      const value = event.target.valueAsNumber
                      setRanges(prev => ({ ...prev, [metric.key]: { ...prev[metric.key], [bound]: Number.isFinite(value) ? value : undefined } }))
                    }} />
                </div>
              })}</div>
              {invalid && <p role="alert" className="text-sm text-destructive mb-2">{en ? "From must not exceed To." : "Значение «От» не должно превышать «До»."}</p>}
              {metric.min < metric.max && !invalid && <Slider min={metric.min} max={metric.max} step={metric.step}
                aria-label={label}
                value={[Math.max(metric.min, Math.min(metric.max, selected.min ?? metric.min)), Math.max(metric.min, Math.min(metric.max, selected.max ?? metric.max))]}
                onValueChange={([min, max]) => setRanges(prev => ({ ...prev, [metric.key]: { min, max } }))} />}
            </fieldset>
          })}
        </div>
        {!options.length && !appOptions.length && !gradeOptions.length && <p className="text-sm text-muted-foreground">{en ? "No comparable filter values are available in this section." : "В этом разделе пока нет сопоставимых значений для фильтрации."}</p>}
      </div>}
    </div>
  )
}

