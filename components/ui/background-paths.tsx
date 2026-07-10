"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { motion, MotionConfig } from "framer-motion"

interface FloatingPathsProps {
  position: number
  count: number
}

function FloatingPaths({ position, count }: FloatingPathsProps) {
  // Пути прорежены относительно исходных 36 — визуально почти неотличимо,
  // но нагрузка на main thread значительно меньше.
  const step = Math.max(1, Math.floor(36 / count))
  const paths = Array.from({ length: count }, (_, idx) => {
    const i = idx * step
    return {
      id: i,
      d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
        380 - i * 5 * position
      } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
        152 - i * 5 * position
      } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
        684 - i * 5 * position
      } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
      width: 0.6 + i * 0.03,
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
            strokeOpacity={0.18 + path.id * 0.02}
            initial={{ pathLength: 0.3, opacity: 0.45 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
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

function BackgroundPathsLayer({ count }: { count: number }) {
  return (
    // reducedMotion="never": фоновые линии — фирменный декоративный элемент,
    // движение должно идти даже при системных «упрощённых анимациях»
    // (глобальный MotionConfig в app-providers иначе глушит framer-анимации).
    <MotionConfig reducedMotion="never">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 w-full max-w-full overflow-hidden"
      >
        <div className="absolute inset-0">
          <FloatingPaths position={1} count={count} />
          <FloatingPaths position={-1} count={count} />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/10 to-background/30" />
      </div>
    </MotionConfig>
  )
}

export function BackgroundPaths() {
  const [mode, setMode] = useState<"pending" | "mobile" | "desktop">("pending")

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches
    setMode(isMobile ? "mobile" : "desktop")
  }, [])

  if (mode === "pending") return null

  return createPortal(<BackgroundPathsLayer count={mode === "mobile" ? 8 : 14} />, document.body)
}
