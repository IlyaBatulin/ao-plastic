"use client"

import { useEffect, useRef, type ReactNode } from "react"

interface ScrollStackProps {
  children: ReactNode[]
  gap?: number
}

export function ScrollStack({ children, gap = 20 }: ScrollStackProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === "undefined" || !window.gsap || !window.ScrollTrigger) return

    if (!containerRef.current) return

    const cards = containerRef.current.querySelectorAll(".stack-card")

    cards.forEach((card, index) => {
      window.gsap.fromTo(
        card,
        {
          y: 100,
          opacity: 0,
          scale: 0.9,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=100",
            end: "top center",
            scrub: 1,
          },
        },
      )

      // Sticky stacking effect
      window.ScrollTrigger.create({
        trigger: card,
        start: "top top+=100",
        endTrigger: containerRef.current,
        end: `bottom top+=${100 + index * gap}`,
        pin: true,
        pinSpacing: false,
      })
    })

    return () => {
      window.ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [gap])

  return (
    <div ref={containerRef} className="relative">
      {children.map((child, index) => (
        <div key={index} className="stack-card" style={{ marginBottom: `${gap}px` }}>
          {child}
        </div>
      ))}
    </div>
  )
}
