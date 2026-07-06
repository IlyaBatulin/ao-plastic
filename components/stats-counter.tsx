"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface StatsCounterProps {
  end: number
  duration?: number
  suffix?: string
  prefix?: string
  /** Переопределение размеров (например, компактный блок на главной) */
  className?: string
}

export function StatsCounter({ end, duration = 2000, suffix = "", prefix = "", className }: StatsCounterProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const valueRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      // Обновляем текст напрямую, без setState на каждый кадр
      if (valueRef.current) {
        valueRef.current.textContent = String(Math.floor(progress * end))
      }

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        // Единственный setState — финальное значение
        setCount(end)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrame)
  }, [isVisible, end, duration])

  return (
    <div
      ref={ref}
      className={cn(
        "font-bold tabular-nums text-primary text-5xl lg:text-6xl",
        className,
      )}
    >
      {prefix}
      <span ref={valueRef}>{count}</span>
      {suffix}
    </div>
  )
}
