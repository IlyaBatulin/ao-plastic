"use client"

import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from "react"
import { type Language, persistLanguage } from "@/lib/language"

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
  t: (key: string) => any
  translations: Record<string, any>
  isLoading: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Предзагружаем переводы для быстрого доступа
let translationsCache: Record<Language, Record<string, any> | null> = {
  ru: null,
  en: null,
}

export function LanguageProvider({
  children,
  initialLang = "ru",
  initialTranslations,
}: {
  children: ReactNode
  initialLang?: Language
  /** Переводы активного языка с сервера — чтобы текст был в HTML при SSR (важно для SEO и LCP). */
  initialTranslations?: Record<string, any>
}) {
  // Сидируем кэш серверными переводами до первого рендера,
  // тогда t() работает уже при SSR и краулеры видят текст.
  if (initialTranslations) {
    translationsCache[initialLang] = initialTranslations
  }

  const [lang, setLangState] = useState<Language>(initialLang)

  const [translations, setTranslations] = useState<Record<string, any>>(
    () => initialTranslations || translationsCache[initialLang] || {}
  )
  const [loadedLang, setLoadedLang] = useState<Language | null>(() =>
    initialTranslations || translationsCache[initialLang] ? initialLang : null
  )

  const [isLoading, setIsLoading] = useState(
    () => !(initialTranslations || translationsCache[initialLang])
  )

  const applyTranslations = (nextLang: Language, data: Record<string, any>) => {
    translationsCache[nextLang] = data
    setTranslations(data)
    setLoadedLang(nextLang)
  }

  // Загружаем переводы при смене языка (активный язык уже в кэше с сервера)
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        // Проверяем кэш
        if (translationsCache[lang]) {
          applyTranslations(lang, translationsCache[lang]!)
          setIsLoading(false)
          return
        }
        setIsLoading(true)

        const response = await fetch(`/locales/${lang}.json`)
        if (!response.ok) throw new Error("Failed to fetch translations")
        const data = await response.json()

        applyTranslations(lang, data)
      } catch (error) {
        console.error("Failed to load translations:", error)
        // В случае ошибки используем пустой объект
        setTranslations({})
      } finally {
        setIsLoading(false)
      }
    }
    loadTranslations()
  }, [lang])

  // Синхронизация localStorage/cookie после гидратации (без чтения localStorage в useState)
  useEffect(() => {
    const saved = localStorage.getItem("lang") as Language | null
    const validSaved = saved === "en" || saved === "ru" ? saved : null

    if (validSaved && validSaved !== initialLang) {
      setLang(validSaved)
      return
    }

    persistLanguage(validSaved ?? initialLang)
  }, [initialLang])

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("lang") as Language | null
      if ((saved === "ru" || saved === "en") && saved !== lang) {
        setLang(saved)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [lang])

  const setLang = (newLang: Language) => {
    setLangState(newLang)
    persistLanguage(newLang)
    if (translationsCache[newLang]) {
      applyTranslations(newLang, translationsCache[newLang]!)
      setIsLoading(false)
    } else {
      setIsLoading(true)
    }
  }

  const t = useMemo(() => {
    return (key: string): any => {
      if (!key) return ""

      const activeTranslations = loadedLang === lang ? translations : translationsCache[lang]

      if (!activeTranslations || Object.keys(activeTranslations).length === 0) {
        return ""
      }

      const keys = key.split(".")
      let value: any = activeTranslations

      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = value[k]
        } else {
          return ""
        }
      }

      return value !== undefined ? value : ""
    }
  }, [translations, loadedLang, lang])

  return <LanguageContext.Provider value={{ lang, setLang, t, translations, isLoading }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    return {
      lang: "ru",
      setLang: () => {},
      t: () => "",
      translations: {},
      isLoading: true,
    }
  }
  return context
}
