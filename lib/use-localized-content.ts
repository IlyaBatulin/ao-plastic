"use client"

import { useLanguage } from "@/contexts/language-context"
import type { Language } from "@/lib/language"

export function useLocalizedContent<T>(content: Record<Language, T>): T {
  const { lang } = useLanguage()
  return content[lang]
}
