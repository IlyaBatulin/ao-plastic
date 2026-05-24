"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { ReactLenis } from "lenis/react"

const lenisOptions = {
  duration: 1.2,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: "vertical" as const,
  gestureOrientation: "vertical" as const,
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 1,
  syncTouch: false,
  infinite: false,
  autoRaf: true,
}

function LenisHtmlClass({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add("lenis")
    return () => {
      document.documentElement.classList.remove("lenis")
    }
  }, [enabled])

  return null
}

function useLenisEnabled() {
  const pathname = usePathname()
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const isLegal = pathname.startsWith("/legal")
    const isTouch = window.matchMedia("(pointer: coarse)").matches
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    setEnabled(!isLegal && !isTouch && !prefersReduced)
  }, [pathname])

  return enabled
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const enabled = useLenisEnabled()

  if (!enabled) {
    return <>{children}</>
  }

  return (
    <ReactLenis root options={lenisOptions}>
      <LenisHtmlClass enabled />
      {children}
    </ReactLenis>
  )
}
