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

    const pointSeries = chart.series.push(
      am5map.MapPointSeries.new(root, {
        latitudeField: "lat",
        longitudeField: "lon",
      })
    )

    const pointData: {
      lat: number
      lon: number
      name: string
      fill: am5.Color
      radius: number
      tooltipText: string
      productLabel?: string
      isMain?: boolean
    }[] = [
      {
        lat: factory.lat,
        lon: factory.lon,
        name: factory.label,
        fill: am5.color(0x34d399),
        fillBright: am5.color(0xa7f3d0),
        radius: 12,
        tooltipText: factory.label,
        isMain: true,
      },
      {
        lat: office.lat,
        lon: office.lon,
        name: office.label,
        fill: am5.color(0x3b82f6),
        fillBright: am5.color(0x93c5fd),
        radius: 12,
        tooltipText: office.label,
        isMain: true,
      },
      ...regions.map((r) => ({
        lat: r.lat,
        lon: r.lon,
        name: r.label,
        fill: am5.color(0x3b82f6),
        fillBright: am5.color(0x93c5fd),
        radius: 5,
        tooltipText: r.products ? `${r.label}\nТовары: ${r.products}` : r.label,
        productLabel: r.products ?? "",
        isMain: false,
      })),
    ]

    pointSeries.data.setAll(pointData)

    pointSeries.bullets.push(function (_root, _target, dataItem) {
      const ctx = dataItem.get("dataContext") as {
        fill?: am5.Color
        fillBright?: am5.Color
        radius?: number
        tooltipText?: string
        productLabel?: string
        isMain?: boolean
      }
      const isMain = ctx?.isMain ?? false
      if (isMain) {
        circle.states.create("hover", { scale: 1.1 })
        const fillColor = ctx?.fill ?? am5.color(0x22c55e)
        const fillBright = ctx?.fillBright ?? am5.color(0xbbf7d0)
        const container = am5.Container.new(root, {})
        const glowOuter = am5.Circle.new(root, {
          radius: 32,
          fill: fillColor,
          fillOpacity: 0.35,
          strokeOpacity: 0,
        })
        const glowMid = am5.Circle.new(root, {
          radius: 22,
          fill: fillColor,
          fillOpacity: 0.55,
          strokeOpacity: 0,
        })
        const ring = am5.Circle.new(root, {
          radius: 16,
          fill: fillBright,
          fillOpacity: 0.9,
          stroke: am5.color(0xffffff),
          strokeWidth: 3,
          strokeOpacity: 1,
        })
        const core = am5.Circle.new(root, {
          radius: 6,
          fill: am5.color(0xffffff),
          fillOpacity: 1,
          strokeOpacity: 0,
        })
        container.children.push(glowOuter)
        container.children.push(glowMid)
        container.children.push(ring)
        container.children.push(core)
        container.set("tooltipText", "{tooltipText}")
        glowOuter.animate({
          key: "opacity",
          from: 0.35,
          to: 0.65,
          duration: 1500,
          loops: Infinity,
          easing: am5.ease.yoyo(am5.ease.inOut(am5.ease.sine)),
        })
        return am5.Bullet.new(root, { sprite: container })
      }
      const fillColor = ctx?.fill ?? am5.color(0x3b82f6)
      const fillBright = ctx?.fillBright ?? am5.color(0x93c5fd)
      const container = am5.Container.new(root, { layout: root.verticalLayout })
      const glowOuter = am5.Circle.new(root, {
        radius: 14,
        fill: fillColor,
        fillOpacity: 0.4,
        strokeOpacity: 0,
      })
      const ring = am5.Circle.new(root, {
        radius: 7,
        fill: fillBright,
        fillOpacity: 0.95,
        stroke: am5.color(0xffffff),
        strokeWidth: 1.5,
        strokeOpacity: 1,
      })
      const core = am5.Circle.new(root, {
        radius: 2.5,
        fill: am5.color(0xffffff),
        fillOpacity: 1,
        strokeOpacity: 0,
      })
      container.children.push(glowOuter)
      container.children.push(ring)
      container.children.push(core)
      container.set("tooltipText", "{tooltipText}")
      glowOuter.animate({
        key: "opacity",
        from: 0.35,
        to: 0.6,
        duration: 1800,
        loops: Infinity,
        easing: am5.ease.yoyo(am5.ease.inOut(am5.ease.sine)),
      })
      if (ctx?.productLabel) {
        const label = am5.Label.new(root, {
          text: "{productLabel}",
          fill: am5.color(0x93c5fd),
          fontSize: 9,
          maxWidth: 90,
          wrap: true,
          centerX: am5.percent(50),
          textAlign: "center",
          paddingTop: 3,
          populateText: true,
        })
        container.children.push(label)
      }
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
      className="relative w-full rounded-xl overflow-hidden"
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
      <div className="absolute top-3 right-3 z-10 flex rounded-lg overflow-hidden border border-white/10 bg-black/50">
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
