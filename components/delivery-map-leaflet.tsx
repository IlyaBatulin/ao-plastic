"use client"

import { useLayoutEffect, useRef, useState, useId } from "react"
import * as am5 from "@amcharts/amcharts5"
import * as am5map from "@amcharts/amcharts5/map"
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated"
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow"

export type MapPoint = { lat: number; lon: number; label: string; products?: string }

type DeliveryMapLeafletProps = {
  factory: MapPoint
  office: MapPoint
  regions: MapPoint[]
}

export function DeliveryMapLeaflet({ factory, office, regions }: DeliveryMapLeafletProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<am5.Root | null>(null)
  const chartId = useId().replace(/:/g, "")
  const [globeMode, setGlobeMode] = useState(false)

  useLayoutEffect(() => {
    if (!chartRef.current) return

    const root = am5.Root.new(chartId)
    rootRef.current = root

    root.setThemes([am5themes_Animated.new(root)])
    root.interfaceColors.set("background", am5.color(0x060e1f))

    const projection = globeMode
      ? am5map.geoOrthographic()
      : am5map.geoMercator()

    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: globeMode ? "rotateX" : "translateX",
        panY: globeMode ? "rotateY" : "translateY",
        projection,
        rotationX: globeMode ? -37 : 0,
        rotationY: globeMode ? 55 : 0,
      })
    )

    chart.set("zoomControl", am5map.ZoomControl.new(root, {}))

    const backgroundSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {}))
    backgroundSeries.mapPolygons.template.setAll({
      fill: root.interfaceColors.get("alternativeBackground"),
      fillOpacity: 0.1,
      strokeOpacity: 0,
    })
    backgroundSeries.data.push({
      geometry: am5map.getGeoRectangle(90, 180, -90, -180),
    })

    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        exclude: ["AQ"],
      })
    )
    polygonSeries.mapPolygons.template.setAll({
      fill: root.interfaceColors.get("alternativeBackground"),
      fillOpacity: 0.2,
      strokeWidth: 0.5,
      stroke: am5.color(0x334155),
    })

    const regionPointSeries = chart.series.push(
      am5map.MapPointSeries.new(root, {
        latitudeField: "lat",
        longitudeField: "lon",
      })
    )

    const regionPointData: {
      lat: number
      lon: number
      name: string
      fill: am5.Color
      fillBright: am5.Color
      tooltipText: string
      productLabel?: string
    }[] = regions.map((r) => ({
        lat: r.lat,
        lon: r.lon,
        name: r.label,
        fill: am5.color(0x64748b),
        fillBright: am5.color(0xcbd5e1),
        tooltipText: r.products ? `${r.label}\nТовары: ${r.products}` : r.label,
        productLabel: r.products ?? "",
      }))

    regionPointSeries.data.setAll(regionPointData)
    regionPointSeries.bullets.push(function (_root, _target, dataItem) {
      const ctx = dataItem.get("dataContext") as {
        fill?: am5.Color
        fillBright?: am5.Color
        tooltipText?: string
        productLabel?: string
      }
      const fillColor = ctx?.fill ?? am5.color(0x64748b)
      const fillBright = ctx?.fillBright ?? am5.color(0xcbd5e1)
      const container = am5.Container.new(root, { layout: root.verticalLayout })
      const glowOuter = am5.Circle.new(root, {
        radius: 10,
        fill: fillColor,
        fillOpacity: 0.22,
        strokeOpacity: 0,
      })
      const ring = am5.Circle.new(root, {
        radius: 5,
        fill: fillBright,
        fillOpacity: 0.88,
        stroke: am5.color(0xffffff),
        strokeWidth: 1,
        strokeOpacity: 0.75,
      })
      const core = am5.Circle.new(root, {
        radius: 2,
        fill: am5.color(0xffffff),
        fillOpacity: 1,
        strokeOpacity: 0,
      })
      container.children.push(glowOuter)
      container.children.push(ring)
      container.children.push(core)
      container.set("tooltipText", "{tooltipText}")
      if (ctx?.productLabel) {
        const label = am5.Label.new(root, {
          text: "{productLabel}",
          fill: am5.color(0x94a3b8),
          fontSize: 8,
          maxWidth: 86,
          wrap: true,
          centerX: am5.percent(50),
          textAlign: "center",
          paddingTop: 2,
          populateText: true,
        })
        container.children.push(label)
      }
      return am5.Bullet.new(root, { sprite: container })
    })

    const mainPointSeries = chart.series.push(
      am5map.MapPointSeries.new(root, {
        latitudeField: "lat",
        longitudeField: "lon",
      })
    )

    const mainPointData: {
      lat: number
      lon: number
      name: string
      fill: am5.Color
      fillBright: am5.Color
      tooltipText: string
      labelText: string
      captionText: string
    }[] = [
      {
        lat: factory.lat,
        lon: factory.lon,
        name: factory.label,
        fill: am5.color(0x2563eb),
        fillBright: am5.color(0x60a5fa),
        tooltipText: factory.label,
        labelText: "ЗАВОД",
        captionText: "Узловая",
      },
      {
        lat: office.lat,
        lon: office.lon,
        name: office.label,
        fill: am5.color(0x0284c7),
        fillBright: am5.color(0x7dd3fc),
        tooltipText: office.label,
        labelText: "ОФИС ПРОДАЖ",
        captionText: "Москва",
      },
    ]

    mainPointSeries.data.setAll(mainPointData)

    mainPointSeries.bullets.push(function (_root, _target, dataItem) {
      const ctx = dataItem.get("dataContext") as {
        fill?: am5.Color
        fillBright?: am5.Color
        tooltipText?: string
        labelText?: string
        captionText?: string
      }
      const fillColor = ctx?.fill ?? am5.color(0x2563eb)
      const fillBright = ctx?.fillBright ?? am5.color(0x60a5fa)
      const container = am5.Container.new(root, {})
      const glowOuter = am5.Circle.new(root, {
        radius: 44,
        fill: fillColor,
        fillOpacity: 0.16,
        strokeOpacity: 0,
      })
      const pulse = am5.Circle.new(root, {
        radius: 25,
        fillOpacity: 0,
        stroke: fillBright,
        strokeWidth: 2,
        strokeOpacity: 0.55,
      })
      const pinBase = am5.Circle.new(root, {
        radius: 19,
        fill: am5.color(0x020617),
        fillOpacity: 0.9,
        stroke: fillBright,
        strokeWidth: 3,
        strokeOpacity: 0.85,
      })
      const pinCore = am5.Circle.new(root, {
        radius: 8,
        fill: fillBright,
        fillOpacity: 0.9,
        stroke: am5.color(0xffffff),
        strokeWidth: 1.5,
      })
      const label = am5.Label.new(root, {
        text: "{labelText}\n[fontSize:11px; fontWeight:500]{captionText}[/]",
        populateText: true,
        fill: am5.color(0xffffff),
        fontSize: 13,
        fontWeight: "800",
        centerX: am5.percent(50),
        centerY: am5.percent(100),
        y: -40,
        textAlign: "center",
        paddingTop: 8,
        paddingRight: 12,
        paddingBottom: 8,
        paddingLeft: 12,
        background: am5.RoundedRectangle.new(root, {
          fill: am5.color(0x020617),
          fillOpacity: 0.86,
          stroke: fillBright,
          strokeOpacity: 0.75,
          strokeWidth: 1,
        }),
      })
      container.children.push(glowOuter)
      container.children.push(pulse)
      container.children.push(pinBase)
      container.children.push(pinCore)
      container.children.push(label)
      container.set("tooltipText", "{tooltipText}")
      glowOuter.animate({
        key: "scale",
        from: 0.85,
        to: 1.18,
        duration: 1800,
        loops: Infinity,
        easing: am5.ease.yoyo(am5.ease.inOut(am5.ease.sine)),
      })
      pulse.animate({
        key: "scale",
        from: 0.85,
        to: 1.35,
        duration: 1800,
        loops: Infinity,
        easing: am5.ease.yoyo(am5.ease.inOut(am5.ease.sine)),
      })
      pulse.animate({
        key: "opacity",
        from: 0.55,
        to: 0.18,
        duration: 1800,
        loops: Infinity,
        easing: am5.ease.yoyo(am5.ease.inOut(am5.ease.sine)),
      })
      container.states.create("hover", { scale: 1.12 })
      return am5.Bullet.new(root, { sprite: container })
    })

    chart.appear(1000, 100)

    return () => {
      root.dispose()
      rootRef.current = null
    }
  }, [chartId, globeMode, factory, office, regions])

  return (
    <div
      className="delivery-map-chart-frame relative w-full rounded-xl overflow-hidden bg-[#050d1c]"
      style={{ touchAction: "none" }}
      onWheel={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
      onTouchMove={(e) => {
        e.preventDefault()
      }}
    >
      <div
        ref={chartRef}
        id={chartId}
        className="w-full"
        style={{ height: 600 }}
      />
      <style>{`
        .delivery-map-chart-frame canvas.am5-layer-30 {
          left: 2px !important;
          top: 10px !important;
        }
      `}</style>
      <div className="pointer-events-none absolute inset-0 z-[2] rounded-xl ring-1 ring-cyan-300/20 [box-shadow:inset_0_0_80px_rgba(34,211,238,0.12)]" />
      <div className="absolute right-3 top-3 z-10 flex rounded-lg overflow-hidden border border-white/10 bg-black/50">
        <button
          type="button"
          onClick={() => setGlobeMode(false)}
          className={`px-4 py-2 text-sm font-medium transition-colors ${!globeMode ? "bg-blue-500 text-white" : "text-white/80 hover:bg-white/10"}`}
        >
          Плоская карта
        </button>
        <button
          type="button"
          onClick={() => setGlobeMode(true)}
          className={`px-4 py-2 text-sm font-medium transition-colors ${globeMode ? "bg-blue-500 text-white" : "text-white/80 hover:bg-white/10"}`}
        >
          Глобус
        </button>
      </div>
    </div>
  )
}
