"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { DEFAULT_CATEGORY_VIDEO, getCategoryVideoBackdrop } from "@/lib/video-config"
import { cn } from "@/lib/utils"

interface CategoryHeroProps {
  title: string
  description?: string
  backHref: string
  backLabel: string
  hasVideo: boolean
  videoSrc?: string
  imageSrc?: string
  categoryId?: string
  subcategoryId?: string
}

export function CategoryHero({
  title,
  description,
  backHref,
  backLabel,
  hasVideo,
  videoSrc,
  imageSrc,
  categoryId,
  subcategoryId,
}: CategoryHeroProps) {
  const [playVideo, setPlayVideo] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const videoUrl = hasVideo && videoSrc ? videoSrc : DEFAULT_CATEGORY_VIDEO
  const backdrop = categoryId ? getCategoryVideoBackdrop(categoryId, subcategoryId) : undefined
  const mediaClassName = cn(
    "absolute inset-0 h-full w-full object-cover",
    backdrop?.scale && "origin-top"
  )
  const mediaStyle = backdrop
    ? {
        objectPosition: backdrop.objectPosition ?? "center",
        transform: backdrop.scale ? `scale(${backdrop.scale})` : undefined,
        transformOrigin: backdrop.transformOrigin ?? "center center",
      }
    : undefined

  useEffect(() => {
    if (!hasVideo) return

    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPlayVideo(true)
          observer.disconnect()
        }
      },
      { rootMargin: "100px" }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [hasVideo])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[60vh] w-full overflow-hidden flex items-center justify-center"
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        {imageSrc && (
          <img
            src={imageSrc}
            alt=""
            aria-hidden
            className={mediaClassName}
            style={mediaStyle}
          />
        )}
        {playVideo && (
          <video
            autoPlay
            loop
            muted
            playsInline
            controls={false}
            disablePictureInPicture
            disableRemotePlayback
            preload="none"
            poster={imageSrc}
            className={mediaClassName}
            style={{ pointerEvents: "none", ...mediaStyle }}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background/95" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-4 lg:px-8 pt-24 pb-12 sm:pt-28 sm:pb-14 lg:pt-32 lg:pb-16 min-h-[60vh] flex flex-col">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-white font-medium hover:text-white transition-colors mb-8 group backdrop-blur-md bg-black/50 rounded-full px-4 py-2.5 w-fit border border-white/30 shadow-lg hover:bg-black/60 hover:border-white/50"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>{backLabel}</span>
        </Link>
        <div className="flex-1 flex items-center">
          <div className="max-w-4xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 text-primary leading-tight break-words">
              {title}
            </h1>
            {description && (
              <p className="text-xl lg:text-2xl text-primary/90 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
