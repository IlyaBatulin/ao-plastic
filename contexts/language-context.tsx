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
}: {
  children: ReactNode
  initialLang?: Language
}) {
  const [lang, setLangState] = useState<Language>(initialLang)

  const [translations, setTranslations] = useState<Record<string, any>>(
    () => translationsCache[initialLang] || {}
  )
  const [loadedLang, setLoadedLang] = useState<Language | null>(() =>
    translationsCache[initialLang] ? initialLang : null
  )

  const [isLoading, setIsLoading] = useState(true)

  const applyTranslations = (nextLang: Language, data: Record<string, any>) => {
    translationsCache[nextLang] = data
    setTranslations(data)
    setLoadedLang(nextLang)
  }

  // Загружаем переводы сразу при монтировании
  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true)
      try {
        // Проверяем кэш
        if (translationsCache[lang]) {
          applyTranslations(lang, translationsCache[lang]!)
          setIsLoading(false)
          return
        }

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
    const preloadLanguages = async () => {
      for (const locale of ["ru", "en"] as Language[]) {
        if (translationsCache[locale]) continue
        try {
          const response = await fetch(`/locales/${locale}.json`)
          if (response.ok) {
            translationsCache[locale] = await response.json()
          }
        } catch {
          // ignore preload errors
        }
      }
    }

    void preloadLanguages()
  }, [])

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

      const activeTranslations =
        translationsCache[lang] ??
        (loadedLang === lang ? translations : null) ??
        translations

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
