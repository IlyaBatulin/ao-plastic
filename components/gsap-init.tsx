"use client"

import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

/**
 * Подключает GSAP из npm-пакета (а не с внешнего CDN) и кладёт его в window,
 * чтобы компоненты, использующие глобальные window.gsap / window.ScrollTrigger
 * (chroma-grid, scroll-stack, lenis-provider), работали как раньше.
 *
 * Присваивание на уровне модуля выполняется при загрузке клиентского бандла —
 * раньше, чем эффекты компонентов-потребителей, поэтому глобали доступны вовремя.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
  const w = window as unknown as { gsap?: unknown; ScrollTrigger?: unknown }
  w.gsap = gsap
  w.ScrollTrigger = ScrollTrigger
}

export function GsapInit() {
  return null
}
