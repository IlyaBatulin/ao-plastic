"use client"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"

interface HeroLanguageSwitcherProps {
  isMenuOpen?: boolean
}

export function HeroLanguageSwitcher({ isMenuOpen = false }: HeroLanguageSwitcherProps) {
  const { lang, setLang } = useLanguage()

  const textClass = isMenuOpen
    ? "text-foreground hover:text-primary hover:bg-primary/10"
    : "text-white hover:text-white/90 hover:bg-white/10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"

  return (
    <Button
      variant="ghost"
      size="lg"
      onClick={() => setLang(lang === "ru" ? "en" : "ru")}
      className={`text-sm xl:text-base font-medium transition-colors whitespace-nowrap flex-shrink-0 min-w-[60px] xl:min-w-[70px] px-3 xl:px-4 py-2.5 ${textClass}`}
    >
      {lang === "ru" ? "Eng" : "Рус"}
    </Button>
  )
}

