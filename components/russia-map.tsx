"use client"

import { useLayoutEffect, useRef, useId } from "react"
import * as am5 from "@amcharts/amcharts5"
import * as am5map from "@amcharts/amcharts5/map"
import am5geodata_russiaLow from "@amcharts/amcharts5-geodata/russiaLow"

type City = {
  name: string
  nameEn: string
  lat: number
  lon: number
  /** Крупные точки получают подпись всегда, остальные — только на широких экранах */
  major?: boolean
  /** Положение подписи относительно точки (по умолчанию — снизу) */
  labelPos?: "top" | "bottom"
  /** Горизонтальный сдвиг подписи в px — для разведения тесных подписей */
  labelDx?: number
}

/** Города поставок — только Россия. */
const CITIES: City[] = [
  { name: "Санкт-Петербург", nameEn: "St. Petersburg", lat: 59.93, lon: 30.34, major: true },
  { name: "Калининград", nameEn: "Kaliningrad", lat: 54.71, lon: 20.51, major: true },
  { name: "Мурманск", nameEn: "Murmansk", lat: 68.96, lon: 33.08 },
  { name: "Москва", nameEn: "Moscow", lat: 55.75, lon: 37.62, major: true, labelPos: "top", labelDx: -6 },
  { name: "Воронеж", nameEn: "Voronezh", lat: 51.67, lon: 39.18 },
  { name: "Ростов-на-Дону", nameEn: "Rostov-on-Don", lat: 47.23, lon: 39.72, major: true },
  { name: "Краснодар", nameEn: "Krasnodar", lat: 45.04, lon: 38.98 },
  { name: "Волгоград", nameEn: "Volgograd", lat: 48.71, lon: 44.51 },
  { name: "Нижний Новгород", nameEn: "N. Novgorod", lat: 56.33, lon: 44.01, labelPos: "top", labelDx: 10 },
  { name: "Казань", nameEn: "Kazan", lat: 55.83, lon: 49.07, major: true, labelDx: -8 },
  { name: "Самара", nameEn: "Samara", lat: 53.2, lon: 50.1 },
  { name: "Уфа", nameEn: "Ufa", lat: 54.74, lon: 55.97, labelDx: -6 },
  { name: "Пермь", nameEn: "Perm", lat: 58.01, lon: 56.25, labelPos: "top" },
  { name: "Екатеринбург", nameEn: "Yekaterinburg", lat: 56.84, lon: 60.61, major: true, labelPos: "top", labelDx: -12 },
  { name: "Челябинск", nameEn: "Chelyabinsk", lat: 55.16, lon: 61.44, labelDx: 10 },
  { name: "Тюмень", nameEn: "Tyumen", lat: 57.15, lon: 65.53 },
  { name: "Омск", nameEn: "Omsk", lat: 54.99, lon: 73.32 },
  { name: "Новосибирск", nameEn: "Novosibirsk", lat: 55.01, lon: 82.94, major: true },
  { name: "Томск", nameEn: "Tomsk", lat: 56.5, lon: 84.97, labelPos: "top" },
  { name: "Красноярск", nameEn: "Krasnoyarsk", lat: 56.02, lon: 92.89, major: true },
  { name: "Иркутск", nameEn: "Irkutsk", lat: 52.3, lon: 104.3 },
  { name: "Якутск", nameEn: "Yakutsk", lat: 62.04, lon: 129.68 },
  { name: "Магадан", nameEn: "Magadan", lat: 59.56, lon: 150.83 },
  { name: "Владивосток", nameEn: "Vladivostok", lat: 43.12, lon: 131.89, major: true },
]

const FACTORY = { name: "Узловая", nameEn: "Uzlovaya", lat: 54.01, lon: 38.08 }

// Фирменные цвета карты
const LAND_FILL = 0xe4ecf9
const LAND_HOVER = 0xcfdef7
const LAND_STROKE = 0xffffff
const DOT_COLOR = 0x1e3a8a
const FACTORY_COLOR = 0x0046ff
const ROUTE_COLOR = 0x0046ff
const LABEL_COLOR = 0x33415c
const DARK_NAVY = 0x0f1e42

// Диапазон долгот городов — для волны появления «запад → восток»
const LON_MIN = 20.5
const LON_MAX = 151

// Тайминги последовательного появления: страна → точки волной → дуги → «посылки»
const FACTORY_APPEAR = 550
const WAVE_START = 750
const WAVE_SPAN = 1250
const ROUTES_START = 2150
const PARCELS_START = 2500

export function RussiaMap({
  lang,
  factoryLabel,
}: {
  lang: "ru" | "en"
  factoryLabel: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartId = useId()

  useLayoutEffect(() => {
    if (!containerRef.current) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const timers: number[] = []

    const root = am5.Root.new(containerRef.current)
    root._logo?.dispose()

    /** setTimeout с автоочисткой и защитой от dispose. */
    const later = (fn: () => void, ms: number) => {
      timers.push(
        window.setTimeout(() => {
          if (!root.isDisposed()) fn()
        }, ms)
      )
    }

    /** Тёмно-синий тултип в стиле сайта. */
    const makeTooltip = () => {
      const tooltip = am5.Tooltip.new(root, {
        getFillFromSprite: false,
        autoTextColor: false,
      })
      tooltip.get("background")?.setAll({
        fill: am5.color(DARK_NAVY),
        fillOpacity: 0.92,
        stroke: am5.color(0xffffff),
        strokeOpacity: 0.15,
      })
      tooltip.label.setAll({ fill: am5.color(0xffffff), fontSize: 13 })
      return tooltip
    }

    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        projection: am5map.geoMercator(),
        // Сдвиг центрального меридиана на 90°в.д.: Чукотка за 180°
        // не оборачивается на левый край, страна непрерывна.
        rotationX: -90,
        panX: "none",
        panY: "none",
        wheelX: "none",
        wheelY: "none",
        pinchZoom: false,
        // Отступы, чтобы крайние точки (Владивосток, Мурманск) и их подписи
        // не подрезались границей контейнера
        paddingTop: 12,
        paddingBottom: 34,
        paddingLeft: 10,
        paddingRight: 10,
      })
    )

    // Полигоны России
    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_russiaLow as unknown as GeoJSON.FeatureCollection,
      })
    )
    polygonSeries.mapPolygons.template.setAll({
      fill: am5.color(LAND_FILL),
      stroke: am5.color(LAND_STROKE),
      strokeWidth: 0.7,
      interactive: true,
      tooltipText: "{name}",
      // Плавный переход заливки при ховере региона
      stateAnimationDuration: 350,
      stateAnimationEasing: am5.ease.out(am5.ease.cubic),
    })
    polygonSeries.mapPolygons.template.states.create("hover", {
      fill: am5.color(LAND_HOVER),
    })
    polygonSeries.set("tooltip", makeTooltip())

    // После загрузки геоданных вписываем страну в контейнер по её границам
    polygonSeries.events.on("datavalidated", () => {
      chart.goHome(0)
    })

    const isNarrow = (containerRef.current?.clientWidth ?? 1200) < 700

    // Дуги поставок: Узловая → город (под точками)
    const lineSeries = chart.series.push(am5map.MapLineSeries.new(root, {}))
    lineSeries.mapLines.template.setAll({
      stroke: am5.color(ROUTE_COLOR),
      strokeWidth: 1.1,
      // При reduced motion дуги видны сразу, иначе проявляются после волны точек
      strokeOpacity: reduceMotion ? 0.18 : 0,
    })

    // «Посылки» — точки, бегущие по дугам (над линиями, под городами)
    const parcelSeries = chart.series.push(am5map.MapPointSeries.new(root, {}))
    parcelSeries.bullets.push(() =>
      am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
          radius: 2.2,
          fill: am5.color(ROUTE_COLOR),
          stroke: am5.color(0xffffff),
          strokeWidth: 0.8,
          centerX: am5.p50,
          centerY: am5.p50,
        }),
      })
    )

    // Города поставок
    const citySeries = chart.series.push(
      am5map.MapPointSeries.new(root, {
        latitudeField: "lat",
        longitudeField: "lon",
      })
    )
    citySeries.bullets.push((_root, _series, dataItem) => {
      const ctx = dataItem.dataContext as City
      const container = am5.Container.new(root, {
        opacity: reduceMotion ? 1 : 0,
        scale: reduceMotion ? 1 : 0.4,
      })

      const halo = container.children.push(
        am5.Circle.new(root, {
          radius: 4,
          fill: am5.color(DOT_COLOR),
          fillOpacity: reduceMotion ? 0.18 : 0.3,
          centerX: am5.p50,
          centerY: am5.p50,
        })
      )

      const dot = container.children.push(
        am5.Circle.new(root, {
          radius: isNarrow ? 3 : 3.6,
          fill: am5.color(DOT_COLOR),
          stroke: am5.color(0xffffff),
          strokeWidth: 1.4,
          centerX: am5.p50,
          centerY: am5.p50,
          tooltipText: lang === "en" ? ctx.nameEn : ctx.name,
          tooltip: makeTooltip(),
          interactive: true,
          cursorOverStyle: "pointer",
          stateAnimationDuration: 200,
          stateAnimationEasing: am5.ease.out(am5.ease.cubic),
        })
      )
      dot.states.create("hover", { scale: 1.4 })

      if (ctx.major || !isNarrow) {
        const onTop = ctx.labelPos === "top"
        container.children.push(
          am5.Label.new(root, {
            text: lang === "en" ? ctx.nameEn : ctx.name,
            fontSize: isNarrow ? 9 : 11,
            fontWeight: "500",
            fill: am5.color(LABEL_COLOR),
            centerX: am5.p50,
            centerY: onTop ? am5.p100 : am5.p0,
            dy: onTop ? -6 : 6,
            dx: ctx.labelDx ?? 0,
          })
        )
      }

      // Волна появления «запад → восток»: задержка пропорциональна долготе
      if (!reduceMotion) {
        const t = (ctx.lon - LON_MIN) / (LON_MAX - LON_MIN)
        later(() => {
          container.animate({
            key: "opacity",
            from: 0,
            to: 1,
            duration: 450,
            easing: am5.ease.out(am5.ease.cubic),
          })
          container.animate({
            key: "scale",
            from: 0.4,
            to: 1,
            duration: 550,
            easing: am5.ease.out(am5.ease.cubic),
          })
          // Пульс гало — с индивидуальной фазой, чтобы карта «дышала» неравномерно
          later(() => {
            halo.animate({
              key: "scale",
              from: 1,
              to: 3,
              duration: 2400,
              loops: Infinity,
              easing: am5.ease.out(am5.ease.cubic),
            })
            halo.animate({
              key: "fillOpacity",
              from: 0.3,
              to: 0,
              duration: 2400,
              loops: Infinity,
              easing: am5.ease.out(am5.ease.cubic),
            })
          }, 300 + Math.round((ctx.lon * 137) % 900))
        }, WAVE_START + t * WAVE_SPAN)
      }

      return am5.Bullet.new(root, { sprite: container })
    })
    citySeries.data.setAll(CITIES.map((c) => ({ ...c })))

    // Завод в Узловой — акцентная точка с двойной волной пульсации
    const factorySeries = chart.series.push(
      am5map.MapPointSeries.new(root, {
        latitudeField: "lat",
        longitudeField: "lon",
      })
    )
    factorySeries.bullets.push(() => {
      const container = am5.Container.new(root, {
        opacity: reduceMotion ? 1 : 0,
        scale: reduceMotion ? 1 : 0.4,
      })

      const makeHalo = (fillOpacity: number) =>
        container.children.push(
          am5.Circle.new(root, {
            radius: 6,
            fill: am5.color(FACTORY_COLOR),
            fillOpacity,
            centerX: am5.p50,
            centerY: am5.p50,
          })
        )
      // Вторая волна стартует в противофазе — виден постоянный «радар»
      const halo1 = makeHalo(reduceMotion ? 0.2 : 0.35)
      const halo2 = makeHalo(0)

      const startPulse = (halo: am5.Circle, fromOpacity: number, delay: number) => {
        if (reduceMotion) return
        later(() => {
          halo.animate({
            key: "scale",
            from: 1,
            to: 3.6,
            duration: 2000,
            loops: Infinity,
            easing: am5.ease.out(am5.ease.cubic),
          })
          halo.animate({
            key: "fillOpacity",
            from: fromOpacity,
            to: 0,
            duration: 2000,
            loops: Infinity,
            easing: am5.ease.out(am5.ease.cubic),
          })
        }, delay)
      }

      const dot = container.children.push(
        am5.Circle.new(root, {
          radius: isNarrow ? 5 : 6,
          fill: am5.color(FACTORY_COLOR),
          stroke: am5.color(0xffffff),
          strokeWidth: 2,
          centerX: am5.p50,
          centerY: am5.p50,
          tooltipText: factoryLabel,
          tooltip: makeTooltip(),
          interactive: true,
          cursorOverStyle: "pointer",
          stateAnimationDuration: 200,
          stateAnimationEasing: am5.ease.out(am5.ease.cubic),
        })
      )
      dot.states.create("hover", { scale: 1.25 })

      // Подпись — под точкой (над ней Москва)
      container.children.push(
        am5.Label.new(root, {
          text: factoryLabel,
          fontSize: isNarrow ? 10 : 12.5,
          fontWeight: "700",
          fill: am5.color(DARK_NAVY),
          // На узких экранах завод у западного края — подпись растёт вправо,
          // чтобы не подрезалась границей контейнера
          centerX: isNarrow ? am5.p0 : am5.p50,
          centerY: am5.p0,
          dx: isNarrow ? 7 : 0,
          dy: 9,
        })
      )

      if (!reduceMotion) {
        later(() => {
          container.animate({
            key: "opacity",
            from: 0,
            to: 1,
            duration: 450,
            easing: am5.ease.out(am5.ease.cubic),
          })
          container.animate({
            key: "scale",
            from: 0.4,
            to: 1,
            duration: 550,
            easing: am5.ease.out(am5.ease.cubic),
          })
          startPulse(halo1, 0.35, 250)
          startPulse(halo2, 0.3, 1250)
        }, FACTORY_APPEAR)
      }

      return am5.Bullet.new(root, { sprite: container })
    })
    factorySeries.data.setAll([{ lat: FACTORY.lat, lon: FACTORY.lon }])

    // Дуги и «посылки» строим, когда обе точечные серии получили dataItems
    let linesBuilt = false
    const buildLines = () => {
      if (linesBuilt) return
      const factoryDataItem = factorySeries.dataItems[0]
      if (!factoryDataItem || citySeries.dataItems.length < CITIES.length) return
      linesBuilt = true

      citySeries.dataItems.forEach((cityDataItem, i) => {
        const lineDataItem = lineSeries.pushDataItem({
          pointsToConnect: [factoryDataItem, cityDataItem],
        })
        if (reduceMotion) return

        const parcelDataItem = parcelSeries.pushDataItem({
          lineDataItem,
          positionOnLine: 0,
        })
        parcelDataItem.hide(0)

        const ctx = cityDataItem.dataContext as City
        // Длительность пропорциональна дальности маршрута, задержки расфазированы
        const dLon = Math.abs(ctx.lon - FACTORY.lon)
        later(() => {
          parcelDataItem.show(300)
          parcelDataItem.animate({
            key: "positionOnLine",
            from: 0,
            to: 1,
            duration: 2800 + Math.round(dLon * 60),
            loops: Infinity,
            easing: am5.ease.inOut(am5.ease.sine),
          })
        }, PARCELS_START + (i % 7) * 320)
      })

      // Проявление дуг после волны точек
      if (!reduceMotion) {
        later(() => {
          lineSeries.mapLines.each((line) => {
            line.animate({
              key: "strokeOpacity",
              from: 0,
              to: 0.18,
              duration: 900,
              easing: am5.ease.out(am5.ease.cubic),
            })
          })
          lineSeries.mapLines.template.set("strokeOpacity", 0.18)
        }, ROUTES_START)
      }
    }
    citySeries.events.on("datavalidated", buildLines)
    factorySeries.events.on("datavalidated", buildLines)

    if (!reduceMotion) {
      chart.appear(700, 100)
    }

    return () => {
      timers.forEach((t) => window.clearTimeout(t))
      root.dispose()
    }
  }, [lang, factoryLabel])

  return <div id={chartId} ref={containerRef} className="h-full w-full" aria-hidden />
}

export default RussiaMap
