"use client"

import { useEffect, useRef, useState } from "react"

export const HERO_CLIPS = ["factory", "abs", "polystyrene", "dispersion", "hoztovary"] as const

/** Only the visible clip plays. Preload one neighbour after the current frame is ready. */
export function HeroBackground({ activeIndex, paused, onStatus }: {
  activeIndex: number
  paused: boolean
  onStatus: (index: number, ready: boolean) => void
}) {
  const refs = useRef<(HTMLVideoElement | null)[]>([])
  const [variant, setVariant] = useState<"mobile" | "desktop" | null>(null)
  const [prefetchFrom, setPrefetchFrom] = useState(-1)
  const [playingIndex, setPlayingIndex] = useState(-1)
  const [failed, setFailed] = useState<number[]>([])

  useEffect(() => {
    // Choose once, avoiding a second full download when rotating a phone.
    setVariant(window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop")
  }, [])

  useEffect(() => {
    let cancelled = false
    setPlayingIndex(-1)
    if (failed.includes(activeIndex)) onStatus(activeIndex, true)
    refs.current.forEach((video, index) => {
      if (!video) return
      if (index !== activeIndex || paused) video.pause()
      else void video.play().catch(() => {
        if (!cancelled) onStatus(index, true) // Still poster if autoplay is unavailable.
      })
    })
    return () => { cancelled = true }
  }, [activeIndex, paused, variant, failed, onStatus])

  useEffect(() => {
    if (paused || failed.includes(activeIndex)) return
    // A slow/unavailable clip must not leave the carousel stuck on an empty screen.
    const timeout = window.setTimeout(() => onStatus(activeIndex, true), 8000)
    return () => window.clearTimeout(timeout)
  }, [activeIndex, paused, failed, onStatus])

  const nextIndex = (activeIndex + 1) % HERO_CLIPS.length
  return <div className="absolute inset-0 z-0" aria-hidden="true">
    {HERO_CLIPS.map((key, index) => {
      const active = index === activeIndex
      const mounted = active || (prefetchFrom === activeIndex && index === nextIndex)
      return <div key={key} className={`absolute inset-0 transition-opacity duration-500 ${active ? "opacity-100" : "opacity-0"}`}>
        {(mounted || index === 0) && <img src={`/videos/hero/${key}-poster.webp`} alt=""
          className="absolute inset-0 h-full w-full object-cover" fetchPriority={index === 0 ? "high" : "auto"} />}
        {mounted && variant && !failed.includes(index) && <video
          ref={(element) => { refs.current[index] = element }}
          src={`/videos/hero/${key}-${variant}.mp4`}
          poster={`/videos/hero/${key}-poster.webp`}
          className={`hero-bg-video absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${active && playingIndex === index ? "opacity-100" : "opacity-0"}`}
          muted loop playsInline preload="auto" controls={false} disablePictureInPicture disableRemotePlayback
          onCanPlay={(event) => {
            if (!active || paused) return
            setPrefetchFrom(index)
            void event.currentTarget.play().catch(() => onStatus(index, true))
          }}
          onPlaying={(event) => {
            if (!active || paused || document.hidden) { event.currentTarget.pause(); return }
            setPlayingIndex(index)
            setPrefetchFrom(index)
            onStatus(index, true)
          }}
          onWaiting={() => { if (active) onStatus(index, false) }}
          onError={() => {
            setFailed((previous) => previous.includes(index) ? previous : [...previous, index])
            if (active) onStatus(index, true)
          }}
        />}
      </div>
    })}
    <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/50" />
  </div>
}
