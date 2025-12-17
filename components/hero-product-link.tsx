"use client"

import Link from "next/link"
import { useState } from "react"

export function HeroProductLink() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link
      href="/products"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="inline-block relative group cursor-pointer"
    >
      <span
        className="inline-block font-medium sm:font-semibold text-4xl sm:text-5xl md:text-6xl lg:text-7xl antialiased"
        style={{
          textShadow: isHovered
            ? '0 0 8px rgba(180, 230, 200, 0.35), 0 0 20px rgba(180, 230, 200, 0.15)'
            : '0 2px 12px rgba(0, 0, 0, 0.25)',
          color: isHovered ? '#E6F3E8' : 'rgba(255, 255, 255, 0.9)',
          transform: isHovered ? 'translateY(-1px)' : 'translateY(0)',
          transition: 'color 0.6s ease, text-shadow 0.6s ease, transform 0.4s ease',
        }}
      >
        Технология продукции
      </span>
      
      {/* Подчеркивание при hover */}
      <span
        className="absolute -bottom-2 left-0 right-0 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-600 ease-out"
        style={{
          background: 'linear-gradient(to right, rgba(180,230,200,0), rgba(180,230,200,0.8), rgba(180,230,200,0))',
          filter: 'blur(0.5px)',
        }}
      />
    </Link>
  )
}

