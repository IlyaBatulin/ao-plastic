"use client"

import { useLanguage } from "@/contexts/language-context"

export function useTranslation() {
  const { t, lang } = useLanguage()
  return { t, lang }
}
