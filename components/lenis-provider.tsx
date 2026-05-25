"use client"

import "lenis/dist/lenis.css"
import Lenis from "lenis"
import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { getLenisInstance, setLenisInstance } from "@/lib/lenis-instance"

const LENIS_EASING = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))

/** Нативный скролл на мобилках и чисто сенсорных устройствах (без мыши / тачпада). */
function shouldUseNativeScroll(): boolean {
  if (typeof window === "undefined") return false
  if (window.matchMedia("(max-width: 767px)").matches) return true
  const finePointer = window.matchMedia("(pointer: fine)").matches
  const hover = window.matchMedia("(hover: hover)").matches
  return !finePointer && !hover
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    if (shouldUseNativeScroll()) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: LENIS_EASING,
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    })

    setLenisInstance(lenis)

    let rafId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    const onLenisScroll = () => {
      const st = (window as Window & { ScrollTrigger?: { update: () => void } }).ScrollTrigger
      st?.update()
    }
    lenis.on("scroll", onLenisScroll)

    const refresh = () => {
      requestAnimationFrame(() => {
        lenis.resize()
        const st = (window as Window & { ScrollTrigger?: { refresh: () => void } }).ScrollTrigger
        st?.refresh()
      })
    }

    window.addEventListener("lenis:refresh", refresh)
    window.addEventListener("load", refresh)
    const resizeTimer = window.setTimeout(refresh, 400)
    const loadTimer = window.setTimeout(refresh, 1200)

    return () => {
      window.clearTimeout(resizeTimer)
      window.clearTimeout(loadTimer)
      window.removeEventListener("lenis:refresh", refresh)
      window.removeEventListener("load", refresh)
      lenis.off("scroll", onLenisScroll)
      cancelAnimationFrame(rafId)
      lenis.destroy()
      setLenisInstance(null)
    }
  }, [])

  useEffect(() => {
    const lenis = getLenisInstance()
    if (!lenis) return
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        lenis.resize()
        const st = (window as Window & { ScrollTrigger?: { refresh: () => void } }).ScrollTrigger
        st?.refresh()
      })
    })
    return () => cancelAnimationFrame(id)
  }, [pathname])

  return <>{children}</>
}
