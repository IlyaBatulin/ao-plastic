"use client"

import { useEffect, useState, useRef, useCallback } from "react"

const MAX_SPLASH_MS = 4500

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
  const videoRef = useRef<HTMLVideoElement>(null)
  const dismissedRef = useRef(false)
  const [pageLoaded, setPageLoaded] = useState(false)

  const dismissSplash = useCallback((persist = true) => {
    if (dismissedRef.current) return
    dismissedRef.current = true

    setIsFading(true)
    revealMainContent()
    if (persist) {
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
      if (sessionStorage.getItem("hasSeenLoading")) {
        revealMainContent()
        return
      }
    } catch {
      // ignore
    }

    if (shouldSkipSplash()) {
      revealMainContent()
      try {
        sessionStorage.setItem("hasSeenLoading", "true")
      } catch {
        // ignore
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
    if (document.readyState === "complete") {
      setPageLoaded(true)
    } else {
      window.addEventListener("load", handleLoad)
    }

    const maxTimer = window.setTimeout(() => dismissSplash(true), MAX_SPLASH_MS)

    return () => {
      window.removeEventListener("load", handleLoad)
      window.clearTimeout(maxTimer)
      document.body.style.overflow = ""
    }
  }, [isVisible, dismissSplash])

  useEffect(() => {
    if (!isVisible || dismissedRef.current) return

    const video = videoRef.current
    if (!video) return

    video.playbackRate = 2.0
    const playPromise = video.play()
    if (playPromise) {
      playPromise.catch(() => dismissSplash(true))
    }
  }, [isVisible, dismissSplash])

  useEffect(() => {
    if (pageLoaded && videoRef.current?.ended) {
      dismissSplash(true)
    }
  }, [pageLoaded, dismissSplash])

  if (!isVisible) return null

  return (
    <div
      role="presentation"
      className={`fixed inset-0 z-[9999] bg-background transition-opacity duration-400 ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      onClick={() => dismissSplash(true)}
    >
      <div className="flex items-center justify-center w-full h-full p-4 sm:p-8">
        <div className="relative w-full max-w-xs sm:max-w-md md:max-w-2xl aspect-video overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            preload="metadata"
            controls={false}
            disablePictureInPicture
            disableRemotePlayback
            className="w-full h-full object-cover"
            style={{ pointerEvents: "none" }}
            onEnded={() => dismissSplash(true)}
            onError={() => dismissSplash(true)}
            onLoadedMetadata={(e) => {
              e.currentTarget.playbackRate = 2.0
            }}
            onTimeUpdate={(e) => {
              const video = e.currentTarget
              if (!Number.isFinite(video.duration) || video.duration <= 0) return
              if (pageLoaded && video.currentTime >= video.duration - 0.15) {
                dismissSplash(true)
              }
            }}
          >
            <source src="/videos/mainload.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
      <p className="absolute bottom-6 left-0 right-0 text-center text-xs text-muted-foreground">
        Нажмите, чтобы пропустить
      </p>
    </div>
  )
}
