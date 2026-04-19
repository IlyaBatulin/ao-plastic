"use client"

import { cn } from "@/lib/utils"
import { SimpleLogoLoop } from "@/components/simple-logo-loop"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

type PartnerLogo = {
  src: string
  alt: string
  href?: string
  width?: number
  height?: number
  loopSlotClass?: string
  imgClassName?: string
  mobileImgClass?: string
  mobileWrapClass?: string
}

const partnerLogos: PartnerLogo[] = [
  { src: "/images/partners/gazprom-logo.png", alt: "Газпром", href: "https://www.gazprom.ru", width: 200, height: 100 },
  {
    src: "/images/partners/roshim-logo.png",
    alt: "Росхим",
    href: "https://ruschem.ru",
    width: 200,
    height: 100,
    loopSlotClass: "w-[205px] h-[88px]",
    imgClassName: "scale-[1.08] origin-center",
    mobileImgClass: "scale-110 origin-center",
    mobileWrapClass: "max-w-[288px]",
  },
  { src: "/images/partners/vtb-bank.png", alt: "ВТБ", href: "https://www.vtb.ru", width: 200, height: 100 },
  {
    src: "/images/partners/abr-logo.png",
    alt: "АБР Россия",
    href: "https://www.abr.ru",
    width: 200,
    height: 100,
    loopSlotClass: "w-[205px] h-[88px]",
    imgClassName: "scale-[1.08] origin-center",
    mobileImgClass: "scale-110 origin-center",
    mobileWrapClass: "max-w-[288px]",
  },
  { src: "/images/partners/GAZ-Logo.png", alt: "ГАЗ", href: "https://www.avtogaz.ru", width: 200, height: 100 },
  { src: "/images/partners/kamaz-logo.png", alt: "КАМАЗ", href: "https://kamaz.ru", width: 200, height: 100 },
  { src: "/images/partners/lada-logo.png", alt: "LADA", href: "https://www.lada.ru", width: 200, height: 100 },
  { src: "/images/partners/sibur-logo.png", alt: "СИБУР", href: "https://www.sibur.ru", width: 200, height: 100 },
  { src: "/images/partners/yaz-logo.png", alt: "УАЗ", href: "https://www.uaz.ru", width: 200, height: 100 },
]

export function Partners() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextLogo = () => {
    setCurrentIndex((prev) => (prev + 1) % partnerLogos.length)
  }

  const prevLogo = () => {
    setCurrentIndex((prev) => (prev - 1 + partnerLogos.length) % partnerLogos.length)
  }

  const currentLogo = partnerLogos[currentIndex]

  return (
    <section id="partners" className="py-12 lg:py-16 pb-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div>
          {/* Desktop: Animated Loop */}
          <div className="hidden lg:block relative py-6">
            <SimpleLogoLoop logos={partnerLogos} speed={40} />
          </div>

          {/* Mobile: Single Logo with Arrows */}
          <div className="lg:hidden relative py-6">
            <div className="flex items-center justify-center gap-4">
              {/* Left Arrow */}
              <button
                onClick={prevLogo}
                className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                aria-label="Предыдущий партнёр"
              >
                <ChevronLeft className="w-6 h-6 text-primary" />
              </button>

              {/* Logo Container */}
              <div className="flex-1 flex items-center justify-center min-h-[100px]">
                {currentLogo.href ? (
                  <Link
                    href={currentLogo.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn("block w-full h-auto", currentLogo.mobileWrapClass ?? "max-w-[260px]")}
                  >
                    <img
                      src={currentLogo.src}
                      alt={currentLogo.alt || ""}
                      width={currentLogo.width ?? 200}
                      height={currentLogo.height ?? 100}
                      className={cn(
                        "w-full h-auto object-contain opacity-90 hover:opacity-100 transition-opacity",
                        currentLogo.mobileImgClass,
                      )}
                    />
                  </Link>
                ) : (
                  <img
                    src={currentLogo.src}
                    alt={currentLogo.alt || ""}
                    width={currentLogo.width ?? 200}
                    height={currentLogo.height ?? 100}
                    className="w-full max-w-[200px] h-auto object-contain opacity-90"
                  />
                )}
              </div>

              {/* Right Arrow */}
              <button
                onClick={nextLogo}
                className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                aria-label="Следующий партнёр"
              >
                <ChevronRight className="w-6 h-6 text-primary" />
              </button>
            </div>

            {/* Dots Indicator */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {partnerLogos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-primary w-6"
                      : "bg-primary/30 hover:bg-primary/50"
                  }`}
                  aria-label={`Перейти к партнёру ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
