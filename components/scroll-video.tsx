"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Регистрируем плагин ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface ScrollVideoProps {
  src: string
  className?: string
  scrollHeight?: number
  startOffset?: number
  loop?: boolean
  poster?: string
  /** Текст для постера (SEO / доступность) */
  posterAlt?: string
  lazy?: boolean
}

export function ScrollVideo({
  src,
  className = "",
  scrollHeight = 2000,
  startOffset = 0,
  loop = false,
  poster,
  posterAlt = "Производство АО «Пластик» — кадр из видео",
  lazy = true,
}: ScrollVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null)
  const [isVisible, setIsVisible] = useState(!lazy)
  const [shouldLoad, setShouldLoad] = useState(!lazy)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (!lazy || shouldLoad) return

    const container = containerRef.current
    if (!container) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            setShouldLoad(true)
            setTimeout(() => {
              if (videoRef.current) {
                videoRef.current.load()
              }
            }, 100)
            if (observerRef.current) {
              observerRef.current.disconnect()
            }
          }
        })
      },
      {
        rootMargin: "200px",
        threshold: 0.1,
      }
    )

    observerRef.current.observe(container)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [lazy, shouldLoad])

  useEffect(() => {
    if (!shouldLoad) return

    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill()
      }

      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: containerRef.current,
        start: `top ${startOffset}px`,
        end: `+=${scrollHeight}`,
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress
          const videoTime = progress * video.duration
          
          if (video.readyState >= 2) {
            video.currentTime = videoTime
          }
        },
      })

      video.currentTime = 0
    }

    if (video.readyState >= 1) {
      handleLoadedMetadata()
    } else {
      video.addEventListener("loadedmetadata", handleLoadedMetadata)
    }

    if (loop) {
      const handleTimeUpdate = () => {
        if (video.currentTime >= video.duration - 0.1) {
          video.currentTime = 0
        }
      }
      video.addEventListener("timeupdate", handleTimeUpdate)
      
      return () => {
        video.removeEventListener("timeupdate", handleTimeUpdate)
        video.removeEventListener("loadedmetadata", handleLoadedMetadata)
        if (scrollTriggerRef.current) {
          scrollTriggerRef.current.kill()
        }
      }
    }

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill()
      }
    }
  }, [src, scrollHeight, startOffset, loop, shouldLoad])

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className}`}
      style={{ minHeight: `${scrollHeight}px` }}
    >
      <div className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden">
        {poster && !shouldLoad && (
          <img
            src={poster}
            alt={posterAlt}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        )}
        <video
          ref={videoRef}
          src={shouldLoad ? src : undefined}
          poster={poster}
          className="w-full h-full object-cover"
          playsInline
          muted
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          preload={shouldLoad ? "metadata" : "none"}
          style={{ pointerEvents: "none" }}
        />
      </div>
    </div>
  )
}

