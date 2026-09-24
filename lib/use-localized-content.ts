"use client"

import { useLanguage } from "@/contexts/language-context"
import type { Language } from "@/lib/language"

export function useLocalizedContent<T extends Record<Language, unknown>>(content: T): T[Language] {
  const { lang } = useLanguage()
  return content[lang]
}
