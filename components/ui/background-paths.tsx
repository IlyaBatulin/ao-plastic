"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { motion } from "framer-motion"

interface FloatingPathsProps {
  position: number
  count: number
}

function FloatingPaths({ position, count }: FloatingPathsProps) {
  // Пути прорежены (каждый 3-й из исходных 36) — визуально почти неотличимо,
  // но нагрузка на main thread втрое меньше.
  const paths = Array.from({ length: count }, (_, idx) => {
    const i = idx * 3
    return {
      id: i,
      d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
        380 - i * 5 * position
      } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
        152 - i * 5 * position
      } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
        684 - i * 5 * position
      } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
      width: 0.5 + i * 0.03,
    }
  })

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="h-full w-full"
        viewBox="0 0 696 316"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="rgb(59, 130, 246)"
            strokeWidth={path.width}
            strokeOpacity={0.15 + path.id * 0.02}
            initial={{ pathLength: 0.3, opacity: 0.4 }}
            animate={{
              pathLength: 1,
              opacity: [0.2, 0.5, 0.2],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  )
}

function BackgroundPathsLayer() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 w-full max-w-full overflow-hidden"
    >
      <div className="absolute inset-0">
        <FloatingPaths position={1} count={12} />
        <FloatingPaths position={-1} count={12} />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background/40" />
    </div>
  )
}

export function BackgroundPaths() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    // На телефонах и при prefers-reduced-motion фон не анимируем —
    // экономим батарею и main thread при скролле каталога.
    const isMobile = window.matchMedia("(max-width: 768px)").matches
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    setEnabled(!isMobile && !reducedMotion)
  }, [])

  if (!enabled) return null

  return createPortal(<BackgroundPathsLayer />, document.body)
}
