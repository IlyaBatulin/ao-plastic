"use client"

import { useLenis } from "lenis/react"
import { useEffect } from "react"

/**
 * Длинная страница /about (карта, секции) — обновляем габариты Lenis при входе.
 */
export function AboutLenisSync() {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => lenis.resize())
    })
    return () => cancelAnimationFrame(id)
  }, [lenis])

  return null
}
