"use client"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLang(lang === "ru" ? "en" : "ru")}
      className="text-[13px] xl:text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors whitespace-nowrap flex-shrink-0 min-w-[50px] xl:min-w-[60px] px-2 xl:px-3"
    >
      {lang === "ru" ? "Eng" : "Рус"}
    </Button>
  )
}
