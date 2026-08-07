"use client"

import { useEffect, useMemo, useRef, useState, useCallback } from "react"
import Link from "next/link"
import { geoConicEqualArea, geoPath, type GeoPermissibleObjects } from "d3-geo"
import am5geodata_russiaLow from "@amcharts/amcharts5-geodata/russiaLow"
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow"
import { Plus, Minus, Home, X, ArrowRight } from "lucide-react"

type ProductKey = "abs" | "ps" | "styrene" | "dispersion" | "household"

type City = {
  name: string
  nameEn: string
  region: string
  regionEn: string
  lat: number
  lon: number
  /** Группы продукции из таблицы поставок */
  products: ProductKey[]
}

type DestinationCountry = City & { countryId: "BY" | "KZ" | "UZ" }

const PRODUCT_LABELS: Record<ProductKey, { ru: string; en: string }> = {
  abs: { ru: "АБС-пластики", en: "ABS plastics" },
  ps: { ru: "Полистирол", en: "Polystyrene" },
  styrene: { ru: "Стирол", en: "Styrene" },
  dispersion: { ru: "Дисперсии", en: "Dispersions" },
  household: { ru: "Товары для дома", en: "Household goods" },
}

/** Города поставок — только Россия; продукция из фактической таблицы поставок. */
const CITIES: City[] = [
  { name: "Санкт-Петербург", nameEn: "St. Petersburg", region: "Санкт-Петербург", regionEn: "St. Petersburg", lat: 59.93, lon: 30.34, products: ["abs", "ps", "styrene"] },
  { name: "Калининград", nameEn: "Kaliningrad", region: "Калининградская область", regionEn: "Kaliningrad Region", lat: 54.71, lon: 20.51, products: ["abs", "ps"] },
  { name: "Мурманск", nameEn: "Murmansk", region: "Мурманская область", regionEn: "Murmansk Region", lat: 68.96, lon: 33.08, products: ["ps"] },
  { name: "Москва", nameEn: "Moscow", region: "Москва и Московская область", regionEn: "Moscow & Moscow Region", lat: 55.75, lon: 37.62, products: ["abs", "ps", "styrene"] },
  { name: "Воронеж", nameEn: "Voronezh", region: "Воронежская область", regionEn: "Voronezh Region", lat: 51.67, lon: 39.18, products: ["abs", "ps"] },
  { name: "Ростов-на-Дону", nameEn: "Rostov-on-Don", region: "Ростовская область", regionEn: "Rostov Region", lat: 47.23, lon: 39.72, products: ["abs", "ps"] },
  { name: "Краснодар", nameEn: "Krasnodar", region: "Краснодарский край", regionEn: "Krasnodar Krai", lat: 45.04, lon: 38.98, products: ["abs", "ps", "styrene"] },
  { name: "Волгоград", nameEn: "Volgograd", region: "Волгоградская область", regionEn: "Volgograd Region", lat: 48.71, lon: 44.51, products: ["abs", "ps"] },
  { name: "Нижний Новгород", nameEn: "Nizhny Novgorod", region: "Нижегородская область", regionEn: "Nizhny Novgorod Region", lat: 56.33, lon: 44.01, products: ["abs", "ps", "styrene"] },
  { name: "Казань", nameEn: "Kazan", region: "Республика Татарстан", regionEn: "Republic of Tatarstan", lat: 55.83, lon: 49.07, products: ["abs", "ps"] },
  { name: "Самара", nameEn: "Samara", region: "Самарская область", regionEn: "Samara Region", lat: 53.2, lon: 50.1, products: ["abs", "ps"] },
  { name: "Уфа", nameEn: "Ufa", region: "Республика Башкортостан", regionEn: "Republic of Bashkortostan", lat: 54.74, lon: 55.97, products: ["abs", "ps"] },
  { name: "Пермь", nameEn: "Perm", region: "Пермский край", regionEn: "Perm Krai", lat: 58.01, lon: 56.25, products: ["abs", "ps"] },
  { name: "Екатеринбург", nameEn: "Yekaterinburg", region: "Свердловская область", regionEn: "Sverdlovsk Region", lat: 56.84, lon: 60.61, products: ["abs", "ps"] },
  { name: "Челябинск", nameEn: "Chelyabinsk", region: "Челябинская область", regionEn: "Chelyabinsk Region", lat: 55.16, lon: 61.44, products: ["abs", "ps"] },
  { name: "Тюмень", nameEn: "Tyumen", region: "Тюменская область", regionEn: "Tyumen Region", lat: 57.15, lon: 65.53, products: ["abs", "ps"] },
  { name: "Омск", nameEn: "Omsk", region: "Омская область", regionEn: "Omsk Region", lat: 54.99, lon: 73.32, products: ["abs", "ps"] },
  { name: "Новосибирск", nameEn: "Novosibirsk", region: "Новосибирская область", regionEn: "Novosibirsk Region", lat: 55.01, lon: 82.94, products: ["abs", "ps"] },
  { name: "Томск", nameEn: "Tomsk", region: "Томская область", regionEn: "Tomsk Region", lat: 56.5, lon: 84.97, products: ["abs", "ps"] },
  { name: "Красноярск", nameEn: "Krasnoyarsk", region: "Красноярский край", regionEn: "Krasnoyarsk Krai", lat: 56.02, lon: 92.89, products: ["abs", "ps"] },
  { name: "Иркутск", nameEn: "Irkutsk", region: "Иркутская область", regionEn: "Irkutsk Region", lat: 52.3, lon: 104.3, products: ["abs"] },
  { name: "Якутск", nameEn: "Yakutsk", region: "Республика Саха (Якутия)", regionEn: "Republic of Sakha (Yakutia)", lat: 62.04, lon: 129.68, products: ["ps"] },
  { name: "Магадан", nameEn: "Magadan", region: "Магаданская область", regionEn: "Magadan Region", lat: 59.56, lon: 150.83, products: ["ps"] },
  { name: "Владивосток", nameEn: "Vladivostok", region: "Приморский край", regionEn: "Primorsky Krai", lat: 43.12, lon: 131.89, products: ["abs"] },
]

const DESTINATION_COUNTRIES: DestinationCountry[] = [
  {
    countryId: "BY",
    name: "Беларусь",
    nameEn: "Belarus",
    region: "Республика Беларусь",
    regionEn: "Republic of Belarus",
    lat: 53.7,
    lon: 27.9,
    products: ["abs", "ps"],
  },
  {
    countryId: "KZ",
    name: "Казахстан",
    nameEn: "Kazakhstan",
    region: "Республика Казахстан",
    regionEn: "Republic of Kazakhstan",
    lat: 48.0,
    lon: 67.0,
    products: ["ps"],
  },
  {
    countryId: "UZ",
    name: "Узбекистан",
    nameEn: "Uzbekistan",
    region: "Республика Узбекистан",
    regionEn: "Republic of Uzbekistan",
    lat: 41.4,
    lon: 64.6,
    products: ["abs", "ps"],
  },
]

const FACTORY = {
  name: "Узловая",
  nameEn: "Uzlovaya",
  region: "Тульская область",
  regionEn: "Tula Region",
  lat: 54.01,
  lon: 38.08,
  products: ["abs", "ps", "styrene", "dispersion", "household"] as ProductKey[],
}

/** «Паутина»: каждый город соединён с двумя ближайшими, завод — с хабами. */
const WEB_EDGES: Array<[{ lon: number; lat: number; name: string }, { lon: number; lat: number; name: string }]> = (() => {
  const hubs = new Set(["Москва", "Санкт-Петербург", "Казань", "Екатеринбург", "Новосибирск", "Красноярск", "Ростов-на-Дону", "Владивосток", "Калининград"])
  const nodes: Array<{ lon: number; lat: number; name: string }> = [FACTORY, ...CITIES, ...DESTINATION_COUNTRIES]
  const seen = new Set<string>()
  const edges: Array<[(typeof nodes)[number], (typeof nodes)[number]]> = []

  const push = (a: (typeof nodes)[number], b: (typeof nodes)[number]) => {
    const key = [a.name, b.name].sort().join("|")
    if (seen.has(key)) return
    seen.add(key)
    edges.push([a, b])
  }
  const dist = (a: (typeof nodes)[number], b: (typeof nodes)[number]) => {
    const kx = Math.cos(((a.lat + b.lat) / 2) * (Math.PI / 180))
    return Math.hypot((a.lon - b.lon) * kx, a.lat - b.lat)
  }
  for (const node of nodes) {
    nodes
      .filter((o) => o !== node)
      .sort((a, b) => dist(node, a) - dist(node, b))
      .slice(0, 2)
      .forEach((o) => push(node, o))
  }
  CITIES.filter((c) => hubs.has(c.name)).forEach((hub) => push(FACTORY, hub))
  return edges
})()

const VIEW_W = 1200
const VIEW_H = 640
const PAD = 30
const MAX_ZOOM = 8
/** Шаг подсветки точек, мс */
const LIGHT_STAGGER = 110

const russiaGeodata = am5geodata_russiaLow as unknown as GeoJSON.FeatureCollection
const worldGeodata = am5geodata_worldLow as unknown as GeoJSON.FeatureCollection
const destinationFeatures = worldGeodata.features.filter((feature) =>
  DESTINATION_COUNTRIES.some((country) => country.countryId === String(feature.id))
)
const mapExtentData = {
  type: "FeatureCollection",
  features: [...russiaGeodata.features, ...destinationFeatures],
} as GeoJSON.FeatureCollection

type Selected = (City | DestinationCountry | typeof FACTORY) & {
  isFactory?: boolean
  isCountry?: boolean
}

export function RussiaMap({
  lang,
  factoryLabel,
}: {
  lang: "ru" | "en"
  factoryLabel: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState({ k: 1, x: 0, y: 0 })
  const [hoverRegion, setHoverRegion] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null)
  const [selected, setSelected] = useState<Selected | null>(null)
  const [lit, setLit] = useState(false)
  const dragRef = useRef<{ startX: number; startY: number; baseX: number; baseY: number; moved: boolean } | null>(null)
  const pinchRef = useRef<{ dist: number; k: number } | null>(null)

  // Подсветка точек по очереди — когда секция долистана до карты
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLit(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setLit(true)
          observer.disconnect()
        }
      },
      { threshold: 0.35 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const { regionPaths, countryPaths, project } = useMemo(() => {
    const projection = geoConicEqualArea()
      .rotate([-100, 0])
      .parallels([50, 70])
      .fitExtent(
        [
          [PAD, PAD],
          [VIEW_W - PAD, VIEW_H - PAD - 10],
        ],
        mapExtentData as GeoPermissibleObjects
      )
    const path = geoPath(projection)
    const regions = russiaGeodata.features.map((f) => ({
      d: path(f as GeoPermissibleObjects) ?? "",
      name: String((f.properties as { name?: string })?.name ?? ""),
      id: String(f.id ?? (f.properties as { id?: string })?.id ?? Math.random()),
    }))
    const countries = destinationFeatures.flatMap((feature) => {
      const country = DESTINATION_COUNTRIES.find(
        (item) => item.countryId === String(feature.id)
      )
      if (!country) return []
      return [{
        ...country,
        d: path(feature as GeoPermissibleObjects) ?? "",
        id: country.countryId,
      }]
    })
    return {
      regionPaths: regions,
      countryPaths: countries,
      project: (lon: number, lat: number) => projection([lon, lat]) ?? [0, 0],
    }
  }, [])

  // Порядок подсветки: с запада на восток
  const cityPoints = useMemo(() => {
    const sorted = [...CITIES].sort((a, b) => a.lon - b.lon)
    return sorted.map((c, order) => {
      const [x, y] = project(c.lon, c.lat)
      return { ...c, x, y, order }
    })
  }, [project])
  const factoryPoint = useMemo(() => {
    const [x, y] = project(FACTORY.lon, FACTORY.lat)
    return { ...FACTORY, x, y }
  }, [project])
  const webLines = useMemo(
    () =>
      WEB_EDGES.map(([a, b], i) => {
        const [x1, y1] = project(a.lon, a.lat)
        const [x2, y2] = project(b.lon, b.lat)
        return { x1, y1, x2, y2, key: i }
      }),
    [project]
  )

  const clampTransform = useCallback((t: { k: number; x: number; y: number }) => {
    const k = Math.min(MAX_ZOOM, Math.max(1, t.k))
    const limX = VIEW_W * (k - 1) * 0.5 + VIEW_W * 0.1
    const limY = VIEW_H * (k - 1) * 0.5 + VIEW_H * 0.1
    return { k, x: Math.min(limX, Math.max(-limX, t.x)), y: Math.min(limY, Math.max(-limY, t.y)) }
  }, [])

  const zoomBy = useCallback(
    (factor: number) => {
      setTransform((t) => {
        const k = Math.min(MAX_ZOOM, Math.max(1, t.k * factor))
        const ratio = k / t.k
        return clampTransform({ k, x: t.x * ratio, y: t.y * ratio })
      })
    },
    [clampTransform]
  )
  const resetView = useCallback(() => setTransform({ k: 1, x: 0, y: 0 }), [])

  const onPointerDown = (e: React.PointerEvent) => {
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
    dragRef.current = { startX: e.clientX, startY: e.clientY, baseX: transform.x, baseY: transform.y, moved: false }
  }
  const onPointerMove = (e: React.PointerEvent) => {
    const drag = dragRef.current
    if (!drag) return
    const rect = containerRef.current?.getBoundingClientRect()
    const scale = rect ? VIEW_W / rect.width : 1
    const dx = (e.clientX - drag.startX) * scale
    const dy = (e.clientY - drag.startY) * scale
    if (Math.abs(dx) + Math.abs(dy) > 3) drag.moved = true
    setTransform((t) => clampTransform({ k: t.k, x: drag.baseX + dx, y: drag.baseY + dy }))
  }
  const onPointerUp = () => {
    const wasDrag = dragRef.current?.moved
    dragRef.current = null
    pinchRef.current = null
    // клик по пустому месту карты (не перетаскивание) закрывает карточку
    if (!wasDrag) setSelected(null)
  }
  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const [a, b] = [e.touches[0], e.touches[1]]
      const d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
      if (!pinchRef.current) {
        pinchRef.current = { dist: d, k: transform.k }
      } else {
        const k = pinchRef.current.k * (d / pinchRef.current.dist)
        setTransform((t) => clampTransform({ ...t, k }))
      }
    }
  }

  const showTooltip = (e: React.MouseEvent, text: string) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top, text })
  }

  const selectPoint = (point: Selected, isFactory = false) => {
    setSelected({ ...point, isFactory })
    setTooltip(null)
  }

  const productCountLabel = (count: number) =>
    en
      ? `${count} product ${count === 1 ? "category" : "categories"}`
      : `${count} ${count === 1 ? "вид продукции" : count < 5 ? "вида продукции" : "видов продукции"}`

  const inv = 1 / transform.k
  const en = lang === "en"
  const cityName = (c: { name: string; nameEn: string }) => (en ? c.nameEn : c.name)

  return (
    <div ref={containerRef} className="group relative h-full w-full touch-pan-y overflow-hidden" onPointerLeave={() => setTooltip(null)}>
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="h-full w-full cursor-grab select-none active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onTouchMove={onTouchMove}
        role="img"
        aria-label={en ? "Delivery map of Russia and CIS" : "Карта поставок по России и СНГ"}
      >
        <defs>
          <linearGradient id="rm-land" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#eef3fc" />
            <stop offset="100%" stopColor="#dde8f8" />
          </linearGradient>
          <filter id="rm-shadow" x="-8%" y="-8%" width="116%" height="120%">
            <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#0f1e42" floodOpacity="0.10" />
          </filter>
          <radialGradient id="rm-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0046FF" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#0046FF" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g transform={`translate(${VIEW_W / 2 + transform.x} ${VIEW_H / 2 + transform.y}) scale(${transform.k}) translate(${-VIEW_W / 2} ${-VIEW_H / 2})`}>
          {/* Россия и страны экспортных поставок */}
          <g filter="url(#rm-shadow)" className="rm-fade-in">
            {regionPaths.map((r) => (
              <path
                key={r.id}
                d={r.d}
                aria-label={r.name}
                fill={hoverRegion === r.id ? "#d9e4f7" : "url(#rm-land)"}
                stroke="#ffffff"
                strokeWidth={0.9 * inv}
                className="cursor-help"
                style={{ transition: "fill 250ms ease" }}
                onMouseEnter={(event) => {
                  setHoverRegion(r.id)
                  showTooltip(event, r.name)
                }}
                onMouseMove={(event) => showTooltip(event, r.name)}
                onMouseLeave={() => {
                  setHoverRegion(null)
                  setTooltip(null)
                }}
              />
            ))}
            {countryPaths.map((country) => {
              const isSelected = selected?.isCountry && selected.name === country.name
              return (
                <path
                  key={country.id}
                  d={country.d}
                  data-country={country.id}
                  aria-label={`${cityName(country)} — ${productCountLabel(country.products.length)}`}
                  role="button"
                  fill={isSelected || hoverRegion === country.id ? "#c8d9f5" : "#dce8fa"}
                  stroke="#ffffff"
                  strokeWidth={(isSelected ? 2 : 1.2) * inv}
                  className="cursor-pointer"
                  style={{ transition: "fill 200ms ease" }}
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={(event) => {
                    event.stopPropagation()
                    setSelected({ ...country, isCountry: true })
                    setTooltip(null)
                  }}
                  onMouseEnter={(event) => {
                    setHoverRegion(country.id)
                    showTooltip(event, `${cityName(country)} — ${productCountLabel(country.products.length)}`)
                  }}
                  onMouseMove={(event) =>
                    showTooltip(event, `${cityName(country)} — ${productCountLabel(country.products.length)}`)
                  }
                  onMouseLeave={() => {
                    setHoverRegion(null)
                    setTooltip(null)
                  }}
                />
              )
            })}
          </g>

          {/* Паутина поставок — проявляется после подсветки точек */}
          <g className={lit ? "rm-web-in" : "opacity-0"} style={{ animationDelay: `${CITIES.length * LIGHT_STAGGER + 400}ms` }}>
            {webLines.map((l) => (
              <line key={l.key} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="#2c53c7" strokeWidth={0.8 * inv} strokeOpacity="0.15" strokeLinecap="round" />
            ))}
          </g>

          {/* Города — точки без подписей, загораются по очереди */}
          {cityPoints.map((c) => {
            const isSelected = selected && !selected.isFactory && selected.name === c.name
            return (
              <g
                key={c.name}
                transform={`translate(${c.x} ${c.y}) scale(${inv})`}
                className={lit ? "rm-light-up" : "opacity-0"}
                style={{ animationDelay: `${300 + c.order * LIGHT_STAGGER}ms` }}
              >
                <circle r="9" fill="none" stroke="#1e3a8a" strokeOpacity="0.3" strokeWidth="1" className="rm-pulse" style={{ animationDelay: `${300 + c.order * LIGHT_STAGGER + 600}ms` }} />
                {isSelected && <circle r="8.5" fill="none" stroke="#0046FF" strokeWidth="1.6" strokeOpacity="0.85" />}
                <circle
                  r={isSelected ? 5 : 4}
                  fill={isSelected ? "#0046FF" : "#1e3a8a"}
                  stroke="#ffffff"
                  strokeWidth="1.6"
                  className="rm-dot"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation()
                    selectPoint(c)
                  }}
                  onMouseEnter={(e) => showTooltip(e, cityName(c))}
                  onMouseMove={(e) => showTooltip(e, cityName(c))}
                  onMouseLeave={() => setTooltip(null)}
                />
              </g>
            )
          })}

          {/* Завод — Узловая: самая яркая точка, загорается первой */}
          {(() => {
            const isSelected = selected?.isFactory
            return (
              <g transform={`translate(${factoryPoint.x} ${factoryPoint.y}) scale(${inv})`} className={lit ? "rm-light-up" : "opacity-0"} style={{ animationDelay: "0ms" }}>
                <circle r="30" fill="url(#rm-glow)" />
                <circle r="13" fill="none" stroke="#0046FF" strokeOpacity="0.55" strokeWidth="1.3" className="rm-pulse" style={{ animationDelay: "500ms" }} />
                <circle r="13" fill="none" stroke="#0046FF" strokeOpacity="0.55" strokeWidth="1.3" className="rm-pulse" style={{ animationDelay: "1700ms" }} />
                {isSelected && <circle r="11" fill="none" stroke="#0046FF" strokeWidth="1.8" strokeOpacity="0.9" />}
                <circle
                  r={isSelected ? 7.5 : 6.8}
                  fill="#0046FF"
                  stroke="#ffffff"
                  strokeWidth="2.2"
                  className="rm-dot"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation()
                    selectPoint(FACTORY, true)
                  }}
                  onMouseEnter={(e) => showTooltip(e, factoryLabel)}
                  onMouseMove={(e) => showTooltip(e, factoryLabel)}
                  onMouseLeave={() => setTooltip(null)}
                />
              </g>
            )
          })()}
        </g>
      </svg>

      {/* Управление масштабом */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-1.5 opacity-90">
        {[
          { icon: Plus, action: () => zoomBy(1.5), label: en ? "Zoom in" : "Приблизить" },
          { icon: Minus, action: () => zoomBy(1 / 1.5), label: en ? "Zoom out" : "Отдалить" },
          { icon: Home, action: resetView, label: en ? "Reset view" : "Сбросить вид" },
        ].map(({ icon: Icon, action, label }) => (
          <button
            key={label}
            type="button"
            onClick={action}
            aria-label={label}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/70 bg-white/95 text-primary shadow-md backdrop-blur transition-all hover:bg-primary hover:text-white active:scale-95"
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}
      </div>

      {/* Тултип при наведении */}
      {tooltip && !selected && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[130%] whitespace-nowrap rounded-lg bg-[#0f1e42]/95 px-3 py-1.5 text-xs font-medium text-white shadow-lg"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.text}
        </div>
      )}

      {/* Карточка города/завода по клику */}
      {selected && (
        <div className="absolute inset-x-3 bottom-3 z-20 sm:inset-x-auto sm:left-4 sm:bottom-4 sm:w-[330px]">
          <div className="rm-card-in relative overflow-hidden rounded-2xl border border-border/60 bg-white/95 p-5 shadow-xl backdrop-blur-md">
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label={en ? "Close" : "Закрыть"}
              className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            {selected.isFactory ? (
              <>
                <p className="text-caption mb-1 text-[#0046FF]">{en ? "Production site" : "Производственная площадка"}</p>
                <h3 className="text-lg font-semibold text-foreground">
                  {en ? "Uzlovaya — Plastik JSC" : "Узловая — АО «Пластик»"}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">{en ? selected.regionEn : selected.region}</p>
              </>
            ) : selected.isCountry ? (
              <>
                <p className="text-caption mb-1 text-primary">{en ? "Export destination" : "Страна поставок"}</p>
                <h3 className="text-lg font-semibold text-foreground">{cityName(selected)}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {productCountLabel(selected.products.length)}
                </p>
              </>
            ) : (
              <>
                <p className="text-caption mb-1 text-primary">{en ? "Delivery city" : "Город поставок"}</p>
                <h3 className="text-lg font-semibold text-foreground">{cityName(selected)}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{en ? selected.regionEn : selected.region}</p>
              </>
            )}

            <p className="mt-3 text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
              {selected.isFactory ? (en ? "We produce" : "Производим") : en ? "We deliver" : "Поставляем"}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {selected.products.map((p) => (
                <span key={p} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {en ? PRODUCT_LABELS[p].en : PRODUCT_LABELS[p].ru}
                </span>
              ))}
            </div>

            {selected.isFactory && (
              <Link
                href="/products"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0046FF] transition-colors hover:text-primary"
              >
                {en ? "Product catalog" : "Каталог продукции"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default RussiaMap
