"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { HERO_VIDEO_READY_EVENT, HERO_VIDEO_SRC } from "@/lib/hero-media"
import { COOKIE_CONSENT_READY_EVENT } from "@/lib/cookie-consent"

const MAX_SPLASH_MS = 15000
const MIN_SPLASH_MS = 600
const FORCE_SPLASH_IN_DEV = process.env.NODE_ENV === "development"

function isHomePage(): boolean {
  if (typeof window === "undefined") return false
  const path = window.location.pathname
  return path === "/" || path === ""
}

function shouldSkipSplash(): boolean {
  if (typeof window === "undefined") return true
  if (!isHomePage()) return true
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true
  return false
}

function hasSeenSplash(): boolean {
  if (FORCE_SPLASH_IN_DEV) return false
  try {
    return sessionStorage.getItem("hasSeenLoading") === "true"
  } catch {
    return false
  }
}

function clearSplashPending() {
  document.documentElement.classList.remove("splash-pending")
  const staticSplash = document.getElementById("splash-static")
  if (staticSplash) {
    staticSplash.style.display = "none"
  }
}

function revealMainContent() {
  clearSplashPending()
  const mainContent = document.getElementById("main-content")
  if (mainContent) {
    mainContent.classList.remove("opacity-0")
    mainContent.classList.add("opacity-100")
  }
  document.body.style.overflow = ""
  window.dispatchEvent(new Event("lenis:refresh"))
  window.dispatchEvent(new Event(COOKIE_CONSENT_READY_EVENT))
}

function hideMainContentForSplash() {
  const mainContent = document.getElementById("main-content")
  if (mainContent) {
    mainContent.classList.add("opacity-0")
    mainContent.classList.remove("opacity-100")
  }
  document.body.style.overflow = "hidden"
}

function preloadHeroVideo(onReady: () => void): () => void {
  const video = document.createElement("video")
  video.preload = "auto"
  video.muted = true
  video.playsInline = true
  video.src = HERO_VIDEO_SRC

  const handleReady = () => {
    onReady()
    window.dispatchEvent(new Event(HERO_VIDEO_READY_EVENT))
  }

  video.addEventListener("canplaythrough", handleReady, { once: true })
  video.addEventListener("playing", handleReady, { once: true })
  video.addEventListener("error", handleReady, { once: true })
  video.load()

  return () => {
    video.removeEventListener("canplaythrough", handleReady)
    video.removeEventListener("playing", handleReady)
    video.removeEventListener("error", handleReady)
    video.removeAttribute("src")
    video.load()
  }
}

export function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(false)
  const [isFading, setIsFading] = useState(false)
  const dismissedRef = useRef(false)
  const [pageLoaded, setPageLoaded] = useState(false)
  const [heroVideoReady, setHeroVideoReady] = useState(false)

  const dismissSplash = useCallback((persist = true) => {
    if (dismissedRef.current) return
    dismissedRef.current = true

    setIsFading(true)
    revealMainContent()
    if (persist && !FORCE_SPLASH_IN_DEV) {
      try {
        sessionStorage.setItem("hasSeenLoading", "true")
      } catch {
        // ignore
      }
    }

    window.setTimeout(() => {
      setIsVisible(false)
      document.body.style.overflow = ""
    }, 400)
  }, [])

  useEffect(() => {
    if (hasSeenSplash()) {
      revealMainContent()
      return
    }

    if (shouldSkipSplash()) {
      revealMainContent()
      if (!FORCE_SPLASH_IN_DEV) {
        try {
          sessionStorage.setItem("hasSeenLoading", "true")
        } catch {
          // ignore
        }
      }
      return
    }

    dismissedRef.current = false
    setIsVisible(true)
    document.documentElement.classList.add("splash-pending")
    hideMainContentForSplash()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    hideMainContentForSplash()

    const handleLoad = () => setPageLoaded(true)
    const shouldWaitForHeroVideo = isHomePage()
    const handleHeroVideoReady = () => setHeroVideoReady(true)

    setHeroVideoReady(!shouldWaitForHeroVideo)

    if (document.readyState === "complete") {
      setPageLoaded(true)
    } else {
      window.addEventListener("load", handleLoad)
    }
    window.addEventListener(HERO_VIDEO_READY_EVENT, handleHeroVideoReady)

    const cleanupPreload = shouldWaitForHeroVideo ? preloadHeroVideo(() => setHeroVideoReady(true)) : undefined

    const maxTimer = window.setTimeout(() => dismissSplash(true), MAX_SPLASH_MS)

    return () => {
      window.removeEventListener("load", handleLoad)
      window.removeEventListener(HERO_VIDEO_READY_EVENT, handleHeroVideoReady)
      window.clearTimeout(maxTimer)
      cleanupPreload?.()
      document.body.style.overflow = ""
    }
  }, [isVisible, dismissSplash])

  useEffect(() => {
    if (!isVisible || !pageLoaded || !heroVideoReady || dismissedRef.current) return

    const timer = window.setTimeout(() => dismissSplash(true), MIN_SPLASH_MS)
    return () => window.clearTimeout(timer)
  }, [isVisible, pageLoaded, heroVideoReady, dismissSplash])

  if (!isVisible) return null

  return (
    <div
      role="presentation"
      className={`fixed inset-0 z-[9999] bg-white transition-opacity duration-400 ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      onClick={() => dismissSplash(true)}
    >
      <div className="flex items-center justify-center w-full h-full p-4 sm:p-8">
        <img
          src="/images/logo123.jpg"
          alt="АО Пластик"
          className="w-full max-w-xs animate-pulse select-none sm:max-w-md md:max-w-2xl"
          draggable={false}
        />
      </div>
    </div>
  )
}
