'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Search, Filter, ArrowUpDown, Sparkles } from 'lucide-react'

export type ExtrusionProductType =
  | 'Сепаратор'
  | 'Трубка'
  | 'Шланг'
  | 'Окантовка'
  | 'Профиль'
  | 'Втулка'
  | 'Прокладка'
  | 'Облицовка'
  | 'Накладка'
  | 'Молдинг'

export type LengthKind = 'coil' | 'fixed'

export interface ExtrusionProduct {
  id: number
  type: ExtrusionProductType
  subtype: string | null
  name: string
  size_raw: string | null
  size_a_mm: number | null
  size_b_mm: number | null
  size_note: string | null
  code: string
  length_raw: string
  length_kind: LengthKind
  length_mm: number | null
  length_tolerance_raw: string | null
  source_no: number | null
}

type SortBy = 'name' | 'code' | 'size' | 'length'

const ALL_TYPES: ExtrusionProductType[] = [
  'Сепаратор',
  'Трубка',
  'Шланг',
  'Окантовка',
  'Профиль',
  'Втулка',
  'Прокладка',
  'Облицовка',
  'Накладка',
  'Молдинг',
]

interface Props {
  products: ExtrusionProduct[]
}

export function PartsExtrusionInfo({ products }: Props) {
  const [selectedTypes, setSelectedTypes] = useState<ExtrusionProductType[]>([])
  const [search, setSearch] = useState('')
  const [lengthKindFilter, setLengthKindFilter] = useState<'all' | 'coil' | 'fixed'>('all')
  const [sortBy, setSortBy] = useState<SortBy>('name')
  const [sortAsc, setSortAsc] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  const toggleType = (t: ExtrusionProductType) => {
    setSelectedTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    )
  }

  const filtered = useMemo(() => {
    let list = products.slice()

    if (selectedTypes.length > 0) {
      list = list.filter((p) => selectedTypes.includes(p.type))
    }

    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q)
      )
    }

    if (lengthKindFilter === 'coil') {
      list = list.filter((p) => p.length_kind === 'coil')
    } else if (lengthKindFilter === 'fixed') {
      list = list.filter((p) => p.length_kind === 'fixed')
    }

    list.sort((a, b) => {
      const dir = sortAsc ? 1 : -1

      if (sortBy === 'name') {
        return a.name.localeCompare(b.name) * dir
      }

      if (sortBy === 'code') {
        return a.code.localeCompare(b.code) * dir
      }

      if (sortBy === 'size') {
        const aKey = a.size_a_mm ?? Number.POSITIVE_INFINITY
        const bKey = b.size_a_mm ?? Number.POSITIVE_INFINITY
        if (aKey === bKey) {
          const a2 = a.size_b_mm ?? Number.POSITIVE_INFINITY
          const b2 = b.size_b_mm ?? Number.POSITIVE_INFINITY
          if (a2 === b2) return 0
          return a2 < b2 ? -1 * dir : 1 * dir
        }
        return aKey < bKey ? -1 * dir : 1 * dir
      }

      if (sortBy === 'length') {
        const aKey = a.length_mm ?? Number.POSITIVE_INFINITY
        const bKey = b.length_mm ?? Number.POSITIVE_INFINITY
        if (aKey === bKey) return 0
        return aKey < bKey ? -1 * dir : 1 * dir
      }

      return 0
    })

    return list
  }, [products, selectedTypes, search, lengthKindFilter, sortBy, sortAsc])

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Section - стилистика как у FilteredProductsSection */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-h2">Товары в этой категории</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
              Экструзионные изделия ДМС: сепараторы, трубки, шланги, окантовки, профили и другие
              специализированные детали для автомобильной промышленности.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>{filtered.length} изделий</span>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Поиск по названию или шифру изделия..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="h-12 px-6"
          >
            <Filter className="h-5 w-5 mr-2" />
            Фильтры
          </Button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-muted/30 rounded-2xl p-6 space-y-6 border border-border">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Type Filter */}
              <div>
                <h3 className="font-semibold mb-4 text-lg">Тип изделия</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  {ALL_TYPES.map((t) => (
                    <label
                      key={t}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <Checkbox
                        checked={selectedTypes.includes(t)}
                        onCheckedChange={() => toggleType(t)}
                      />
                      <span className="group-hover:text-primary transition-colors">{t}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Length Filter */}
              <div>
                <h3 className="font-semibold mb-4 text-lg">Длина изделия</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="lengthKind"
                      checked={lengthKindFilter === 'all'}
                      onChange={() => setLengthKindFilter('all')}
                      className="w-4 h-4"
                    />
                    <span className="group-hover:text-primary transition-colors">Все</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="lengthKind"
                      checked={lengthKindFilter === 'fixed'}
                      onChange={() => setLengthKindFilter('fixed')}
                      className="w-4 h-4"
                    />
                    <span className="group-hover:text-primary transition-colors">
                      Фиксированная длина
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="lengthKind"
                      checked={lengthKindFilter === 'coil'}
                      onChange={() => setLengthKindFilter('coil')}
                      className="w-4 h-4"
                    />
                    <span className="group-hover:text-primary transition-colors">В бухтах</span>
                  </label>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold mb-4 text-lg">Сортировка</h3>
                  <div className="space-y-3">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortBy)}
                      className="w-full p-3 rounded-lg border border-border bg-background"
                    >
                      <option value="name">По названию</option>
                      <option value="code">По шифру</option>
                      <option value="size">По размерам</option>
                      <option value="length">По длине</option>
                    </select>
                    <Button
                      variant="outline"
                      onClick={() => setSortAsc((prev) => !prev)}
                      className="w-full"
                    >
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      {sortAsc ? 'По возрастанию' : 'По убыванию'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">№</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Тип</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Наименование</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Размеры</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Шифр</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Длина</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Поставка</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {p.source_no ?? '—'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{p.type}</span>
                      {p.subtype && (
                        <span className="text-xs text-muted-foreground">({p.subtype})</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{p.name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {p.size_raw || '—'}
                  </td>
                  <td className="px-6 py-4">
                    <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
                      {p.code}
                    </code>
                  </td>
                  <td className="px-6 py-4 text-sm">{p.length_raw}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        p.length_kind === 'coil'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      }`}
                    >
                      {p.length_kind === 'coil' ? 'В бухтах' : 'Фиксированная'}
                    </span>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    Ничего не найдено по заданным фильтрам.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
