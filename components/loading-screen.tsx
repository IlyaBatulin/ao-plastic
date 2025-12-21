"use client"

import { useEffect, useState, useRef } from "react"

export function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true)
  const [isFading, setIsFading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [pageLoaded, setPageLoaded] = useState(false)

  useEffect(() => {
    // Проверяем, была ли уже показана заставка при первой загрузке
    const hasSeenLoading = sessionStorage.getItem("hasSeenLoading")
    
    if (hasSeenLoading) {
      // Если уже видели заставку, сразу скрываем её
      setIsVisible(false)
      const mainContent = document.getElementById("main-content")
      if (mainContent) {
        mainContent.classList.remove("opacity-0")
        mainContent.classList.add("opacity-100")
      }
      return
    }

    const handleLoad = () => {
      setPageLoaded(true)
    }

    if (document.readyState === "complete") {
      setPageLoaded(true)
    } else {
      window.addEventListener("load", handleLoad)
    }

    return () => {
      window.removeEventListener("load", handleLoad)
    }
  }, [])

  const handleVideoEnd = () => {
    setIsFading(true)
    const mainContent = document.getElementById("main-content")
    if (mainContent) {
      mainContent.classList.remove("opacity-0")
      mainContent.classList.add("opacity-100")
    }
    // Сохраняем, что заставка уже была показана
    sessionStorage.setItem("hasSeenLoading", "true")
    setTimeout(() => {
      setIsVisible(false)
      document.body.style.overflow = ""
    }, 500)
  }

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current
      video.playbackRate = 2.0
    }
  }, [])

  useEffect(() => {
    if (pageLoaded && videoRef.current) {
      const video = videoRef.current
      if (video.ended) {
        handleVideoEnd()
      }
    }
  }, [pageLoaded, handleVideoEnd])

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden"
      const mainContent = document.getElementById("main-content")
      if (mainContent) {
        mainContent.classList.add("opacity-0")
      }
    } else {
      document.body.style.overflow = ""
    }
  }, [isVisible])

  if (!isVisible) {
    return null
  }

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-background transition-opacity duration-500 ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex items-center justify-center w-full h-full p-4 sm:p-8">
        <div className="relative w-full max-w-2xl aspect-video overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            controls={false}
            disablePictureInPicture
            disableRemotePlayback
            className="w-full h-full object-cover"
            style={{ pointerEvents: "none" }}
            onEnded={handleVideoEnd}
            onLoadedMetadata={(e) => {
              e.currentTarget.playbackRate = 2.0
            }}
            onTimeUpdate={(e) => {
              const video = e.currentTarget
              if (pageLoaded && video.currentTime >= video.duration - 0.1) {
                handleVideoEnd()
              }
            }}
          >
            <source src="/videos/mainload.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  )
}

