"use client"

import { useEffect, useState, useRef, useCallback } from "react"

const MAX_SPLASH_MS = 12000
const MIN_SPLASH_MS = 900
const HERO_VIDEO_READY_EVENT = "ao-plastic:hero-video-ready"
const FORCE_SPLASH_IN_DEV = process.env.NODE_ENV === "development"

function isMobileViewport(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(max-width: 767px)").matches
}

function shouldSkipSplash(): boolean {
  if (typeof window === "undefined") return true
  if (isMobileViewport()) return true
  if (window.matchMedia("(pointer: coarse)").matches) return true
  if (window.matchMedia("(hover: none)").matches && navigator.maxTouchPoints > 0) return true
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true
  return false
}

function revealMainContent() {
  const mainContent = document.getElementById("main-content")
  if (mainContent) {
    mainContent.classList.remove("opacity-0")
    mainContent.classList.add("opacity-100")
  }
  document.body.style.overflow = ""
  window.dispatchEvent(new Event("lenis:refresh"))
}

function hideMainContentForSplash() {
  const mainContent = document.getElementById("main-content")
  if (mainContent) {
    mainContent.classList.add("opacity-0")
    mainContent.classList.remove("opacity-100")
  }
  document.body.style.overflow = "hidden"
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
    try {
      if (!FORCE_SPLASH_IN_DEV && sessionStorage.getItem("hasSeenLoading")) {
        revealMainContent()
        return
      }
    } catch {
      // ignore
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
  }, [])

  useEffect(() => {
    if (!isVisible) return

    hideMainContentForSplash()

    const handleLoad = () => setPageLoaded(true)
    const shouldWaitForHeroVideo = window.location.pathname === "/"
    const handleHeroVideoReady = () => setHeroVideoReady(true)

    setHeroVideoReady(!shouldWaitForHeroVideo)

    if (document.readyState === "complete") {
      setPageLoaded(true)
    } else {
      window.addEventListener("load", handleLoad)
    }
    window.addEventListener(HERO_VIDEO_READY_EVENT, handleHeroVideoReady)

    const maxTimer = window.setTimeout(() => dismissSplash(true), MAX_SPLASH_MS)

    return () => {
      window.removeEventListener("load", handleLoad)
      window.removeEventListener(HERO_VIDEO_READY_EVENT, handleHeroVideoReady)
      window.clearTimeout(maxTimer)
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
