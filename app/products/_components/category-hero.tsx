"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { DEFAULT_CATEGORY_VIDEO } from "@/lib/video-config"

interface CategoryHeroProps {
  title: string
  description?: string
  backHref: string
  backLabel: string
  hasVideo: boolean
  videoSrc?: string
  imageSrc?: string
}

export function CategoryHero({
  title,
  description,
  backHref,
  backLabel,
  hasVideo,
  videoSrc,
  imageSrc: _imageSrc,
}: CategoryHeroProps) {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const typeIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Анимация появления заголовка
    const timer1 = setTimeout(() => {
      titleRef.current?.classList.add("animate-in")
    }, 100)
    
    // Анимация печатания описания
    if (description) {
      setDisplayedText("") // Сбрасываем текст при изменении описания
      setIsTyping(false)
      
      // Очищаем предыдущий интервал если есть
      if (typeIntervalRef.current) {
        clearInterval(typeIntervalRef.current)
      }
      
      const timer2 = setTimeout(() => {
        setIsTyping(true)
        const currentIndexRef = { current: 0 }
        typeIntervalRef.current = setInterval(() => {
          if (currentIndexRef.current < description.length) {
            setDisplayedText(description.slice(0, currentIndexRef.current + 1))
            currentIndexRef.current++
          } else {
            if (typeIntervalRef.current) {
              clearInterval(typeIntervalRef.current)
              typeIntervalRef.current = null
            }
            setIsTyping(false)
          }
        }, 50) // Скорость печатания: 50ms на символ
      }, 800)
      
      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
        if (typeIntervalRef.current) {
          clearInterval(typeIntervalRef.current)
          typeIntervalRef.current = null
        }
      }
    }
    
    return () => {
      clearTimeout(timer1)
    }
  }, [description])

  const videoUrl = (hasVideo && videoSrc) ? videoSrc : DEFAULT_CATEGORY_VIDEO

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          className="absolute inset-0 w-full h-full object-cover"
          style={{ pointerEvents: "none" }}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background/95" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-4 lg:px-8 pt-32 pb-20 min-h-screen flex flex-col">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-white font-medium hover:text-white transition-colors mb-8 group backdrop-blur-md bg-black/50 rounded-full px-4 py-2.5 w-fit border border-white/30 shadow-lg hover:bg-black/60 hover:border-white/50"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>{backLabel}</span>
        </Link>
        <div className="flex-1 flex items-center">
          <div className="max-w-4xl">
            <h1
              ref={titleRef}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 text-white drop-shadow-2xl opacity-0 translate-y-8 transition-all duration-1000 leading-tight break-words"
            >
              {title}
            </h1>
            {description && (
              <p
                ref={descRef}
                className="text-xl lg:text-2xl text-white/90 leading-relaxed drop-shadow-lg"
              >
                {displayedText}
                {isTyping && (
                  <span className="inline-block w-0.5 h-6 lg:h-8 bg-white/90 ml-1 animate-pulse" />
                )}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

