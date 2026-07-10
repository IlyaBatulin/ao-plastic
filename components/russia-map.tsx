"use client"

import { useEffect, useMemo, useRef, useState, useCallback } from "react"
import { geoConicEqualArea, geoPath, type GeoPermissibleObjects } from "d3-geo"
import am5geodata_russiaLow from "@amcharts/amcharts5-geodata/russiaLow"
import { Plus, Minus, Home } from "lucide-react"

type City = {
  name: string
  nameEn: string
  lat: number
  lon: number
  /** Крупные города подписаны всегда; остальные — на десктопе */
  major?: boolean
  /** Положение подписи: top | bottom (по умолчанию bottom) */
  labelPos?: "top" | "bottom"
  labelDx?: number
}

/** Города поставок — только Россия. */
const CITIES: City[] = [
  { name: "Санкт-Петербург", nameEn: "St. Petersburg", lat: 59.93, lon: 30.34, major: true, labelPos: "top" },
  { name: "Калининград", nameEn: "Kaliningrad", lat: 54.71, lon: 20.51, major: true },
  { name: "Мурманск", nameEn: "Murmansk", lat: 68.96, lon: 33.08 },
  { name: "Москва", nameEn: "Moscow", lat: 55.75, lon: 37.62, major: true, labelPos: "top", labelDx: 10 },
  { name: "Воронеж", nameEn: "Voronezh", lat: 51.67, lon: 39.18, labelDx: -12 },
  { name: "Ростов-на-Дону", nameEn: "Rostov-on-Don", lat: 47.23, lon: 39.72, major: true },
  { name: "Краснодар", nameEn: "Krasnodar", lat: 45.04, lon: 38.98, labelDx: -16 },
  { name: "Волгоград", nameEn: "Volgograd", lat: 48.71, lon: 44.51, labelDx: 14 },
  { name: "Нижний Новгород", nameEn: "N. Novgorod", lat: 56.33, lon: 44.01, labelPos: "top", labelDx: 16 },
  { name: "Казань", nameEn: "Kazan", lat: 55.83, lon: 49.07, major: true, labelDx: -8 },
  { name: "Самара", nameEn: "Samara", lat: 53.2, lon: 50.1, labelDx: 8 },
  { name: "Уфа", nameEn: "Ufa", lat: 54.74, lon: 55.97 },
  { name: "Пермь", nameEn: "Perm", lat: 58.01, lon: 56.25, labelPos: "top", labelDx: -8 },
  { name: "Екатеринбург", nameEn: "Yekaterinburg", lat: 56.84, lon: 60.61, major: true, labelPos: "top", labelDx: 16 },
  { name: "Челябинск", nameEn: "Chelyabinsk", lat: 55.16, lon: 61.44, labelDx: 16 },
  { name: "Тюмень", nameEn: "Tyumen", lat: 57.15, lon: 65.53 },
  { name: "Омск", nameEn: "Omsk", lat: 54.99, lon: 73.32 },
  { name: "Новосибирск", nameEn: "Novosibirsk", lat: 55.01, lon: 82.94, major: true },
  { name: "Томск", nameEn: "Tomsk", lat: 56.5, lon: 84.97, labelPos: "top" },
  { name: "Красноярск", nameEn: "Krasnoyarsk", lat: 56.02, lon: 92.89, major: true, labelPos: "top" },
  { name: "Иркутск", nameEn: "Irkutsk", lat: 52.3, lon: 104.3 },
  { name: "Якутск", nameEn: "Yakutsk", lat: 62.04, lon: 129.68 },
  { name: "Магадан", nameEn: "Magadan", lat: 59.56, lon: 150.83, labelPos: "top" },
  { name: "Владивосток", nameEn: "Vladivostok", lat: 43.12, lon: 131.89, major: true },
]

const FACTORY = { name: "Узловая", nameEn: "Uzlovaya", lat: 54.01, lon: 38.08 }

/**
 * «Паутина» поставок: каждый город соединён с двумя ближайшими,
 * завод — с крупными хабами. Пары считаются один раз.
 */
const WEB_EDGES: Array<[City | typeof FACTORY, City | typeof FACTORY]> = (() => {
  const nodes: Array<City | typeof FACTORY> = [FACTORY, ...CITIES]
  const seen = new Set<string>()
  const edges: Array<[City | typeof FACTORY, City | typeof FACTORY]> = []

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
      .filter((other) => other !== node)
      .sort((a, b) => dist(node, a) - dist(node, b))
      .slice(0, 2)
      .forEach((other) => push(node, other))
  }
  CITIES.filter((c) => c.major).forEach((hub) => push(FACTORY, hub))

  return edges
})()

const VIEW_W = 1200
const VIEW_H = 640
const PAD = 28
const MAX_ZOOM = 8

const geodata = am5geodata_russiaLow as unknown as GeoJSON.FeatureCollection

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
  const [isNarrow, setIsNarrow] = useState(false)
  const [mounted, setMounted] = useState(false)
  const dragRef = useRef<{ startX: number; startY: number; baseX: number; baseY: number; moved: boolean } | null>(null)
  const pinchRef = useRef<{ dist: number; k: number } | null>(null)

  useEffect(() => {
    setMounted(true)
    const check = () => setIsNarrow((containerRef.current?.clientWidth ?? 1200) < 700)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  // Коническая равновеликая проекция — «атласный» вид России,
  // вписанный в viewBox по реальным проекционным границам (fitExtent).
  const { regionPaths, project } = useMemo(() => {
    const projection = geoConicEqualArea()
      .rotate([-100, 0])
      .parallels([50, 70])
      .fitExtent(
        [
          [PAD, PAD],
          [VIEW_W - PAD, VIEW_H - PAD - 14],
        ],
        geodata as GeoPermissibleObjects
      )
    const path = geoPath(projection)
    const regions = geodata.features.map((f) => ({
      d: path(f as GeoPermissibleObjects) ?? "",
      name: String((f.properties as { name?: string })?.name ?? ""),
      id: String(f.id ?? (f.properties as { id?: string })?.id ?? Math.random()),
    }))
    return {
      regionPaths: regions,
      project: (lon: number, lat: number) => projection([lon, lat]) ?? [0, 0],
    }
  }, [])

  const cityPoints = useMemo(
    () =>
      CITIES.map((c) => {
        const [x, y] = project(c.lon, c.lat)
        return { ...c, x, y }
      }),
    [project]
  )
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
    // не даём укатить карту дальше 60% ширины за край
    const limX = VIEW_W * (k - 1) * 0.5 + VIEW_W * 0.1
    const limY = VIEW_H * (k - 1) * 0.5 + VIEW_H * 0.1
    return {
      k,
      x: Math.min(limX, Math.max(-limX, t.x)),
      y: Math.min(limY, Math.max(-limY, t.y)),
    }
  }, [])

  const zoomBy = useCallback(
    (factor: number) => {
      setTransform((t) => {
        // зум к центру вьюпорта
        const k = Math.min(MAX_ZOOM, Math.max(1, t.k * factor))
        const ratio = k / t.k
        return clampTransform({ k, x: t.x * ratio, y: t.y * ratio })
      })
    },
    [clampTransform]
  )

  const resetView = useCallback(() => setTransform({ k: 1, x: 0, y: 0 }), [])

  // Пан мышью/пальцем + пинч-зум
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
    dragRef.current = null
    pinchRef.current = null
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

  // Обратный масштаб: точки/подписи/линии не распухают при зуме
  const inv = 1 / transform.k
  const cityName = (c: { name: string; nameEn: string }) => (lang === "en" ? c.nameEn : c.name)

  return (
    <div
      ref={containerRef}
      className="group relative h-full w-full touch-pan-y overflow-hidden"
      onPointerLeave={() => setTooltip(null)}
    >
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="h-full w-full cursor-grab select-none active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onTouchMove={onTouchMove}
        role="img"
        aria-label={lang === "en" ? "Delivery map of Russia" : "Карта поставок по России"}
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
            <stop offset="0%" stopColor="#0046FF" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#0046FF" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g
          transform={`translate(${VIEW_W / 2 + transform.x} ${VIEW_H / 2 + transform.y}) scale(${transform.k}) translate(${-VIEW_W / 2} ${-VIEW_H / 2})`}
        >
          {/* Страна */}
          <g filter="url(#rm-shadow)" className={mounted ? "rm-fade-in" : "opacity-0"}>
            {regionPaths.map((r) => (
              <path
                key={r.id}
                d={r.d}
                fill={hoverRegion === r.id ? "#d3e0f6" : "url(#rm-land)"}
                stroke="#ffffff"
                strokeWidth={0.9 * inv}
                style={{ transition: "fill 250ms ease" }}
                onMouseEnter={(e) => {
                  setHoverRegion(r.id)
                  if (r.name) showTooltip(e, r.name)
                }}
                onMouseMove={(e) => r.name && showTooltip(e, r.name)}
                onMouseLeave={() => {
                  setHoverRegion(null)
                  setTooltip(null)
                }}
              />
            ))}
          </g>

          {/* Паутина поставок */}
          <g className={mounted ? "rm-web-in" : "opacity-0"}>
            {webLines.map((l) => (
              <line
                key={l.key}
                x1={l.x1}
                y1={l.y1}
                x2={l.x2}
                y2={l.y2}
                stroke="#2c53c7"
                strokeWidth={0.8 * inv}
                strokeOpacity="0.18"
                strokeLinecap="round"
              />
            ))}
          </g>

          {/* Города */}
          {cityPoints.map((c, i) => {
            const onTop = c.labelPos === "top"
            const showLabel = c.major || !isNarrow
            return (
              <g
                key={c.name}
                transform={`translate(${c.x} ${c.y}) scale(${inv})`}
                className={mounted ? "rm-city-in" : "opacity-0"}
                style={{ animationDelay: `${600 + ((c.lon - 20) / 131) * 1100}ms` }}
              >
                <circle r="10" fill="none" stroke="#1e3a8a" strokeOpacity="0.35" strokeWidth="1" className="rm-pulse" style={{ animationDelay: `${(i % 6) * 400}ms` }} />
                <circle
                  r={isNarrow ? 3.2 : 3.8}
                  fill="#1e3a8a"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  className="rm-dot"
                  onMouseEnter={(e) => showTooltip(e, cityName(c))}
                  onMouseMove={(e) => showTooltip(e, cityName(c))}
                  onMouseLeave={() => setTooltip(null)}
                />
                {showLabel && (
                  <text
                    x={c.labelDx ?? 0}
                    y={onTop ? -8 : 14}
                    textAnchor="middle"
                    fontSize={isNarrow ? 10 : 11.5}
                    fontWeight={500}
                    fill="#33415c"
                    stroke="#ffffff"
                    strokeWidth="3"
                    paintOrder="stroke"
                    style={{ pointerEvents: "none" }}
                  >
                    {cityName(c)}
                  </text>
                )}
              </g>
            )
          })}

          {/* Завод — Узловая */}
          <g
            transform={`translate(${factoryPoint.x} ${factoryPoint.y}) scale(${inv})`}
            className={mounted ? "rm-city-in" : "opacity-0"}
            style={{ animationDelay: "400ms" }}
          >
            <circle r="26" fill="url(#rm-glow)" />
            <circle r="14" fill="none" stroke="#0046FF" strokeOpacity="0.5" strokeWidth="1.2" className="rm-pulse" />
            <circle r="14" fill="none" stroke="#0046FF" strokeOpacity="0.5" strokeWidth="1.2" className="rm-pulse" style={{ animationDelay: "1100ms" }} />
            <circle
              r={isNarrow ? 5.5 : 6.5}
              fill="#0046FF"
              stroke="#ffffff"
              strokeWidth="2"
              className="rm-dot"
              onMouseEnter={(e) => showTooltip(e, factoryLabel)}
              onMouseMove={(e) => showTooltip(e, factoryLabel)}
              onMouseLeave={() => setTooltip(null)}
            />
            <text
              x={isNarrow ? 10 : 0}
              y={isNarrow ? 4 : 20}
              textAnchor={isNarrow ? "start" : "middle"}
              fontSize={isNarrow ? 10.5 : 12.5}
              fontWeight={700}
              fill="#0f1e42"
              stroke="#ffffff"
              strokeWidth="3.5"
              paintOrder="stroke"
              style={{ pointerEvents: "none" }}
            >
              {factoryLabel}
            </text>
          </g>
        </g>
      </svg>

      {/* Управление масштабом */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-1.5 opacity-90">
        {[
          { icon: Plus, action: () => zoomBy(1.5), label: lang === "en" ? "Zoom in" : "Приблизить" },
          { icon: Minus, action: () => zoomBy(1 / 1.5), label: lang === "en" ? "Zoom out" : "Отдалить" },
          { icon: Home, action: resetView, label: lang === "en" ? "Reset view" : "Сбросить вид" },
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

      {/* Тултип */}
      {tooltip && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[130%] whitespace-nowrap rounded-lg bg-[#0f1e42]/95 px-3 py-1.5 text-xs font-medium text-white shadow-lg"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.text}
        </div>
      )}

    </div>
  )
}

export default RussiaMap
