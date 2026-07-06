"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronDown } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { HeroNavigation } from "@/components/hero-navigation"
import { HERO_POSTER_SRC, HERO_VIDEO_READY_EVENT, HERO_VIDEO_SRC } from "@/lib/hero-media"
import { getLenisInstance } from "@/lib/lenis-instance"

export function Hero() {
  const { t } = useLanguage()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoReady, setIsVideoReady] = useState(false)

  const notifySplashReady = () => {
    window.dispatchEvent(new Event(HERO_VIDEO_READY_EVENT))
  }

  const handleVideoReady = () => {
    setIsVideoReady(true)
    notifySplashReady()
  }

  const handleVideoError = () => {
    console.error("Hero video failed to load:", HERO_VIDEO_SRC)
    notifySplashReady()
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = true
    video.playsInline = true
    void video.play().catch((error) => {
      console.log("Video autoplay failed:", error)
    })
  }, [])

  const handleScrollToStats = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const statsSection = document.getElementById("stats")
    if (statsSection) {
      const lenis = getLenisInstance()
      if (lenis) {
        lenis.scrollTo(statsSection)
      } else {
        statsSection.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }
  }

  return (
    <section className="relative flex h-[100svh] min-h-[100svh] items-center justify-center overflow-hidden md:h-auto md:min-h-screen">
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
          src={HERO_VIDEO_SRC}
          poster={HERO_POSTER_SRC}
          className={`hero-bg-video absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            isVideoReady ? "opacity-100" : "opacity-0"
          }`}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          controls={false}
          controlsList="nodownload noplaybackrate noremoteplayback"
          disablePictureInPicture
          disableRemotePlayback
          onCanPlayThrough={handleVideoReady}
          onPlaying={handleVideoReady}
          onError={handleVideoError}
          style={{ pointerEvents: "none" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
        <h1 className="text-display text-white mb-4 sm:mb-6 animate-fade-in drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
          {t("homePage.hero.title")}
        </h1>
        <p className="text-body-lead text-white/95 mb-8 sm:mb-12 max-w-3xl mx-auto text-pretty animate-fade-in-delay drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
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
