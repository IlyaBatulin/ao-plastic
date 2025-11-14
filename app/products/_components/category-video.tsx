"use client"

import { useEffect, useRef, useState } from "react"

interface CategoryVideoProps {
  src: string
  alt?: string
  className?: string
  priority?: boolean
  autoPlay?: boolean
  loop?: boolean
  muted?: boolean
  playsInline?: boolean
}

export function CategoryVideo({
  src,
  alt,
  className = "",
  priority = false,
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
}: CategoryVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (videoRef.current && priority && autoPlay) {
      // Приоритетная загрузка для первого видео
      videoRef.current.load()
    }
  }, [priority, autoPlay])

  const handleError = () => {
    setHasError(true)
  }

  if (hasError || !src) {
    return (
      <div className={`relative w-full aspect-[4/3] rounded-3xl overflow-hidden border-2 border-border shadow-2xl bg-gradient-to-br from-primary/20 to-primary/5 ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-muted-foreground text-sm">Видео недоступно</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative w-full aspect-[4/3] rounded-3xl overflow-hidden border-2 border-border shadow-2xl ${className}`}>
      <video
        ref={videoRef}
        src={src}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        className="absolute inset-0 w-full h-full object-cover"
        aria-label={alt}
        preload={priority ? "auto" : "metadata"}
        onError={handleError}
      />
      {/* Градиентный overlay для лучшей читаемости текста поверх видео (опционально) */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" aria-hidden="true" />
    </div>
  )
}

