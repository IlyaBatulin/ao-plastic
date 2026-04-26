"use client"

import { useEffect } from "react"
import { ReactLenis } from "lenis/react"

const lenisOptions = {
  duration: 1.2,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: "vertical" as const,
  gestureOrientation: "vertical" as const,
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
  infinite: false,
  autoRaf: true,
}

function LenisHtmlClass() {
  useEffect(() => {
    try {
      document.documentElement.classList.add("lenis")
    } catch {
      // ignore
    }
    return () => {
      try {
        document.documentElement.classList.remove("lenis")
      } catch {
        // ignore
      }
    }
  }, [])

  return null
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={lenisOptions}>
      <LenisHtmlClass />
      {children}
    </ReactLenis>
  )
}
