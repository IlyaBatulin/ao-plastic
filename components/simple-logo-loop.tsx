"use client"

import { cn } from "@/lib/utils"

interface Logo {
  src: string
  alt: string
  href?: string
  width?: number
  height?: number
  /** Классы ячейки (по умолчанию 180×80), чтобы отдельные логотипы чуть крупнее */
  loopSlotClass?: string
  /** Доп. классы для <img> (например scale) */
  imgClassName?: string
}

interface SimpleLogoLoopProps {
  logos: Logo[]
  speed?: number
}

export function SimpleLogoLoop({ logos, speed = 30 }: SimpleLogoLoopProps) {
  // Дублируем логотипы для бесшовного цикла
  const duplicatedLogos = [...logos, ...logos, ...logos]
  
  return (
    <div className="w-full overflow-hidden bg-transparent py-4">
      <div 
        className="flex gap-20 animate-scroll"
        style={{
          width: 'max-content',
          animation: `scroll ${speed}s linear infinite`
        }}
      >
        {duplicatedLogos.map((logo, index) => (
          <div
            key={index}
            className={cn(
              "flex-shrink-0 flex items-center justify-center grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300",
              logo.loopSlotClass ?? "w-[180px] h-[80px]",
            )}
          >
            {logo.href ? (
              <a
                href={logo.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-full flex items-center justify-center"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="max-w-full max-h-full object-contain"
                  loading="eager"
                />
              </a>
            ) : (
              <img
                src={logo.src}
                alt={logo.alt}
                className={cn("max-w-full max-h-full object-contain", logo.imgClassName)}
                loading="eager"
              />
            )}
          </div>
        ))}
      </div>
      
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 3));
          }
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
