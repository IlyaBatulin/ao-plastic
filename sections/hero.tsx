"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronDown } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { HeroNavigation } from "@/components/hero-navigation"

const HERO_VIDEO_SRC = "/videos/frontpage4.mp4"
const HERO_POSTER_SRC = "/prevyu/fasad/furs0079-1.jpeg"
const HERO_VIDEO_READY_EVENT = "ao-plastic:hero-video-ready"

export function Hero() {
  const { t } = useLanguage()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false)
  const [isVideoReady, setIsVideoReady] = useState(false)

  const markVideoReady = () => {
    setIsVideoReady(true)
    window.dispatchEvent(new Event(HERO_VIDEO_READY_EVENT))
  }

  useEffect(() => {
    const connection = (navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string }
    }).connection
    const isSlowConnection =
      connection?.saveData || connection?.effectiveType === "slow-2g" || connection?.effectiveType === "2g"

    if (isSlowConnection) {
      window.dispatchEvent(new Event(HERO_VIDEO_READY_EVENT))
      return
    }

    setShouldLoadVideo(true)
  }, [shouldLoadVideo])

  useEffect(() => {
    if (!shouldLoadVideo || !videoRef.current) return

    videoRef.current.muted = true
    videoRef.current.playsInline = true
    videoRef.current.play().catch((error) => {
      console.log("Video autoplay failed:", error)
    })
  }, [shouldLoadVideo])

  const handleScrollToStats = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const statsSection = document.getElementById("stats")
    if (statsSection) {
      statsSection.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center md:min-h-screen">
      {/* Navigation Overlay */}
      <HeroNavigation />

      {/* Background Video with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_POSTER_SRC}
          alt=""
          aria-hidden
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            isVideoReady ? "opacity-0" : "opacity-100"
          }`}
          fetchPriority="high"
        />
        <video
          ref={videoRef}
          src={shouldLoadVideo ? HERO_VIDEO_SRC : undefined}
          poster={HERO_POSTER_SRC}
          className={`hero-bg-video absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            isVideoReady ? "opacity-100" : "opacity-0"
          }`}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          controls={false}
          controlsList="nodownload noplaybackrate noremoteplayback"
          disablePictureInPicture
          disableRemotePlayback
          onCanPlay={markVideoReady}
          onPlaying={markVideoReady}
          onError={markVideoReady}
          style={{ pointerEvents: "none" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 text-balance leading-tight animate-fade-in drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
          {t("homePage.hero.title")}
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-white/95 mb-8 sm:mb-12 max-w-3xl mx-auto text-pretty leading-relaxed animate-fade-in-delay drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          {t("homePage.hero.description")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-delay-2">
          <Button
            size="lg"
            variant="brand"
            asChild
            className="text-base px-8 transition-all hover:scale-105 hover-glow-blue shadow-blue-lg w-full sm:w-auto"
          >
            <Link href="/products">
              {t("homePage.hero.catalogButton")}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="text-base rounded-xl px-8 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:border-primary/50 transition-all hover:scale-105 shadow-blue-md w-full sm:w-auto"
          >
            <Link href="/about">{t("homePage.hero.aboutButton")}</Link>
          </Button>
        </div>

      </div>

      {/* Scroll Indicator */}
      <button
        onClick={handleScrollToStats}
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 animate-bounce cursor-pointer sm:block"
        aria-label="Scroll down"
      >
        <ChevronDown className="w-8 h-8 text-white drop-shadow-lg" />
      </button>
    </section>
  )
}
