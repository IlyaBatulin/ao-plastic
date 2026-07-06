"use client"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage()
  const pathname = usePathname()
  const isHomePage = pathname === "/"
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isTransparentHeader = isHomePage && !isScrolled
  const textClass = isTransparentHeader
    ? "text-white hover:text-white/90 hover:bg-white/10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
    : "text-foreground hover:bg-primary/10 hover:text-primary"

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLang(lang === "ru" ? "en" : "ru")}
      className={`text-[13px] xl:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 min-w-[50px] xl:min-w-[60px] px-2 xl:px-3 ${textClass}`}
    >
      {lang === "ru" ? "Eng" : "Рус"}
    </Button>
  )
}
