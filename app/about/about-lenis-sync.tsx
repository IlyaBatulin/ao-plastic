"use client"

import { useEffect } from "react"
import { getLenisInstance } from "@/lib/lenis-instance"

/**
 * Длинная страница /about (карта, секции) — обновляем габариты Lenis при входе.
 */
export function AboutLenisSync() {
  useEffect(() => {
    const lenis = getLenisInstance()
    if (!lenis) return
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => lenis.resize())
    })
    return () => cancelAnimationFrame(id)
  }, [])

  return null
}
