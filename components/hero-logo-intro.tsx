"use client"

import { useEffect, useRef, useState } from "react"
import "./hero-logo-intro.css"

export function HeroLogoIntro({ mediaReady, onComplete }: { mediaReady: boolean; onComplete: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const [minimumElapsed, setMinimumElapsed] = useState(false)
  const [timedOut, setTimedOut] = useState(false)
  const departing = minimumElapsed && (mediaReady || timedOut)

  useEffect(() => {
    const minimum = window.setTimeout(() => setMinimumElapsed(true), 3500)
    const maximum = window.setTimeout(() => setTimedOut(true), 8000)
    return () => { clearTimeout(minimum); clearTimeout(maximum) }
  }, [])

  useEffect(() => {
    if (!departing) return
    const element = ref.current
    if (!element) return
    let flight: Animation | undefined
    let cancelled = false
    const finish = () => { if (!cancelled) onComplete() }
    const timer = window.setTimeout(() => {
      const target = document.querySelector("[data-hero-logo-target]")
      if (!target || window.scrollY > 50) { finish(); return }
      const from = element.getBoundingClientRect()
      const to = target.getBoundingClientRect()
      const scale = to.width / from.width
      const y = to.top + (to.height - from.height * scale) / 2
      flight = element.animate([
        { transform: "translate(0, 0) scale(1)" },
        { transform: `translate(${to.left - from.left}px, ${y - from.top}px) scale(${scale})` },
      ], { duration: 1000, easing: "cubic-bezier(0.65, 0, 0.25, 1)", fill: "forwards" })
      flight.finished.then(finish).catch(() => {})
    }, 50)
    const skip = () => { if (window.scrollY > 50) finish() }
    window.addEventListener("scroll", skip, { passive: true })
    window.addEventListener("resize", finish)
    return () => {
      cancelled = true
      clearTimeout(timer)
      flight?.cancel()
      window.removeEventListener("scroll", skip)
      window.removeEventListener("resize", finish)
    }
  }, [departing, onComplete])

  return (
    <>
    <div className={`hero-logo-intro-backdrop ${departing ? "is-departing" : ""}`} aria-hidden="true" />
    <div className={`hero-logo-intro ${departing ? "is-departing" : ""}`} ref={ref} aria-hidden="true">
      <svg viewBox="0 0 2752 1535" className="hero-logo-intro-art">
        <defs>
          <clipPath id="hero-logo-symbol-clip"><rect width="940" height="1535" /></clipPath>
          <clipPath id="hero-logo-word-clip"><rect x="940" width="1812" height="1535" /></clipPath>
        </defs>
        <g className="hero-logo-intro-symbol">
          <g clipPath="url(#hero-logo-symbol-clip)">
            <image href="/images/logo123.png" width="2752" height="1535" />
          </g>
        </g>
        <g clipPath="url(#hero-logo-word-clip)">
          <image href="/images/logo123.png" width="2752" height="1535" />
        </g>
      </svg>
    </div>
    </>
  )
}
