"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronDown, Pause, Play } from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { HeroNavigation } from "@/components/hero-navigation"
import { HERO_POSTER_SRC, HERO_VIDEO_READY_EVENT, HERO_VIDEO_SRC } from "@/lib/hero-media"
import { getLenisInstance } from "@/lib/lenis-instance"

/** Слайды главного экрана — механика как у LG Chem: фоновые видео,
 *  нумерованная пагинация с прогрессом, автосмена, пауза. */
const SLIDES = [
  {
    key: "factory",
    video: HERO_VIDEO_SRC,
    href: null as string | null,
  },
  {
    key: "abs",
    video: "/videos/abs-category.mp4",
    href: "/products/abs",
  },
  {
    key: "polystyrene",
    video: "/videos/polystyrene-category.mp4",
    href: "/products/polystyrene",
  },
  {
    key: "hoztovary",
    video: "/videos/xoztov.mp4",
    href: "/products/hoztovary",
  },
]

const SLIDE_DURATION_MS = 8000

export function Hero() {
  const { t } = useLanguage()
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isFirstVideoReady, setIsFirstVideoReady] = useState(false)
  // Видео монтируем лениво: активное и следующее (чтобы не качать всё сразу)
  const [loadedSet, setLoadedSet] = useState<Set<number>>(() => new Set([0, 1]))
  // Ключ для перезапуска CSS-анимации прогресса при смене слайда
  const [progressKey, setProgressKey] = useState(0)

  const notifySplashReady = () => {
    window.dispatchEvent(new Event(HERO_VIDEO_READY_EVENT))
  }

  const handleFirstVideoReady = () => {
    setIsFirstVideoReady(true)
    notifySplashReady()
  }

  const handleFirstVideoError = () => {
    console.error("Hero video failed to load:", HERO_VIDEO_SRC)
    notifySplashReady()
  }

  const goToSlide = useCallback((next: number) => {
    const target = ((next % SLIDES.length) + SLIDES.length) % SLIDES.length
    setActiveIndex(target)
    setProgressKey((k) => k + 1)
    // Догружаем целевое и следующее за ним видео
    setLoadedSet((prev) => {
      const copy = new Set(prev)
      copy.add(target)
      copy.add((target + 1) % SLIDES.length)
      return copy
    })
  }, [])

  // Автосмена слайдов
  useEffect(() => {
    if (isPaused) return
    const timer = window.setTimeout(() => {
      goToSlide(activeIndex + 1)
    }, SLIDE_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [activeIndex, isPaused, goToSlide, progressKey])

  // Управление воспроизведением: активное видео играет, остальные на паузе
  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (!video) return
      if (idx === activeIndex && !isPaused) {
        video.muted = true
        video.playsInline = true
        void video.play().catch(() => {})
      } else {
        video.pause()
        if (idx !== activeIndex) {
          try {
            video.currentTime = 0
          } catch {}
        }
      }
    })
  }, [activeIndex, isPaused, loadedSet])

  const togglePaused = () => {
    setIsPaused((p) => !p)
  }

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

      {/* Background videos with crossfade */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_POSTER_SRC}
          alt=""
          aria-hidden
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            isFirstVideoReady ? "opacity-0" : "opacity-100"
          }`}
          fetchPriority="high"
        />
        {SLIDES.map((slide, idx) =>
          loadedSet.has(idx) ? (
            <video
              key={slide.key}
              ref={(el) => {
                videoRefs.current[idx] = el
              }}
              src={slide.video}
              poster={idx === 0 ? HERO_POSTER_SRC : undefined}
              className={`hero-bg-video absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                idx === activeIndex && (idx !== 0 || isFirstVideoReady) ? "opacity-100" : "opacity-0"
              }`}
              autoPlay={idx === 0}
              loop
              muted
              playsInline
              preload={idx === activeIndex ? "auto" : "metadata"}
              controls={false}
              controlsList="nodownload noplaybackrate noremoteplayback"
              disablePictureInPicture
              disableRemotePlayback
              onCanPlayThrough={idx === 0 ? handleFirstVideoReady : undefined}
              onPlaying={idx === 0 ? handleFirstVideoReady : undefined}
              onError={idx === 0 ? handleFirstVideoError : undefined}
              style={{ pointerEvents: "none" }}
            />
          ) : null
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/50" />
      </div>

      {/* Content — crossfade per slide */}
      <div className="relative z-10 container mx-auto grid px-4 lg:px-8 text-center">
        {SLIDES.map((slide, idx) => (
          <div
            key={slide.key}
            className={`col-start-1 row-start-1 flex flex-col items-center justify-center transition-opacity duration-500 ${
              idx === activeIndex ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={idx !== activeIndex}
          >
            <h1 className="text-display text-white mb-4 sm:mb-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
              {t(`homePage.heroSlides.${slide.key}.title`)}
            </h1>
            <p className="text-body-lead text-white/95 mb-8 sm:mb-12 max-w-3xl mx-auto text-pretty drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              {t(`homePage.heroSlides.${slide.key}.description`)}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {slide.href ? (
                <Button
                  size="lg"
                  variant="brand"
                  asChild
                  className="text-base px-8 transition-all hover:scale-105 hover-glow-blue shadow-blue-lg w-full sm:w-auto"
                >
                  <Link href={slide.href} tabIndex={idx === activeIndex ? 0 : -1}>
                    {t(`homePage.heroSlides.${slide.key}.cta`)}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button
                    size="lg"
                    variant="brand"
                    asChild
                    className="text-base px-8 transition-all hover:scale-105 hover-glow-blue shadow-blue-lg w-full sm:w-auto"
                  >
                    <Link href="/products" tabIndex={idx === activeIndex ? 0 : -1}>
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
                    <Link href="/about" tabIndex={idx === activeIndex ? 0 : -1}>
                      {t("homePage.hero.aboutButton")}
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Slider controls — как у LG Chem: номера с прогрессом + пауза */}
      <div className="absolute inset-x-0 bottom-6 z-10 sm:bottom-9">
        <div className="container mx-auto flex items-end justify-center gap-3 px-4 sm:gap-5 lg:px-8">
          <div className="flex items-end gap-3 sm:gap-5" role="tablist" aria-label="Слайды">
            {SLIDES.map((slide, idx) => {
              const isActive = idx === activeIndex
              return (
                <button
                  key={slide.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`${t("homePage.heroSlides.goToSlide")} ${idx + 1}: ${t(
                    `homePage.heroSlides.${slide.key}.label`
                  )}`}
                  onClick={() => goToSlide(idx)}
                  className={`group flex flex-col items-start gap-1.5 pb-1 transition-opacity ${
                    isActive ? "opacity-100" : "opacity-55 hover:opacity-85"
                  }`}
                >
                  <span className="flex items-baseline gap-1.5">
                    <span className="text-sm font-semibold tabular-nums text-white drop-shadow sm:text-base">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`hidden whitespace-nowrap text-xs font-medium text-white drop-shadow transition-opacity sm:text-sm lg:inline ${
                        isActive ? "lg:opacity-100" : "lg:opacity-0 lg:group-hover:opacity-70"
                      }`}
                    >
                      {t(`homePage.heroSlides.${slide.key}.label`)}
                    </span>
                  </span>
                  <span
                    className={`relative block h-0.5 overflow-hidden rounded-full bg-white/30 transition-all duration-300 ${
                      isActive ? "w-16 sm:w-24 lg:w-32" : "w-8 sm:w-12"
                    }`}
                  >
                    {isActive && (
                      <span
                        key={progressKey}
                        className="hero-slide-progress absolute inset-y-0 left-0 block w-full rounded-full bg-white"
                        style={{
                          animationDuration: `${SLIDE_DURATION_MS}ms`,
                          animationPlayState: isPaused ? "paused" : "running",
                        }}
                      />
                    )}
                  </span>
                </button>
              )
            })}
          </div>

          <button
            type="button"
            onClick={togglePaused}
            aria-label={isPaused ? t("homePage.heroSlides.play") : t("homePage.heroSlides.pause")}
            className="mb-0.5 flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/25 sm:h-9 sm:w-9"
          >
            {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={handleScrollToStats}
        className="absolute bottom-20 left-1/2 z-10 hidden -translate-x-1/2 animate-bounce cursor-pointer sm:block"
        aria-label="Scroll down"
      >
        <ChevronDown className="w-8 h-8 text-white drop-shadow-lg" />
      </button>
    </section>
  )
}
