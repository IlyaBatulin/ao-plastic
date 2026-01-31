"use client"

import { useEffect, useRef, memo, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface BeamsBackgroundProps {
  className?: string
  children?: React.ReactNode
  intensity?: "subtle" | "medium" | "strong"
  beamCount?: number
}

interface Beam {
  x: number
  y: number
  width: number
  length: number
  angle: number
  speed: number
  opacity: number
  hue: number
  pulse: number
  pulseSpeed: number
}

function createBeam(width: number, height: number): Beam {
  const angle = -35 + Math.random() * 10
  return {
    x: Math.random() * width * 1.5 - width * 0.25,
    y: Math.random() * height * 1.5 - height * 0.25,
    width: 60 + Math.random() * 100,
    length: height * 2.5,
    angle: angle,
    speed: 0.9 + Math.random() * 1.4,
    opacity: 0.3 + Math.random() * 0.3,
    hue: 200 + Math.random() * 60,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.04 + Math.random() * 0.04,
  }
}

export const BeamsBackground = memo(function BeamsBackground({
  className,
  children,
  intensity = "medium",
  beamCount = 18,
}: BeamsBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const beamsRef = useRef<Beam[]>([])
  const animationFrameRef = useRef<number>(0)
  const [isReady, setIsReady] = useState(false)

  const opacityMap = {
    subtle: 0.5,
    medium: 0.7,
    strong: 0.9,
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      console.log("Canvas not found")
      return
    }

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) {
      console.log("Context not found")
      return
    }

    console.log("BeamsBackground: Initializing canvas...")

    const updateCanvasSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.scale(dpr, dpr)

      beamsRef.current = Array.from({ length: beamCount }, () =>
        createBeam(canvas.width, canvas.height)
      )
      
      console.log(`Canvas size: ${canvas.width}x${canvas.height}, Beams: ${beamCount}`)
      setIsReady(true)
    }

    updateCanvasSize()

    let resizeTimeout: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(updateCanvasSize, 250)
    }

    window.addEventListener("resize", handleResize)

    function resetBeam(beam: Beam, index: number, totalBeams: number) {
      if (!canvas) return beam

      const column = index % 3
      const spacing = canvas.width / 3

      beam.y = canvas.height + 100
      beam.x =
        column * spacing +
        spacing / 2 +
        (Math.random() - 0.5) * spacing * 0.5
      beam.width = 100 + Math.random() * 120
      beam.speed = 0.8 + Math.random() * 0.8
      beam.hue = 200 + (index * 60) / totalBeams
      beam.opacity = 0.3 + Math.random() * 0.25
      return beam
    }

    function drawBeam(ctx: CanvasRenderingContext2D, beam: Beam) {
      ctx.save()
      ctx.translate(beam.x, beam.y)
      ctx.rotate((beam.angle * Math.PI) / 180)

      const pulsingOpacity =
        beam.opacity *
        (0.85 + Math.sin(beam.pulse) * 0.15) *
        opacityMap[intensity]

      const gradient = ctx.createLinearGradient(0, 0, 0, beam.length)

      gradient.addColorStop(0, `hsla(${beam.hue}, 90%, 75%, 0)`)
      gradient.addColorStop(
        0.1,
        `hsla(${beam.hue}, 90%, 75%, ${pulsingOpacity * 0.7})`
      )
      gradient.addColorStop(
        0.5,
        `hsla(${beam.hue}, 90%, 75%, ${pulsingOpacity})`
      )
      gradient.addColorStop(
        0.9,
        `hsla(${beam.hue}, 90%, 75%, ${pulsingOpacity * 0.7})`
      )
      gradient.addColorStop(1, `hsla(${beam.hue}, 90%, 75%, 0)`)

      ctx.fillStyle = gradient
      ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length)
      ctx.restore()
    }

    let lastTime = performance.now()
    const targetFPS = 30
    const frameInterval = 1000 / targetFPS
    let frameCount = 0

    function animate(currentTime: number) {
      if (!canvas || !ctx) return

      const deltaTime = currentTime - lastTime

      if (deltaTime >= frameInterval) {
        lastTime = currentTime - (deltaTime % frameInterval)

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.filter = "blur(16px)"

        const totalBeams = beamsRef.current.length
        beamsRef.current.forEach((beam, index) => {
          beam.y -= beam.speed
          beam.pulse += beam.pulseSpeed

          if (beam.y + beam.length < -100) {
            resetBeam(beam, index, totalBeams)
          }

          drawBeam(ctx, beam)
        })

        frameCount++
        if (frameCount === 1) {
          console.log("BeamsBackground: First frame rendered!")
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(resizeTimeout)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      console.log("BeamsBackground: Cleanup")
    }
  }, [intensity, beamCount])

  return (
    <div className={cn("fixed inset-0 -z-10 overflow-hidden bg-black", className)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-100"
        style={{ 
          filter: "blur(5px)",
          mixBlendMode: "lighten"
        }}
      />

      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/30 to-background/40"
        initial={{ opacity: 0.3 }}
        animate={{
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{
          duration: 10,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
        }}
      />

      {children}
    </div>
  )
})
